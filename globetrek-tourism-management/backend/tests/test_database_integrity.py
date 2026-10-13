import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def get_admin_token():
    res = client.post("/api/auth/demo-login/admin")
    assert res.status_code == 200
    return res.json()["access_token"]

def get_customer_token():
    res = client.post("/api/auth/demo-login/customer")
    assert res.status_code == 200
    return res.json()["access_token"]

def test_prevent_overbooking():
    """Verifies the DBMS capacity rule: Booked travellers must not exceed departure capacity."""
    token = get_customer_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Departure 1 has total_capacity 20, confirmed_seats 14 -> available 6
    # Attempting to book 10 travellers should fail with 400
    excessive_travellers = [
        {"full_name": f"Traveller {i}", "age": 25, "gender": "Male"}
        for i in range(10)
    ]
    response = client.post("/api/bookings", json={
        "departure_id": 1,
        "travellers": excessive_travellers
    }, headers=headers)

    assert response.status_code == 400
    assert "Capacity Exceeded" in response.json()["detail"]

def test_prevent_guide_schedule_conflict():
    """Verifies that a guide cannot be assigned to overlapping departures."""
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Guide 1 is assigned to Departure 1 (2026-11-05 to 2026-11-10)
    # Attempting to schedule Guide 1 on an overlapping date (2026-11-08 to 2026-11-14) must fail
    response = client.post("/api/departures", json={
        "package_id": 2,
        "start_date": "2026-11-08",
        "end_date": "2026-11-14",
        "total_capacity": 15,
        "guide_id": 1,
        "status": "Published"
    }, headers=headers)

    assert response.status_code == 400
    assert "Scheduling Conflict" in response.json()["detail"]

def test_prevent_duplicate_itinerary_day():
    """Verifies UNIQUE constraint on (package_id, day_number)."""
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Package 1 already has day 1
    response = client.post("/api/itineraries", json={
        "package_id": 1,
        "day_number": 1,
        "title": "Duplicate Day",
        "activities": "This should fail due to unique day constraint"
    }, headers=headers)

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_cancellation_and_capacity_restoration():
    """Verifies that cancelling a booking releases capacity back to the departure."""
    token = get_customer_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Book 2 seats on Departure 2 (capacity 20, was 8 -> now 10)
    dep_before = client.get("/api/departures/2").json()
    seats_before = dep_before["confirmed_seats"]

    booking_res = client.post("/api/bookings", json={
        "departure_id": 2,
        "travellers": [
            {"full_name": "Test Passenger 1", "age": 30, "gender": "Female"},
            {"full_name": "Test Passenger 2", "age": 32, "gender": "Male"}
        ]
    }, headers=headers)
    assert booking_res.status_code == 201
    booking_data = booking_res.json()
    booking_id = booking_data["booking_id"]

    dep_after = client.get("/api/departures/2").json()
    assert dep_after["confirmed_seats"] == seats_before + 2

    # 2. Cancel the booking
    cancel_res = client.post("/api/cancellations", json={
        "booking_id": booking_id,
        "reason": "Test automated cancellation flow"
    }, headers=headers)
    assert cancel_res.status_code == 201

    # 3. Verify confirmed_seats returned to previous value
    dep_restored = client.get("/api/departures/2").json()
    assert dep_restored["confirmed_seats"] == seats_before
