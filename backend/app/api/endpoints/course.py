from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from typing import List, TypeVar, Dict, Union, Any
from sqlmodel import select, and_
import sqlalchemy as sa

from app.api.endpoints import deps
from app.models import User, Course, Statistic
from app.crud import course_crud, module_crud, statistic_crud
from app.schemas.role_schema import RoleEnum
from app.schemas.course_schema import CourseCreate, CourseRead, CourseUpdate
from app.schemas.statistic_schema import StatisticCreate, StatisticRead


DataType = TypeVar("DataType")


router = APIRouter()


@router.get("")
async def get_multi(
    skip: int = 0,
    limit: int = 100, 
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.user, RoleEnum.admin]))
) -> List[CourseRead]:
    query = select(Course).offset(skip).limit(limit).order_by(Course.id)
    courses = await course_crud.course.get_multi(query=query)
    return courses


@router.get("/{course_id}")
async def get_course_by_id(
    course_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin, RoleEnum.user])),
) -> Dict[str, Any]:
    course = await course_crud.course.get(id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="course not found")
    
    query = select(Statistic).where(and_(Statistic.course_id == course_id, Statistic.user_id == current_user.id))
    stat = await statistic_crud.statistic.get_multi(query=query)
    if not stat:
        course_stat = {}
        course_stat['course_count_modules'] = 0
        for module in course.modules:
            course_stat['course_count_modules'] += 1
            module_id = module.id
            if module_id not in course_stat:
                course_stat[str(module_id)] = {}
            for task in module.tasks:
                task_id = task.id
                course_stat[str(module_id)][str(task_id)] = False
            course_stat[str(module_id)]['progress'] = False
        print(course_stat)
        new_stat = StatisticCreate(course_id=course_id, user_id=current_user.id, course_stats=course_stat) 
        stat = await statistic_crud.statistic.create(obj_in=new_stat)
    else:
        stat = stat[0]

    return {"course": CourseRead.model_validate(course), "user_stat": StatisticRead.model_validate(stat)}


@router.post("")
async def create_course(
    course: CourseCreate,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> CourseRead:
    new_course = await course_crud.course.create(obj_in=course, user_id=current_user.id)
    return new_course 


@router.put("/{course_id}")
async def update_course(
    course_id: UUID,
    course: CourseUpdate,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> CourseRead:
    current_course = await course_crud.course.get(id=course_id)
    if not current_course:
        raise HTTPException(status_code=404, detail="Worksapce not found")

    course_updated = await course_crud.course.update(obj_new=course, obj_current=current_course)
    return course_updated


@router.delete("/{course_id}")
async def delete_course(
    course_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
):
    current_course = await course_crud.course.get(id=course_id)
    if not current_course:
        raise HTTPException(status_code=404, detail="course not found")
    
    for module in current_course.modules:
        await module_crud.module.remove(id=module.id)

    course = await course_crud.course.remove(id=course_id)
    return {'course_id': course_id,
            'message': 'deleted'}