from pydantic import BaseModel


class RecommendationRequest(BaseModel):

    name: str

    age: int

    occupation: str

    monthly_income: float

    monthly_savings: float

    investment_goal: str

    risk_level: str


class RecommendationResponse(BaseModel):

    product: str

    expected_return: str

    risk: str

    description: str


class History(BaseModel):

    id: int

    name: str

    recommended_product: str

    investment_goal: str

    risk_level: str

    class Config:
        from_attributes = True