from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Refund, Cancellation, Customer, User
from backend.app.schemas import RefundProcess
from backend.app.auth import require_roles, get_current_user

router = APIRouter(prefix="/refunds", tags=["Refunds"])

@router.get("/status/{booking_ref}")
def get_refund_status_by_booking(
    booking_ref: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    refund = db.query(Refund).join(Cancellation).join(Cancellation.booking).filter(
        Cancellation.booking.has(booking_reference=booking_ref)
    ).first()

    if not refund:
        raise HTTPException(status_code=404, detail="No refund record found for this booking reference")

    c = refund.cancellation
    b = c.booking
    return {
        "refund_id": refund.refund_id,
        "booking_reference": b.booking_reference,
        "refund_amount": float(refund.refund_amount),
        "cancellation_fee": float(c.cancellation_fee),
        "total_paid": float(b.net_amount),
        "refund_date": refund.refund_date,
        "refund_status": refund.refund_status,
        "refund_method": refund.refund_method,
        "notes": refund.notes
    }

@router.get("/all")
def list_refunds(
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    refunds = db.query(Refund).order_by(Refund.refund_date.desc()).all()
    results = []
    for r in refunds:
        c = r.cancellation
        b = c.booking if c else None
        cust = b.customer if b else None
        results.append({
            "refund_id": r.refund_id,
            "cancellation_id": r.cancellation_id,
            "booking_reference": b.booking_reference if b else None,
            "customer_name": cust.full_name if cust else None,
            "refund_amount": float(r.refund_amount),
            "refund_status": r.refund_status,
            "refund_method": r.refund_method,
            "refund_date": r.refund_date,
            "notes": r.notes
        })
    return results

@router.put("/process")
def process_refund(
    data: RefundProcess,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    refund = db.query(Refund).filter(Refund.cancellation_id == data.cancellation_id).first()
    if not refund:
        raise HTTPException(status_code=404, detail="Refund record not found")

    if data.action == "APPROVE":
        refund.refund_status = "Processed"
    else:
        refund.refund_status = "Rejected"

    if data.notes:
        refund.notes = data.notes

    db.commit()
    return {"message": f"Refund status updated to {refund.refund_status}"}
