from datetime import datetime
from random import randint

from sqlalchemy import update, select, func, delete, insert
from starlette import status
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, FastAPI
from fastapi.responses import FileResponse, JSONResponse

from sqlalchemy.ext.asyncio import AsyncSession
from utilities import verify_token
from database import get_async_session
from models.model import book, user, categories, rate, review, images, superuser,books_in_ages
from category.scheme import CategoryEnum, AgesEnum
import aiofiles
from utilities import UPLOAD_DIR
from scheme import *
from dateutil.parser import parse
import os

app = FastAPI()



book_router = APIRouter(tags=['book'])

from sqlalchemy import insert, select

@book_router.post('/add-book')
async def add_book(
        special_book_id: int,
        title: str,
        author: str,
        publication_date: str,
        quantity: int,
        age: AgesEnum,
        category: CategoryEnum,
        description: str,
        price: float,
        language: BookLanguageEnum,
        barcode: str,
        token: dict = Depends(verify_token),
        session: AsyncSession = Depends(get_async_session)
):
    if token is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    user_id = token.get('user_id')
    result = await session.execute(
        select(user).where(
            (user.c.id == user_id) &
            (user.c.is_admin == True)
        )
    )
    if not result.scalar():
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    existing_book = await session.execute(
        select(book).where(
            (book.c.title == title) &
            (book.c.author == author)
        )
    )
    if existing_book.scalar():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Book with this TITLE and AUTHOR already exists')

    checking_book = await session.execute(
        select(book).where(
            (book.c.special_book_id == special_book_id) |
            (book.c.barcode == barcode)
        )
    )
    if checking_book.scalar():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Book with this SPECIAL_BOOK_ID or BARCODE already exists')

    try:
        selected_date = parse(publication_date).date()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid publication date format')

    barcode_length = len(barcode)
    if barcode_length < 8 or barcode_length > 13:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Barcode should be between 8 and 13 digits')

    category_query = await session.execute(select(categories).where(categories.c.category_name == category.value))
    category_exists = category_query.fetchone()

    if category_exists is None:
        await session.execute(
            insert(categories).values(
                category_name=category.value
            )
        )

    # Insert the book into the book table
    query = insert(book).values(
        special_book_id=special_book_id,
        title=title,
        author=author,
        publication_date=selected_date,
        category=str(category.value),
        description=description,
        price=price,
        quantity=quantity,
        barcode=barcode,
        language=str(language.value)
    )
    result = await session.execute(query)

    new_book_id = result.inserted_primary_key[0]
    age_book_exists_query = await session.execute(
        select(books_in_ages).where(
            (books_in_ages.c.book_id == new_book_id) &
            (books_in_ages.c.ages == age.value)
        )
    )
    age_query = await session.execute(insert(books_in_ages).values(
        ages=age.value,
        book_id=new_book_id
    ))

    if age_book_exists_query.scalar():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='This book is already associated with the selected age category')

    await session.commit()

    return {"message": "Book added successfully"}


@book_router.get('/get-books')
async def get_books(session: AsyncSession = Depends(get_async_session)):

    query = select(
        book.c.id,
        book.c.special_book_id,
        book.c.title,
        book.c.author,
        book.c.publication_date,
        book.c.quantity,
        book.c.description,
        book.c.price,
        book.c.barcode,
        book.c.language,
        book.c.category,
        book.c.added_at,
        func.coalesce(func.round(func.avg(rate.c.rating), 1), 1).label('average_rating')
    ).join(
        rate, rate.c.book_id == book.c.id, isouter=True
    ).group_by(
        book.c.id
    ).order_by(
        book.c.id
    )
    books = await session.execute(query)
    books_list = books.fetchall()

    book_ids = [b.id for b in books_list]

    photo_query = select(images).where(images.c.book_id.in_(book_ids))
    photo_result = await session.execute(photo_query)
    photos_by_book_id = {book_id: [] for book_id in book_ids}

    for photo in photo_result.fetchall():
        photos_by_book_id[photo.book_id].append(photo.photo_url)

    age_query = select(
        books_in_ages.c.book_id,
        books_in_ages.c.ages
    ).where(books_in_ages.c.book_id.in_(book_ids))

    age_result = await session.execute(age_query)
    ages_by_book_id = {book_id: [] for book_id in book_ids}

    for age in age_result.fetchall():
        ages_by_book_id[age.book_id].append(age.ages)

    books_list = [
        {
            "id": b.id,
            "special_book_id": b.special_book_id,
            "title": b.title,
            "author": b.author,
            "publication_date": b.publication_date,
            "quantity": b.quantity,
            "description": b.description,
            "price": b.price,
            "barcode": b.barcode,
            "language": b.language,
            "ages": ages_by_book_id.get(b.id),
            "category": b.category,
            "average_rating": b.average_rating if b.average_rating is not None else 0,
            "added_at": b.added_at.strftime('%Y-%m-%d %H:%M:%S') if b.added_at else None,
            "photos": photos_by_book_id.get(b.id)
        }
        for b in books_list
    ]

    return books_list

@book_router.delete('/delete-book')
async def delete_book(
        book_id: int,
        token: dict = Depends(verify_token),
        session: AsyncSession = Depends(get_async_session)
):
    if token is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    user_id = token.get('user_id')
    user_check = await session.execute(
        select(user).where(
            (user.c.id == user_id) &
            (user.c.is_admin == True)
        )
    )

    if not user_check.scalar():
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    book_query = select(book).where(book.c.id == book_id)
    existing_book = await session.execute(book_query)
    book_to_delete = existing_book.scalar_one_or_none()

    if book_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Book not found')

    # Delete associated records in books_in_ages first
    await session.execute(delete(books_in_ages).where(books_in_ages.c.book_id == book_id))

    # Delete associated reviews, ratings, and images
    await session.execute(delete(rate).where(rate.c.book_id == book_id))
    await session.execute(delete(review).where(review.c.book_id == book_id))
    await session.execute(delete(images).where(images.c.book_id == book_id))

    # Finally, delete the book
    await session.execute(delete(book).where(book.c.id == book_id))
    await session.commit()

    return {"message": "Book deleted successfully"}



@book_router.post('/upload-image')
async def upload_image(
    book_id: int,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session),
    token: dict = Depends(verify_token)
):
    if token is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    user_id = token.get('user_id')

    result = await session.execute(
        select(user).where(user.c.id == user_id, user.c.is_admin == True)
    )
    if not result.scalar():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")

    result = await session.execute(
        select(book).where(book.c.id == book_id)
    )
    if not result.scalar():
        raise HTTPException(status_code=404, detail="Book not found")

    file_location = os.path.join(UPLOAD_DIR, file.filename)
    async with aiofiles.open(file_location, "wb") as buffer:
        content = await file.read()
        await buffer.write(content)

    query = insert(images).values(
        book_id=book_id,
        photo_url=f"/images/{file.filename}"
    )
    await session.execute(query)
    await session.commit()

    return {"message": "Image uploaded successfully"}



@book_router.get('/get-books-photos')
async def get_books_photos(book_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(images.c.photo_url).where(images.c.book_id == book_id))
    image_urls = result.scalars().all()

    if not image_urls:
        raise HTTPException(status_code=404, detail="No images found for this book")

    # Construct full paths for the images
    image_paths = [os.path.join(UPLOAD_DIR, os.path.basename(url)) for url in image_urls]

    # Check if all images exist
    valid_images = [path for path in image_paths if os.path.exists(path)]

    if not valid_images:
        raise HTTPException(status_code=404, detail="No valid images found")

    return JSONResponse(content={"image_urls": valid_images})



@book_router.delete('/delete-image')
async def delete_image(
        book_id: int,
        session: AsyncSession = Depends(get_async_session),
        token: dict = Depends(verify_token)
):
    if token is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    user_id = token.get('user_id')

    admin_query = await session.execute(select(user).where(
        (user.c.id == user_id) &
        (user.c.is_admin == True))
    )
    is_admin = admin_query.scalar()

    if not is_admin:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Check if the book exists
    book_query = await session.execute(
        select(book).where(book.c.id == book_id)
    )
    if not book_query.scalar():
        raise HTTPException(status_code=404, detail="Book not found")

    # Delete the images from the database
    delete_query = delete(images).where(images.c.book_id == book_id)
    await session.execute(delete_query)
    await session.commit()

    return {"message": "Images deleted successfully"}


@book_router.patch('/increment-quantity')
async def increment_quantity(
        book_id: int,
        increment_by: int,
        session: AsyncSession = Depends(get_async_session),
        token: dict = Depends(verify_token)
):
    if token is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    user_id = token.get('user_id')

    admin_query = await session.execute(select(user).where(
        (user.c.id == user_id) &
        (user.c.is_admin == True))
    )
    is_admin = admin_query.scalar()

    super_user_query = await session.execute(select(superuser).where(
        (superuser.c.user_id == user_id) &
        (superuser.c.is_superuser == True))
    )
    is_superuser = super_user_query.scalar()

    if not is_admin and not is_superuser:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Check if the book exists
    book_query = await session.execute(
        select(book).where(book.c.id == book_id)
    )
    book_data = book_query.scalar()

    if not book_data:
        raise HTTPException(status_code=404, detail="Book not found")

    # Increment the book quantity
    update_query = (
        update(book).
        where(book.c.id == book_id).
        values(quantity=book.c.quantity + increment_by)
    )
    await session.execute(update_query)
    await session.commit()

    return {"message": "Book quantity incremented successfully"}


@book_router.patch('/decrement-quantity')
async def decrement_quantity(
        book_id: int,
        decrement_by: int,
        session: AsyncSession = Depends(get_async_session),
        token: dict = Depends(verify_token)
):
    if token is None:
        raise HTTPException(status_code=403, detail='Forbidden')

    user_id = token.get('user_id')

    admin_query = await session.execute(select(user).where(
        (user.c.id == user_id) &
        (user.c.is_admin == True))
    )
    is_admin = admin_query.scalar()

    super_user_query = await session.execute(select(superuser).where(
        (superuser.c.user_id == user_id) &
        (superuser.c.is_superuser == True))
    )
    is_superuser = super_user_query.scalar()

    if not is_admin and not is_superuser:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Check if the book exists
    book_query = await session.execute(
        select(book.c.id, book.c.quantity).where(book.c.id == book_id))

    book_data = book_query.fetchone()

    if not book_data:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check if the resulting quantity will be non-negative
    new_quantity = book_data.quantity - decrement_by
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="There is not enough books")

    # Decrement the book quantity
    update_query = (
        update(book).
        where(book.c.id == book_id).
        values(quantity=new_quantity)
    )
    await session.execute(update_query)
    await session.commit()

    return {"message": "Book quantity decremented successfully"}




