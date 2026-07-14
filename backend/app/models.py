from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime

from datetime import datetime, UTC

from .database import Base


class UserRecommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    age = Column(Integer)

    occupation = Column(String)

    monthly_income = Column(Float)

    monthly_savings = Column(Float)

    investment_goal = Column(String)

    risk_level = Column(String)

    recommended_product = Column(String)

    created_at = Column(DateTime, default=lambda: datetime.now(UTC))