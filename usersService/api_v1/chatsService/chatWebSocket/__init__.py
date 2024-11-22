from fastapi import APIRouter
from .chatWS import router as ws_router

router = APIRouter(tags=["ws"])
router.include_router(router=ws_router)
