from fastapi import APIRouter

from .views import router as images_router

router = APIRouter(prefix="/images")
router.include_router(router=images_router)
