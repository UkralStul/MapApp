from fastapi import APIRouter
from .friendsSystem import router as friends_router
from .imageService import router as image_router
from .chatsService import router as chat_router

router = APIRouter()
router.include_router(router=friends_router)
router.include_router(router=image_router)
router.include_router(router=chat_router)
