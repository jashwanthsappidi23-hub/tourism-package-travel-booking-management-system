from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import ItineraryDay, TourPackage
from backend.app.schemas import ItineraryDayCreate, ItineraryDayOut
from backend.app.auth import require_roles

router = APIRouter(prefix="/itineraries", tags=["Itineraries"])

@router.get("/package/{package_id}", response_model=List[ItineraryDayOut])
def get_package_itinerary(package_id: int, db: Session = Depends(get_db)):
    days = db.query(ItineraryDay).filter(
        ItineraryDay.package_id == package_id
    ).order_by(ItineraryDay.day_number.asc()).all()

    result = []
    for d in days:
        result.append({
            "itinerary_id": d.itinerary_id,
            "package_id": d.package_id,
            "day_number": d.day_number,
            "title": d.title,
            "activities": d.activities,
            "meals_included": d.meals_included,
            "hotel_id": d.hotel_id,
            "hotel_name": d.hotel.name if d.hotel else None,
            "transport_id": d.transport_id,
            "vehicle_type": d.transport.vehicle_type if d.transport else None,
            "notes": d.notes
        })
    return result

@router.post("", response_model=ItineraryDayOut, status_code=status.HTTP_201_CREATED)
def add_itinerary_day(
    data: ItineraryDayCreate,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    pkg = db.query(TourPackage).filter(TourPackage.package_id == data.package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")

    # Enforce unique day_number within package
    existing_day = db.query(ItineraryDay).filter(
        ItineraryDay.package_id == data.package_id,
        ItineraryDay.day_number == data.day_number
    ).first()
    if existing_day:
        raise HTTPException(
            status_code=400,
            detail=f"Day {data.day_number} already exists for this tour package. Use a different day number or update existing."
        )

    new_day = ItineraryDay(**data.model_dump())
    db.add(new_day)
    db.commit()
    db.refresh(new_day)

    return {
        "itinerary_id": new_day.itinerary_id,
        "package_id": new_day.package_id,
        "day_number": new_day.day_number,
        "title": new_day.title,
        "activities": new_day.activities,
        "meals_included": new_day.meals_included,
        "hotel_id": new_day.hotel_id,
        "hotel_name": new_day.hotel.name if new_day.hotel else None,
        "transport_id": new_day.transport_id,
        "vehicle_type": new_day.transport.vehicle_type if new_day.transport else None,
        "notes": new_day.notes
    }

@router.delete("/{itinerary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_itinerary_day(
    itinerary_id: int,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    day = db.query(ItineraryDay).filter(ItineraryDay.itinerary_id == itinerary_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
    db.delete(day)
    db.commit()
    return None
