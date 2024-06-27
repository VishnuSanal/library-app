import requests
from flask import Flask
from flask_restful import Resource, Api, fields, marshal_with, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Float

app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
db = SQLAlchemy(app)


@app.before_request
def create_tables():
    app.before_request_funcs[None].remove(create_tables)

    db.create_all()


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


# book_post_validator = reqparse.RequestParser()
# book_post_validator.add_argument('isbn', help="ISBN is required to add book", required=True)


class Books(Resource):
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

        book = Book(bookID=book_data['bookID'], title=book_data['title'], authors=book_data['authors'],
                    average_rating=book_data['average_rating'], isbn=book_data['isbn'], isbn13=book_data['isbn13'],
                    language_code=book_data['language_code'], num_pages=book_data['  num_pages'],
                    ratings_count=book_data['ratings_count'], text_reviews_count=book_data['text_reviews_count'],
                    publication_date=book_data['publication_date'], publisher=book_data['publisher'])

        db.session.add(book)
        db.session.commit()

        return Book.query.all()

class Init(Resource):
    def get(self):

        response = requests.get(f'https://frappe.io/api/method/frappe-library')

        response.headers['Access-Control-Allow-Origin'] = '*'
        print(response.headers)

        if response.status_code != 200:
            abort(500, message="Book import failed")

        return response.json()


api.add_resource(Books, '/api/v1/book/', '/api/v1/book/<string:isbn>')
api.add_resource(Init, '/api/v1/init/')


class Book(db.Model):
    bookID = Column(String(50))
    title = Column(String(255))
    authors = Column(String(255))
    average_rating = Column(Float)
    isbn = Column(String(13), primary_key=True)
    isbn13 = Column(String(13))
    language_code = Column(String(10))
    num_pages = Column(Integer)
    ratings_count = Column(Integer)
    text_reviews_count = Column(Integer)
    publication_date = Column(String(10))
    publisher = Column(String(255))

    def __repr__(self):
        return f"""
        \"Book ID\" : \"{self.bookID}\",
        \"Title\" : \"{self.title}\",
        \"Authors\" : \"{self.authors}\",
        \"Average Rating\" : \"{self.average_rating}\",
        \"ISBN\" : \"{self.isbn}\",
        \"ISBN-13\" : \"{self.isbn13}\",
        \"Language Code\" : \"{self.language_code}\",
        \"Number of Pages\" : \"{self.num_pages}\",
        \"Ratings Count\" : \"{self.ratings_count}\",
        \"Text Reviews Count\" : \"{self.text_reviews_count}\",
        \"Publication Date\" : \"{self.publication_date}\",
        \"Publisher\" : \"{self.publisher}\",
        """
