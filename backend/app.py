import requests
from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, fields, marshal_with, abort, reqparse

from models import Book, Member, db, Issue

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
        "name": fields.String(50)
    }

    @marshal_with(member_fields)
    def get(self):
        return Member.query.all()

    @marshal_with(member_fields)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, required=True, trim=True, help="Name is required")
        args = parser.parse_args()

        member = Member(name=args.get('name'))

        db.session.add(member)
        db.session.commit()

        return Member.query.all()


class Issues(Resource):
    issue_fields = {
        "id": fields.Integer,
        "member_id": fields.Integer,
        "book_id": fields.Integer,
        "issue_date": fields.String(10)
    }

    @marshal_with(issue_fields)
    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument("member_id", type=int, required=False, trim=True, location='args', )
        member_id = parser.parse_args()['member_id']

        if not member_id:
            return Issue.query.all()
        else:
            return Issue.query.filter_by(member_id=member_id)

    @marshal_with(issue_fields)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("member_id", type=int, required=True, trim=True, help="member_id is required")
        parser.add_argument("book_id", type=int, required=True, trim=True, help="book_id is required")
        parser.add_argument("issue_date", type=str, required=True, trim=True, help="issue_date is required")
        args = parser.parse_args()

        if not Book.query.filter_by(bookID=args['book_id']).first():
            abort(404, message="No such book")

        if not Member.query.filter_by(id=args['member_id']).first():
            abort(404, message="No such member")

        issue = Issue(member_id=args.get('member_id'), book_id=args.get('book_id'), issue_date=args.get('issue_date'))

        db.session.add(issue)
        db.session.commit()

        return Issue.query.all()


api.add_resource(Books, '/api/v1/book', '/api/v1/book/', '/api/v1/book/<string:isbn>')
api.add_resource(FetchBookList, '/api/v1/fetch/', '/api/v1/fetch')

api.add_resource(Members, '/api/v1/member', '/api/v1/member/')

api.add_resource(Issues, '/api/v1/issue', '/api/v1/issue/')
