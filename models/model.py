import enum
from sqlalchemy import Table, MetaData, Column, String, Integer, Text, Boolean, Date, ForeignKey, Float, DECIMAL, Enum, \
    TIMESTAMP, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, date

Base = declarative_base()
metadata = MetaData()

# User Table
user = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('password', String),
    Column('email', String, unique=True, index=True),
    Column('name', String),
    Column('phone_number', String),
    Column('is_admin',Boolean,default=False),
    Column('date_joined', Date, default=date.today),
)

superuser = Table(
    'superuser',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('is_superuser', Boolean, default=False),
)

# Book Table
book = Table(
    'books',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('special_book_id', Integer, index=True),
    Column('title', String, index=True),
    Column('author', String, index=True),
    Column('publication_date', Date),
    Column('category',String),
    Column('description', String, default='description is not available'),
    Column('price', Float, default=0),
    Column('quantity', Integer, default=0),
    Column('language', String, default="Russian"),
    Column('added_at', TIMESTAMP, default=datetime.utcnow),
    Column('barcode', String, index=True)
)

categories = Table(
    'category',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('category_name', String, unique=True, index=True),
)


# Wishlist Table
wishlist = Table(
    'wishlists',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('number_of_books_left', Integer, default=0),
    Column('date_created', TIMESTAMP, default=datetime.utcnow)
)

# Order Table
order = Table(
    'orders',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('shopping_cart_id', Integer, ForeignKey('shopping_cart.id')),
    Column('order_date', TIMESTAMP, default=datetime.utcnow),
    Column('address', String),
    Column('order_status', String),
    Column('total_price', Float),
    Column('phone_number', String)
)

# OrderItem Table
shopping_cart = Table(
    'shopping_cart',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('quantity', Integer),
    Column('amount', Float),
    Column('created_at', TIMESTAMP, default=datetime.utcnow)
)

# Review Table
review = Table(
    'reviews',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('comments', String,default='no comments yet'),
    Column('review_date', TIMESTAMP, default=datetime.utcnow)
)

# Promotion Table
promotion = Table(
    'promotions',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('promotion_name', String, unique=True, index=True),
    Column('description', String),
    Column('discount_percentage', Float),
    Column('start_date', TIMESTAMP),
    Column('end_date', TIMESTAMP)
)

# Images Table
images = Table(
    'images',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column ('book_id', Integer, ForeignKey("books.id")),
    Column('photo_url', String)
)



rate = Table(
    'rates',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('rating', Integer, default=1)
)


books_in_ages = Table(
    'books_in_ages',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('ages', String ),
    Column('book_id', Integer, ForeignKey('books.id'))
)

user_address = Table(
    'user_address',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('address', String),
    Column('date_added', TIMESTAMP,default=datetime.utcnow)
)



