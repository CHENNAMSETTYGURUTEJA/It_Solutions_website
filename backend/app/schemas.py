from datetime import datetime
from typing import List, Optional
import re
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator, ConfigDict


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name of the user", examples=["John Doe"])
    email: EmailStr = Field(..., description="Valid unique email address", examples=["johndoe@example.com"])
    password: str = Field(..., min_length=6, max_length=128, description="Password (minimum 6 characters)", examples=["SecurePass123!"])
    role: Optional[str] = Field("user", description="Account role: 'user' or 'admin'", examples=["user"])

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty or blank")
        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: Optional[str]) -> str:
        if value:
            value = value.lower().strip()
            if value not in ("user", "admin"):
                raise ValueError("Role must be either 'user' or 'admin'")
            return value
        return "user"


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address", examples=["johndoe@example.com"])
    password: str = Field(..., min_length=1, description="Account password", examples=["SecurePass123!"])


class UserResponse(BaseModel):
    id: int = Field(..., description="Unique user identifier", examples=[1])
    name: str = Field(..., description="User full name", examples=["John Doe"])
    email: EmailStr = Field(..., description="User email address", examples=["johndoe@example.com"])
    role: str = Field(..., description="User account role", examples=["user"])
    created_at: datetime = Field(..., description="Timestamp when account was created")

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="Signed JWT Bearer access token")
    token_type: str = Field("bearer", description="Token type")
    user: UserResponse = Field(..., description="Authenticated user profile")


class MessageResponse(BaseModel):
    message: str = Field(..., description="Informational message", examples=["Action completed successfully."])


class ContactInfoResponse(BaseModel):
    company_name: str = Field(..., examples=["STACKLY"])
    phone_number: str = Field(..., examples=["+91 7010792745"])
    company_address: str = Field(
        ...,
        examples=["MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008"],
    )
    linkedin: str = Field(..., examples=["https://www.linkedin.com/company/the-stackly/"])
    instagram: str = Field(..., examples=["https://www.instagram.com/thestackly"])
    twitter: Optional[str] = Field("https://x.com/The_Stackly", examples=["https://x.com/The_Stackly"])
    company_website: str = Field(..., examples=["https://thestackly.com/index.html"])


class SubscribeRequest(BaseModel):
    email: EmailStr = Field(..., description="Email address for subscription", examples=["visitor@example.com"])


class SubscribeResponse(BaseModel):
    message: str = Field(..., examples=["Thank you for subscribing to STACKLY IT updates!"])
    email: EmailStr


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name of customer", examples=["Jane Smith"])
    email: EmailStr = Field(..., description="Valid work/contact email", examples=["janesmith@business.com"])
    phone: Optional[str] = Field(None, description="Contact phone number", examples=["+91 9876543210"])
    subject: Optional[str] = Field("General Enquiry", max_length=150, description="Enquiry topic / service", examples=["Managed IT"])
    company: Optional[str] = Field(None, max_length=100, description="Company name", examples=["Acme Corp"])
    message: Optional[str] = Field(None, description="Detailed inquiry message", examples=["We need 24/7 cloud and helpdesk support."])
    requirements: Optional[str] = Field(None, description="Alternative field name matching frontend textarea", examples=["We need 24/7 cloud and helpdesk support."])

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty or whitespace only")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None or not value.strip():
            return None
        cleaned = value.strip()
        if not re.match(r"^[+]?[\d\s\-()]{7,25}$", cleaned):
            raise ValueError("Phone number must contain between 7 and 25 valid digits and formatting characters")
        return cleaned

    @model_validator(mode="after")
    def resolve_and_validate_message(self) -> "EnquiryCreate":
        resolved = (self.message or self.requirements or "").strip()
        if not resolved:
            raise ValueError("Enquiry message cannot be empty")
        self.message = resolved

        if self.company and self.company.strip():
            if not self.subject or self.subject.strip() == "General Enquiry":
                self.subject = f"Enquiry from {self.company.strip()}"
            elif self.company.strip() not in self.subject:
                self.subject = f"{self.subject.strip()} ({self.company.strip()})"
        elif not self.subject or not self.subject.strip():
            self.subject = "General Enquiry"

        return self


class EnquiryResponse(BaseModel):
    id: int = Field(..., description="Auto-generated unique enquiry ID", examples=[1])
    name: str = Field(..., description="Customer name", examples=["Jane Smith"])
    email: EmailStr = Field(..., description="Customer email", examples=["janesmith@business.com"])
    phone: Optional[str] = Field(None, description="Customer phone", examples=["+91 9876543210"])
    subject: str = Field(..., description="Enquiry subject / service", examples=["Managed IT"])
    message: str = Field(..., description="Customer inquiry message", examples=["We need 24/7 support."])
    created_at: datetime = Field(..., description="Submission date and time")

    model_config = ConfigDict(from_attributes=True)


class EnquiryCreateResponse(BaseModel):
    message: str = Field(..., description="Success message", examples=["Enquiry submitted successfully."])
    enquiry_id: int = Field(..., description="Generated enquiry database ID", examples=[1])
    reference_number: str = Field(..., description="Formatted tracking reference", examples=["NX-2026-0001"])
    enquiry: EnquiryResponse = Field(..., description="Stored enquiry details")


class EnquiryListResponse(BaseModel):
    total: int = Field(..., description="Total number of enquiries", examples=[42])
    skip: int = Field(..., description="Pagination offset", examples=[0])
    limit: int = Field(..., description="Pagination limit", examples=[20])
    items: List[EnquiryResponse] = Field(..., description="List of enquiries")
