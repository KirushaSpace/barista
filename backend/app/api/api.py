from fastapi import APIRouter
from app.api.endpoints import (
    user,
    course,
    module,
    task
)

api_router = APIRouter()
api_router.include_router(user.router, prefix='/user', tags=['user'])
api_router.include_router(course.router, prefix='/course', tags=['course'])
api_router.include_router(module.router, prefix='/module', tags=['course'])
api_router.include_router(task.router, prefix='/task', tags=['course'])
