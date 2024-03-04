from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from app.models.user_model import UserBase


class LoginSchema(BaseModel):
    username: Optional[str]
    password: Optional[str]


class UserCreate(UserBase):
    password: Optional[str]

    class Config:
        hashed_password = None


class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str]


class UserUpdateLevel(BaseModel):
    level: str


class UserRead(UserBase):
    id: UUID

    class Config:
        from_attributes = True
