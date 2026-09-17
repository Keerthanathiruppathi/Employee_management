from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import employees


app = FastAPI(
    title="Employee Management API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(employees.router)


@app.get("/")
def root():
    return {
        "message": "Employee Management API is running"
    }