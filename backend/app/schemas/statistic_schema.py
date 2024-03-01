from uuid import UUID
from app.models.statistic_model import StatisticBase


class StatisticCreate(StatisticBase):
    user_id: UUID


class StatisticUpdate(StatisticBase):
    pass


class StatisticRead(StatisticBase):
    id: UUID
    