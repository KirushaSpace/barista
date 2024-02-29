from uuid import UUID

from app.models.task_model import TaskBase


class TaskCreate(TaskBase):
    module_id: UUID


class TaskUpdate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: UUID
    module_id: UUID