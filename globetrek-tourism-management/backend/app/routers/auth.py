from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, Customer
from backend.app.schemas import UserRegister, UserLogin, UserOut, Token, PasswordReset
from backend.app.auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, enrich_user_out
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    # Hash password & create user
    hashed = get_password_hash(req.password)
    new_user = User(
        email=req.email.lower(),
        password_hash=hashed,
        role=req.role or "Customer",
        is_active=True
    )
    db.add(new_user)
    db.flush()

    # Create associated Customer profile
    customer = Customer(
        user_id=new_user.user_id,
        full_name=req.full_name,
        phone=req.phone
    )
    db.add(customer)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    user_out = enrich_user_out(new_user, db)
    return Token(access_token=access_token, token_type="bearer", user=user_out)

@router.post("/login", response_model=Token)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials"
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Your account has been deactivated")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    user_out = enrich_user_out(user, db)
    return Token(access_token=access_token, token_type="bearer", user=user_out)

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return enrich_user_out(user, db)

@router.post("/demo-login/{role}", response_model=Token)
def quick_demo_login(role: str, db: Session = Depends(get_db)):
    """Convenient 1-click login for demonstration to teachers/examiners."""
    role_map = {
        "admin": "admin@bharatyatra.com",
        "guide": "rajesh.guide@bharatyatra.com",
        "customer": "arjun.sharma@gmail.com"
    }
    target_email = role_map.get(role.lower())
    if not target_email:
        raise HTTPException(status_code=400, detail="Invalid demo role requested")

    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found in database")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    user_out = enrich_user_out(user, db)
    return Token(access_token=access_token, token_type="bearer", user=user_out)

@router.post("/reset-password")
def reset_password(req: PasswordReset, db: Session = Depends(get_db)):
    """Reset user password and persist new hash to SQLite database."""
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user account found with this email address"
        )
    user.password_hash = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password updated and stored successfully in the database"}

