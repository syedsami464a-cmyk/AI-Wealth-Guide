from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import UserRecommendation
from .schemas import RecommendationRequest
from .recommendation import get_recommendation

router = APIRouter()


@router.get("/")
def home():
    return {
        "message": "Welcome to AI Wealth Guide API"
    }


@router.get("/products")
def get_products():

    return [
        {
            "name": "Fixed Deposit (FD)",
            "risk": "Low",
            "returns": "6% - 8%"
        },
        {
            "name": "Recurring Deposit (RD)",
            "risk": "Low",
            "returns": "6% - 7.5%"
        },
        {
            "name": "Public Provident Fund (PPF)",
            "risk": "Low",
            "returns": "7% - 8%"
        },
        {
            "name": "National Pension System (NPS)",
            "risk": "Medium",
            "returns": "8% - 10%"
        },
        {
            "name": "Mutual Funds",
            "risk": "Medium - High",
            "returns": "10% - 15%"
        },
        {
            "name": "Gold ETF",
            "risk": "Medium",
            "returns": "7% - 10%"
        }
    ]


@router.post("/recommend")
def recommend(
    user: RecommendationRequest,
    db: Session = Depends(get_db)
):

    result = get_recommendation(user)

    recommendation = UserRecommendation(
        name=user.name,
        age=user.age,
        occupation=user.occupation,
        monthly_income=user.monthly_income,
        monthly_savings=user.monthly_savings,
        investment_goal=user.investment_goal,
        risk_level=user.risk_level,
        recommended_product=result["product"]
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return result


@router.get("/history")
def history(db: Session = Depends(get_db)):

    records = db.query(UserRecommendation).all()

    return records


@router.delete("/history/{recommendation_id}")
def delete_history(recommendation_id: int, db: Session = Depends(get_db)):
    record = db.query(UserRecommendation).filter(UserRecommendation.id == recommendation_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    db.delete(record)
    db.commit()

    return {"message": "Recommendation deleted successfully"}