from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Enquiry, User
from app.schemas import (
    EnquiryCreate,
    EnquiryResponse,
    EnquiryCreateResponse,
    EnquiryListResponse,
)
from app.dependencies import require_admin

router = APIRouter()


@router.post(
    "",
    response_model=EnquiryCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a customer enquiry",
    description="Submits and stores a customer enquiry in the database. Open to public visitors.",
)
def create_enquiry(
    enquiry_in: EnquiryCreate,
    db: Session = Depends(get_db),
) -> EnquiryCreateResponse:
    new_enquiry = Enquiry(
        name=enquiry_in.name,
        email=enquiry_in.email,
        phone=enquiry_in.phone,
        subject=enquiry_in.subject or "General Enquiry",
        message=enquiry_in.message,
    )
    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    ref_num = f"NX-2026-{new_enquiry.id:04d}"

    return EnquiryCreateResponse(
        message="Thank you for getting in touch. Your enquiry has been received successfully.",
        enquiry_id=new_enquiry.id,
        reference_number=ref_num,
        enquiry=EnquiryResponse.model_validate(new_enquiry),
    )


@router.get(
    "/{enquiry_id}",
    response_model=EnquiryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get enquiry by ID (Admin only)",
    description="Retrieves details of a specific enquiry. Restricted to authorized administrators.",
)
def get_enquiry_by_id(
    enquiry_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> EnquiryResponse:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry with ID {enquiry_id} was not found.",
        )
    return EnquiryResponse.model_validate(enquiry)


@router.get(
    "",
    response_model=EnquiryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all enquiries (Admin only)",
    description="Returns a paginated list of all customer enquiries. Restricted to authorized administrators.",
)
def list_enquiries(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max number of records to return"),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> EnquiryListResponse:
    total = db.query(Enquiry).count()
    items = (
        db.query(Enquiry)
        .order_by(Enquiry.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return EnquiryListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[EnquiryResponse.model_validate(item) for item in items],
    )
