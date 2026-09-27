from fastapi import FastAPI

app = FastAPI(title="KriyosOS API")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}