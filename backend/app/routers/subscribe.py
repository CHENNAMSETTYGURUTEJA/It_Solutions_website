from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Subscriber
from app.schemas import SubscribeRequest, SubscribeResponse

router = APIRouter()


@router.post(
    "",
    response_model=SubscribeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Subscribe email for newsletter/updates",
    description="Stores email subscription in database. Duplicates are handled cleanly.",
)
def subscribe_newsletter(
    sub_in: SubscribeRequest,
    db: Session = Depends(get_db),
) -> SubscribeResponse:
    existing = db.query(Subscriber).filter(Subscriber.email == sub_in.email).first()
    if existing:
        return SubscribeResponse(
            message="You are already subscribed to STACKLY IT updates!",
            email=sub_in.email,
        )

    new_sub = Subscriber(email=sub_in.email)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)

    return SubscribeResponse(
        message="Thank you for subscribing to STACKLY IT updates!",
        email=new_sub.email,
    )
