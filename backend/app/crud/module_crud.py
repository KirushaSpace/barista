from app.models import Module
from app.schemas.module_schema import ModuleCreate, ModuleUpdate
from app.crud.base_crud import CRUDBase


class CRUDModule(CRUDBase[Module, ModuleCreate, ModuleUpdate]):
    pass


module = CRUDModule(Module)