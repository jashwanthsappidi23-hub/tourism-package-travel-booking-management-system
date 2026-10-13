from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db
from backend.app.models import Guide, Departure, User
from backend.app.schemas import GuideOut
from backend.app.auth import require_roles, get_current_user

router = APIRouter(prefix="/guides", tags=["Guides"])

@router.get("", response_model=List[GuideOut])
def list_guides(db: Session = Depends(get_db)):
    guides = db.query(Guide).all()
    return guides

@router.get("/my-schedule")
def get_guide_my_schedule(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Guide":
        # Allow admin or fallback to guide 1 for demonstration if not logged as guide
        guide = db.query(Guide).first()
    else:
        guide = db.query(Guide).filter(Guide.user_id == current_user.user_id).first()

    if not guide:
        raise HTTPException(status_code=404, detail="Guide profile not found")

    departures = db.query(Departure).filter(
        Departure.guide_id == guide.guide_id
    ).order_by(Departure.start_date.asc()).all()

    assigned_tours = []
    for d in departures:
        pkg = d.package
        # Collect traveller manifest for each booking
        manifest = []
        for b in d.bookings:
            if b.booking_status != "Cancelled":
                for assoc in b.booking_travellers:
                    t = assoc.traveller
                    manifest.append({
                        "booking_reference": b.booking_reference,
                        "seat_number": assoc.seat_number,
                        "full_name": t.full_name,
                        "age": t.age,
                        "gender": t.gender,
                        "phone": t.phone or b.customer.phone
                    })

        # Itinerary
        itinerary = []
        if pkg:
            for day in pkg.itinerary_days:
                itinerary.append({
                    "day_number": day.day_number,
                    "title": day.title,
                    "activities": day.activities,
                    "meals": day.meals_included,
                    "hotel": day.hotel.name if day.hotel else "Local Stay"
                })

        assigned_tours.append({
            "departure_id": d.departure_id,
            "package_title": pkg.title if pkg else "N/A",
            "package_image": pkg.featured_image if pkg else None,
            "start_date": d.start_date,
            "end_date": d.end_date,
            "confirmed_travellers_count": len(manifest),
            "status": d.status,
            "vehicle_type": d.transport.vehicle_type if d.transport else "AC Coach",
            "vehicle_plate": d.transport.registration_number if d.transport else "N/A",
            "manifest": manifest,
            "itinerary": itinerary
        })

    return {
        "guide_id": guide.guide_id,
        "full_name": guide.full_name,
        "phone": guide.phone,
        "languages": guide.languages,
        "experience_years": guide.experience_years,
        "bio": guide.bio,
        "assigned_tours": assigned_tours
    }

@router.get("/conflicts")
def check_guide_conflicts(
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    """Executes DBMS Query 6 to find any overlapping guide schedules."""
    sql_query = text("""
        SELECT 
            g.guide_id,
            g.full_name AS guide_name,
            d1.departure_id AS departure_1,
            p1.title AS tour_1,
            d1.start_date AS tour1_start,
            d1.end_date AS tour1_end,
            d2.departure_id AS departure_2,
            p2.title AS tour_2,
            d2.start_date AS tour2_start,
            d2.end_date AS tour2_end
        FROM Departures d1
        JOIN Departures d2 ON d1.guide_id = d2.guide_id AND d1.departure_id < d2.departure_id
        JOIN Guides g ON d1.guide_id = g.guide_id
        JOIN TourPackages p1 ON d1.package_id = p1.package_id
        JOIN TourPackages p2 ON d2.package_id = p2.package_id
        WHERE d1.status NOT IN ('Cancelled') AND d2.status NOT IN ('Cancelled')
          AND d1.start_date <= d2.end_date
          AND d1.end_date >= d2.start_date
    """)
    rows = db.execute(sql_query).mappings().all()
    return {
        "conflicts_count": len(rows),
        "conflicts": [dict(r) for r in rows]
    }
