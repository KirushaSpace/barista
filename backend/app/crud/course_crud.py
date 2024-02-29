from app.models import Course
from app.schemas.course_schema import CourseCreate, CourseUpdate
from app.crud.base_crud import CRUDBase


class CRUDCourse(CRUDBase[Course, CourseCreate, CourseUpdate]):
    pass


course = CRUDCourse(Course)