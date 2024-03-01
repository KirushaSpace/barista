from sqlmodel import  Field, SQLModel, Relationship, Column, JSON
from typing import Dict, Optional, List
from uuid import UUID

from app.models.base_model import BaseUUIDModel


class StatisticBase(SQLModel):
    course_id: Optional[UUID] = Field(default=None)
    course_stats: Dict[UUID, List["Task"]] = Field(sa_column=Column(JSON), default=None)


class Statistic(BaseUUIDModel, StatisticBase, table=True):
    user: Optional["User"] = Relationship(
        back_populates="stats", sa_relationship_kwargs={"lazy": "joined"}
    )  
    user_id: Optional[UUID] = Field(default=None, foreign_key="User.id")
