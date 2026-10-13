import time
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db
from backend.app.models import (
    Customer, Destination, TourPackage, Departure, Booking,
    Payment, Cancellation, Refund
)
from backend.app.auth import require_roles

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Calculates all admin statistics directly from database records."""
    total_customers = db.query(Customer).count()
    total_destinations = db.query(Destination).count()
    active_packages = db.query(TourPackage).filter(TourPackage.is_active == True).count()
    published_departures = db.query(Departure).filter(Departure.status.in_(["Published", "Confirmed"])).count()
    confirmed_bookings = db.query(Booking).filter(Booking.booking_status == "Confirmed").count()
    
    # Available seats calculation
    total_cap = db.execute(text("SELECT COALESCE(SUM(total_capacity), 0), COALESCE(SUM(confirmed_seats), 0) FROM Departures WHERE status IN ('Published', 'Confirmed')")).fetchone()
    available_seats = max(0, total_cap[0] - total_cap[1])

    # Revenue
    revenue_res = db.execute(text("SELECT COALESCE(SUM(amount), 0.0) FROM Payments WHERE payment_status = 'Successful'")).fetchone()
    total_revenue = float(revenue_res[0])

    pending_cancellations = db.query(Cancellation).filter(Cancellation.status == "Pending").count()
    pending_refunds = db.query(Refund).filter(Refund.refund_status == "Pending").count()

    return {
        "total_customers": total_customers,
        "total_destinations": total_destinations,
        "active_tour_packages": active_packages,
        "published_departures": published_departures,
        "confirmed_bookings": confirmed_bookings,
        "available_seats": available_seats,
        "total_revenue": total_revenue,
        "pending_cancellations": pending_cancellations,
        "pending_refunds": pending_refunds
    }

@router.get("/analytics-charts")
def get_analytics_charts(db: Session = Depends(get_db)):
    """Provides structured data for Recharts interactive visualizations."""
    
    # 1. Monthly revenue & bookings
    monthly_sql = text("""
        SELECT 
            strftime('%Y-%m', b.booking_date) AS month,
            COUNT(b.booking_id) AS bookings_count,
            COALESCE(SUM(b.net_amount), 0.0) AS revenue
        FROM Bookings b
        GROUP BY strftime('%Y-%m', b.booking_date)
        ORDER BY month ASC
    """)
    monthly_data = [dict(r) for r in db.execute(monthly_sql).mappings().all()]

    # 2. Destination Popularity (by travellers visited)
    dest_sql = text("""
        SELECT 
            d.name AS destination,
            COALESCE(SUM(b.traveller_count), 0) AS travellers_count
        FROM Destinations d
        JOIN PackageDestinations pd ON d.destination_id = pd.destination_id
        JOIN TourPackages p ON pd.package_id = p.package_id
        JOIN Departures dep ON p.package_id = dep.package_id
        LEFT JOIN Bookings b ON dep.departure_id = b.departure_id AND b.booking_status != 'Cancelled'
        GROUP BY d.name
        ORDER BY travellers_count DESC
        LIMIT 6
    """)
    dest_data = [dict(r) for r in db.execute(dest_sql).mappings().all()]

    # 3. Booking Status Distribution
    status_sql = text("""
        SELECT 
            booking_status AS name,
            COUNT(booking_id) AS value
        FROM Bookings
        GROUP BY booking_status
    """)
    status_data = [dict(r) for r in db.execute(status_sql).mappings().all()]

    # 4. Package Category Distribution
    category_sql = text("""
        SELECT 
            category AS name,
            COUNT(package_id) AS value
        FROM TourPackages
        GROUP BY category
    """)
    category_data = [dict(r) for r in db.execute(category_sql).mappings().all()]

    return {
        "monthly_trends": monthly_data,
        "destination_demand": dest_data,
        "booking_status_distribution": status_data,
        "category_distribution": category_data
    }

@router.get("/run-query")
def run_project_query(
    query_key: str = Query(..., description="Query ID or View name to execute"),
    db: Session = Depends(get_db)
):
    """Executes predefined 3NF SQL queries or views live against the database."""
    queries_registry = {
        "view_available_departures": {
            "title": "AvailableDeparturesView",
            "concept": "Real-time SQL View with departure capacity calculation",
            "sql": "SELECT * FROM AvailableDeparturesView LIMIT 15;"
        },
        "view_booking_details": {
            "title": "BookingDetailsView",
            "concept": "Multi-table SQL View joining Customers, Packages, and Payments",
            "sql": "SELECT * FROM BookingDetailsView LIMIT 15;"
        },
        "view_guide_schedule": {
            "title": "GuideScheduleView",
            "concept": "SQL View with guide assignments and tour dates",
            "sql": "SELECT * FROM GuideScheduleView LIMIT 15;"
        },
        "view_monthly_revenue": {
            "title": "MonthlyRevenueView",
            "concept": "Financial aggregation View tracking gross, refunds, and net revenue",
            "sql": "SELECT * FROM MonthlyRevenueView LIMIT 12;"
        },
        "view_cancellation_refund": {
            "title": "CancellationRefundView",
            "concept": "Audit View tracking cancellations and policy disbursements",
            "sql": "SELECT * FROM CancellationRefundView LIMIT 15;"
        },
        "q1_packages_catalog": {
            "title": "Q1: Available Tour Packages with Destinations",
            "concept": "INNER JOIN, GROUP_CONCAT, Filtering",
            "sql": """
                SELECT 
                    p.package_id,
                    p.title AS package_name,
                    p.category,
                    p.duration_days || 'D / ' || p.duration_nights || 'N' AS duration,
                    p.base_price AS starting_price_inr,
                    GROUP_CONCAT(d.name, ' -> ') AS route_destinations
                FROM TourPackages p
                JOIN PackageDestinations pd ON p.package_id = pd.package_id
                JOIN Destinations d ON pd.destination_id = d.destination_id
                WHERE p.is_active = 1
                GROUP BY p.package_id
                ORDER BY p.base_price ASC;
            """
        },
        "q6_guide_conflicts": {
            "title": "Q6: Guide Schedule Overlap Detection",
            "concept": "Self-Join, Date interval intersection logic",
            "sql": """
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
                WHERE d1.status != 'Cancelled' AND d2.status != 'Cancelled'
                  AND d1.start_date <= d2.end_date
                  AND d1.end_date >= d2.start_date;
            """
        },
        "q7_package_revenue": {
            "title": "Q7: Total Bookings & Revenue per Package",
            "concept": "LEFT JOIN, COUNT, SUM, GROUP BY",
            "sql": """
                SELECT 
                    p.package_id,
                    p.title AS package_name,
                    p.category,
                    COUNT(b.booking_id) AS total_bookings_count,
                    COALESCE(SUM(b.traveller_count), 0) AS total_passengers,
                    COALESCE(SUM(b.net_amount), 0.0) AS total_revenue_inr
                FROM TourPackages p
                LEFT JOIN Departures d ON p.package_id = d.package_id
                LEFT JOIN Bookings b ON d.departure_id = b.departure_id AND b.booking_status IN ('Confirmed', 'Completed')
                GROUP BY p.package_id
                ORDER BY total_revenue_inr DESC;
            """
        },
        "q8_popular_destinations": {
            "title": "Q8: Most Popular Tourist Destinations",
            "concept": "M:N traversal, COUNT(DISTINCT), Aggregation",
            "sql": """
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
                GROUP BY dest.destination_id
                ORDER BY total_travellers_visited DESC;
            """
        },
        "q13_nearing_capacity": {
            "title": "Q13: Departures Nearing Capacity (>= 80%)",
            "concept": "HAVING clause with mathematical threshold",
            "sql": """
                SELECT 
                    d.departure_id,
                    p.title AS tour_title,
                    d.start_date,
                    d.total_capacity,
                    d.confirmed_seats,
                    (d.total_capacity - d.confirmed_seats) AS seats_remaining,
                    ROUND(((CAST(d.confirmed_seats AS FLOAT) / d.total_capacity) * 100), 1) AS occupancy_rate
                FROM Departures d
                JOIN TourPackages p ON d.package_id = p.package_id
                WHERE d.status IN ('Published', 'Confirmed')
                GROUP BY d.departure_id
                HAVING (CAST(d.confirmed_seats AS FLOAT) / d.total_capacity) >= 0.70
                ORDER BY occupancy_rate DESC;
            """
        }
    }

    item = queries_registry.get(query_key)
    if not item:
        raise HTTPException(status_code=400, detail=f"Invalid query key. Supported keys: {list(queries_registry.keys())}")

    start_time = time.time()
    result = db.execute(text(item["sql"]))
    rows = [dict(r) for r in result.mappings().all()]
    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    columns = list(rows[0].keys()) if rows else []

    return {
        "query_key": query_key,
        "title": item["title"],
        "concept": item["concept"],
        "sql": item["sql"].strip(),
        "execution_time_ms": elapsed_ms,
        "row_count": len(rows),
        "columns": columns,
        "data": rows
    }
