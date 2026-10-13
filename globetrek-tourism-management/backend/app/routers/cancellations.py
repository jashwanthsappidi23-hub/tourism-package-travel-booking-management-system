from datetime import datetime, date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Booking, Cancellation, Refund, Payment, Departure, Customer, User
from backend.app.schemas import CancellationRequest, CancellationOut
from backend.app.auth import get_current_user, require_roles

router = APIRouter(prefix="/cancellations", tags=["Cancellations"])

@router.post("", response_model=CancellationOut, status_code=status.HTTP_201_CREATED)
def request_cancellation(
    data: CancellationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.booking_id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.booking_status == "Cancelled":
        raise HTTPException(status_code=400, detail="This booking has already been cancelled")

    # Authorize: Owner or Admin
    if current_user.role != "Administrator":
        cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
        if not cust or booking.customer_id != cust.customer_id:
            raise HTTPException(status_code=403, detail="Unauthorized access to this booking")

    # Calculate cancellation charges based on days to departure
    dep = booking.departure
    try:
        dep_date = datetime.strptime(dep.start_date, "%Y-%m-%d").date()
    except Exception:
        dep_date = date.today()

    days_to_departure = (dep_date - date.today()).days
    paid_amount = float(booking.net_amount)

    if days_to_departure >= 15:
        fee_percent = 0.10  # 10% cancellation charge
    elif 7 <= days_to_departure < 15:
        fee_percent = 0.50  # 50% cancellation charge
    else:
        fee_percent = 0.85  # Late cancellation: 85% penalty, 15% refund

    cancellation_fee = round(paid_amount * fee_percent, 2)
    refundable_amount = round(paid_amount - cancellation_fee, 2)

    # Record cancellation
    new_cancellation = Cancellation(
        booking_id=booking.booking_id,
        cancellation_date=datetime.utcnow(),
        reason=data.reason,
        cancellation_fee=cancellation_fee,
        refundable_amount=refundable_amount,
        status="Approved"
    )
    db.add(new_cancellation)
    db.flush()

    # Update booking status
    booking.booking_status = "Cancelled"

    # Restore departure capacity
    if dep.confirmed_seats >= booking.traveller_count:
        dep.confirmed_seats -= booking.traveller_count
    if dep.status == "Confirmed" and dep.confirmed_seats < dep.total_capacity:
        dep.status = "Published"

    # Automatically create refund entry linked to successful payment if refundable
    pay = db.query(Payment).filter(
        Payment.booking_id == booking.booking_id,
        Payment.payment_status == "Successful"
    ).first()

    if pay and refundable_amount > 0:
        pay.payment_status = "Refunded"
        refund = Refund(
            cancellation_id=new_cancellation.cancellation_id,
            payment_id=pay.payment_id,
            refund_amount=refundable_amount,
            refund_date=datetime.utcnow(),
            refund_method="Original Source (UPI/Card)",
            refund_status="Processed",
            notes=f"Auto-processed refund. {int(fee_percent * 100)}% cancellation fee applied ({days_to_departure} days prior)."
        )
        db.add(refund)

    db.commit()
    db.refresh(new_cancellation)

    return CancellationOut(
        cancellation_id=new_cancellation.cancellation_id,
        booking_id=new_cancellation.booking_id,
        booking_reference=booking.booking_reference,
        cancellation_date=new_cancellation.cancellation_date,
        reason=new_cancellation.reason,
        cancellation_fee=float(new_cancellation.cancellation_fee),
        refundable_amount=float(new_cancellation.refundable_amount),
        status=new_cancellation.status
    )

@router.get("/all")
def list_cancellations(
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    cancels = db.query(Cancellation).order_by(Cancellation.cancellation_date.desc()).all()
    results = []
    for c in cancels:
        results.append({
            "cancellation_id": c.cancellation_id,
            "booking_reference": c.booking.booking_reference if c.booking else None,
            "customer_name": c.booking.customer.full_name if c.booking and c.booking.customer else None,
            "cancellation_date": c.cancellation_date,
            "cancellation_fee": float(c.cancellation_fee),
            "refundable_amount": float(c.refundable_amount),
            "reason": c.reason,
            "status": c.status
        })
    return results
