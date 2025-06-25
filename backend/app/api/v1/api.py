from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, products, dashboard, menus, templates, generations, admin_drive, attachments, drive

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(menus.router, prefix="/menus", tags=["menus"])
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
api_router.include_router(generations.router, prefix="/generations", tags=["generations"])
api_router.include_router(admin_drive.router, prefix="/admin/drive", tags=["admin"])
api_router.include_router(drive.router, prefix="/drive", tags=["drive"])
api_router.include_router(attachments.router, prefix="/attachments", tags=["attachments"]) 