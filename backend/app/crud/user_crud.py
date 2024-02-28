from typing import Union, Optional, List, Dict, Any
from sqlmodel import select

from app.db.session import AsyncSession
from app.crud.base_crud import CRUDBase
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_username(
        self, 
        *, 
        username: str, 
        db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        db_session = db_session or super().get_db().session
        users = await db_session.execute(select(User).where(User.username == username))
        return users.scalar_one_or_none()


    async def create_user(
        self, *, obj_in: UserCreate, db_session: Optional[AsyncSession] = None
    ) -> User:
        db_session = db_session or super().get_db().session
        print(obj_in)
        db_obj = User.model_validate(obj_in)
        print(db_obj)
        db_obj.hashed_password = get_password_hash(obj_in.password)
        db_session.add(db_obj)
        await db_session.commit()
        await db_session.refresh(db_obj)
        return db_obj


    async def authenticate(
        self, 
        *, 
        username: str, 
        password: str
    ) -> Optional[User]:
        user = await self.get_by_username(username=username)

        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    

user = CRUDUser(User)