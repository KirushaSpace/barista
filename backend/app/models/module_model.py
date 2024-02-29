from sqlmodel import  Field, SQLModel, Relationship, Column, JSON
from typing import List, Optional
from uuid import UUID

from app.models.base_model import BaseUUIDModel


class ModuleBase(SQLModel):
    title: Optional[str] = Field(nullable=False)
    description: Optional[str] = Field(nullable=False)


class Module(BaseUUIDModel, ModuleBase, table=True):  
    course: Optional["Course"] = Relationship(
        back_populates="modules", sa_relationship_kwargs={"lazy": "joined"}
    )
    course_id: Optional[UUID] = Field(default=None, foreign_key="Course.id")

    tasks: List["Task"] = Relationship(
        back_populates="module", sa_relationship_kwargs={"lazy": "selectin"}
    )