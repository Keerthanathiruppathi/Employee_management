from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class EmployeeCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    department: str
    salary: float

class EmployeeUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    department: str
    salary: float


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    department: str
    salary: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
