from datetime import datetime

import dateutil
import requests
from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, fields, marshal_with, abort, reqparse

from models import Book, Member, db

app = Flask(__name__)
api = Api(app)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
db.init_app(app)


@app.before_request
def create_tables():
    app.before_request_funcs[None].remove(create_tables)

    db.create_all()


class Books(Resource):
    book_fields = {
        "bookID": fields.String(50),
        "title": fields.String(255),
        "authors": fields.String(255),
        "average_rating": fields.Float,
        "isbn": fields.String(13),
        "isbn13": fields.String(13),
        "language_code": fields.String(10),
        "num_pages": fields.Integer,
        "ratings_count": fields.Integer,
        "text_reviews_count": fields.Integer,
        "publication_date": fields.String(10),
        "publisher": fields.String(255),
        "book_count": fields.Integer
    }

    @marshal_with(book_fields)
    def get(self, isbn=None):

        if not isbn:
            books = Book.query.all()
            return books
        else:
            book = Book.query.filter_by(isbn=isbn).first()
            if not book:
                abort(404, message="Book not found")
            return book

    @marshal_with(book_fields)
    def post(self):

        parser = reqparse.RequestParser()
        parser.add_argument("bookID", help="bookID is required", type=str, required=True, trim=True)
        parser.add_argument("title", help="title is required", type=str, required=True, trim=True)
        parser.add_argument("authors", help="authors is required", type=str, required=True, trim=True)
        parser.add_argument("average_rating", help="average_rating is required", type=str, required=True, trim=True)
        parser.add_argument("isbn", help="isbn is required", type=str, required=True, trim=True)
        parser.add_argument("isbn13", help="isbn13 is required", type=str, required=True, trim=True)
        parser.add_argument("language_code", help="language_code is required", type=str, required=True, trim=True)
        parser.add_argument("ratings_count", help="ratings_count is required", type=str, required=True, trim=True)
        parser.add_argument("text_reviews_count", help="text_reviews_count is required", type=str, required=True, trim=True)
        parser.add_argument("publication_date", help="publication_date is required", type=str, required=True, trim=True)
        parser.add_argument("publisher", help="publisher is required", type=str, required=True, trim=True)
        parser.add_argument("book_count", help="book_count is required", type=str, required=False, trim=True)

        parser.add_argument("  num_pages", help="num_pages is required", type=str, required=False, trim=True)
        parser.add_argument("num_pages", help="num_pages is required", type=str, required=False, trim=True)

        args = parser.parse_args()

        book = Book.create_from_data(args)

        if Book.query.filter_by(bookID=args['bookID']).first():
            Book.query.filter_by(bookID=args['bookID']).delete()

        db.session.add(book)
        db.session.commit()

        return Book.query.all()


class FetchBookList(Resource):
    @marshal_with(Books.book_fields)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('title', type=str, required=False, location='args', default='')
        parser.add_argument('authors', type=str, required=False, location='args', default='')
        parser.add_argument('isbn', type=str, required=False, location='args', default='')
        parser.add_argument('publisher', type=str, required=False, location='args', default='')
        parser.add_argument('page', type=str, required=False, location='args', default='')

        args = parser.parse_args()

        link = f"https://frappe.io/api/method/frappe-library?title={args['title']}&authors={args['authors']}&isbn={args['isbn']}&publisher={args['publisher']}&page={args['page']}"

        response = requests.get(link)

        if response.status_code != 200:
            abort(500, message="Book import failed")

        return response.json()['message']


class Members(Resource):
    member_fields = {
        "id": fields.Integer,
        "name": fields.String(50),
        "books_issued": fields.List(fields.Integer),
        "issue_dates": fields.List(fields.String),
        "amount_due": fields.Float,
    }

    @marshal_with(member_fields)
    def get(self):
        member_list = Member.query.all()

        today = dateutil.parser.parse(datetime.today().strftime('%d/%m/%Y'))

        for entry in member_list:
            amount_due = 0

            for date in entry.issue_dates:
                issue_date = dateutil.parser.parse(date)
                amount_due += (today - issue_date).days * 10

            entry.amount_due = amount_due

        return member_list

    @marshal_with(member_fields)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True, trim=True, help="Name is required")
        args = parser.parse_args()

        member = Member(name=args.get('name'))

        db.session.add(member)
        db.session.commit()

        member_list = Member.query.all()

        today = dateutil.parser.parse(datetime.today().strftime('%d/%m/%Y'))

        for entry in member_list:
            amount_due = 0

            for date in entry.issue_dates:
                issue_date = dateutil.parser.parse(date)
                amount_due += (today - issue_date).days * 10

            entry.amount_due = amount_due

        return member_list


class Issues(Resource):
    member_fields = {
        "id": fields.Integer,
        "name": fields.String(50),
        "books_issued": fields.List(fields.Integer),
        "issue_dates": fields.List(fields.String),
        "amount_due": fields.Float,
    }

    @marshal_with(member_fields)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("member_id", type=int, required=True, trim=True, help="member_id is required")
        parser.add_argument("book_id", type=int, required=True, trim=True, help="book_id is required")
        args = parser.parse_args()

        member_entry = Member.query.filter_by(id=args['member_id'])
        book_entry = Book.query.filter_by(bookID=args['book_id'])

        member = member_entry.first()
        book = book_entry.first()

        if not member:
            abort(404, message="No such member")

        if book:
            book_entry.update({'book_count': book.book_count + 1})
        else:
            abort(404, message="No such book")

        books_issued = member.books_issued
        if books_issued is None:
            books_issued = []
        elif book.bookID in books_issued:
            abort(400, message="Book already issued to member")
        books_issued.append(book.bookID)

        issue_dates = member.issue_dates
        if issue_dates is None:
            issue_dates = []
        issue_dates.append(datetime.today().strftime('%d/%m/%Y'))

        member_entry.update(({'books_issued': books_issued, 'issue_dates': issue_dates}))
        db.session.commit()

        member_list = Member.query.all()

        today = dateutil.parser.parse(datetime.today().strftime('%d/%m/%Y'))

        for entry in member_list:
            amount_due = 0

            for date in entry.issue_dates:
                issue_date = dateutil.parser.parse(date)
                amount_due += (today - issue_date).days * 10

            entry.amount_due = amount_due

        return member_list

    @marshal_with(member_fields)
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument("member_id", type=int, required=True, trim=True, help="member_id is required")
        parser.add_argument("book_id", type=int, required=True, trim=True, help="book_id is required")
        args = parser.parse_args()

        member_entry = Member.query.filter_by(id=args['member_id'])
        book_entry = Book.query.filter_by(bookID=args['book_id'])

        member = member_entry.first()
        book = book_entry.first()

        if not member:
            abort(404, message="No such member")

        if book:
            book_entry.update({'book_count': book.book_count + 1})
        else:
            abort(404, message="No such book")

        books_issued = member.books_issued
        if not books_issued or book.bookID not in books_issued:
            abort(400, message="No such book issued to member")

        idx = books_issued.index(book.bookID)
        books_issued.remove(book.bookID)

        issue_dates = member.issue_dates
        if not issue_dates:
            abort(400, message="No such book issued to member")
        issue_dates.pop(idx)

        member_entry.update(({'books_issued': books_issued, 'issue_dates': issue_dates}))
        db.session.commit()

        member_list = Member.query.all()

        today = dateutil.parser.parse(datetime.today().strftime('%d/%m/%Y'))

        for entry in member_list:
            amount_due = 0

            for date in entry.issue_dates:
                issue_date = dateutil.parser.parse(date)
                amount_due += (today - issue_date).days * 10

            entry.amount_due = amount_due

        return member_list


api.add_resource(Books, '/api/v1/book', '/api/v1/book/', '/api/v1/book/<string:isbn>')
api.add_resource(FetchBookList, '/api/v1/fetch/', '/api/v1/fetch')

api.add_resource(Members, '/api/v1/member', '/api/v1/member/')

api.add_resource(Issues, '/api/v1/issue', '/api/v1/issue/')
