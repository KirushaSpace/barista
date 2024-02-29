from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException

from app.api.endpoints import deps
from app.models import User
from app.crud import module_crud, task_crud
from app.schemas.role_schema import RoleEnum
from app.schemas.module_schema import ModuleCreate, ModuleRead, ModuleUpdate


router = APIRouter()


@router.get("/{module_id}")
async def get_module_by_id(
    module_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> ModuleRead:
    module = await module_crud.module.get(id=module_id)
    if not module:
        raise HTTPException(status_code=404, detail="module not found")
    return module


@router.post("")
async def create_module(
    module: ModuleCreate,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> ModuleRead:
    new_module = await module_crud.module.create(obj_in=module)
    return new_module 


@router.put("/{module_id}")
async def update_module(
    module_id: UUID,
    module: ModuleUpdate,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
) -> ModuleRead:
    current_module = await module_crud.module.get(id=module_id)
    if not current_module:
        raise HTTPException(status_code=404, detail="Worksapce not found")

    module_updated = await module_crud.module.update(obj_new=module, obj_current=current_module)
    return module_updated


@router.delete("/{module_id}")
async def delete_module(
    module_id: UUID,
    current_user: User = Depends(deps.get_current_user(required_roles=[RoleEnum.admin])),
):
    current_module = await module_crud.module.get(id=module_id)
    if not current_module:
        raise HTTPException(status_code=404, detail="module not found")
    
    for task in current_module.tasks:
        await task_crud.task.remove(id=task.id)

    module = await module_crud.module.remove(id=module_id)
    return {'module_id': module_id,
            'message': 'deleted'}