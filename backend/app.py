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

with app.app_context():
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
    def get(self):
        return Book.query.all()

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
        parser.add_argument("text_reviews_count", help="text_reviews_count is required", type=str, required=True,
                            trim=True)
        parser.add_argument("publication_date", help="publication_date is required", type=str, required=True, trim=True)
        parser.add_argument("publisher", help="publisher is required", type=str, required=True, trim=True)
        parser.add_argument("book_count", help="book_count is required", type=str, required=False, trim=True)

        parser.add_argument("  num_pages", help="num_pages is required", type=str, required=False, trim=True)
        parser.add_argument("num_pages", help="num_pages is required", type=str, required=False, trim=True)

        args = parser.parse_args()

        book = Book.create_from_data(args)

        db.session.add(book)
        db.session.commit()

        return Book.query.all()

    @marshal_with(book_fields)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument("bookID", help="bookID is required", type=str, required=True, trim=True)

        parser.add_argument("title", help="title is required", type=str, required=False, trim=True)
        parser.add_argument("authors", help="authors is required", type=str, required=False, trim=True)
        parser.add_argument("average_rating", help="average_rating is required", type=str, required=False, trim=True)
        parser.add_argument("isbn", help="isbn is required", type=str, required=False, trim=True)
        parser.add_argument("isbn13", help="isbn13 is required", type=str, required=False, trim=True)
        parser.add_argument("language_code", help="language_code is required", type=str, required=False, trim=True)
        parser.add_argument("ratings_count", help="ratings_count is required", type=str, required=False, trim=True)
        parser.add_argument("text_reviews_count", help="text_reviews_count is required", type=str, required=False,
                            trim=True)
        parser.add_argument("publication_date", help="publication_date is required", type=str, required=False,
                            trim=True)
        parser.add_argument("publisher", help="publisher is required", type=str, required=False, trim=True)
        parser.add_argument("book_count", help="book_count is required", type=str, required=False, trim=True)

        parser.add_argument("  num_pages", help="num_pages is required", type=str, required=False, trim=True)
        parser.add_argument("num_pages", help="num_pages is required", type=str, required=False, trim=True)

        args = parser.parse_args()

        existing_book = Book.query.filter_by(bookID=args['bookID']).first()

        if not existing_book:
            abort(400, message="No such book")

        Book.query.filter_by(bookID=args['bookID']).delete()

        book = Book.create_from_data(existing_book.__dict__)

        if args['title']:
            book.title = args['title']
        if args['authors']:
            book.authors = args['authors']
        if args['average_rating']:
            book.average_rating = args['average_rating']
        if args['isbn']:
            book.isbn = args['isbn']
        if args['isbn13']:
            book.isbn13 = args['isbn13']
        if args['language_code']:
            book.language_code = args['language_code']
        if args['ratings_count']:
            book.ratings_count = args['ratings_count']
        if args['text_reviews_count']:
            book.text_reviews_count = args['text_reviews_count']
        if args['publication_date']:
            book.publication_date = args['publication_date']
        if args['publisher']:
            book.publisher = args['publisher']
        if args['book_count']:
            book.book_count = args['book_count']
        if args['num_pages']:
            book.num_pages = args['num_pages']
        if args['  num_pages']:
            book.num_pages = args['  num_pages']

        db.session.add(book)
        db.session.commit()

        return Book.query.all()

    @marshal_with(book_fields)
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument("bookID", type=str, required=True, location='args', trim=True, help="bookID is required")
        args = parser.parse_args()

        Book.query.filter_by(bookID=args['bookID']).delete()

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
        parser.add_argument('page', type=str, required=False, location='args', default='1')

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

    @marshal_with(member_fields)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=True, trim=True, help="id is required")
        parser.add_argument("name", type=str, required=True, trim=True, help="Name is required")
        args = parser.parse_args()

        member_query = Member.query.filter_by(id=args['id'])

        if not member_query.first():
            abort(400, message="No such member")

        member_query.update({'name': args['name']})

        db.session.commit()

        member_list = Member.query.all()

        for member_entry in member_list:
            member_entry.amount_due = calculate_amount_due(member_entry)

        return member_list

    @marshal_with(member_fields)
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=True, location='args', trim=True, help="id is required")
        args = parser.parse_args()

        Member.query.filter_by(id=args['id']).delete()

        db.session.commit()

        member_list = Member.query.all()

        for member_entry in member_list:
            member_entry.amount_due = calculate_amount_due(member_entry)

        return member_list


def calculate_amount_due(member):
    today = dateutil.parser.parse(datetime.today().strftime('%d/%m/%Y'))

    amount_due = 0

    for date in member.issue_dates:
        issue_date = dateutil.parser.parse(date)
        amount_due += (today - issue_date).days * 10

    return amount_due


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

        member = Member.query.filter_by(id=args['member_id'])
        book_entry = Book.query.filter_by(bookID=args['book_id'])

        member = member.first()
        book = book_entry.first()

        if not member:
            abort(404, message="No such member")

        if book:
            book_entry.update({'book_count': book.book_count - 1})
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

        if calculate_amount_due(member) >= 500:
            abort(409, message="A member cannot have outstanding due greater than 500")

        member.update(({'books_issued': books_issued, 'issue_dates': issue_dates}))
        db.session.commit()

        member_list = Member.query.all()

        for member_entry in member_list:
            member_entry.amount_due = calculate_amount_due(member_entry)

        return member_list

    @marshal_with(member_fields)
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument("member_id", type=int, required=True, trim=True, help="member_id is required")
        parser.add_argument("book_id", type=int, required=True, trim=True, help="book_id is required")
        args = parser.parse_args()

        member = Member.query.filter_by(id=args['member_id'])
        book_entry = Book.query.filter_by(bookID=args['book_id'])

        member = member.first()
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

        member.update(({'books_issued': books_issued, 'issue_dates': issue_dates}))
        db.session.commit()

        member_list = Member.query.all()

        for member_entry in member_list:
            member_entry.amount_due = calculate_amount_due(member_entry)

        return member_list


api.add_resource(Books, '/api/v1/book', '/api/v1/book/')
api.add_resource(FetchBookList, '/api/v1/fetch/', '/api/v1/fetch')

api.add_resource(Members, '/api/v1/member', '/api/v1/member/')

api.add_resource(Issues, '/api/v1/issue', '/api/v1/issue/')
