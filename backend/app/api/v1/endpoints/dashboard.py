from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_active_user
from app.db.base import get_db
from app.models.user import User
from app.models.product import Product, ProductStatus
from app.models.template import Template
from app.models.generation import Generation
from app.models.log import Log
from sqlalchemy.sql import func

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get dashboard statistics for the current user.
    """
    # Comptages Produits
    total_products = db.query(Product).filter(Product.user_id == current_user.id).count()
    draft_products = db.query(Product).filter(
        Product.user_id == current_user.id,
        Product.status == ProductStatus.DRAFT,
    ).count()
    validated_products = db.query(Product).filter(
        Product.user_id == current_user.id,
        Product.status == ProductStatus.VALIDATED,
    ).count()

    # Comptages DIP (Générations)
    total_dips = (
        db.query(Generation)
        .join(Product, Generation.product_id == Product.id)
        .filter(Product.user_id == current_user.id)
        .count()
    )

    pending_dips = (
        db.query(Generation)
        .filter(Generation.status == "pending")
        .join(Product, Generation.product_id == Product.id)
        .filter(Product.user_id == current_user.id)
        .count()
    )

    completed_dips = (
        db.query(Generation)
        .filter(Generation.status == "success")
        .join(Product, Generation.product_id == Product.id)
        .filter(Product.user_id == current_user.id)
        .count()
    )

    # Nombre de templates accessibles (pas de filtre user pour le moment)
    templates_count = db.query(Template).count()

    # Générations en attente (status "pending")
    pending_generations = (
        db.query(Generation)
        .filter(Generation.status == "pending")
        .join(Product, Generation.product_id == Product.id)
        .filter(Product.user_id == current_user.id)
        .count()
    )

    # Moyenne progression (0-100) sur les produits de l'utilisateur
    avg_completion = (
        db.query(func.coalesce(func.avg(Product.progression), 0))
        .filter(Product.user_id == current_user.id)
        .scalar()
    )

    # Activité récente : derniers logs (5)
    recent_logs = (
        db.query(Log)
        .order_by(Log.timestamp.desc())
        .limit(5)
        .all()
    )

    def _extract_title(l: Log):
        # Si le champ details est un dict avec clé "message"
        if isinstance(l.details, dict) and "message" in l.details:
            return str(l.details["message"])[:80]
        # Fallback à l'event_type
        return l.event_type

    recent_activity = [
        {
            "id": str(log.id),
            "type": log.event_type,
            "title": _extract_title(log),
            "date": log.timestamp.isoformat(),
            "status": (log.level or "info").lower(),
        }
        for log in recent_logs
    ]

    return {
        # Produits
        "totalProducts": total_products,
        "draftProducts": draft_products,
        "validatedProducts": validated_products,

        # DIP (Générations)
        "totalDips": total_dips,
        "pendingDips": pending_dips,
        "completedDips": completed_dips,

        # Divers
        "templatesCount": templates_count,
        "pendingGenerations": pending_generations,
        "averageCompletion": int(avg_completion),
        "recentActivity": recent_activity,
    } 