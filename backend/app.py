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
    }

    @marshal_with(book_fields)
    def get(self, isbn=None):

        if not isbn:
            books = Book.query.all()
            if not books:
                abort(404, message="Book list empty")
            return books
        else:
            book = Book.query.filter_by(isbn=isbn).first()
            if not book:
                abort(404, message="Book not found")
            return book

    @marshal_with(book_fields)
    def post(self, isbn=None):
        if not isbn:
            abort(409, message="ISBN ID required")

        if Book.query.filter_by(isbn=isbn).first():
            return Book.query.all()

        response = requests.get(f'https://frappe.io/api/method/frappe-library?isbn={isbn}')

        if response.status_code != 200:
            abort(500, message="Book import failed")

        book_data = response.json()['message'][0]

        book = Book.create_from_data(book_data)

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

        link = (f'https://frappe.io/api/method/frappe-library?'
                f'&title={args['title']}'
                f'&authors={args['authors']}'
                f'&isbn={args['isbn']}'
                f'&publisher={args['publisher']}'
                f'&page={args['page']}'
                )

        response = requests.get(link)

        if response.status_code != 200:
            abort(500, message="Book import failed")

        return response.json()['message']


class Members(Resource):
    member_fields = {
        "_id": fields.Integer,
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


api.add_resource(Books, '/api/v1/book', '/api/v1/book/', '/api/v1/book/<string:isbn>')
api.add_resource(FetchBookList, '/api/v1/fetch/', '/api/v1/fetch')

api.add_resource(Members, '/api/v1/member', '/api/v1/member/')
