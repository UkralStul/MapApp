from fastapi import APIRouter
from .views import router as event_router

router = APIRouter()
router.include_router(router=event_router)
