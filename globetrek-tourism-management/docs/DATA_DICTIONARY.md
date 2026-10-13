# Data Dictionary — BharatYatra DBMS Project
**Course:** Database Management Systems (PBL Project 63)  
**Entities Covered:** 20 Normalized Tables + 5 SQL Views

---

### Table 1: `Users`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | INT / INTEGER | NO | PK | Auto Increment | Unique internal system user identifier |
| `email` | VARCHAR(150) | NO | UK | Unique, Valid Email | User login email address |
| `password_hash` | VARCHAR(255) | NO | None | PBKDF2/SHA256 salted hash | Securely hashed user password |
| `role` | ENUM / TEXT | NO | None | 'Customer', 'Administrator', 'Guide' | Role-based authorization tier |
| `is_active` | BOOLEAN / INT | NO | None | DEFAULT TRUE (1) | Account active status flag |
| `created_at` | TIMESTAMP | NO | None | CURRENT_TIMESTAMP | Account creation timestamp |

---

### Table 2: `Customers`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `customer_id` | INT / INTEGER | NO | PK | Auto Increment | Primary key for customer profile |
| `user_id` | INT / INTEGER | NO | FK, UK | REFERENCES Users(user_id) | 1-to-1 link to user authentication |
| `full_name` | VARCHAR(120) | NO | None | NOT NULL | Customer full legal name |
| `phone` | VARCHAR(20) | NO | None | NOT NULL | Primary mobile contact number |
| `city` | VARCHAR(80) | YES | None | None | Customer residential city |
| `state` | VARCHAR(80) | YES | None | None | Customer residential state |
| `emergency_contact`| VARCHAR(20) | YES | None | None | Emergency phone contact |

---

### Table 3: `Destinations`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `destination_id` | INT / INTEGER | NO | PK | Auto Increment | Unique destination identifier |
| `name` | VARCHAR(100) | NO | UK | Unique city/region name | Destination name (e.g., Paris, Tokyo, Goa) |
| `state` | VARCHAR(100) | NO | None | NOT NULL | State / Province / Territory / Department |
| `country` | VARCHAR(100) | NO | None | DEFAULT 'India' | Country name |
| `continent` | VARCHAR(50) | YES | None | None | Continent name (e.g., Europe, Asia, Americas) |
| `country_id` | INT / INTEGER | YES | FK | REFERENCES Countries(country_id) | Normalized foreign key link to Country table |
| `description` | TEXT | YES | None | None | Promotional & historical summary |
| `image_url` | VARCHAR(500) | YES | None | None | High-res travel photograph URL |
| `is_popular` | BOOLEAN / INT | NO | None | DEFAULT FALSE (0) | Featured on homepage carousel |
| `best_time_to_visit`| VARCHAR(100)| YES | None | None | Seasonal recommendation |

---

### Table 4: `TourPackages`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `package_id` | INT / INTEGER | NO | PK | Auto Increment | Unique tour package identifier |
| `title` | VARCHAR(200) | NO | None | NOT NULL | Marketing package name |
| `slug` | VARCHAR(220) | NO | UK | Unique slug | URL-friendly unique identifier |
| `category` | ENUM / TEXT | NO | None | Honeymoon, Heritage, Adventure, Beach... | Tour thematic category |
| `duration_days` | INT | NO | None | CHECK(duration_days > 0) | Total itinerary days |
| `duration_nights`| INT | NO | None | CHECK(duration_nights >= 0) | Total hotel nights |
| `base_price` | DECIMAL(10,2)| NO | None | CHECK(base_price >= 0) | Starting price per adult in INR |
| `featured_image` | VARCHAR(500) | YES | None | None | Banner hero image URL |
| `description` | TEXT | NO | None | NOT NULL | In-depth trip overview |
| `inclusions` | TEXT | YES | None | None | What is included in package |
| `exclusions` | TEXT | YES | None | None | What is excluded from package |
| `cancellation_policy`| TEXT | YES | None | None | Terms for refunds & cancellations |
| `is_active` | BOOLEAN / INT | NO | None | DEFAULT TRUE (1) | Package bookable status |

---

### Table 5: `PackageDestinations`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `package_id` | INT / INTEGER | NO | PK, FK | REFERENCES TourPackages | Package component |
| `destination_id` | INT / INTEGER | NO | PK, FK | REFERENCES Destinations | Destination visited |
| `sequence_order` | INT | NO | None | DEFAULT 1 | Stop order in the travel itinerary |

---

### Table 6: `Hotels`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `hotel_id` | INT / INTEGER | NO | PK | Auto Increment | Primary key for partner hotel |
| `destination_id` | INT / INTEGER | NO | FK | REFERENCES Destinations | Destination location |
| `name` | VARCHAR(150) | NO | None | NOT NULL | Hotel / Resort legal title |
| `star_rating` | INT | NO | None | CHECK(star_rating BETWEEN 1 AND 5) | Star rating classification (1-5) |
| `address` | TEXT | YES | None | None | Full property postal address |
| `contact_phone` | VARCHAR(20) | YES | None | None | Reception / reservation phone |
| `amenities` | VARCHAR(300) | YES | None | None | Wi-Fi, Pool, Spa, Lake View... |

---

### Table 7: `Transport`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `transport_id` | INT / INTEGER | NO | PK | Auto Increment | Unique vehicle fleet identifier |
| `vehicle_type` | ENUM / TEXT | NO | None | Sedan, SUV (Innova), Tempo, Coach, Houseboat | Vehicle classification |
| `capacity` | INT | NO | None | CHECK(capacity > 0) | Maximum passenger seat capacity |
| `registration_number`| VARCHAR(30)| NO | UK | Unique vehicle plate | Regional transport authority registration |
| `operator_name` | VARCHAR(120) | NO | None | NOT NULL | Logistics company / operator |
| `contact_phone` | VARCHAR(20) | YES | None | None | Fleet coordinator phone |

---

### Table 8: `Guides`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `guide_id` | INT / INTEGER | NO | PK | Auto Increment | Unique guide identifier |
| `user_id` | INT / INTEGER | NO | FK, UK | REFERENCES Users | Login user account reference |
| `full_name` | VARCHAR(120) | NO | None | NOT NULL | Guide legal name |
| `phone` | VARCHAR(20) | NO | None | NOT NULL | Guide primary telephone |
| `email` | VARCHAR(150) | NO | None | NOT NULL | Guide email address |
| `languages` | VARCHAR(200) | NO | None | NOT NULL | Fluency (e.g. English, Hindi, German) |
| `experience_years`| INT | NO | None | CHECK(experience_years >= 0) | Professional field experience |
| `is_available` | BOOLEAN / INT | NO | None | DEFAULT TRUE (1) | Current roster availability |

---

### Table 9: `Departures`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `departure_id` | INT / INTEGER | NO | PK | Auto Increment | Scheduled departure batch identifier |
| `package_id` | INT / INTEGER | NO | FK | REFERENCES TourPackages | Tour package scheduled |
| `start_date` | DATE / TEXT | NO | None | NOT NULL | Tour commencement date |
| `end_date` | DATE / TEXT | NO | None | CHECK(end_date >= start_date) | Tour termination date |
| `total_capacity` | INT | NO | None | CHECK(total_capacity > 0) | Passenger seat limit |
| `confirmed_seats`| INT | NO | None | CHECK(confirmed_seats <= total_capacity) | Current confirmed booked seats |
| `price_override` | DECIMAL(10,2)| YES | None | NULL or seasonal price | Optional seasonal departure price |
| `guide_id` | INT / INTEGER | YES | FK | REFERENCES Guides | Assigned lead tour guide |
| `transport_id` | INT / INTEGER | YES | FK | REFERENCES Transport | Assigned primary vehicle |
| `status` | ENUM / TEXT | NO | None | Draft, Published, Confirmed, Completed, Cancelled | Operational status of batch |

---

### Table 10: `ItineraryDays`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `itinerary_id` | INT / INTEGER | NO | PK | Auto Increment | Unique day itinerary entry |
| `package_id` | INT / INTEGER | NO | FK | REFERENCES TourPackages | Associated package |
| `day_number` | INT | NO | None | CHECK(day_number > 0), UNIQUE(pkg, day) | Day order (Day 1, Day 2...) |
| `title` | VARCHAR(150) | NO | None | NOT NULL | Theme title of the day |
| `activities` | TEXT | NO | None | NOT NULL | Sightseeing and activity schedule |
| `meals_included` | VARCHAR(100) | YES | None | DEFAULT 'Breakfast' | Meal plan included |
| `hotel_id` | INT / INTEGER | YES | FK | REFERENCES Hotels | Overnight accommodation partner |
| `transport_id` | INT / INTEGER | YES | FK | REFERENCES Transport | Day transit vehicle |

---

### Table 11: `PackageHotels`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `package_id` | INT / INTEGER | NO | PK, FK | REFERENCES TourPackages | Package identifier |
| `hotel_id` | INT / INTEGER | NO | PK, FK | REFERENCES Hotels | Hotel partner identifier |
| `room_type` | VARCHAR(80) | YES | None | DEFAULT 'Deluxe Double Room' | Contracted room category |

---

### Table 12: `GuideAssignments`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `assignment_id` | INT / INTEGER | NO | PK | Auto Increment | Assignment record identifier |
| `guide_id` | INT / INTEGER | NO | FK | REFERENCES Guides | Guide assigned |
| `departure_id` | INT / INTEGER | NO | FK | REFERENCES Departures | Departure scheduled |
| `assigned_date` | TIMESTAMP | NO | None | CURRENT_TIMESTAMP | Assignment timestamp |
| `status` | ENUM / TEXT | NO | None | Assigned, Confirmed, Completed, Cancelled | Assignment status |

---

### Table 13: `Bookings`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `booking_id` | INT / INTEGER | NO | PK | Auto Increment | Internal booking identifier |
| `booking_reference`| VARCHAR(40)| NO | UK | Unique voucher code | Public reference (e.g. BY-2026-KASH-101) |
| `customer_id` | INT / INTEGER | NO | FK | REFERENCES Customers | Booking customer account |
| `departure_id` | INT / INTEGER | NO | FK | REFERENCES Departures | Booked departure batch |
| `booking_date` | TIMESTAMP | NO | None | CURRENT_TIMESTAMP | Order creation timestamp |
| `traveller_count`| INT | NO | None | CHECK(traveller_count > 0) | Number of seats reserved |
| `total_amount` | DECIMAL(10,2)| NO | None | Base fare calculation | Gross ticket fare |
| `discount_amount`| DECIMAL(10,2)| NO | None | DEFAULT 0.00 | Promotional deduction |
| `tax_amount` | DECIMAL(10,2)| NO | None | DEFAULT 0.00 | 5% GST tax component |
| `net_amount` | DECIMAL(10,2)| NO | None | CHECK(net_amount >= 0) | Final payable total |
| `booking_status` | ENUM / TEXT | NO | None | Pending, Confirmed, Cancelled, Completed | Reservation lifecycle state |
| `special_requests`| TEXT | YES | None | None | Dietary, accessibility or room notes |

---

### Table 14: `Travellers`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `traveller_id` | INT / INTEGER | NO | PK | Auto Increment | Passenger record identifier |
| `customer_id` | INT / INTEGER | NO | FK | REFERENCES Customers | Associated primary booker |
| `full_name` | VARCHAR(120) | NO | None | NOT NULL | Passenger full name |
| `age` | INT | NO | None | CHECK(age BETWEEN 0 AND 120) | Age in years |
| `gender` | ENUM / TEXT | NO | None | Male, Female, Other | Gender identity |
| `id_proof_type` | ENUM / TEXT | YES | None | Aadhaar, Passport, Voter ID... | Government identification type |
| `id_proof_number`| VARCHAR(50) | YES | None | None | ID document number |

---

### Table 15: `BookingTravellers`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `booking_id` | INT / INTEGER | NO | PK, FK | REFERENCES Bookings | Booking identifier |
| `traveller_id` | INT / INTEGER | NO | PK, FK | REFERENCES Travellers | Associated traveller |
| `seat_number` | VARCHAR(10) | YES | None | None | Allocated coach/flight seat code |

---

### Table 16: `Payments`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `payment_id` | INT / INTEGER | NO | PK | Auto Increment | Payment transaction identifier |
| `booking_id` | INT / INTEGER | NO | FK | REFERENCES Bookings | Reservation paid for |
| `payment_reference`| VARCHAR(50)| NO | UK | Unique transaction reference | E.g. PAY-UPI-8841920 |
| `payment_method`| ENUM / TEXT | NO | None | UPI, Card, NetBanking, DemoPay | Method used |
| `amount` | DECIMAL(10,2)| NO | None | CHECK(amount > 0) | Transaction value in INR |
| `payment_status`| ENUM / TEXT | NO | None | Initiated, Successful, Failed, Refunded | Gateway settlement state |
| `transaction_date`| TIMESTAMP | NO | None | CURRENT_TIMESTAMP | Timestamp of execution |
| `gateway_response`| TEXT | YES | None | None | JSON simulated gateway response |

---

### Table 17: `Cancellations`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cancellation_id`| INT / INTEGER | NO | PK | Auto Increment | Cancellation audit record |
| `booking_id` | INT / INTEGER | NO | FK, UK | REFERENCES Bookings | Unique cancelled booking |
| `cancellation_date`| TIMESTAMP | NO | None | CURRENT_TIMESTAMP | Request timestamp |
| `reason` | TEXT | NO | None | NOT NULL | Customer explanation |
| `cancellation_fee`| DECIMAL(10,2)| NO | None | CHECK(cancellation_fee >= 0) | Forfeited penalty per policy |
| `refundable_amount`| DECIMAL(10,2)| NO | None | CHECK(refundable_amount >= 0) | Net refundable balance |
| `status` | ENUM / TEXT | NO | None | Pending, Approved, Rejected | Administrative approval state |

---

### Table 18: `Refunds`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `refund_id` | INT / INTEGER | NO | PK | Auto Increment | Refund payout identifier |
| `cancellation_id`| INT / INTEGER | NO | FK | REFERENCES Cancellations | Triggering cancellation |
| `payment_id` | INT / INTEGER | NO | FK | REFERENCES Payments | Source payment transaction |
| `refund_amount` | DECIMAL(10,2)| NO | None | CHECK(refund_amount <= refundable_amount)| Actual disbursed refund in INR |
| `refund_date` | TIMESTAMP | NO | None | CURRENT_TIMESTAMP | Disbursement timestamp |
| `refund_method` | TEXT | YES | None | Original Source (UPI/Card) | Refund payment channel |
| `refund_status` | ENUM / TEXT | NO | None | Pending, Approved, Processed, Rejected | Disbursement settlement status |
| `notes` | TEXT | YES | None | None | Accounting ledger remarks |

---

### Table 19: `Countries`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `country_id` | INT / INTEGER | NO | PK | Auto Increment | Primary key for country reference |
| `country_name` | VARCHAR(100) | NO | UK | Unique country name | Full name of country (e.g. France, Japan) |
| `continent` | VARCHAR(50) | NO | None | NOT NULL | Continent (Europe, Asia, North America, etc.) |

---

### Table 20: `PackageCategories`
| Attribute | Data Type | Nullable | Key | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category_id` | INT / INTEGER | NO | PK | Auto Increment | Primary key for package category |
| `category_name` | VARCHAR(80) | NO | UK | Unique category title | Category name (e.g. Adventure tourism, Beach holidays) |
| `description` | TEXT | YES | None | None | Standardized thematic category description |

