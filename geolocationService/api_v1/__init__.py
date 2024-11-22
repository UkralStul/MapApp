from fastapi import APIRouter
from .events import router as event_router
from .usersGeo import router as user_geo_router

router = APIRouter()
router.include_router(router=event_router, prefix="/events")
router.include_router(router=user_geo_router, prefix="/userGeo")
