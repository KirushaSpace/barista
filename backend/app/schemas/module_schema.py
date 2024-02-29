from uuid import UUID
from typing import List, Optional

from app.models.module_model import ModuleBase
from app.schemas.task_schema import TaskRead, TaskBase


class ModuleCreate(ModuleBase):
    course_id: UUID
    tasks: Optional[List[TaskBase]] = []


class ModuleUpdate(ModuleBase):
    pass


class ModuleRead(ModuleBase):
    id: UUID
    course_id: UUID
    tasks: Optional[List[TaskRead]] = []