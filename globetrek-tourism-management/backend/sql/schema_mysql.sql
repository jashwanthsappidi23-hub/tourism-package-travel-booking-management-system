-- ============================================================================
-- BharatYatra Tourism Package and Travel Booking Management System
-- Normalized Relational Database Schema (3NF) - MySQL / MariaDB Compatible
-- Course: Database Management Systems (PBL Project 63)
-- ============================================================================

DROP DATABASE IF EXISTS bharatyatra_db;
CREATE DATABASE bharatyatra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bharatyatra_db;

-- ----------------------------------------------------------------------------
-- Table 1: Users (Authentication and Role-Based Access)
-- ----------------------------------------------------------------------------
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Customer', 'Administrator', 'Guide') NOT NULL DEFAULT 'Customer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2: Customers (Customer Profile Details)
-- ----------------------------------------------------------------------------
CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(80),
    state VARCHAR(80),
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_customers_phone (phone)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2b: Countries (Global Geographic Reference per 3NF Schema)
-- ----------------------------------------------------------------------------
CREATE TABLE Countries (
    country_id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE,
    continent VARCHAR(100) NOT NULL,
    INDEX idx_countries_name (country_name),
    INDEX idx_countries_continent (continent)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2c: PackageCategories (Recommended Tourism Categories)
-- ----------------------------------------------------------------------------
CREATE TABLE PackageCategories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 3: Destinations (Geographic Tour Hubs)
-- ----------------------------------------------------------------------------
CREATE TABLE Destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    country_id INT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    continent VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    best_time_to_visit VARCHAR(100),
    CONSTRAINT fk_destinations_country FOREIGN KEY (country_id) REFERENCES Countries(country_id) ON DELETE SET NULL,
    INDEX idx_destinations_name (name),
    INDEX idx_destinations_country (country),
    INDEX idx_destinations_continent (continent),
    INDEX idx_destinations_popular (is_popular)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 4: TourPackages (Tour Package Catalogue)
-- ----------------------------------------------------------------------------
CREATE TABLE TourPackages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    featured_image VARCHAR(500),
    description TEXT NOT NULL,
    inclusions TEXT,
    exclusions TEXT,
    cancellation_policy TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_package_days CHECK (duration_days > 0),
    CONSTRAINT chk_package_nights CHECK (duration_nights >= 0),
    CONSTRAINT chk_package_price CHECK (base_price >= 0),
    INDEX idx_packages_category (category),
    INDEX idx_packages_price (base_price),
    INDEX idx_packages_active (is_active)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 5: PackageDestinations (Many-to-Many Packages <-> Destinations)
-- ----------------------------------------------------------------------------
CREATE TABLE PackageDestinations (
    package_id INT NOT NULL,
    destination_id INT NOT NULL,
    sequence_order INT NOT NULL DEFAULT 1,
    PRIMARY KEY (package_id, destination_id),
    CONSTRAINT fk_pd_package FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_pd_destination FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE,
    INDEX idx_pd_dest (destination_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 6: Hotels (Accommodation Partners)
-- ----------------------------------------------------------------------------
CREATE TABLE Hotels (
    hotel_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    star_rating INT NOT NULL DEFAULT 3,
    address TEXT,
    contact_phone VARCHAR(20),
    amenities VARCHAR(300),
    CONSTRAINT chk_hotel_star CHECK (star_rating BETWEEN 1 AND 5),
    CONSTRAINT fk_hotels_destination FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE,
    INDEX idx_hotels_dest (destination_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 7: Transport (Fleet & Transportation Partners)
-- ----------------------------------------------------------------------------
CREATE TABLE Transport (
    transport_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    operator_name VARCHAR(120) NOT NULL,
    contact_phone VARCHAR(20),
    CONSTRAINT chk_transport_cap CHECK (capacity > 0)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 8: Guides (Licensed Tour Guide Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE Guides (
    guide_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    languages VARCHAR(200) NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    bio TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_guide_exp CHECK (experience_years >= 0),
    CONSTRAINT fk_guides_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_guides_phone (phone)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 9: Departures (Scheduled Tour Departure Batches)
-- ----------------------------------------------------------------------------
CREATE TABLE Departures (
    departure_id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_capacity INT NOT NULL,
    confirmed_seats INT NOT NULL DEFAULT 0,
    price_override DECIMAL(10, 2) NULL,
    guide_id INT NULL,
    transport_id INT NULL,
    status ENUM('Draft', 'Published', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dep_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_dep_capacity CHECK (total_capacity > 0),
    CONSTRAINT chk_dep_seats CHECK (confirmed_seats >= 0 AND confirmed_seats <= total_capacity),
    CONSTRAINT fk_departures_package FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_departures_guide FOREIGN KEY (guide_id) REFERENCES Guides(guide_id) ON DELETE SET NULL,
    CONSTRAINT fk_departures_transport FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL,
    INDEX idx_departures_dates (start_date, end_date),
    INDEX idx_departures_status (status)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 10: ItineraryDays (Day-by-Day Package Itinerary)
-- ----------------------------------------------------------------------------
CREATE TABLE ItineraryDays (
    itinerary_id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    activities TEXT NOT NULL,
    meals_included VARCHAR(100) DEFAULT 'Breakfast',
    hotel_id INT NULL,
    transport_id INT NULL,
    notes TEXT,
    CONSTRAINT uq_pkg_day UNIQUE (package_id, day_number),
    CONSTRAINT chk_day_num CHECK (day_number > 0),
    CONSTRAINT fk_itinerary_package FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_itinerary_hotel FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE SET NULL,
    CONSTRAINT fk_itinerary_transport FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 11: PackageHotels (Package & Hotel Associations)
-- ----------------------------------------------------------------------------
CREATE TABLE PackageHotels (
    package_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_type VARCHAR(80) DEFAULT 'Deluxe Double Room',
    PRIMARY KEY (package_id, hotel_id),
    CONSTRAINT fk_ph_package FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_ph_hotel FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 12: GuideAssignments (Guide & Departure Assignments with conflict prevention)
-- ----------------------------------------------------------------------------
CREATE TABLE GuideAssignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    guide_id INT NOT NULL,
    departure_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Assigned', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Assigned',
    CONSTRAINT uq_guide_dep UNIQUE (guide_id, departure_id),
    CONSTRAINT fk_ga_guide FOREIGN KEY (guide_id) REFERENCES Guides(guide_id) ON DELETE CASCADE,
    CONSTRAINT fk_ga_departure FOREIGN KEY (departure_id) REFERENCES Departures(departure_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 13: Bookings (Customer Tour Bookings)
-- ----------------------------------------------------------------------------
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(40) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    departure_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    traveller_count INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Confirmed',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_travellers CHECK (traveller_count > 0),
    CONSTRAINT chk_booking_net CHECK (net_amount >= 0),
    CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_departure FOREIGN KEY (departure_id) REFERENCES Departures(departure_id) ON DELETE RESTRICT,
    INDEX idx_bookings_ref (booking_reference),
    INDEX idx_bookings_cust (customer_id),
    INDEX idx_bookings_status (booking_status)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 14: Travellers (Traveller Identity Records)
-- ----------------------------------------------------------------------------
CREATE TABLE Travellers (
    traveller_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    id_proof_type ENUM('Aadhaar', 'Passport', 'Voter ID', 'Driving License') DEFAULT 'Aadhaar',
    id_proof_number VARCHAR(50),
    phone VARCHAR(20),
    CONSTRAINT chk_traveller_age CHECK (age >= 0 AND age <= 120),
    CONSTRAINT fk_travellers_customer FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 15: BookingTravellers (Junction Table: Bookings <-> Travellers)
-- ----------------------------------------------------------------------------
CREATE TABLE BookingTravellers (
    booking_id INT NOT NULL,
    traveller_id INT NOT NULL,
    seat_number VARCHAR(10),
    PRIMARY KEY (booking_id, traveller_id),
    CONSTRAINT fk_bt_booking FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_bt_traveller FOREIGN KEY (traveller_id) REFERENCES Travellers(traveller_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 16: Payments (Financial Transactions)
-- ----------------------------------------------------------------------------
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_reference VARCHAR(50) NOT NULL UNIQUE,
    payment_method ENUM('UPI', 'Card', 'NetBanking', 'DemoPay') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Initiated', 'Successful', 'Failed', 'Refunded') NOT NULL DEFAULT 'Successful',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gateway_response TEXT,
    CONSTRAINT chk_pay_amount CHECK (amount > 0),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_payments_status (payment_status),
    INDEX idx_payments_ref (payment_reference)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 17: Cancellations (Booking Cancellation Audit)
-- ----------------------------------------------------------------------------
CREATE TABLE Cancellations (
    cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    cancellation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT NOT NULL,
    cancellation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    refundable_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Approved',
    CONSTRAINT chk_can_fee CHECK (cancellation_fee >= 0),
    CONSTRAINT chk_can_ref CHECK (refundable_amount >= 0),
    CONSTRAINT fk_cancellations_booking FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 18: Refunds (Refund Tracking & Disbursement)
-- ----------------------------------------------------------------------------
CREATE TABLE Refunds (
    refund_id INT AUTO_INCREMENT PRIMARY KEY,
    cancellation_id INT NOT NULL,
    payment_id INT NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refund_method ENUM('Original Source (UPI/Card)', 'Bank Transfer', 'Demo Refund') DEFAULT 'Original Source (UPI/Card)',
    refund_status ENUM('Pending', 'Approved', 'Processed', 'Rejected') NOT NULL DEFAULT 'Processed',
    notes TEXT,
    CONSTRAINT chk_refund_amount CHECK (refund_amount >= 0),
    CONSTRAINT fk_refunds_cancellation FOREIGN KEY (cancellation_id) REFERENCES Cancellations(cancellation_id) ON DELETE CASCADE,
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES Payments(payment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SQL VIEWS FOR REPORTING & ANALYTICS
-- ============================================================================

-- View 1: Available Departures with Real-Time Seat Calculations
CREATE OR REPLACE VIEW AvailableDeparturesView AS
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
WHERE d.status IN ('Published', 'Confirmed') AND d.start_date >= CURDATE();

-- View 2: Complete Booking Details for Customers & Admin
CREATE OR REPLACE VIEW BookingDetailsView AS
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

-- View 3: Guide Schedule View
CREATE OR REPLACE VIEW GuideScheduleView AS
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

-- View 4: Monthly Revenue and Financial Summary
CREATE OR REPLACE VIEW MonthlyRevenueView AS
SELECT 
    DATE_FORMAT(pay.transaction_date, '%Y-%m') AS month_year,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    SUM(CASE WHEN pay.payment_status = 'Successful' THEN pay.amount ELSE 0 END) AS gross_revenue,
    COALESCE(SUM(r.refund_amount), 0) AS total_refunded,
    (SUM(CASE WHEN pay.payment_status = 'Successful' THEN pay.amount ELSE 0 END) - COALESCE(SUM(r.refund_amount), 0)) AS net_revenue
FROM Payments pay
JOIN Bookings b ON pay.booking_id = b.booking_id
LEFT JOIN Cancellations c ON b.booking_id = c.booking_id
LEFT JOIN Refunds r ON c.cancellation_id = r.cancellation_id AND r.refund_status = 'Processed'
WHERE pay.payment_status = 'Successful'
GROUP BY DATE_FORMAT(pay.transaction_date, '%Y-%m')
ORDER BY month_year DESC;

-- View 5: Cancellations and Refund Status View
CREATE OR REPLACE VIEW CancellationRefundView AS
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
    COALESCE(r.refund_amount, 0) AS refund_amount,
    COALESCE(r.refund_status, 'Pending') AS refund_status,
    r.refund_date
FROM Cancellations c
JOIN Bookings b ON c.booking_id = b.booking_id
JOIN Customers cust ON b.customer_id = cust.customer_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Refunds r ON c.cancellation_id = r.cancellation_id;
