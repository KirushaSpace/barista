from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.models.user_model import User
from pydantic import ValidationError
from app.crud import user_crud as crud
from app.core.config import settings


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/user/login"
)


def get_current_user(required_roles: List[str] = None) -> User:
    async def current_user(
        token: str = Depends(reusable_oauth2),
    ) -> User:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
        except (JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        user_id = payload["sub"]
        user: User = await crud.user.get(id=user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if required_roles:
            is_valid_role = False
            for role in required_roles:
                if role == user.role:
                    is_valid_role = True

            if not is_valid_role:
                raise HTTPException(
                    status_code=403,
                    detail=f"""Role "{required_roles}" is required for this action""",
                )
            
        return user
    
    return current_user