from fastapi import APIRouter
from .views import router as friends_router

router = APIRouter(prefix="/friends")
router.include_router(router=friends_router)
