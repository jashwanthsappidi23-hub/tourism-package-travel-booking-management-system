# 🗻GlobeTrek --- Tourism Package & Travel Booking Management System

GlobeTrek is a web-based tourism and travel booking management system
developed as a Database Management Systems (DBMS) project. It helps
customers explore tour packages and make bookings while allowing tour
guides and administrators to manage departures, itineraries, payments,
cancellations, and refunds.

## Project Objectives

-   Organize travel agency information in a relational database.
-   Make it easier for customers to search packages and manage bookings.
-   Help administrators manage destinations, packages, departures,
    guides, and payments.
-   Reduce booking errors through database constraints and transaction
    handling.
-   Demonstrate database concepts such as normalization, relationships,
    SQL queries, and views.

## Main Features

-   **Customer portal:** Browse packages, book a tour, manage traveller
    details, view booking information, and request cancellations.
-   **Tour guide portal:** View assigned departures, traveller
    manifests, and itineraries.
-   **Administrator dashboard:** Manage tourism records and review
    booking, revenue, and destination statistics.
-   **Package and itinerary management:** Organize destinations,
    day-wise itineraries, hotels, transport, and departures.
-   **Booking and payment management:** Track bookings and payment
    records.
-   **Cancellation and refund management:** Record cancellation requests
    and related refunds.
-   **SQL demonstration:** Explore example SQL queries and database
    views for academic evaluation.
-   **Demo payment flow:** Demonstrate payment options without treating
    the simulator as a real payment gateway.

## Technology Stack

-   **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide Icons
-   **Backend:** Python, FastAPI, SQLAlchemy
-   **Database:** SQLite or MySQL
-   **API style:** REST

## Entity Relationship Diagram

The diagram below shows the main entities and relationships in the
GlobeTrek database.

![GlobeTrek Entity Relationship Diagram](docs/er-diagram.png)

*Diagram note: Use the ER diagram as the visual overview of the
database. Confirm table names, keys, and relationship cardinalities
against the implemented schema before submitting the final database
documentation.*

## Database Design

The database is designed around these main areas:

  -----------------------------------------------------------------------
  Area                                Main entities
  ----------------------------------- -----------------------------------
  Users and people                    Users, Customers, Travellers,
                                      Guides

  Tour catalogue                      TourPackages, Destinations,
                                      PackageDestinations, ItineraryDays,
                                      PackageHotels

  Travel operations                   Departures, Transport,
                                      GuideAssignments

  Reservations                        Bookings, BookingTravellers

  Financial records                   Payments, Cancellations, Refunds
  -----------------------------------------------------------------------

The design aims to reduce duplicate data and maintain referential
integrity using primary keys, foreign keys, validation rules, and
transactions where appropriate.

## Getting Started

### Prerequisites

-   Python 3.10 or newer
-   Node.js and npm
-   SQLite or MySQL

### Run the project

The exact commands depend on the folder structure and dependency files
in your repository.

1.  Clone or download this repository.
2.  Install the backend dependencies listed in the backend requirements
    file.
3.  Configure the database connection using the project's configuration
    or environment variables.
4.  Start the FastAPI backend using the instructions in the backend
    folder.
5.  Install frontend dependencies with `npm install` from the frontend
    folder.
6.  Start the frontend with the development command defined in
    `package.json`.
7.  Open the local frontend URL shown in the terminal.

## Database Integrity Rules

The application should enforce these business rules in the database
and/or backend:

-   A departure must not exceed its available capacity.
-   A guide must not be assigned to overlapping departures.
-   A booking must reference a valid departure and customer.
-   Traveller records must be linked to the relevant booking.
-   Refunds must not exceed the amount paid.
-   Cancellation charges should follow the project's defined
    cancellation policy.

## Academic Scope

This project demonstrates relational database design, normalization up
to Third Normal Form (3NF), CRUD operations, SQL queries and views, and
the use of a web application to interact with the database.

## Project Status

This README describes the intended project structure and features.
Update the setup instructions, database rules, and feature list to match
the final implementation before submission.

## License

Add the license used by your repository here. If the project is released
under the MIT License, include the full MIT license text in a `LICENSE`
file.
- **Enterprise SEO & AI-Readiness:**
  - Full server-rendered semantic HTML fallback for search engines and evaluators.
  - Schema.org JSON-LD structured data for `TravelAgency` and `WebSite`.
  - Machine-readable [`/llms.txt`](frontend/public/llms.txt) for AI search engines and crawler agents.
  - Auto-generated [`/robots.txt`](frontend/public/robots.txt) and [`/sitemap.xml`](frontend/public/sitemap.xml).

---

## 3. Relational Database Design (Normalized up to 3NF)

The database schema strictly adheres to **Third Normal Form (3NF)**:
- **1NF:** All attribute domains contain atomic values; repeating groups (destinations, itinerary days, travellers) are decomposed into independent entities.
- **2NF:** Every non-key attribute is fully functionally dependent on the primary key. All composite junction keys (`PackageDestinations`, `BookingTravellers`, `PackageHotels`) only contain attributes dependent on the whole key.
- **3NF:** No transitive dependencies between non-key attributes exist ($X \to Y \to Z$). Customer profiles, hotel coordinates, vehicle capacities, and refund amounts are decoupled from bookings and departures.

### The 20 Normalized Relational Tables:
1. `Users` — Authentication credentials, PBKDF2/bcrypt hashed passwords, and system roles.
2. `Customers` — Customer profile, phone, address, and emergency contact.
3. `Countries` — Worldwide nation registry (40+ countries across 6 continents).
4. `PackageCategories` — Master catalogue of standardized tourism categories.
5. `Destinations` — Global & Indian tourist hubs (Paris, Interlaken, Tokyo, Bali, Dubai, Goa, Kashmir, etc.).
6. `TourPackages` — Master tour catalog with curated packages, pricing, duration, and cancellation policies.
7. `PackageDestinations` — Many-to-Many junction linking tour routes sequentially.
8. `Hotels` — Certified partner properties, destination links, star ratings, and amenities.
9. `PackageHotels` — Many-to-Many association of contracted hotel room tiers.
10. `Transport` — Fleet vehicles and rail/water transit (Sedan, Innova, Luxury Coach, Houseboat, Shinkansen).
11. `Guides` — Multilingual licensed tour guide profiles, languages spoken, and experience.
12. `Departures` — Scheduled departure batches, capacity limits, and assigned guides/vehicles.
13. `ItineraryDays` — Day-by-day sightseeing schedule with unique constraint `(package_id, day_number)`.
14. `GuideAssignments` — Guide roster table preventing overlapping tour assignments.
15. `Bookings` — Customer reservations, unique reference code `GT-2026-XXXX`, and financial totals.
16. `Travellers` — Individual passenger identity records with ID proof numbers.
17. `BookingTravellers` — Junction allocating specific seats to travellers on a booking.
18. `Payments` — Financial payment audit trail, payment method, and simulated gateway states.
19. `Cancellations` — Booking cancellation audit, reasons, fee calculation, and refundable balance.
20. `Refunds` — Refund disbursement records enforcing constraint `refund_amount <= refundable_amount`.

---

## 4. SQL Views & Analytical Reports

### 5 Required Database Views:
- **`AvailableDeparturesView`**: Real-time view abstracting packages, start dates, total capacity, confirmed seats, and available seats remaining.
- **`BookingDetailsView`**: Customer invoice and ticket view joining customers, departures, packages, and payment transaction details.
- **`GuideScheduleView`**: Tour guide schedule view displaying assigned tour dates, vehicle plates, and passenger counts.
- **`MonthlyRevenueView`**: Financial view computing gross revenue, total refunds, and net earnings per calendar month.
- **`CancellationRefundView`**: Audit view of cancellations, policy fee deductions, and refund disbursement status.

### 14 Comprehensive SQL Queries:
Demonstrating `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, `HAVING`, subqueries, date intervals, and self-joins for guide conflict audits. See detailed queries in [`docs/SQL_QUERIES_AND_REPORTS.md`](docs/SQL_QUERIES_AND_REPORTS.md).

---

## 5. Instant Demo Credentials

For quick evaluation during college viva, use either the **Instant Demo Role Buttons** on the Login page or log in manually with:

| Role | Email Address | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Administrator (DBA)** | `admin@bharatyatra.com` | `Admin@123` | Analytics charts, manage packages/departures, execute 14 SQL reports |
| **Tour Guide** | `tashi.namgyal@bharatyatra.com` | `Guide@123` | Assigned tour rosters, passenger manifests, trip status updates |
| **Customer** | `rohit.sharma@example.com` | `Customer@123` | Search, book tours, demo payments, download vouchers, cancel/refund |

---

## 6. How to Run Locally

### Quick Launch (Single Command)
```bash
./start.sh
```
This automatically:
1. Verifies and seeds the SQLite database (`bharatyatra.db`) with 50+ destinations, packages, departures, guides, and bookings.
2. Starts the Python FastAPI backend on `http://127.0.0.1:8000`.
3. Starts the React + Vite frontend on `http://localhost:5173`.

### Manual Step-by-Step Instructions

#### 1. Backend Setup:
```bash
# In the project root
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
PYTHONPATH=. uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API documentation will be available at `http://127.0.0.1:8000/docs`.

#### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in any modern web browser.

#### 3. Running Automated Tests:
```bash
PYTHONPATH=. backend/venv/bin/pytest backend/tests -v
```
All **13 integrity tests** (capacity overbooking rejection, guide overlap conflict detection, unique day validation, cancellation capacity restoration, and email notification generation) will execute and report 100% pass status.

#### 4. Using MySQL / phpMyAdmin:
To import the schema into a MySQL server:
```bash
mysql -u root -p < backend/sql/schema_mysql.sql
mysql -u root -p bharatyatra_db < backend/sql/seed_data.sql
```

---

## 7. Deliverables & Academic Documentation

- [`docs/NORMALIZATION_3NF.md`](docs/NORMALIZATION_3NF.md): Complete functional dependency and anomaly elimination proofs.
- [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md): Mermaid Entity-Relationship diagram and cardinality mapping.
- [`docs/DATA_DICTIONARY.md`](docs/DATA_DICTIONARY.md): Complete attribute data dictionary and constraints.
- [`docs/SQL_QUERIES_AND_REPORTS.md`](docs/SQL_QUERIES_AND_REPORTS.md): Complete catalogue of 14 SQL queries and views.
- [`backend/sql/schema_mysql.sql`](backend/sql/schema_mysql.sql): MySQL/MariaDB DDL script.
- [`backend/sql/schema_sqlite.sql`](backend/sql/schema_sqlite.sql): SQLite DDL script.
- [`backend/sql/seed_data.sql`](backend/sql/seed_data.sql): Realistic worldwide & domestic demonstration dataset.

---

## 8. Git & GitHub Upload Instructions

To upload this repository to your GitHub account:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "feat: complete MakeMyTrip-inspired tourism booking platform with 3NF database"

# 4. Create a new empty repository on GitHub named 'globetrek-tourism-management'

# 5. Link and push to GitHub (replace with your GitHub username):
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/globetrek-tourism-management.git
git push -u origin main
```

---

## 9. Permanent Public Website Links & 24/7 Cloud Deployment

### Why Quick Tunnels Are Not Permanent
Temporary tunnels (like `trycloudflare.com`) assign a randomly changing URL every time they start, and they shut down immediately when your laptop sleeps or disconnects.

To have a **truly permanent link** that stays online 24/7 forever, choose either Cloud Deployment or a Fixed Subdomain:

### Method A: Free 24/7 Permanent Cloud Hosting on Render (Recommended)
This platform is pre-configured with `render.yaml` and `Dockerfile` to host the full stack (React + FastAPI + SQLite 3NF database) on a single port for **100% free**:
1. Push your code to your GitHub repository (see Section 8 above).
2. Go to **[render.com](https://render.com)** and sign in with GitHub.
3. Click **New +** > **Blueprint** (or **Web Service**).
4. Select your `globetrek-tourism-management` repository.
5. Render will automatically read `render.yaml`, build the frontend, install backend requirements, and assign you a permanent 24/7 URL like:
   `https://globetrek-tourism.onrender.com`
6. This URL never expires, has free automatic SSL (`https`), and stays active even when your laptop is turned off!

### Method B: Fixed Subdomain Tunnel (Local Machine)
If you want to keep running the application on your computer with a fixed link that does not change on restart:
```bash
./bin/permanent_link.sh globetrek-yatra 5173
```
This requests the fixed subdomain `https://globetrek-yatra.loca.lt` so your link remains consistent across restarts.
