from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException

from app.api.endpoints import deps
from app.models import User
from app.crud import task_crud
from app.schemas.role_schema import RoleEnum
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskRead


router = APIRouter()


@router.get("/{task_id}")
async def get_task_by_id(
    task_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> TaskRead:
    task = await task_crud.task.get(id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    return task


@router.post("")
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> TaskRead:
    new_task = await task_crud.task.create(obj_in=task)
    return new_task 


@router.put("/{task_id}")
async def update_task(
    task_id: UUID,
    task: TaskUpdate,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> TaskRead:
    current_task = await task_crud.task.get(id=task_id)
    if not current_task:
        raise HTTPException(status_code=404, detail="Worksapce not found")

    task_updated = await task_crud.task.update(obj_new=task, obj_current=current_task)
    return task_updated


@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
):
    current_task = await task_crud.task.get(id=task_id)
    if not current_task:
        raise HTTPException(status_code=404, detail="task not found")
    
    task = await task_crud.task.remove(id=task_id)
    return {'task_id': task_id,
            'message': 'deleted'}