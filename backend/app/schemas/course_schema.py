from uuid import UUID
from typing import List, Optional

from app.models.course_model import CourseBase
from app.schemas.module_schema import ModuleRead


class CourseCreate(CourseBase):
    user_id: UUID


class CourseUpdate(CourseBase):
    pass


class CourseRead(CourseBase):
    id: UUID
    user_id: UUID
    modules: Optional[List[ModuleRead]] = []

    class Config:
        from_orm = True
