from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Destination
from backend.app.schemas import DestinationOut, DestinationCreate
from backend.app.auth import require_roles

router = APIRouter(prefix="/destinations", tags=["Destinations"])

@router.get("", response_model=List[DestinationOut])
def list_destinations(
    popular_only: bool = False,
    continent: Optional[str] = None,
    country: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Destination)
    if popular_only:
        query = query.filter(Destination.is_popular == True)
    if continent:
        query = query.filter(Destination.continent.ilike(f"%{continent}%"))
    if country:
        query = query.filter(Destination.country.ilike(f"%{country}%"))
    if search:
        query = query.filter(
            Destination.name.ilike(f"%{search}%") | 
            Destination.state.ilike(f"%{search}%") |
            Destination.country.ilike(f"%{search}%") |
            Destination.continent.ilike(f"%{search}%")
        )
    return query.order_by(Destination.name.asc()).all()

@router.get("/{destination_id}", response_model=DestinationOut)
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.destination_id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

@router.post("", response_model=DestinationOut, status_code=status.HTTP_201_CREATED)
def create_destination(
    data: DestinationCreate,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    existing = db.query(Destination).filter(Destination.name.ilike(data.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="A destination with this name already exists")

    new_dest = Destination(**data.model_dump())
    db.add(new_dest)
    db.commit()
    db.refresh(new_dest)
    return new_dest

@router.put("/{destination_id}", response_model=DestinationOut)
def update_destination(
    destination_id: int,
    data: DestinationCreate,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    dest = db.query(Destination).filter(Destination.destination_id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")

    for field, val in data.model_dump().items():
        setattr(dest, field, val)
    db.commit()
    db.refresh(dest)
    return dest

@router.delete("/{destination_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_destination(
    destination_id: int,
    db: Session = Depends(get_db),
    _user = Depends(require_roles(["Administrator"]))
):
    dest = db.query(Destination).filter(Destination.destination_id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    db.delete(dest)
    db.commit()
    return None
