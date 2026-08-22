from fastapi import FastAPI, APIRouter

from app.routes import assessment_websocket, auth, identify, users, plants, concerns, upload
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Potter.ai backend is running."}


@app.get("/health")
def health_check():
    return {"status": "Running ok."}


app.include_router(auth.router, prefix="/api/auth")
app.include_router(users.router, prefix="/api/users")
app.include_router(plants.router, prefix="/api/plants")
app.include_router(concerns.router, prefix="/api/concerns")
app.include_router(assessment_websocket.router, prefix="/api/concern/ws")
app.include_router(upload.router, prefix="/api/uploads")
app.include_router(identify.router, prefix="/api/identify")
