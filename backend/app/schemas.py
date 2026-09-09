from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EmployeeCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None
    department: str
    salary: float

class EmployeeUpdate(BaseModel):
    name: str
    email: str
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
