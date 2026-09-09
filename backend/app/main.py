from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers import employees


app = FastAPI(
    title="Employee Management API",
    version="1.0.0"
)


Base.metadata.create_all(bind=engine)


app.include_router(employees.router)


@app.get("/")
def root():
    return {
        "message": "Employee Management API is running"
    }