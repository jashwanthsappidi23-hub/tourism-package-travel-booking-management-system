-- ============================================================================
-- BharatYatra Tourism Package and Travel Booking Management System
-- Normalized Relational Database Schema (3NF) - SQLite Compatible
-- Course: Database Management Systems (PBL Project 63)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- Table 1: Users (Authentication and Role-Based Access)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Customer', 'Administrator', 'Guide')) DEFAULT 'Customer',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON Users(role);

-- ----------------------------------------------------------------------------
-- Table 2: Customers (Customer Profile Details)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    state TEXT,
    emergency_contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON Customers(phone);

-- ----------------------------------------------------------------------------
-- Table 2b: Countries (Global Geographic Reference per 3NF Schema)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Countries (
    country_id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_name TEXT NOT NULL UNIQUE,
    continent TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_countries_name ON Countries(country_name);
CREATE INDEX IF NOT EXISTS idx_countries_continent ON Countries(continent);

-- ----------------------------------------------------------------------------
-- Table 2c: PackageCategories (Recommended Tourism Categories)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS PackageCategories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- ----------------------------------------------------------------------------
-- Table 3: Destinations (Geographic Tour Hubs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Destinations (
    destination_id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_id INTEGER NULL,
    name TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    continent TEXT,
    description TEXT,
    image_url TEXT,
    is_popular INTEGER NOT NULL DEFAULT 0,
    best_time_to_visit TEXT,
    FOREIGN KEY (country_id) REFERENCES Countries(country_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_destinations_name ON Destinations(name);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON Destinations(country);
CREATE INDEX IF NOT EXISTS idx_destinations_continent ON Destinations(continent);
CREATE INDEX IF NOT EXISTS idx_destinations_popular ON Destinations(is_popular);

-- ----------------------------------------------------------------------------
-- Table 4: TourPackages (Tour Package Catalogue)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS TourPackages (
    package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    duration_days INTEGER NOT NULL CHECK(duration_days > 0),
    duration_nights INTEGER NOT NULL CHECK(duration_nights >= 0),
    base_price REAL NOT NULL CHECK(base_price >= 0),
    featured_image TEXT,
    description TEXT NOT NULL,
    inclusions TEXT,
    exclusions TEXT,
    cancellation_policy TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_packages_category ON TourPackages(category);
CREATE INDEX IF NOT EXISTS idx_packages_price ON TourPackages(base_price);
CREATE INDEX IF NOT EXISTS idx_packages_active ON TourPackages(is_active);

-- ----------------------------------------------------------------------------
-- Table 5: PackageDestinations (Many-to-Many Packages <-> Destinations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS PackageDestinations (
    package_id INTEGER NOT NULL,
    destination_id INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (package_id, destination_id),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pd_dest ON PackageDestinations(destination_id);

-- ----------------------------------------------------------------------------
-- Table 6: Hotels (Accommodation Partners)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Hotels (
    hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    star_rating INTEGER NOT NULL CHECK(star_rating BETWEEN 1 AND 5) DEFAULT 3,
    address TEXT,
    contact_phone TEXT,
    amenities TEXT,
    FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hotels_dest ON Hotels(destination_id);

-- ----------------------------------------------------------------------------
-- Table 7: Transport (Fleet & Transportation Partners)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Transport (
    transport_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_type TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK(capacity > 0),
    registration_number TEXT NOT NULL UNIQUE,
    operator_name TEXT NOT NULL,
    contact_phone TEXT
);

-- ----------------------------------------------------------------------------
-- Table 8: Guides (Licensed Tour Guide Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Guides (
    guide_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    languages TEXT NOT NULL,
    experience_years INTEGER NOT NULL CHECK(experience_years >= 0) DEFAULT 1,
    bio TEXT,
    is_available INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_guides_phone ON Guides(phone);

-- ----------------------------------------------------------------------------
-- Table 9: Departures (Scheduled Tour Departure Batches)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Departures (
    departure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_capacity INTEGER NOT NULL CHECK(total_capacity > 0),
    confirmed_seats INTEGER NOT NULL CHECK(confirmed_seats >= 0 AND confirmed_seats <= total_capacity) DEFAULT 0,
    price_override REAL NULL,
    guide_id INTEGER NULL,
    transport_id INTEGER NULL,
    status TEXT NOT NULL CHECK(status IN ('Draft', 'Published', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date >= start_date),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (guide_id) REFERENCES Guides(guide_id) ON DELETE SET NULL,
    FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_departures_dates ON Departures(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_departures_status ON Departures(status);

-- ----------------------------------------------------------------------------
-- Table 10: ItineraryDays (Day-by-Day Package Itinerary)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ItineraryDays (
    itinerary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL CHECK(day_number > 0),
    title TEXT NOT NULL,
    activities TEXT NOT NULL,
    meals_included TEXT DEFAULT 'Breakfast',
    hotel_id INTEGER NULL,
    transport_id INTEGER NULL,
    notes TEXT,
    UNIQUE(package_id, day_number),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE SET NULL,
    FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Table 11: PackageHotels (Package & Hotel Associations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS PackageHotels (
    package_id INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    room_type TEXT DEFAULT 'Deluxe Double Room',
    PRIMARY KEY (package_id, hotel_id),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table 12: GuideAssignments (Guide & Departure Assignments)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS GuideAssignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    guide_id INTEGER NOT NULL,
    departure_id INTEGER NOT NULL,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Assigned', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Assigned',
    UNIQUE(guide_id, departure_id),
    FOREIGN KEY (guide_id) REFERENCES Guides(guide_id) ON DELETE CASCADE,
    FOREIGN KEY (departure_id) REFERENCES Departures(departure_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table 13: Bookings (Customer Tour Bookings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    departure_id INTEGER NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    traveller_count INTEGER NOT NULL CHECK(traveller_count > 0),
    total_amount REAL NOT NULL,
    discount_amount REAL NOT NULL DEFAULT 0.00,
    tax_amount REAL NOT NULL DEFAULT 0.00,
    net_amount REAL NOT NULL CHECK(net_amount >= 0),
    booking_status TEXT NOT NULL CHECK(booking_status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')) DEFAULT 'Confirmed',
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (departure_id) REFERENCES Departures(departure_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_bookings_ref ON Bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_cust ON Bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON Bookings(booking_status);

-- ----------------------------------------------------------------------------
-- Table 14: Travellers (Traveller Identity Records)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Travellers (
    traveller_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 0 AND age <= 120),
    gender TEXT NOT NULL CHECK(gender IN ('Male', 'Female', 'Other')),
    id_proof_type TEXT CHECK(id_proof_type IN ('Aadhaar', 'Passport', 'Voter ID', 'Driving License')) DEFAULT 'Aadhaar',
    id_proof_number TEXT,
    phone TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table 15: BookingTravellers (Junction Table: Bookings <-> Travellers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS BookingTravellers (
    booking_id INTEGER NOT NULL,
    traveller_id INTEGER NOT NULL,
    seat_number TEXT,
    PRIMARY KEY (booking_id, traveller_id),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (traveller_id) REFERENCES Travellers(traveller_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table 16: Payments (Financial Transactions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    payment_reference TEXT NOT NULL UNIQUE,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('UPI', 'Card', 'NetBanking', 'DemoPay')),
    amount REAL NOT NULL CHECK(amount > 0),
    payment_status TEXT NOT NULL CHECK(payment_status IN ('Initiated', 'Successful', 'Failed', 'Refunded')) DEFAULT 'Successful',
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    gateway_response TEXT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON Payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_ref ON Payments(payment_reference);

-- ----------------------------------------------------------------------------
-- Table 17: Cancellations (Booking Cancellation Audit)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Cancellations (
    cancellation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    cancellation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT NOT NULL,
    cancellation_fee REAL NOT NULL CHECK(cancellation_fee >= 0) DEFAULT 0.00,
    refundable_amount REAL NOT NULL CHECK(refundable_amount >= 0),
    status TEXT NOT NULL CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Approved',
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table 18: Refunds (Refund Tracking & Disbursement)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Refunds (
    refund_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cancellation_id INTEGER NOT NULL,
    payment_id INTEGER NOT NULL,
    refund_amount REAL NOT NULL CHECK(refund_amount >= 0),
    refund_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    refund_method TEXT DEFAULT 'Original Source (UPI/Card)',
    refund_status TEXT NOT NULL CHECK(refund_status IN ('Pending', 'Approved', 'Processed', 'Rejected')) DEFAULT 'Processed',
    notes TEXT,
    FOREIGN KEY (cancellation_id) REFERENCES Cancellations(cancellation_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id) ON DELETE CASCADE
);

-- ============================================================================
-- SQL VIEWS FOR REPORTING & ANALYTICS
-- ============================================================================

DROP VIEW IF EXISTS AvailableDeparturesView;
CREATE VIEW AvailableDeparturesView AS
SELECT 
    d.departure_id,
    p.package_id,
    p.title AS package_title,
    p.category,
    p.duration_days,
    p.duration_nights,
    COALESCE(d.price_override, p.base_price) AS effective_price,
    d.start_date,
    d.end_date,
    d.total_capacity,
    d.confirmed_seats,
    (d.total_capacity - d.confirmed_seats) AS available_seats,
    d.status AS departure_status,
    g.full_name AS assigned_guide,
    t.vehicle_type AS assigned_transport
FROM Departures d
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Guides g ON d.guide_id = g.guide_id
LEFT JOIN Transport t ON d.transport_id = t.transport_id
WHERE d.status IN ('Published', 'Confirmed');

DROP VIEW IF EXISTS BookingDetailsView;
CREATE VIEW BookingDetailsView AS
SELECT 
    b.booking_id,
    b.booking_reference,
    b.booking_date,
    c.customer_id,
    c.full_name AS customer_name,
    c.phone AS customer_phone,
    u.email AS customer_email,
    p.package_id,
    p.title AS package_title,
    d.start_date,
    d.end_date,
    b.traveller_count,
    b.net_amount,
    b.booking_status,
    pay.payment_status,
    pay.payment_method,
    pay.payment_reference
FROM Bookings b
JOIN Customers c ON b.customer_id = c.customer_id
JOIN Users u ON c.user_id = u.user_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Payments pay ON b.booking_id = pay.booking_id;

DROP VIEW IF EXISTS GuideScheduleView;
CREATE VIEW GuideScheduleView AS
SELECT 
    g.guide_id,
    g.full_name AS guide_name,
    g.phone AS guide_phone,
    g.languages,
    d.departure_id,
    p.title AS package_title,
    d.start_date,
    d.end_date,
    d.confirmed_seats AS travellers_count,
    d.status AS departure_status,
    t.vehicle_type,
    t.registration_number AS vehicle_plate
FROM Guides g
JOIN Departures d ON g.guide_id = d.guide_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Transport t ON d.transport_id = t.transport_id
ORDER BY d.start_date ASC;

DROP VIEW IF EXISTS MonthlyRevenueView;
CREATE VIEW MonthlyRevenueView AS
SELECT 
    strftime('%Y-%m', pay.transaction_date) AS month_year,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    SUM(CASE WHEN pay.payment_status = 'Successful' THEN pay.amount ELSE 0.0 END) AS gross_revenue,
    COALESCE(SUM(r.refund_amount), 0.0) AS total_refunded,
    (SUM(CASE WHEN pay.payment_status = 'Successful' THEN pay.amount ELSE 0.0 END) - COALESCE(SUM(r.refund_amount), 0.0)) AS net_revenue
FROM Payments pay
JOIN Bookings b ON pay.booking_id = b.booking_id
LEFT JOIN Cancellations c ON b.booking_id = c.booking_id
LEFT JOIN Refunds r ON c.cancellation_id = r.cancellation_id AND r.refund_status = 'Processed'
WHERE pay.payment_status = 'Successful'
GROUP BY strftime('%Y-%m', pay.transaction_date)
ORDER BY month_year DESC;

DROP VIEW IF EXISTS CancellationRefundView;
CREATE VIEW CancellationRefundView AS
SELECT 
    c.cancellation_id,
    b.booking_reference,
    cust.full_name AS customer_name,
    p.title AS package_title,
    b.net_amount AS total_booking_amount,
    c.cancellation_fee,
    c.refundable_amount,
    c.cancellation_date,
    c.reason,
    r.refund_id,
    COALESCE(r.refund_amount, 0.0) AS refund_amount,
    COALESCE(r.refund_status, 'Pending') AS refund_status,
    r.refund_date
FROM Cancellations c
JOIN Bookings b ON c.booking_id = b.booking_id
JOIN Customers cust ON b.customer_id = cust.customer_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Refunds r ON c.cancellation_id = r.cancellation_id;
