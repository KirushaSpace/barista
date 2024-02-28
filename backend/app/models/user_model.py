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


class User(BaseUUIDModel, UserBase, table=True):
    hashed_password: Optional[str] = Field(nullable=False, index=True)
    role: Optional["Role"] = Relationship(  # noqa: F821
        back_populates="users", sa_relationship_kwargs={"lazy": "joined"}
    )
    role_id: Optional[UUID] = Field(default=None, foreign_key="Role.id")
    is_active: bool = Field(default=True)