from fastapi import APIRouter
from .geoWS import router as ws_router

router = APIRouter()
router.include_router(router=ws_router)
