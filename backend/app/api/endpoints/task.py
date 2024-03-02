from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, and_
from typing import List
import copy

from app.api.endpoints import deps
from app.models import User, Task, Statistic
from app.crud import task_crud, statistic_crud, module_crud
from app.schemas.role_schema import RoleEnum
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskRead
from app.schemas.statistic_schema import StatisticRead, StatisticUpdate


router = APIRouter()


@router.get("")
async def get_multi(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin, RoleEnum.user])) 
) -> List[TaskRead]:
    query = select(Task).offset(skip).limit(limit).order_by(Task.id)
    tasks = await task_crud.task.get_multi(query=query)
    return tasks


@router.get("/{task_id}")
async def get_task_by_id(
    task_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin, RoleEnum.user])),
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


@router.post("/check_ans/{task_id}")
async def check_answer(
    task_id: UUID,
    answer_user: str,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin, RoleEnum.user])),
) -> StatisticRead:
    cur_task = await task_crud.task.get(id=task_id)

    if not cur_task:
        raise HTTPException(status_code=404, detail="task not found")
    
    cur_module = await module_crud.module.get(id=cur_task.module_id)
    query = select(Statistic).where(and_(Statistic.course_id == cur_module.course_id, Statistic.user_id == current_user.id))
    cur_stat = await statistic_crud.statistic.get_multi(query=query)
    cur_stat = cur_stat[0]
    new_stat = copy.copy(cur_stat)
    new_stat.course_stats[str(cur_module.id)][str(cur_task.id)] = cur_task.right_answer == answer_user
    stat_updated = await statistic_crud.statistic.update(obj_new=new_stat, obj_current=cur_stat)
    return stat_updated
