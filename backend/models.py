from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Float

db = SQLAlchemy()


class Book(db.Model):
    bookID = Column(String(50), primary_key=True)
    title = Column(String(255))
    authors = Column(String(255))
    average_rating = Column(Float)
    isbn = Column(String(13))
    isbn13 = Column(String(13))
    language_code = Column(String(10))
    num_pages = Column(Integer)
    ratings_count = Column(Integer)
    text_reviews_count = Column(Integer)
    publication_date = Column(String(10))
    publisher = Column(String(255))

    book_count = Column(Integer, default=0)

    @staticmethod
    def create_from_data(book_data):
        book = Book(bookID=book_data['bookID'], title=book_data['title'], authors=book_data['authors'],
                    average_rating=book_data['average_rating'], isbn=book_data['isbn'], isbn13=book_data['isbn13'],
                    language_code=book_data['language_code'], ratings_count=book_data['ratings_count'],
                    text_reviews_count=book_data['text_reviews_count'],
                    publication_date=book_data['publication_date'], publisher=book_data['publisher'])

        if '  num_pages' in book_data:
            book.num_pages = book_data['  num_pages']
        elif 'num_pages' in book_data:
            book.num_pages = book_data['num_pages']

        if 'book_count' in book_data:
            book.book_count = book_data['book_count']

        return book

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


class Member(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))

    def __repr__(self):
        return f"""
        \"ID\" : \"{self.id}\",
        \"name\" : \"{self.name}\",
        """


class Issue(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(Integer, db.ForeignKey(Member.id))
    book_id = Column(Integer, db.ForeignKey(Book.bookID))
    issue_date = Column(String(10))
