from app.models import Statistic
from app.schemas.statistic_schema import StatisticCreate, StatisticUpdate
from app.crud.base_crud import CRUDBase


class CRUDStat(CRUDBase[Statistic, StatisticCreate, StatisticUpdate]):
    pass


statistic = CRUDStat(Statistic)