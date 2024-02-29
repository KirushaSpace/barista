from app.models import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.crud.base_crud import CRUDBase


class CRUDTask(CRUDBase[Task, TaskCreate, TaskUpdate]):
    pass


task = CRUDTask(Task)