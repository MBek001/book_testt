import datetime
import enum
from typing import Optional, List

from pydantic import BaseModel


class ShoppingCartItem(BaseModel):
    book_id: int
    quantity: int


class BooksList(BaseModel):
    id: int
    special_book_id: int
    title: str
    author: str
    publication_date: datetime.date
    category: str
    description: str
    price: float
    barcode: int
    quantity: int
    language: str
    average_rating: Optional[float]=None,
    added_at: Optional[datetime.datetime]=None
    photos: Optional[List[str]]=None



class BookCategoryEnum(enum.Enum):
    fiction = "Fiction"
    non_fiction = "Non-Fiction"
    biography = "Biography"
    science_fiction = "Science Fiction"
    history = "History"
    poetry = "Poetry"
    cooking = "Cooking"


class BookLanguageEnum(enum.Enum):
    russian = "Russian"
    english = "English"
    french = "French"
    uzbek = "Uzbek"





import datetime
from datetime import date

from fastapi import HTTPException
from pydantic import BaseModel ,EmailStr, validator
import phonenumbers

class UserRegister(BaseModel):
    name: str
    email: str
    phone_number: str
    password1: str
    password2: str


    # @validator('phone_number')
    # def validate_phone_number(cls, v):
    #     try:
    #         parsed_number = phonenumbers.parse(v)
    #         if not phonenumbers.is_valid_number(parsed_number):
    #            raise HTTPException(detail='Enter phone number correctly !', status_code=400)
    #     except phonenumbers.phonenumberutil.NumberParseException:
    #         raise HTTPException(detail='Enter phone number correctly !', status_code=400)
    #     return v

class UserEditProfile(BaseModel):
    phone_number:str

    @validator('phone_number')
    def validate_phone_number(cls, v):
        try:
            parsed_number = phonenumbers.parse(v)
            if not phonenumbers.is_valid_number(parsed_number):
                raise HTTPException(detail='Enter phone number correctly !', status_code=400)
        except phonenumbers.phonenumberutil.NumberParseException:
            raise HTTPException(detail='Enter phone number correctly !', status_code=400)
        return v


class UserDb(BaseModel):
    name: str
    email: str
    phone_number: str
    is_admin: bool
    password: str


class GetUSerInfo(BaseModel):
    id: int
    name: str
    email: str
    phone_number: str


class UserLogin(BaseModel):
    email: str
    password: str


class AllUserInfo(BaseModel):
    id: int
    name: str
    email: str
    phone_number: str
    is_admin: bool
    date_joined: date


class UserList(BaseModel):
    id: int
    name: str
    email: str
    phone_number: str
    date_joined: date
    is_admin: bool
