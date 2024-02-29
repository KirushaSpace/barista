from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List

from app.models.base_model import BaseUUIDModel


class UserBase(SQLModel):
    first_name: str
    last_name: str
    phone: Optional[str]
    username: str = Field(
        nullable=True, index=True, sa_column_kwargs={"unique": True}
    )
    process: Optional[int] = Field(default=0)
    finish: Optional[int] = Field(default=1)
    role: str = Field(default='user')
    level: str = Field(default='junior')


class User(BaseUUIDModel, UserBase, table=True):
    hashed_password: Optional[str] = Field(default=None, nullable=False, index=True)

    courses: List["Course"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )

    