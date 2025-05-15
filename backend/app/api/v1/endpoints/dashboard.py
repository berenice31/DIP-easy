from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_active_user
from app.db.base import get_db
from app.models.user import User
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get dashboard statistics for the current user.
    """
    # Pour l'instant, retournons des données fictives
    return {
        "totalDips": 0,
        "pendingDips": 0,
        "completedDips": 0,
        "recentActivity": []
    } 