from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Departure, TourPackage, Guide, Transport, GuideAssignment
from backend.app.schemas import DepartureOut, DepartureCreate
from backend.app.auth import require_roles

router = APIRouter(prefix="/departures", tags=["Departures"])

def enrich_departure(d: Departure) -> dict:
    avail = max(0, d.total_capacity - d.confirmed_seats)
    return {
        "departure_id": d.departure_id,
        "package_id": d.package_id,
        "start_date": d.start_date,
        "end_date": d.end_date,
        "total_capacity": d.total_capacity,
        "confirmed_seats": d.confirmed_seats,
        "available_seats": avail,
        "price_override": float(d.price_override) if d.price_override else float(d.package.base_price),
        "guide_id": d.guide_id,
        "transport_id": d.transport_id,
        "status": d.status,
        "package_title": d.package.title if d.package else None,
        "package_image": d.package.featured_image if d.package else None,
        "guide_name": d.guide.full_name if d.guide else None,
        "vehicle_type": d.transport.vehicle_type if d.transport else None
    }

@router.get("", response_model=List[DepartureOut])
def list_departures(
    package_id: Optional[int] = None,
    only_available: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Departure)
    if package_id:
        query = query.filter(Departure.package_id == package_id)
    if only_available:
        query = query.filter(
            Departure.status.in_(["Published", "Confirmed"]),
            Departure.confirmed_seats < Departure.total_capacity
        )

    departures = query.order_by(Departure.start_date.asc()).all()
    return [enrich_departure(d) for d in departures]

@router.get("/{departure_id}", response_model=DepartureOut)
def get_departure(departure_id: int, db: Session = Depends(get_db)):
    dep = db.query(Departure).filter(Departure.departure_id == departure_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Tour departure not found")
    return enrich_departure(dep)

@router.post("", response_model=DepartureOut, status_code=status.HTTP_201_CREATED)
def schedule_departure(
    data: DepartureCreate,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    pkg = db.query(TourPackage).filter(TourPackage.package_id == data.package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")

    # Business Rule: start_date <= end_date
    if data.start_date > data.end_date:
        raise HTTPException(status_code=400, detail="Departure end date must be on or after the start date")

    # Critical Business Rule: Prevent Overlapping Guide Assignment!
    if data.guide_id:
        overlapping = db.query(Departure).filter(
            Departure.guide_id == data.guide_id,
            Departure.status != "Cancelled",
            Departure.start_date <= data.end_date,
            Departure.end_date >= data.start_date
        ).first()
        if overlapping:
            guide = db.query(Guide).filter(Guide.guide_id == data.guide_id).first()
            g_name = guide.full_name if guide else "Guide"
            raise HTTPException(
                status_code=400,
                detail=f"Scheduling Conflict: {g_name} is already assigned to departure #{overlapping.departure_id} ({overlapping.start_date} to {overlapping.end_date}) which overlaps with this date range."
            )

    new_dep = Departure(
        package_id=data.package_id,
        start_date=data.start_date,
        end_date=data.end_date,
        total_capacity=data.total_capacity,
        confirmed_seats=0,
        price_override=data.price_override,
        guide_id=data.guide_id,
        transport_id=data.transport_id,
        status=data.status
    )
    db.add(new_dep)
    db.flush()

    if data.guide_id:
        assignment = GuideAssignment(guide_id=data.guide_id, departure_id=new_dep.departure_id, status="Assigned")
        db.add(assignment)

    db.commit()
    db.refresh(new_dep)
    return enrich_departure(new_dep)

@router.put("/{departure_id}/status")
def update_departure_status(
    departure_id: int,
    status_value: str = Query(..., regex="^(Draft|Published|Confirmed|Completed|Cancelled)$"),
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    dep = db.query(Departure).filter(Departure.departure_id == departure_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Departure not found")
    dep.status = status_value
    db.commit()
    return {"message": f"Departure #{departure_id} status updated to {status_value}"}
