from contextlib import asynccontextmanager
from core.models import Base, db_helper
from fastapi import FastAPI
from core.config import settings
from auth.views import router as auth_router
from api_v1 import router as apiv1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with db_helper.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router=auth_router)
app.include_router(router=apiv1_router, prefix=settings.api_v1_prefix)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
