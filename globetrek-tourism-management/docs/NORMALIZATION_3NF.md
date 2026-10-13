# Database Normalization Analysis (Up to Third Normal Form - 3NF)
**Project Title:** BharatYatra — Tourism Package and Travel Booking Management System  
**Course:** Database Management Systems (PBL Project 63)

---

## 1. Introduction to Normalization Goals

In relational database design, **Normalization** is the systematic approach of decomposing tables to eliminate data redundancy and prevent undesirable characteristics such as:
1. **Insertion Anomalies:** Inability to record certain facts without adding unrelated attributes.
2. **Update Anomalies:** Inconsistency caused when data stored redundantly in multiple rows is updated in one row but not others.
3. **Deletion Anomalies:** Accidental loss of critical facts when deleting an unrelated record.

The target design standard for this project is **Third Normal Form (3NF)**.

---

## 2. Universal Relation (Unnormalized Form - UNF)

In an unnormalized or spreadsheet-based system, a single wide record captures all tour reservation details:

$$\text{UniversalBooking}(\text{BookingRef}, \text{CustEmail}, \text{CustName}, \text{CustPhone}, \text{PkgTitle}, \text{PkgCategory}, \text{BasePrice}, \text{DestinationsCovered}[\dots], \text{ItineraryDays}[\dots], \text{DepartureDate}, \text{Capacity}, \text{GuideName}, \text{GuidePhone}, \text{TravellerNames}[\dots], \text{TravellerAges}[\dots], \text{Amount}, \text{PayMethod}, \text{PaymentStatus}, \text{CancellationFee})$$

### Anomalies in UNF:
- **Repeating Groups:** Multi-valued arrays for destinations, itinerary days, and travellers violate atomicity.
- **Redundancy:** Package price and guide details are duplicated for every traveller and booking.
- **Update Hazard:** Changing a guide's phone number requires updating thousands of booking records.

---

## 3. First Normal Form (1NF)

### Definition:
A relation is in **1NF** if and only if all attribute domains contain only **atomic (indivisible) values**, and each tuple contains exactly one value for each attribute (no repeating groups, multi-valued attributes, or composite fields).

### Transformations to Achieve 1NF:
1. Extracted multi-valued destinations into an associative entity `PackageDestinations(package_id, destination_id)`.
2. Extracted repeating day-wise itineraries into an entity `ItineraryDays(itinerary_id, package_id, day_number, ...)`.
3. Extracted multi-valued passenger lists into individual records `Travellers(traveller_id, ...)` and `BookingTravellers(booking_id, traveller_id)`.
4. Assigned explicit, single-attribute primary keys (`user_id`, `package_id`, `destination_id`, `booking_id`, `payment_id`, etc.).

---

## 4. Second Normal Form (2NF)

### Definition:
A relation is in **2NF** if:
1. It is already in **1NF**.
2. **No non-prime attribute is partially dependent on any candidate key.** (Every non-key attribute is fully functionally dependent on the primary key).

### Analysis of Composite Key Tables:

#### 1. `PackageDestinations` Table
- **Primary Key:** `(package_id, destination_id)`
- **Attributes:** `sequence_order`
- **Functional Dependency:** `(package_id, destination_id) -> sequence_order`
- *Evaluation:* `sequence_order` depends on both the package and the specific destination in that tour route. No partial dependency exists. Destination description and state are located in the separate `Destinations` table, preventing partial dependency.

#### 2. `PackageHotels` Table
- **Primary Key:** `(package_id, hotel_id)`
- **Attributes:** `room_type`
- **Functional Dependency:** `(package_id, hotel_id) -> room_type`
- *Evaluation:* Hotel name and star rating are stored in `Hotels(hotel_id)`. `PackageHotels` only stores the specific room tier offered for that tour package.

#### 3. `BookingTravellers` Table
- **Primary Key:** `(booking_id, traveller_id)`
- **Attributes:** `seat_number`
- **Functional Dependency:** `(booking_id, traveller_id) -> seat_number`
- *Evaluation:* Traveller name, age, and ID number belong exclusively to `Travellers(traveller_id)`. `seat_number` is assigned only in the context of both the booking and the specific traveller.

All tables with single-attribute primary keys trivially satisfy 2NF because partial dependency is mathematically impossible when the key has only one attribute.

---

## 5. Third Normal Form (3NF)

### Definition:
A relation is in **3NF** if:
1. It is in **2NF**.
2. **There are no transitive functional dependencies** between non-prime attributes ($X \to Y$ and $Y \to Z$ where $Z$ is non-prime and $Y$ is not a candidate key).

### Transitive Dependency Elimination in BharatYatra:

| Problematic Design in 2NF | Transitive Dependency Found | 3NF Decomposition Applied |
| :--- | :--- | :--- |
| Storing Customer Profile in `Users` | `user_id -> customer_phone`, `user_id -> city` | Decomposed into `Users(user_id, email, password_hash, role)` and `Customers(customer_id, user_id, full_name, phone, city)` |
| Storing Hotel Details in `ItineraryDays` | `itinerary_id -> hotel_id` and `hotel_id -> hotel_name, star_rating` | Retained only `hotel_id` as foreign key in `ItineraryDays`. Hotel properties isolated in `Hotels` table. |
| Storing Transport Capacity in `Departures` | `departure_id -> transport_id` and `transport_id -> vehicle_type, capacity, registration` | Kept only `transport_id` in `Departures`. Vehicle registration and capacity isolated in `Transport` table. |
| Storing Refund Info in `Bookings` | `booking_id -> cancellation_id` and `cancellation_id -> refund_amount, refund_status` | Isolated into `Cancellations` and `Refunds` tables, preserving transaction integrity. |

---

## 6. Mathematical Functional Dependency Matrix

1. **`Users`**:
   - $\text{user\_id} \to \{\text{email}, \text{password\_hash}, \text{role}, \text{is\_active}, \text{created\_at}\}$
   - $\text{email} \to \text{user\_id}$ (Candidate Key)
2. **`Customers`**:
   - $\text{customer\_id} \to \{\text{user\_id}, \text{full\_name}, \text{phone}, \text{city}, \text{state}, \text{emergency\_contact}\}$
   - $\text{user\_id} \to \text{customer\_id}$ (1-to-1 relationship with User)
3. **`TourPackages`**:
   - $\text{package\_id} \to \{\text{title}, \text{slug}, \text{category}, \text{duration\_days}, \text{duration\_nights}, \text{base\_price}, \text{description}\}$
   - $\text{slug} \to \text{package\_id}$ (Alternate Key)
4. **`Departures`**:
   - $\text{departure\_id} \to \{\text{package\_id}, \text{start\_date}, \text{end\_date}, \text{total\_capacity}, \text{confirmed\_seats}, \text{price\_override}, \text{guide\_id}, \text{transport\_id}, \text{status}\}$
5. **`ItineraryDays`**:
   - $\text{itinerary\_id} \to \{\text{package\_id}, \text{day\_number}, \text{title}, \text{activities}, \text{meals\_included}, \text{hotel\_id}, \text{transport\_id}\}$
   - $\{\text{package\_id}, \text{day\_number}\} \to \text{itinerary\_id}$ (Composite Alternate Key)
6. **`Bookings`**:
   - $\text{booking\_id} \to \{\text{booking\_reference}, \text{customer\_id}, \text{departure\_id}, \text{booking\_date}, \text{traveller\_count}, \text{net\_amount}, \text{booking\_status}\}$
   - $\text{booking\_reference} \to \text{booking\_id}$ (Alternate Key)
7. **`Payments`**:
   - $\text{payment\_id} \to \{\text{booking\_id}, \text{payment\_reference}, \text{payment\_method}, \text{amount}, \text{payment\_status}, \text{transaction\_date}\}$
   - $\text{payment\_reference} \to \text{payment\_id}$ (Alternate Key)
8. **`Cancellations`**:
   - $\text{cancellation\_id} \to \{\text{booking\_id}, \text{cancellation\_date}, \text{reason}, \text{cancellation\_fee}, \text{refundable\_amount}, \text{status}\}$
   - $\text{booking\_id} \to \text{cancellation\_id}$ (1-to-1 relationship)
9. **`Refunds`**:
   - $\text{refund\_id} \to \{\text{cancellation\_id}, \text{payment\_id}, \text{refund\_amount}, \text{refund\_date}, \text{refund\_method}, \text{refund\_status}\}$

### Conclusion:
Every determinant in the system is a **candidate key** or a valid **foreign key** linking normalized relations. The schema is strictly in **Third Normal Form (3NF)** and Boyce-Codd Normal Form (BCNF) compliant.
