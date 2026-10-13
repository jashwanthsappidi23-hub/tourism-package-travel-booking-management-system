from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import TourPackage, Destination, PackageDestination, ItineraryDay, Departure, Hotel, Transport
from backend.app.schemas import PackageOut, PackageCreate
from backend.app.auth import require_roles

router = APIRouter(prefix="/packages", tags=["Tour Packages"])

def enrich_package_dict(pkg: TourPackage, db: Session) -> dict:
    destinations = [assoc.destination for assoc in pkg.destination_associations]
    
    itinerary_out = []
    for day in pkg.itinerary_days:
        hotel_name = day.hotel.name if day.hotel else None
        vehicle_type = day.transport.vehicle_type if day.transport else None
        itinerary_out.append({
            "itinerary_id": day.itinerary_id,
            "package_id": day.package_id,
            "day_number": day.day_number,
            "title": day.title,
            "activities": day.activities,
            "meals_included": day.meals_included,
            "hotel_id": day.hotel_id,
            "hotel_name": hotel_name,
            "transport_id": day.transport_id,
            "vehicle_type": vehicle_type,
            "notes": day.notes
        })

    return {
        "package_id": pkg.package_id,
        "title": pkg.title,
        "slug": pkg.slug,
        "category": pkg.category,
        "duration_days": pkg.duration_days,
        "duration_nights": pkg.duration_nights,
        "base_price": float(pkg.base_price),
        "featured_image": pkg.featured_image,
        "description": pkg.description,
        "inclusions": pkg.inclusions,
        "exclusions": pkg.exclusions,
        "cancellation_policy": pkg.cancellation_policy,
        "is_active": pkg.is_active,
        "is_domestic": getattr(pkg, "is_domestic", True) if getattr(pkg, "is_domestic", None) is not None else True,
        "hotel_star_rating": getattr(pkg, "hotel_star_rating", 4) or 4,
        "flights_included": getattr(pkg, "flights_included", False) or False,
        "departure_city": getattr(pkg, "departure_city", "New Delhi (DEL)") or "New Delhi (DEL)",
        "activities_count": getattr(pkg, "activities_count", 5) or 5,
        "discount_percentage": getattr(pkg, "discount_percentage", 15) or 15,
        "destinations": destinations,
        "itinerary_days": itinerary_out
    }

@router.get("", response_model=List[PackageOut])
def list_packages(
    search: Optional[str] = None,
    category: Optional[str] = None,
    destination_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    max_days: Optional[int] = None,
    is_domestic: Optional[bool] = None,
    hotel_star_rating: Optional[int] = None,
    flights_included: Optional[bool] = None,
    departure_city: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    query = db.query(TourPackage)
    if is_active is not None:
        query = query.filter(TourPackage.is_active == is_active)
    if category:
        query = query.filter(TourPackage.category == category)
    if min_price is not None:
        query = query.filter(TourPackage.base_price >= min_price)
    if max_price is not None:
        query = query.filter(TourPackage.base_price <= max_price)
    if max_days is not None:
        query = query.filter(TourPackage.duration_days <= max_days)
    if is_domestic is not None:
        query = query.filter(TourPackage.is_domestic == is_domestic)
    if hotel_star_rating is not None:
        query = query.filter(TourPackage.hotel_star_rating == hotel_star_rating)
    if flights_included is not None:
        query = query.filter(TourPackage.flights_included == flights_included)
    if departure_city:
        query = query.filter(TourPackage.departure_city.ilike(f"%{departure_city}%"))
    if destination_id is not None:
        query = query.join(PackageDestination).filter(PackageDestination.destination_id == destination_id)
    if search:
        query = query.filter(
            TourPackage.title.ilike(f"%{search}%") | 
            TourPackage.description.ilike(f"%{search}%")
        )

    packages = query.order_by(TourPackage.package_id.asc()).all()
    return [enrich_package_dict(pkg, db) for pkg in packages]

@router.get("/{package_id_or_slug}", response_model=PackageOut)
def get_package(package_id_or_slug: str, db: Session = Depends(get_db)):
    if package_id_or_slug.isdigit():
        pkg = db.query(TourPackage).filter(TourPackage.package_id == int(package_id_or_slug)).first()
    else:
        pkg = db.query(TourPackage).filter(TourPackage.slug == package_id_or_slug).first()

    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    return enrich_package_dict(pkg, db)

@router.post("", response_model=PackageOut, status_code=status.HTTP_201_CREATED)
def create_package(
    data: PackageCreate,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    existing = db.query(TourPackage).filter(TourPackage.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A package with this URL slug already exists")

    package_data = data.model_dump()
    destination_ids = package_data.pop("destination_ids", [])

    new_pkg = TourPackage(**package_data)
    db.add(new_pkg)
    db.flush()

    for idx, dest_id in enumerate(destination_ids, start=1):
        assoc = PackageDestination(package_id=new_pkg.package_id, destination_id=dest_id, sequence_order=idx)
        db.add(assoc)

    db.commit()
    db.refresh(new_pkg)
    return enrich_package_dict(new_pkg, db)

@router.put("/{package_id}", response_model=PackageOut)
def update_package(
    package_id: int,
    data: PackageCreate,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    pkg = db.query(TourPackage).filter(TourPackage.package_id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")

    package_data = data.model_dump()
    destination_ids = package_data.pop("destination_ids", [])

    for key, val in package_data.items():
        setattr(pkg, key, val)

    if destination_ids:
        db.query(PackageDestination).filter(PackageDestination.package_id == package_id).delete()
        for idx, dest_id in enumerate(destination_ids, start=1):
            db.add(PackageDestination(package_id=package_id, destination_id=dest_id, sequence_order=idx))

    db.commit()
    db.refresh(pkg)
    return enrich_package_dict(pkg, db)

@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_package(
    package_id: int,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    pkg = db.query(TourPackage).filter(TourPackage.package_id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found")
    db.delete(pkg)
    db.commit()
    return None
