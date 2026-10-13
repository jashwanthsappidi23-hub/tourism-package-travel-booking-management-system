import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Booking, Payment, Customer, User
from backend.app.schemas import PaymentSimulate, PaymentOut
from backend.app.auth import get_current_user, require_roles

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/simulate", response_model=PaymentOut)
def simulate_payment(
    data: PaymentSimulate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.booking_id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Authorize: Owner or Admin
    if current_user.role != "Administrator":
        cust = db.query(Customer).filter(Customer.user_id == current_user.user_id).first()
        if not cust or booking.customer_id != cust.customer_id:
            raise HTTPException(status_code=403, detail="Unauthorized access to this booking")

    is_success = data.simulated_outcome.upper() == "SUCCESS"
    pay_status = "Successful" if is_success else "Failed"

    # Payment reference
    prefix = data.payment_method.upper()[:4]
    rand_ref = uuid.uuid4().hex[:8].upper()
    pay_ref = f"PAY-{prefix}-{rand_ref}"

    gateway_data = {
        "gateway": "BharatYatraDemoPG",
        "timestamp": datetime.utcnow().isoformat(),
        "method": data.payment_method,
        "amount": float(booking.net_amount),
        "status": pay_status,
        "is_simulated": True
    }

    new_payment = Payment(
        booking_id=booking.booking_id,
        payment_reference=pay_ref,
        payment_method=data.payment_method,
        amount=booking.net_amount,
        payment_status=pay_status,
        transaction_date=datetime.utcnow(),
        gateway_response=json.dumps(gateway_data)
    )
    db.add(new_payment)

    if is_success:
        booking.booking_status = "Confirmed"
        from backend.app.routers.bookings import dispatch_booking_email
        target_email = booking.customer.user.email if (booking.customer and booking.customer.user) else current_user.email
        background_tasks.add_task(dispatch_booking_email, booking.booking_id, target_email)
    else:
        booking.booking_status = "Pending"

    db.commit()
    db.refresh(new_payment)

    return PaymentOut(
        payment_id=new_payment.payment_id,
        booking_id=new_payment.booking_id,
        payment_reference=new_payment.payment_reference,
        payment_method=new_payment.payment_method,
        amount=float(new_payment.amount),
        payment_status=new_payment.payment_status,
        transaction_date=new_payment.transaction_date,
        gateway_response=new_payment.gateway_response
    )

@router.get("/booking/{booking_id}", response_model=PaymentOut)
def get_payment_for_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).order_by(Payment.payment_id.desc()).first()
    if not payment:
        raise HTTPException(status_code=404, detail="No payment record found for this booking")
    return PaymentOut(
        payment_id=payment.payment_id,
        booking_id=payment.booking_id,
        payment_reference=payment.payment_reference,
        payment_method=payment.payment_method,
        amount=float(payment.amount),
        payment_status=payment.payment_status,
        transaction_date=payment.transaction_date,
        gateway_response=payment.gateway_response
    )

@router.get("/all")
def list_all_payments(
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    """Retrieve full payment audit history for administrators."""
    payments = db.query(Payment).order_by(Payment.transaction_date.desc()).all()
    results = []
    for p in payments:
        b = p.booking
        cust = b.customer if b else None
        results.append({
            "payment_id": p.payment_id,
            "payment_reference": p.payment_reference,
            "booking_id": p.booking_id,
            "booking_reference": b.booking_reference if b else None,
            "customer_name": cust.full_name if cust else "Walk-in Guest",
            "customer_email": cust.user.email if (cust and cust.user) else None,
            "amount": float(p.amount),
            "payment_method": p.payment_method,
            "payment_status": p.payment_status,
            "transaction_date": p.transaction_date.strftime("%Y-%m-%d %H:%M") if p.transaction_date else None
        })
    return results

