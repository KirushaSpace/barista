from sqlmodel import  Field, SQLModel, Relationship, Column, JSON
from typing import List, Optional
from uuid import UUID

from app.models.base_model import BaseUUIDModel


class CourseBase(SQLModel):
    title: Optional[str] = Field(nullable=False)
    description: Optional[str] = Field(nullable=False)
    access: List[str] = Field(sa_column=Column(JSON), default=['user'])


class Course(BaseUUIDModel, CourseBase, table=True):  
    user_id: Optional[UUID] = Field(default=None, foreign_key="User.id")

    modules: List["Module"] = Relationship(
        back_populates="course", sa_relationship_kwargs={"lazy": "selectin"}
    )
