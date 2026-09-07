from pydantic import BaseModel, EmailStr
from typing import Optional


class EmployeeCreate(BaseModel):
    name: str
    email: EmailStr
    department: str
    designation: str
    salary: float


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: str
    designation: str
    salary: float

    class Config:
        from_attributes = True