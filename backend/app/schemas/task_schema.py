from uuid import UUID

from app.models.task_model import TaskBase


class TaskSchema(TaskBase):
    module_id: UUID


class TaskRead(TaskBase):
    id: UUID
    module_id: UUID