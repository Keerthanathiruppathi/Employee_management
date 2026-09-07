from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Employee Management API is running"}