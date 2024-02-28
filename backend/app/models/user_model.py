from sqlmodel import Field, SQLModel, Relationship
from typing import Optional
from uuid import UUID

from app.models.base_model import BaseUUIDModel


class UserBase(SQLModel):
    first_name: str
    last_name: str
    phone: Optional[str]
    username: str = Field(
        nullable=True, index=True, sa_column_kwargs={"unique": True}
    )
    bonus_balance: Optional[float] = Field(default=0)
    role: str = Field(default='user')


class User(BaseUUIDModel, UserBase, table=True):
    hashed_password: Optional[str] = Field(default=None, nullable=False, index=True)
    