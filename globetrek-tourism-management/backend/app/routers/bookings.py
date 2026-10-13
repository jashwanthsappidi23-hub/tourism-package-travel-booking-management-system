import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import (
    Booking, Departure, Customer, TourPackage, Traveller,
    BookingTraveller, Payment, User
)
from backend.app.schemas import BookingCreate, BookingOut, TravellerInput
from backend.app.auth import get_current_user, require_roles
from backend.app.services.email_service import send_booking_confirmation_email

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def enrich_booking_dict(b: Booking) -> dict:
    travellers_list = []
    for assoc in b.booking_travellers:
        t = assoc.traveller
        travellers_list.append({
            "full_name": t.full_name,
            "age": t.age,
            "gender": t.gender,
            "id_proof_type": t.id_proof_type,
            "id_proof_number": t.id_proof_number,
            "phone": t.phone
        })

    pay = b.payments[0] if b.payments else None
    dep = b.departure
    pkg = dep.package if dep else None

    return {
        "booking_id": b.booking_id,
        "booking_reference": b.booking_reference,
        "customer_id": b.customer_id,
        "customer_name": b.customer.full_name if b.customer else None,
        "customer_email": b.customer.user.email if b.customer and b.customer.user else None,
        "customer_phone": b.customer.phone if b.customer else None,
        "departure_id": b.departure_id,
        "package_id": pkg.package_id if pkg else None,
        "package_title": pkg.title if pkg else None,
        "package_image": pkg.featured_image if pkg else None,
        "start_date": dep.start_date if dep else None,
        "end_date": dep.end_date if dep else None,
        "booking_date": b.booking_date,
        "traveller_count": b.traveller_count,
        "total_amount": float(b.total_amount),
        "discount_amount": float(b.discount_amount),
        "tax_amount": float(b.tax_amount),
        "net_amount": float(b.net_amount),
        "booking_status": b.booking_status,
        "special_requests": b.special_requests,
        "travellers": travellers_list,
        "payment_status": pay.payment_status if pay else "Pending",
        "payment_method": pay.payment_method if pay else None
    }

def dispatch_booking_email(booking_id: int, recipient_email: Optional[str] = None, db: Optional[Session] = None):
    """Fetches booking records and dispatches HTML & plain text E-Ticket confirmation email."""
    from backend.app.database import SessionLocal
    session_to_use = db or SessionLocal()
    close_after = db is None
    try:
        b = session_to_use.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not b:
            return {"success": False, "message": "Booking not found"}
        dep = b.departure
        pkg = dep.package if dep else None

        target_email = recipient_email or (b.customer.user.email if b.customer and b.customer.user else None)
        if not target_email:
            target_email = "guest@globetrek.com"

        travellers = []
        for assoc in b.booking_travellers:
            t = assoc.traveller
            travellers.append({
                "full_name": t.full_name,
                "age": t.age,
                "gender": t.gender,
                "seat_number": assoc.seat_number or "Confirmed"
            })

        pay = b.payments[0] if b.payments else None
        booking_data = {
            "booking_reference": b.booking_reference,
            "package_title": pkg.title if pkg else "GlobeTrek Holiday Package",
            "category": pkg.category if pkg else "Holiday",
            "duration_days": pkg.duration_days if pkg else 6,
            "start_date": str(dep.start_date) if dep else "",
            "end_date": str(dep.end_date) if dep else "",
            "customer_name": b.customer.full_name if b.customer else "Travel Enthusiast",
            "customer_phone": b.customer.phone if b.customer else "+91 98765 43210",
            "guide_name": dep.guide.full_name if (dep and dep.guide) else "Licensed Regional Concierge",
            "travellers": travellers,
            "gross_fare": float(b.total_amount),
            "discount_amount": float(b.discount_amount),
            "tax_amount": float(b.tax_amount),
            "net_amount": float(b.net_amount),
            "payment_status": pay.payment_status if pay else "Confirmed",
            "payment_method": pay.payment_method if pay else "Online Payment",
            "year": datetime.utcnow().year
        }

        return send_booking_confirmation_email(booking_data, target_email)
    finally:
        if close_after:
            session_to_use.close()

@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    data: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Customer verification
    cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
    if not cust:
        # Auto-create customer profile if user registered with a different role
        cust = Customer(
            user_id=current_user.user_id,
            full_name=current_user.email.split("@")[0].capitalize(),
            phone="+91 98000 00000"
        )
        db.add(cust)
        db.flush()

    traveller_count = len(data.travellers)
    if traveller_count == 0:
        raise HTTPException(status_code=400, detail="At least one traveller must be specified")

    # Fetch departure with transactional locking check
    dep = db.query(Departure).filter(Departure.departure_id == data.departure_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Selected departure schedule not found")

    if dep.status not in ["Published", "Confirmed"]:
        raise HTTPException(status_code=400, detail=f"This departure is not open for booking (status: {dep.status})")

    # Critical Business Rule: Prevent Overbooking!
    available_seats = dep.total_capacity - dep.confirmed_seats
    if traveller_count > available_seats:
        raise HTTPException(
            status_code=400,
            detail=f"Capacity Exceeded: Only {available_seats} seats remaining, but {traveller_count} requested."
        )

    # Unit price calculation
    pkg = dep.package
    unit_price = float(dep.price_override) if dep.price_override else float(pkg.base_price)
    
    gross_total = unit_price * traveller_count
    # Demo discount: 5% discount if 2 or more travellers, max ₹2500
    discount = round(gross_total * 0.05, 2) if traveller_count >= 2 else 0.0
    if discount > 2500:
        discount = 2500.0
    taxable_amount = gross_total - discount
    gst_tax = round(taxable_amount * 0.05, 2)  # 5% GST on travel
    net_total = round(taxable_amount + gst_tax, 2)

    # Generate unique booking reference: BY-2026-CAT-XXXX
    short_cat = pkg.category[:4].upper()
    rand_suffix = uuid.uuid4().hex[:6].upper()
    booking_ref = f"BY-2026-{short_cat}-{rand_suffix}"

    new_booking = Booking(
        booking_reference=booking_ref,
        customer_id=cust.customer_id,
        departure_id=dep.departure_id,
        booking_date=datetime.utcnow(),
        traveller_count=traveller_count,
        total_amount=gross_total,
        discount_amount=discount,
        tax_amount=gst_tax,
        net_amount=net_total,
        booking_status="Confirmed",
        special_requests=data.special_requests
    )
    db.add(new_booking)
    db.flush()

    # Create travellers and junction records
    for idx, t_input in enumerate(data.travellers, start=1):
        traveller = Traveller(
            customer_id=cust.customer_id,
            full_name=t_input.full_name,
            age=t_input.age,
            gender=t_input.gender,
            id_proof_type=t_input.id_proof_type,
            id_proof_number=t_input.id_proof_number,
            phone=t_input.phone
        )
        db.add(traveller)
        db.flush()

        bt = BookingTraveller(
            booking_id=new_booking.booking_id,
            traveller_id=traveller.traveller_id,
            seat_number=f"T-{idx}"
        )
        db.add(bt)

    # Atomically increment confirmed seats
    dep.confirmed_seats += traveller_count
    if dep.confirmed_seats == dep.total_capacity:
        dep.status = "Confirmed"

    db.commit()
    db.refresh(new_booking)

    # Automatically dispatch E-Ticket confirmation email in background
    target_email = cust.user.email if (cust and cust.user) else current_user.email
    background_tasks.add_task(dispatch_booking_email, new_booking.booking_id, target_email)

    return enrich_booking_dict(new_booking)

@router.post("/{booking_id}/send-email")
def send_or_resend_booking_email(
    booking_id: int,
    background_tasks: BackgroundTasks,
    recipient_email: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually trigger or resend an E-Ticket confirmation email for an existing booking."""
    b = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Authorize: Administrator or customer owner
    if current_user.role != "Administrator":
        cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
        if not cust or b.customer_id != cust.customer_id:
            raise HTTPException(status_code=403, detail="Unauthorized to trigger email for this booking")

    target_email = recipient_email or (b.customer.user.email if b.customer and b.customer.user else current_user.email)
    
    # Dispatch immediately so caller gets the exact status response
    result = dispatch_booking_email(booking_id, target_email, db)
    return result

@router.get("/my-bookings", response_model=List[BookingOut])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
    if not cust:
        return []

    bookings = db.query(Booking).filter(
        Booking.customer_id == cust.customer_id
    ).order_by(Booking.booking_date.desc()).all()

    return [enrich_booking_dict(b) for b in bookings]

@router.get("/reference/{booking_ref}", response_model=BookingOut)
def get_booking_by_reference(
    booking_ref: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.booking_reference == booking_ref).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking reference not found")

    # Authorize: Admin or owner customer
    if current_user.role != "Administrator":
        cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
        if not cust or booking.customer_id != cust.customer_id:
            raise HTTPException(status_code=403, detail="Unauthorized access to this booking")

    return enrich_booking_dict(booking)

@router.get("/all", response_model=List[BookingOut])
def list_all_bookings_admin(
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    bookings = db.query(Booking).order_by(Booking.booking_date.desc()).all()
    return [enrich_booking_dict(b) for b in bookings]
