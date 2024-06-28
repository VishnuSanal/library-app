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


class Initialize(Resource):
    @marshal_with(Books.book_fields)
    def get(self, count):

        if not count:
            abort(409, message="Count ID required")

        page = 1

        while count >= 0:
            response = requests.get(f'https://frappe.io/api/method/frappe-library?page={page}')

            if response.status_code != 200:
                abort(500, message="Book import failed")

            book_list = response.json()['message']

            for book in book_list:
                book = Book.create_from_data(book)

                if Book.query.filter_by(isbn=book.isbn).first():
                    continue

                db.session.add(book)
                db.session.commit()

                count = count - 1

                if count <= 0:
                    return Book.query.all()

            page = page + 1

        return Book.query.all()


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


api.add_resource(Books, '/api/v1/book/', '/api/v1/book/<string:isbn>')
api.add_resource(Initialize, '/api/v1/init/<int:count>', '/api/v1/initialize/<int:count>')

api.add_resource(Members, '/api/v1/member/')
