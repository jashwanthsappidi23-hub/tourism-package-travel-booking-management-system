from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ---------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=8)
    role: Optional[str] = "Customer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    user_id: int
    email: str
    role: str
    is_active: bool
    full_name: Optional[str] = None
    phone: Optional[str] = None
    customer_id: Optional[int] = None
    guide_id: Optional[int] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# ---------------------------------------------------------
# Customer Schemas
# ---------------------------------------------------------
class CustomerUpdate(BaseModel):
    full_name: str
    phone: str
    city: Optional[str] = None
    state: Optional[str] = None
    emergency_contact: Optional[str] = None

# ---------------------------------------------------------
# Country & Category Schemas
# ---------------------------------------------------------
class CountryOut(BaseModel):
    country_id: int
    country_name: str
    continent: str

    class Config:
        from_attributes = True

class PackageCategoryOut(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Destination Schemas
# ---------------------------------------------------------
class DestinationBase(BaseModel):
    name: str
    state: str
    country: str = "India"
    continent: Optional[str] = None
    country_id: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_popular: bool = False
    best_time_to_visit: Optional[str] = None

class DestinationCreate(DestinationBase):
    pass

class DestinationOut(DestinationBase):
    destination_id: int

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Itinerary Schemas
# ---------------------------------------------------------
class ItineraryDayBase(BaseModel):
    day_number: int
    title: str
    activities: str
    meals_included: Optional[str] = "Breakfast"
    hotel_id: Optional[int] = None
    transport_id: Optional[int] = None
    notes: Optional[str] = None

class ItineraryDayCreate(ItineraryDayBase):
    package_id: int

class ItineraryDayOut(ItineraryDayBase):
    itinerary_id: int
    package_id: int
    hotel_name: Optional[str] = None
    vehicle_type: Optional[str] = None

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Package Schemas
# ---------------------------------------------------------
class PackageBase(BaseModel):
    title: str
    slug: str
    category: str
    duration_days: int
    duration_nights: int
    base_price: float
    featured_image: Optional[str] = None
    description: str
    inclusions: Optional[str] = None
    exclusions: Optional[str] = None
    cancellation_policy: Optional[str] = None
    is_active: bool = True
    is_domestic: bool = True
    hotel_star_rating: int = 4
    flights_included: bool = False
    departure_city: Optional[str] = "New Delhi (DEL)"
    activities_count: int = 5
    discount_percentage: int = 15

class PackageCreate(PackageBase):
    destination_ids: List[int] = []

class PackageOut(PackageBase):
    package_id: int
    destinations: List[DestinationOut] = []
    itinerary_days: List[ItineraryDayOut] = []

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Departure Schemas
# ---------------------------------------------------------
class DepartureBase(BaseModel):
    package_id: int
    start_date: str
    end_date: str
    total_capacity: int
    price_override: Optional[float] = None
    guide_id: Optional[int] = None
    transport_id: Optional[int] = None
    status: str = "Published"

class DepartureCreate(DepartureBase):
    pass

class DepartureOut(DepartureBase):
    departure_id: int
    confirmed_seats: int
    available_seats: int
    package_title: Optional[str] = None
    package_image: Optional[str] = None
    guide_name: Optional[str] = None
    vehicle_type: Optional[str] = None

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Traveller & Booking Schemas
# ---------------------------------------------------------
class TravellerInput(BaseModel):
    full_name: str
    age: int
    gender: str
    id_proof_type: Optional[str] = "Aadhaar"
    id_proof_number: Optional[str] = None
    phone: Optional[str] = None

class BookingCreate(BaseModel):
    departure_id: int
    travellers: List[TravellerInput]
    special_requests: Optional[str] = None

class BookingOut(BaseModel):
    booking_id: int
    booking_reference: str
    customer_id: int
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    departure_id: int
    package_id: Optional[int] = None
    package_title: Optional[str] = None
    package_image: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    booking_date: datetime
    traveller_count: int
    total_amount: float
    discount_amount: float
    tax_amount: float
    net_amount: float
    booking_status: str
    special_requests: Optional[str] = None
    travellers: List[TravellerInput] = []
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Payment Simulation Schemas
# ---------------------------------------------------------
class PaymentSimulate(BaseModel):
    booking_id: int
    payment_method: str = "UPI"  # 'UPI', 'Card', 'NetBanking', 'DemoPay'
    simulated_outcome: str = "SUCCESS"  # 'SUCCESS' or 'FAILED'

class PaymentOut(BaseModel):
    payment_id: int
    booking_id: int
    payment_reference: str
    payment_method: str
    amount: float
    payment_status: str
    transaction_date: datetime
    gateway_response: Optional[str] = None

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# Cancellation & Refund Schemas
# ---------------------------------------------------------
class CancellationRequest(BaseModel):
    booking_id: int
    reason: str

class CancellationOut(BaseModel):
    cancellation_id: int
    booking_id: int
    booking_reference: str
    cancellation_date: datetime
    reason: str
    cancellation_fee: float
    refundable_amount: float
    status: str

    class Config:
        from_attributes = True

class RefundProcess(BaseModel):
    cancellation_id: int
    action: str = "APPROVE"  # 'APPROVE' or 'REJECT'
    notes: Optional[str] = None

# ---------------------------------------------------------
# Guide Schemas
# ---------------------------------------------------------
class GuideOut(BaseModel):
    guide_id: int
    user_id: int
    full_name: str
    phone: str
    email: str
    languages: str
    experience_years: int
    bio: Optional[str] = None
    is_available: bool

    class Config:
        from_attributes = True
