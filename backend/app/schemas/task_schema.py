from uuid import UUID

from app.models.task_model import TaskBase


class TaskCreate(TaskBase):
    module_id: UUID


class TaskUpdate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: UUID
    module_id: UUID


class TaskStat(TaskBase):
    comlete: bool
    id: UUID
    
    class Config:
        exclude = {'title', 'text', 'question', 'answers', 'right_answer'}