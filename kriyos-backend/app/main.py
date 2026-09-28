from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.leads import router as leads_router
from app.config import FRONTEND_ORIGIN

app = FastAPI(title="KriyosOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}