from fastapi import APIRouter, status
from app.schemas import ContactInfoResponse

router = APIRouter()

COMPANY_CONTACT_INFO = {
    "company_name": "STACKLY",
    "phone_number": "+91 7010792745",
    "company_address": "MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008",
    "linkedin": "https://www.linkedin.com/company/the-stackly/",
    "instagram": "https://www.instagram.com/thestackly",
    "twitter": "https://x.com/The_Stackly",
    "company_website": "https://thestackly.com/index.html",
}


@router.get(
    "",
    response_model=ContactInfoResponse,
    status_code=status.HTTP_200_OK,
    summary="Get company contact details",
    description="Returns the official STACKLY company contact information.",
)
def get_contact_info() -> ContactInfoResponse:
    return ContactInfoResponse(**COMPANY_CONTACT_INFO)
