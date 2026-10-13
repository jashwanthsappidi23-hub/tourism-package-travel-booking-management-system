from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric, DateTime, Date,
    ForeignKey, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

# 0a. Countries (Global Geographic Reference per 3NF Specification)
class Country(Base):
    __tablename__ = "Countries"

    country_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    country_name = Column(String(100), unique=True, nullable=False, index=True)
    continent = Column(String(100), nullable=False)

    destinations = relationship("Destination", back_populates="country_rel")

# 0b. PackageCategories (Tourism Package Thematic Categories)
class PackageCategory(Base):
    __tablename__ = "PackageCategories"

    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)

# 1. Users
class User(Base):
    __tablename__ = "Users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False, default="Customer")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    guide = relationship("Guide", back_populates="user", uselist=False, cascade="all, delete-orphan")

# 2. Customers
class Customer(Base):
    __tablename__ = "Customers"

    customer_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("Users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False)
    city = Column(String(80), nullable=True)
    state = Column(String(80), nullable=True)
    emergency_contact = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="customer")
    bookings = relationship("Booking", back_populates="customer")
    travellers = relationship("Traveller", back_populates="customer")

# 3. Destinations
class Destination(Base):
    __tablename__ = "Destinations"

    destination_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    country_id = Column(Integer, ForeignKey("Countries.country_id", ondelete="SET NULL"), nullable=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    state = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False, default="India")
    continent = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_popular = Column(Boolean, nullable=False, default=False)
    best_time_to_visit = Column(String(100), nullable=True)

    country_rel = relationship("Country", back_populates="destinations")
    package_associations = relationship("PackageDestination", back_populates="destination", cascade="all, delete-orphan")
    hotels = relationship("Hotel", back_populates="destination", cascade="all, delete-orphan")

# 4. TourPackages
class TourPackage(Base):
    __tablename__ = "TourPackages"

    package_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, nullable=False)
    category = Column(String(50), nullable=False)
    duration_days = Column(Integer, nullable=False)
    duration_nights = Column(Integer, nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)
    featured_image = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    inclusions = Column(Text, nullable=True)
    exclusions = Column(Text, nullable=True)
    cancellation_policy = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_domestic = Column(Boolean, nullable=False, default=True)
    hotel_star_rating = Column(Integer, nullable=False, default=4)
    flights_included = Column(Boolean, nullable=False, default=False)
    departure_city = Column(String(100), nullable=True, default="New Delhi (DEL)")
    activities_count = Column(Integer, nullable=False, default=5)
    discount_percentage = Column(Integer, nullable=False, default=15)
    created_at = Column(DateTime, default=datetime.utcnow)

    destination_associations = relationship("PackageDestination", back_populates="package", cascade="all, delete-orphan")
    itinerary_days = relationship("ItineraryDay", back_populates="package", cascade="all, delete-orphan", order_by="ItineraryDay.day_number")
    departures = relationship("Departure", back_populates="package", cascade="all, delete-orphan")
    hotel_associations = relationship("PackageHotel", back_populates="package", cascade="all, delete-orphan")

# 5. PackageDestinations
class PackageDestination(Base):
    __tablename__ = "PackageDestinations"

    package_id = Column(Integer, ForeignKey("TourPackages.package_id", ondelete="CASCADE"), primary_key=True)
    destination_id = Column(Integer, ForeignKey("Destinations.destination_id", ondelete="CASCADE"), primary_key=True)
    sequence_order = Column(Integer, nullable=False, default=1)

    package = relationship("TourPackage", back_populates="destination_associations")
    destination = relationship("Destination", back_populates="package_associations")

# 6. Hotels
class Hotel(Base):
    __tablename__ = "Hotels"

    hotel_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    destination_id = Column(Integer, ForeignKey("Destinations.destination_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    star_rating = Column(Integer, nullable=False, default=3)
    address = Column(Text, nullable=True)
    contact_phone = Column(String(20), nullable=True)
    amenities = Column(String(300), nullable=True)

    destination = relationship("Destination", back_populates="hotels")
    itinerary_days = relationship("ItineraryDay", back_populates="hotel")
    package_associations = relationship("PackageHotel", back_populates="hotel", cascade="all, delete-orphan")

# 7. Transport
class Transport(Base):
    __tablename__ = "Transport"

    transport_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    vehicle_type = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    registration_number = Column(String(30), unique=True, nullable=False)
    operator_name = Column(String(120), nullable=False)
    contact_phone = Column(String(20), nullable=True)

    departures = relationship("Departure", back_populates="transport")
    itinerary_days = relationship("ItineraryDay", back_populates="transport")

# 8. Guides
class Guide(Base):
    __tablename__ = "Guides"

    guide_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("Users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(150), nullable=False)
    languages = Column(String(200), nullable=False)
    experience_years = Column(Integer, nullable=False, default=1)
    bio = Column(Text, nullable=True)
    is_available = Column(Boolean, nullable=False, default=True)

    user = relationship("User", back_populates="guide")
    departures = relationship("Departure", back_populates="guide")
    assignments = relationship("GuideAssignment", back_populates="guide", cascade="all, delete-orphan")

# 9. Departures
class Departure(Base):
    __tablename__ = "Departures"

    departure_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    package_id = Column(Integer, ForeignKey("TourPackages.package_id", ondelete="CASCADE"), nullable=False)
    start_date = Column(String(20), nullable=False)  # ISO Date YYYY-MM-DD
    end_date = Column(String(20), nullable=False)
    total_capacity = Column(Integer, nullable=False)
    confirmed_seats = Column(Integer, nullable=False, default=0)
    price_override = Column(Numeric(10, 2), nullable=True)
    guide_id = Column(Integer, ForeignKey("Guides.guide_id", ondelete="SET NULL"), nullable=True)
    transport_id = Column(Integer, ForeignKey("Transport.transport_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), nullable=False, default="Published")
    created_at = Column(DateTime, default=datetime.utcnow)

    package = relationship("TourPackage", back_populates="departures")
    guide = relationship("Guide", back_populates="departures")
    transport = relationship("Transport", back_populates="departures")
    bookings = relationship("Booking", back_populates="departure")
    assignments = relationship("GuideAssignment", back_populates="departure", cascade="all, delete-orphan")

# 10. ItineraryDays
class ItineraryDay(Base):
    __tablename__ = "ItineraryDays"

    itinerary_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    package_id = Column(Integer, ForeignKey("TourPackages.package_id", ondelete="CASCADE"), nullable=False)
    day_number = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    activities = Column(Text, nullable=False)
    meals_included = Column(String(100), nullable=True, default="Breakfast")
    hotel_id = Column(Integer, ForeignKey("Hotels.hotel_id", ondelete="SET NULL"), nullable=True)
    transport_id = Column(Integer, ForeignKey("Transport.transport_id", ondelete="SET NULL"), nullable=True)
    notes = Column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("package_id", "day_number", name="uq_pkg_day"),
    )

    package = relationship("TourPackage", back_populates="itinerary_days")
    hotel = relationship("Hotel", back_populates="itinerary_days")
    transport = relationship("Transport", back_populates="itinerary_days")

# 11. PackageHotels
class PackageHotel(Base):
    __tablename__ = "PackageHotels"

    package_id = Column(Integer, ForeignKey("TourPackages.package_id", ondelete="CASCADE"), primary_key=True)
    hotel_id = Column(Integer, ForeignKey("Hotels.hotel_id", ondelete="CASCADE"), primary_key=True)
    room_type = Column(String(80), nullable=True, default="Deluxe Double Room")

    package = relationship("TourPackage", back_populates="hotel_associations")
    hotel = relationship("Hotel", back_populates="package_associations")

# 12. GuideAssignments
class GuideAssignment(Base):
    __tablename__ = "GuideAssignments"

    assignment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    guide_id = Column(Integer, ForeignKey("Guides.guide_id", ondelete="CASCADE"), nullable=False)
    departure_id = Column(Integer, ForeignKey("Departures.departure_id", ondelete="CASCADE"), nullable=False)
    assigned_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30), default="Assigned")

    __table_args__ = (
        UniqueConstraint("guide_id", "departure_id", name="uq_guide_dep"),
    )

    guide = relationship("Guide", back_populates="assignments")
    departure = relationship("Departure", back_populates="assignments")

# 13. Bookings
class Booking(Base):
    __tablename__ = "Bookings"

    booking_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_reference = Column(String(40), unique=True, nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("Customers.customer_id", ondelete="RESTRICT"), nullable=False)
    departure_id = Column(Integer, ForeignKey("Departures.departure_id", ondelete="RESTRICT"), nullable=False)
    booking_date = Column(DateTime, default=datetime.utcnow)
    traveller_count = Column(Integer, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    tax_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    net_amount = Column(Numeric(10, 2), nullable=False)
    booking_status = Column(String(30), nullable=False, default="Confirmed")
    special_requests = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="bookings")
    departure = relationship("Departure", back_populates="bookings")
    booking_travellers = relationship("BookingTraveller", back_populates="booking", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
    cancellation = relationship("Cancellation", back_populates="booking", uselist=False, cascade="all, delete-orphan")

# 14. Travellers
class Traveller(Base):
    __tablename__ = "Travellers"

    traveller_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("Customers.customer_id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(120), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    id_proof_type = Column(String(30), default="Aadhaar")
    id_proof_number = Column(String(50), nullable=True)
    phone = Column(String(20), nullable=True)

    customer = relationship("Customer", back_populates="travellers")
    booking_associations = relationship("BookingTraveller", back_populates="traveller", cascade="all, delete-orphan")

# 15. BookingTravellers
class BookingTraveller(Base):
    __tablename__ = "BookingTravellers"

    booking_id = Column(Integer, ForeignKey("Bookings.booking_id", ondelete="CASCADE"), primary_key=True)
    traveller_id = Column(Integer, ForeignKey("Travellers.traveller_id", ondelete="CASCADE"), primary_key=True)
    seat_number = Column(String(10), nullable=True)

    booking = relationship("Booking", back_populates="booking_travellers")
    traveller = relationship("Traveller", back_populates="booking_associations")

# 16. Payments
class Payment(Base):
    __tablename__ = "Payments"

    payment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("Bookings.booking_id", ondelete="CASCADE"), nullable=False)
    payment_reference = Column(String(50), unique=True, nullable=False, index=True)
    payment_method = Column(String(30), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_status = Column(String(30), nullable=False, default="Successful")
    transaction_date = Column(DateTime, default=datetime.utcnow)
    gateway_response = Column(Text, nullable=True)

    booking = relationship("Booking", back_populates="payments")
    refunds = relationship("Refund", back_populates="payment", cascade="all, delete-orphan")

# 17. Cancellations
class Cancellation(Base):
    __tablename__ = "Cancellations"

    cancellation_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("Bookings.booking_id", ondelete="CASCADE"), unique=True, nullable=False)
    cancellation_date = Column(DateTime, default=datetime.utcnow)
    reason = Column(Text, nullable=False)
    cancellation_fee = Column(Numeric(10, 2), nullable=False, default=0.00)
    refundable_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(30), nullable=False, default="Approved")

    booking = relationship("Booking", back_populates="cancellation")
    refunds = relationship("Refund", back_populates="cancellation", cascade="all, delete-orphan")

# 18. Refunds
class Refund(Base):
    __tablename__ = "Refunds"

    refund_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cancellation_id = Column(Integer, ForeignKey("Cancellations.cancellation_id", ondelete="CASCADE"), nullable=False)
    payment_id = Column(Integer, ForeignKey("Payments.payment_id", ondelete="CASCADE"), nullable=False)
    refund_amount = Column(Numeric(10, 2), nullable=False)
    refund_date = Column(DateTime, default=datetime.utcnow)
    refund_method = Column(String(50), default="Original Source (UPI/Card)")
    refund_status = Column(String(30), nullable=False, default="Processed")
    notes = Column(Text, nullable=True)

    cancellation = relationship("Cancellation", back_populates="refunds")
    payment = relationship("Payment", back_populates="refunds")

# 19. Reviews
class Review(Base):
    __tablename__ = "Reviews"

    review_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    package_id = Column(Integer, ForeignKey("TourPackages.package_id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("Customers.customer_id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False, default=5)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    package = relationship("TourPackage", backref="reviews")
    customer = relationship("Customer", backref="reviews")

# 20. Favourites
class Favourite(Base):
    __tablename__ = "Favourites"

    favourite_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("Customers.customer_id", ondelete="CASCADE"), nullable=False)
    package_id = Column(Integer, ForeignKey("TourPackages.package_id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    package = relationship("TourPackage", backref="favourites")
    customer = relationship("Customer", backref="favourites")

