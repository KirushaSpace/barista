from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException

from app.api.endpoints import deps
from app.models import User
from app.crud import course_crud, module_crud
from app.schemas.role_schema import RoleEnum
from app.schemas.course_schema import CourseCreate, CourseRead, CourseUpdate


router = APIRouter()


@router.get("/{course_id}")
async def get_course_by_id(
    course_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> CourseRead:
    course = await course_crud.course.get(id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="course not found")
    return course


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