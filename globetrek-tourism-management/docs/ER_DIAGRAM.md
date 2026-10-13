# Entity-Relationship (ER) Diagram & Schema Mapping
**Project Title:** BharatYatra — Tourism Package and Travel Booking Management System  
**Course:** Database Management Systems (PBL Project 63)

---

## 1. Visual Mermaid ER Diagram

```mermaid
erDiagram
    USERS ||--|| CUSTOMERS : "creates profile"
    USERS ||--o| GUIDES : "guide role link"
    
    COUNTRIES ||--o{ DESTINATIONS : "contains"
    DESTINATIONS ||--o{ PACKAGE_DESTINATIONS : "covered in"
    TOUR_PACKAGES ||--|{ PACKAGE_DESTINATIONS : "includes"
    
    TOUR_PACKAGES ||--|{ ITINERARY_DAYS : "schedules"
    TOUR_PACKAGES ||--o{ PACKAGE_HOTELS : "contracts"
    HOTELS ||--o{ PACKAGE_HOTELS : "partnered with"
    
    DESTINATIONS ||--o{ HOTELS : "located in"
    
    TOUR_PACKAGES ||--o{ DEPARTURES : "departs on"
    TRANSPORT ||--o{ DEPARTURES : "transports"
    GUIDES ||--o{ DEPARTURES : "leads"
    
    GUIDES ||--o{ GUIDE_ASSIGNMENTS : "assigned to"
    DEPARTURES ||--o{ GUIDE_ASSIGNMENTS : "staffs"
    
    CUSTOMERS ||--o{ BOOKINGS : "places"
    DEPARTURES ||--o{ BOOKINGS : "reserves on"
    
    CUSTOMERS ||--o{ TRAVELLERS : "registers"
    BOOKINGS ||--|{ BOOKING_TRAVELLERS : "includes"
    TRAVELLERS ||--o{ BOOKING_TRAVELLERS : "listed on"
    
    BOOKINGS ||--|{ PAYMENTS : "paid via"
    BOOKINGS ||--o| CANCELLATIONS : "cancelled by"
    CANCELLATIONS ||--o| REFUNDS : "triggers"
    PAYMENTS ||--o| REFUNDS : "refunded from"

    COUNTRIES {
        int country_id PK
        string country_name UK
        string continent
    }

    PACKAGE_CATEGORIES {
        int category_id PK
        string category_name UK
        string description
    }

    USERS {
        int user_id PK
        string email UK
        string password_hash
        string role
        boolean is_active
        timestamp created_at
    }

    CUSTOMERS {
        int customer_id PK
        int user_id FK
        string full_name
        string phone
        string city
        string state
    }

    DESTINATIONS {
        int destination_id PK
        int country_id FK
        string name UK
        string state
        string country
        string continent
        string description
        string image_url
        boolean is_popular
    }

    TOUR_PACKAGES {
        int package_id PK
        string title
        string slug UK
        string category
        int duration_days
        int duration_nights
        decimal base_price
        boolean is_active
    }

    PACKAGE_DESTINATIONS {
        int package_id PK,FK
        int destination_id PK,FK
        int sequence_order
    }

    ITINERARY_DAYS {
        int itinerary_id PK
        int package_id FK
        int day_number
        string title
        text activities
        string meals_included
        int hotel_id FK
        int transport_id FK
    }

    HOTELS {
        int hotel_id PK
        int destination_id FK
        string name
        int star_rating
        string contact_phone
    }

    TRANSPORT {
        int transport_id PK
        string vehicle_type
        int capacity
        string registration_number UK
        string operator_name
    }

    GUIDES {
        int guide_id PK
        int user_id FK
        string full_name
        string phone
        string languages
        int experience_years
        boolean is_available
    }

    DEPARTURES {
        int departure_id PK
        int package_id FK
        date start_date
        date end_date
        int total_capacity
        int confirmed_seats
        decimal price_override
        int guide_id FK
        int transport_id FK
        string status
    }

    BOOKINGS {
        int booking_id PK
        string booking_reference UK
        int customer_id FK
        int departure_id FK
        timestamp booking_date
        int traveller_count
        decimal net_amount
        string booking_status
    }

    TRAVELLERS {
        int traveller_id PK
        int customer_id FK
        string full_name
        int age
        string gender
        string id_proof_number
    }

    BOOKING_TRAVELLERS {
        int booking_id PK,FK
        int traveller_id PK,FK
        string seat_number
    }

    PAYMENTS {
        int payment_id PK
        int booking_id FK
        string payment_reference UK
        string payment_method
        decimal amount
        string payment_status
        timestamp transaction_date
    }

    CANCELLATIONS {
        int cancellation_id PK
        int booking_id FK,UK
        timestamp cancellation_date
        text reason
        decimal cancellation_fee
        decimal refundable_amount
        string status
    }

    REFUNDS {
        int refund_id PK
        int cancellation_id FK
        int payment_id FK
        decimal refund_amount
        string refund_status
        timestamp refund_date
    }
```

---

## 2. Cardinality and Structural Constraints

1. **`Users` to `Customers` (1:1)**:
   - Each registered customer has exactly one system user account.
2. **`Users` to `Guides` (1:1)**:
   - Tour guides are staff members linked to a user authentication record with `role = 'Guide'`.
3. **`TourPackages` to `Destinations` (M:N)**:
   - Implemented via associative entity `PackageDestinations` with composite PK `(package_id, destination_id)` and a `sequence_order` attribute.
4. **`TourPackages` to `ItineraryDays` (1:N)**:
   - A package contains $N$ ordered days ($N \ge 1$), enforced by `UNIQUE(package_id, day_number)`.
5. **`TourPackages` to `Departures` (1:N)**:
   - A single tour package can be scheduled across multiple departure dates throughout the season.
6. **`Departures` to `Bookings` (1:N)**:
   - Multiple customers can book tickets on a single departure until `confirmed_seats = total_capacity`.
7. **`Bookings` to `Travellers` (M:N)**:
   - Captured through junction table `BookingTravellers`, allowing individual passenger seat assignments.
8. **`Bookings` to `Payments` (1:N)**:
   - Usually 1 payment per booking; supports multiple partial attempts or transaction retries.
9. **`Bookings` to `Cancellations` (1:0..1)**:
   - A booking can have at most one cancellation record (`booking_id` has UNIQUE constraint).
10. **`Cancellations` to `Refunds` (1:0..1)**:
    - Approved cancellations link directly to their corresponding payment and refund disbursement.
