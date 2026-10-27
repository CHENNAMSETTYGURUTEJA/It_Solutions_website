from datetime import datetime
from typing import Tuple
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    MessageResponse,
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    revoke_token,
)
from app.dependencies import get_current_user, get_current_user_and_token

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Registers a new user account with secure password hashing. Duplicate emails are rejected.",
)
def register(
    user_in: UserRegisterRequest,
    db: Session = Depends(get_db),
) -> UserResponse:
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    hashed_pw = hash_password(user_in.password)

    new_user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_pw,
        role=user_in.role or "user",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse.model_validate(new_user)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User login and JWT token generation",
    description="Authenticates credentials and returns a signed JWT access token and user profile.",
)
def login(
    credentials: UserLoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = {
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
        "name": user.name,
    }
    access_token = create_access_token(data=token_payload)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="User logout and server-side token revocation",
    description=(
        "Revokes the current access token so it cannot be used again before natural expiry. "
        "The client application must also discard the token locally."
    ),
)
def logout(
    auth_data: Tuple[User, str, datetime] = Depends(get_current_user_and_token),
    db: Session = Depends(get_db),
) -> MessageResponse:
    user, token, expires_at = auth_data
    revoke_token(db=db, token=token, expires_at=expires_at)

    return MessageResponse(
        message="Successfully logged out. The access token has been revoked on the server and must be discarded by the client."
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Returns the profile details of the currently authenticated user. Requires Bearer token.",
)
def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    return UserResponse.model_validate(current_user)
