from fastapi import APIRouter
from .views import router as user_geo_router
from .geolocationWebSocket import router as ws_router

router = APIRouter()
router.include_router(router=ws_router)
router.include_router(router=user_geo_router)
