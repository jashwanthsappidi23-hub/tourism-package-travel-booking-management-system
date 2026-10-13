from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Hotel, Transport, Customer, User, Country, PackageCategory
from backend.app.schemas import CustomerUpdate, CountryOut, PackageCategoryOut
from backend.app.auth import require_roles, get_current_user

router = APIRouter(prefix="/resources", tags=["Hotels, Transport & Customers"])

# ----------------- Hotels -----------------
@router.get("/hotels")
def list_hotels(db: Session = Depends(get_db)):
    hotels = db.query(Hotel).all()
    return [{
        "hotel_id": h.hotel_id,
        "destination_name": h.destination.name if h.destination else None,
        "name": h.name,
        "star_rating": h.star_rating,
        "address": h.address,
        "contact_phone": h.contact_phone,
        "amenities": h.amenities
    } for h in hotels]

@router.post("/hotels", status_code=status.HTTP_201_CREATED)
def create_hotel(
    data: dict,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    hotel = Hotel(
        destination_id=data["destination_id"],
        name=data["name"],
        star_rating=data.get("star_rating", 3),
        address=data.get("address"),
        contact_phone=data.get("contact_phone"),
        amenities=data.get("amenities")
    )
    db.add(hotel)
    db.commit()
    db.refresh(hotel)
    return {"message": "Hotel partner registered successfully", "hotel_id": hotel.hotel_id}

# ----------------- Transport -----------------
@router.get("/transport")
def list_transport(db: Session = Depends(get_db)):
    trans = db.query(Transport).all()
    return [{
        "transport_id": t.transport_id,
        "vehicle_type": t.vehicle_type,
        "capacity": t.capacity,
        "registration_number": t.registration_number,
        "operator_name": t.operator_name,
        "contact_phone": t.contact_phone
    } for t in trans]

@router.post("/transport", status_code=status.HTTP_201_CREATED)
def create_transport(
    data: dict,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    t = Transport(
        vehicle_type=data["vehicle_type"],
        capacity=data["capacity"],
        registration_number=data["registration_number"],
        operator_name=data["operator_name"],
        contact_phone=data.get("contact_phone")
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return {"message": "Transport fleet registered successfully", "transport_id": t.transport_id}

# ----------------- Customers -----------------
@router.get("/customers")
def list_customers(
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    custs = db.query(Customer).all()
    return [{
        "customer_id": c.customer_id,
        "email": c.user.email if c.user else None,
        "full_name": c.full_name,
        "phone": c.phone,
        "city": c.city,
        "state": c.state,
        "total_bookings": len(c.bookings)
    } for c in custs]

@router.put("/customer/profile")
def update_customer_profile(
    data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
    if not cust:
        cust = Customer(user_id=current_user.user_id, full_name=data.full_name, phone=data.phone)
        db.add(cust)

    for field, val in data.model_dump().items():
        setattr(cust, field, val)

    db.commit()
    return {"message": "Profile updated successfully"}

# ----------------- Countries & Categories -----------------
@router.get("/countries", response_model=List[CountryOut])
def list_countries(db: Session = Depends(get_db)):
    return db.query(Country).order_by(Country.country_name.asc()).all()

@router.get("/categories", response_model=List[PackageCategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(PackageCategory).order_by(PackageCategory.name.asc()).all()
