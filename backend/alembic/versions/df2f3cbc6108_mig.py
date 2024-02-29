"""mig

Revision ID: df2f3cbc6108
Revises: 4dc65c7d90ba
Create Date: 2024-02-29 19:41:49.318913

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'df2f3cbc6108'
down_revision: Union[str, None] = '4dc65c7d90ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Task', sa.Column('right_answer', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    op.add_column('User', sa.Column('level', sqlmodel.sql.sqltypes.AutoString(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('User', 'level')
    op.drop_column('Task', 'right_answer')
    # ### end Alembic commands ###
