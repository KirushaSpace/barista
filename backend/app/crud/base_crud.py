from fastapi import HTTPException
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from uuid import UUID
from fastapi_async_sqlalchemy import db
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlmodel import SQLModel, select, JSON
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel.sql.expression import Select
from sqlalchemy import exc
from sqlalchemy.orm.attributes import flag_modified

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
SchemaType = TypeVar("SchemaType", bound=BaseModel)
T = TypeVar("T", bound=SQLModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        **Parameters**
        * `model`: A SQLModel model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model
        self.db = db

    
    def get_db(self):
            return self.db

        
    async def get(
        self, 
        *, 
        id: Union[UUID, str], 
        db_session: Optional[AsyncSession] = None
    ) -> Optional[ModelType]:
        db_session = db_session or self.db.session
        query = select(self.model).where(self.model.id == id)
        response = await db_session.execute(query)
        return response.scalar_one_or_none()
    

    async def get_multi(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        query: Optional[Union[T, Select[T]]] = None,
        db_session: Optional[AsyncSession] = None,
    ) -> List[ModelType]:
        db_session = db_session or self.db.session
        if query is None:
            query = select(self.model).offset(skip).limit(limit).order_by(self.model.id)
        response = await db_session.execute(query)
        return response.scalars().all()
    

    async def create(
        self,
        *,
        obj_in: Union[CreateSchemaType, ModelType],
        user_id: Optional[Union[UUID, str]] = None,
        db_session: Optional[AsyncSession] = None,
    ) -> ModelType:
        db_session = db_session or self.db.session
        db_obj = self.model.model_validate(obj_in)
        if user_id:
            db_obj.user_id = user_id
        try:
            db_session.add(db_obj)
            await db_session.commit()
        except exc.IntegrityError:
            db_session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Resource already exists",
            )
        await db_session.refresh(db_obj)
        return db_obj


    async def update(
        self,
        *,
        obj_current: ModelType,
        obj_new: Union[UpdateSchemaType, Dict[str, Any], ModelType],
        db_session: Optional[AsyncSession] = None,
    ) -> ModelType:
        db_session = db_session or self.db.session
        obj_data = jsonable_encoder(obj_current)
        print(obj_current)
        for field in obj_new.dict():
            if field == "course_stats":
                obj_current.course_stats.update(obj_new.course_stats)
                flag_modified(obj_current, "course_stats")
            else:
                setattr(obj_current, field, getattr(obj_new, field))
        print(obj_current)
        await db_session.commit()
        await db_session.refresh(obj_current)
        print(obj_current)
        return obj_current


    async def remove(
        self, 
        *, 
        id: Union[UUID, str], 
        db_session: Optional[AsyncSession] = None
    ) -> ModelType:
        db_session = db_session or self.db.session
        response = await db_session.execute(
            select(self.model).where(self.model.id == id)
        )
        obj = response.scalar_one()
        await db_session.delete(obj)
        await db_session.commit()
        return obj