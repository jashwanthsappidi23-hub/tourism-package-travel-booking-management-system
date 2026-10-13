# SQL Queries, Analytical Reports & Views Showcase
**Course:** Database Management Systems (PBL Project 63)  
**System:** BharatYatra Tourism Package and Travel Booking Management System

---

## 1. Required Query Index

| # | Objective / Topic | DBMS Concepts Demonstrated |
| :--- | :--- | :--- |
| **Q1** | Display all available tour packages with route | `INNER JOIN`, `GROUP_CONCAT`, `WHERE` |
| **Q2** | Find departures with available seats (> 0) | Arithmetic expression, Multi-table JOIN, Date filter |
| **Q3** | List confirmed customer bookings & payments | Multi-table JOIN, Order By |
| **Q4** | Day-wise itinerary for a package | `LEFT JOIN`, Foreign Key navigation, Sequential order |
| **Q5** | Tour guide schedule & passenger manifest | `LEFT JOIN`, Order By |
| **Q6** | **Conflict Detection:** Overlapping guide assignments | **Self-Join**, Date interval intersection logic |
| **Q7** | Bookings & revenue aggregate per package | `COUNT`, `SUM`, `LEFT JOIN`, `GROUP BY` |
| **Q8** | Most popular tourist destinations by bookings | Many-to-Many traversal, `COUNT(DISTINCT)`, Sorting |
| **Q9** | Total collected revenue & order metrics | `SUM`, `AVG`, `MIN`, `MAX` |
| **Q10**| Cancelled bookings & penalty fee calculation | Financial arithmetic, multi-table `JOIN` |
| **Q11**| Refund disbursement tracking by status | `CASE`, `GROUP BY`, Aggregate sums |
| **Q12**| Tour packages with ZERO customer bookings | Nested subquery with `NOT IN` / `LEFT JOIN` |
| **Q13**| Departures nearing capacity ($\ge 80\%$ occupancy)| `HAVING` clause with mathematical expression |
| **Q14**| Monthly booking trends & financial reconciliation | `DATE_FORMAT` / `strftime`, `GROUP BY` |

---

## 2. In-Depth Query Explanations & SQL Code

### Query 1: Active Tour Packages with Route Destinations
```sql
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
```
*Purpose:* Shows customers and administrators all active travel packages, duration in days/nights, starting price in INR, and the sequenced travel itinerary route across Indian tourist cities.

---

### Query 2: Departures with Available Seats
```sql
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
```
*Purpose:* Powers the frontend search engine to ensure customers can only book tours with open capacity.

---

### Query 6: Critical Business Rule — Guide Schedule Conflict Detection
```sql
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
```
*Purpose:* Evaluates the fundamental DBMS integrity rule: A tour guide cannot physically lead two overlapping tour packages. If this query returns rows, the system flags a scheduling violation.

---

### Query 13: Departures Nearing Capacity ($\ge 80\%$)
```sql
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
```
*Purpose:* Allows marketing and tour operations managers to identify popular departures nearing sell-out so they can schedule additional vehicles or apply peak pricing.

---

## 3. Database Views

1. **`AvailableDeparturesView`**: Real-time view abstracting packages, dates, remaining seats, assigned guides, and transport for public catalog browsing.
2. **`BookingDetailsView`**: Customer invoice and ticket view joining customers, departures, packages, and payment transaction details.
3. **`GuideScheduleView`**: Roster view for tour guides showing assigned departures, start dates, and travellers count.
4. **`MonthlyRevenueView`**: Financial view computing gross revenue, total refunds, and net earnings per calendar month.
5. **`CancellationRefundView`**: Audit view of cancellations, policy fee deductions, and refund disbursement status.
