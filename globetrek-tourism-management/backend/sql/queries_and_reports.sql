-- ============================================================================
-- BharatYatra Tourism Package and Travel Booking Management System
-- Comprehensive SQL Queries, Analytical Reports and Academic Demonstrations
-- Course: Database Management Systems (PBL Project 63)
-- Covers: INNER JOIN, LEFT JOIN, GROUP BY, HAVING, Subqueries, Aggregate
--         Functions, Views, and Conflict Detection.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 1: Display all active tour packages with destinations and base pricing
-- Concept: INNER JOIN, GROUP_CONCAT, Aggregation
-- ----------------------------------------------------------------------------
SELECT 
    p.package_id,
    p.title AS package_name,
    p.category,
    CONCAT(p.duration_days, 'D / ', p.duration_nights, 'N') AS duration,
    p.base_price AS starting_price_inr,
    GROUP_CONCAT(d.name ORDER BY pd.sequence_order SEPARATOR ' -> ') AS route_destinations
FROM TourPackages p
JOIN PackageDestinations pd ON p.package_id = pd.package_id
JOIN Destinations d ON pd.destination_id = d.destination_id
WHERE p.is_active = TRUE
GROUP BY p.package_id, p.title, p.category, p.duration_days, p.duration_nights, p.base_price
ORDER BY p.base_price ASC;


-- ----------------------------------------------------------------------------
-- QUERY 2: Find all departures with available seats (> 0) and published status
-- Concept: Arithmetic expressions, Multi-table JOIN, Date Filtering
-- ----------------------------------------------------------------------------
SELECT 
    d.departure_id,
    p.title AS package_title,
    d.start_date,
    d.end_date,
    d.total_capacity,
    d.confirmed_seats,
    (d.total_capacity - d.confirmed_seats) AS available_seats,
    ROUND(((d.confirmed_seats / d.total_capacity) * 100), 1) AS occupancy_percent,
    COALESCE(d.price_override, p.base_price) AS tour_price,
    d.status
FROM Departures d
JOIN TourPackages p ON d.package_id = p.package_id
WHERE d.status IN ('Published', 'Confirmed')
  AND (d.total_capacity - d.confirmed_seats) > 0
  AND d.start_date >= CURDATE()
ORDER BY d.start_date ASC;


-- ----------------------------------------------------------------------------
-- QUERY 3: List confirmed customer bookings with passenger & payment details
-- Concept: Multi-table INNER JOIN with Filter
-- ----------------------------------------------------------------------------
SELECT 
    b.booking_reference,
    c.full_name AS customer_name,
    c.phone AS contact_number,
    p.title AS tour_package,
    d.start_date AS departure_date,
    b.traveller_count,
    b.net_amount AS total_paid,
    b.booking_status,
    pay.payment_method,
    pay.payment_reference
FROM Bookings b
JOIN Customers c ON b.customer_id = c.customer_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
JOIN Payments pay ON b.booking_id = pay.booking_id
WHERE b.booking_status = 'Confirmed' AND pay.payment_status = 'Successful'
ORDER BY b.booking_date DESC;


-- ----------------------------------------------------------------------------
-- QUERY 4: Show detailed day-wise itinerary for a specific tour package
-- Concept: Sequential ordering, Foreign Key navigation, NULL handling
-- ----------------------------------------------------------------------------
SELECT 
    p.title AS package_name,
    i.day_number,
    i.title AS day_title,
    i.activities,
    i.meals_included,
    COALESCE(h.name, 'No hotel stay scheduled') AS accommodation,
    COALESCE(t.vehicle_type, 'Walking / Local Transport') AS transport
FROM ItineraryDays i
JOIN TourPackages p ON i.package_id = p.package_id
LEFT JOIN Hotels h ON i.hotel_id = h.hotel_id
LEFT JOIN Transport t ON i.transport_id = t.transport_id
WHERE p.package_id = 1
ORDER BY i.day_number ASC;


-- ----------------------------------------------------------------------------
-- QUERY 5: Display tour guide schedules with departure dates and passenger count
-- Concept: LEFT JOIN, Order By Date
-- ----------------------------------------------------------------------------
SELECT 
    g.guide_id,
    g.full_name AS guide_name,
    g.phone,
    g.languages,
    d.departure_id,
    p.title AS tour_title,
    d.start_date,
    d.end_date,
    d.confirmed_seats AS travellers_assigned,
    d.status AS departure_status
FROM Guides g
JOIN Departures d ON g.guide_id = d.guide_id
JOIN TourPackages p ON d.package_id = p.package_id
ORDER BY g.full_name, d.start_date ASC;


-- ----------------------------------------------------------------------------
-- QUERY 6: Conflict Detection Query — Find overlapping guide assignments
-- Concept: Self-Join / Cross verification of date intervals
-- Business Rule: A guide cannot be scheduled on two overlapping tours!
-- ----------------------------------------------------------------------------
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
  AND d1.end_date >= d2.start_date;


-- ----------------------------------------------------------------------------
-- QUERY 7: Calculate total number of bookings and revenue per tour package
-- Concept: LEFT JOIN, Aggregate functions (COUNT, SUM), GROUP BY
-- ----------------------------------------------------------------------------
SELECT 
    p.package_id,
    p.title AS package_name,
    p.category,
    COUNT(b.booking_id) AS total_bookings_count,
    COALESCE(SUM(b.traveller_count), 0) AS total_passengers,
    COALESCE(SUM(b.net_amount), 0.00) AS total_revenue_inr
FROM TourPackages p
LEFT JOIN Departures d ON p.package_id = d.package_id
LEFT JOIN Bookings b ON d.departure_id = b.departure_id AND b.booking_status IN ('Confirmed', 'Completed')
GROUP BY p.package_id, p.title, p.category
ORDER BY total_revenue_inr DESC;


-- ----------------------------------------------------------------------------
-- QUERY 8: Identify the most popular tourist destinations by booking volume
-- Concept: Many-to-Many traversal, Aggregation, Sub-query/JOIN
-- ----------------------------------------------------------------------------
SELECT 
    dest.destination_id,
    dest.name AS destination_name,
    dest.state,
    COUNT(DISTINCT b.booking_id) AS total_package_bookings,
    COALESCE(SUM(b.traveller_count), 0) AS total_travellers_visited
FROM Destinations dest
JOIN PackageDestinations pd ON dest.destination_id = pd.destination_id
JOIN TourPackages p ON pd.package_id = p.package_id
JOIN Departures d ON p.package_id = d.package_id
LEFT JOIN Bookings b ON d.departure_id = b.departure_id AND b.booking_status != 'Cancelled'
GROUP BY dest.destination_id, dest.name, dest.state
ORDER BY total_travellers_visited DESC, total_package_bookings DESC;


-- ----------------------------------------------------------------------------
-- QUERY 9: Calculate overall revenue, GST collected, and average booking ticket
-- Concept: Aggregate functions (SUM, AVG, MIN, MAX)
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(payment_id) AS successful_transactions_count,
    SUM(amount) AS total_collected_revenue,
    ROUND(AVG(amount), 2) AS average_order_value,
    MIN(amount) AS lowest_booking_amount,
    MAX(amount) AS highest_booking_amount
FROM Payments
WHERE payment_status = 'Successful';


-- ----------------------------------------------------------------------------
-- QUERY 10: List all cancelled bookings with cancellation fees and net refunds
-- Concept: Multi-table JOIN with financial calculation
-- ----------------------------------------------------------------------------
SELECT 
    c.cancellation_id,
    b.booking_reference,
    cust.full_name AS customer_name,
    p.title AS tour_name,
    b.net_amount AS original_paid_amount,
    c.cancellation_fee,
    c.refundable_amount,
    c.reason,
    c.cancellation_date
FROM Cancellations c
JOIN Bookings b ON c.booking_id = b.booking_id
JOIN Customers cust ON b.customer_id = cust.customer_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
ORDER BY c.cancellation_date DESC;


-- ----------------------------------------------------------------------------
-- QUERY 11: Track pending vs processed refund requests
-- Concept: CASE statement, GROUP BY aggregation
-- ----------------------------------------------------------------------------
SELECT 
    r.refund_status,
    COUNT(r.refund_id) AS total_refund_requests,
    SUM(r.refund_amount) AS total_amount_inr,
    ROUND(AVG(r.refund_amount), 2) AS average_refund_amount
FROM Refunds r
GROUP BY r.refund_status;


-- ----------------------------------------------------------------------------
-- QUERY 12: Find tour packages that have NEVER had any customer bookings
-- Concept: Nested Subquery with NOT IN (or LEFT JOIN WHERE IS NULL)
-- ----------------------------------------------------------------------------
SELECT 
    p.package_id,
    p.title AS package_name,
    p.category,
    p.base_price,
    p.created_at
FROM TourPackages p
WHERE p.package_id NOT IN (
    SELECT DISTINCT d.package_id 
    FROM Departures d 
    JOIN Bookings b ON d.departure_id = b.departure_id
)
ORDER BY p.base_price DESC;


-- ----------------------------------------------------------------------------
-- QUERY 13: Identify departures nearing capacity (>= 80% capacity booked)
-- Concept: HAVING clause with mathematical filter
-- ----------------------------------------------------------------------------
SELECT 
    d.departure_id,
    p.title AS tour_title,
    d.start_date,
    d.total_capacity,
    d.confirmed_seats,
    (d.total_capacity - d.confirmed_seats) AS seats_remaining,
    ROUND(((d.confirmed_seats / d.total_capacity) * 100), 1) AS occupancy_rate
FROM Departures d
JOIN TourPackages p ON d.package_id = p.package_id
WHERE d.status IN ('Published', 'Confirmed')
GROUP BY d.departure_id, p.title, d.start_date, d.total_capacity, d.confirmed_seats
HAVING (d.confirmed_seats / d.total_capacity) >= 0.80
ORDER BY occupancy_rate DESC;


-- ----------------------------------------------------------------------------
-- QUERY 14: Compare monthly bookings count and gross revenue over time
-- Concept: Date formatting, GROUP BY, Aggregate trend analysis
-- ----------------------------------------------------------------------------
SELECT 
    DATE_FORMAT(b.booking_date, '%Y-%m') AS booking_month,
    COUNT(b.booking_id) AS total_bookings_created,
    SUM(b.traveller_count) AS total_travellers,
    SUM(b.net_amount) AS total_booking_value,
    SUM(CASE WHEN b.booking_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings_count
FROM Bookings b
GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
ORDER BY booking_month DESC;
