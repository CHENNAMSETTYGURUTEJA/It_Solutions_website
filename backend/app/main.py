from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, SessionLocal
from app.models import User
from app.services.auth_service import hash_password
from app.routers import auth, contact, enquiries, subscribe


def seed_default_admin() -> None:
    if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
        db = SessionLocal()
        try:
            admin_user = (
                db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
            )
            if not admin_user:
                new_admin = User(
                    name=settings.ADMIN_NAME,
                    email=settings.ADMIN_EMAIL,
                    password_hash=hash_password(settings.ADMIN_PASSWORD),
                    role="admin",
                )
                db.add(new_admin)
                db.commit()
        except Exception:
            pass
        finally:
            db.close()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    try:
        init_db()
        seed_default_admin()
    except Exception:
        pass

    yield


tags_metadata = [
    {
        "name": "Authentication",
        "description": "User registration, authentication, token revocation (logout), and profile retrieval.",
    },
    {
        "name": "Contact",
        "description": "Canonical STACKLY company contact details.",
    },
    {
        "name": "Enquiries",
        "description": "Customer inquiry submission and administrative management.",
    },
    {
        "name": "Newsletter",
        "description": "Newsletter email subscription.",
    },
]

app = FastAPI(
    title="STACKLY IT Solutions API",
    description=(
        "REST API for the STACKLY IT Solutions platform. "
        "Provides customer enquiry submission, company contact details, "
        "and secure JWT user authentication with role-based access control."
    ),
    version="1.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = list(settings.cors_origins_list)
if not origins:
    origins = ["*"]
elif "null" not in origins:
    origins.append("null")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(enquiries.router, prefix="/api/enquiries", tags=["Enquiries"])
app.include_router(subscribe.router, prefix="/api/subscribe", tags=["Newsletter"])


@app.get(
    "/",
    tags=["General"],
    summary="Root welcome endpoint",
)
def root():
    return {
        "message": "Welcome to STACKLY IT Solutions API",
        "documentation": "/docs",
        "version": "1.0.0",
        "status": "online",
    }


@app.get(
    "/api/health",
    tags=["General"],
    summary="Health check endpoint",
)
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
