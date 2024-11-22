from fastapi import APIRouter
from .chatWebSocket import router as ws_router
from .views import router as chat_router

router = APIRouter(prefix="/chat")
router.include_router(router=ws_router)
router.include_router(router=chat_router)
