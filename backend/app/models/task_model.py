from sqlmodel import  Field, SQLModel, Relationship, Column, JSON
from typing import List, Optional
from uuid import UUID

from app.models.base_model import BaseUUIDModel


class TaskBase(SQLModel):
    title: Optional[str] = Field(nullable=False)
    text: Optional[str] = Field(nullable=False)
    question: Optional[str] = Field(default=None)
    answers: List[str] = Field(sa_column=Column(JSON), default=None)
    right_answer: Optional[str] = Field(default=None)
    

class Task(BaseUUIDModel, TaskBase, table=True): 
    module: Optional["Module"] = Relationship(
        back_populates="tasks", sa_relationship_kwargs={"lazy": "joined"}
    )
    module_id: Optional[UUID] = Field(default=None, foreign_key="Module.id")
    