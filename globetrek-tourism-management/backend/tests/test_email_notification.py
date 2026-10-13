import os
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.email_service import send_booking_confirmation_email

client = TestClient(app)

def get_demo_token():
    res = client.post("/api/auth/demo-login/customer")
    return res.json()["access_token"]

def test_email_service_rendering():
    """Verify that email HTML and text render properly and create verification files."""
    dummy_booking = {
        "booking_reference": "BY-TEST-EMAIL-001",
        "package_title": "Grand Kashmir & Dal Lake Paradise",
        "category": "Honeymoon",
        "duration_days": 6,
        "start_date": "2026-11-15",
        "end_date": "2026-11-21",
        "customer_name": "Arjun Verma",
        "customer_phone": "+91 98765 43210",
        "guide_name": "Farooq Sheikh",
        "travellers": [
            {"full_name": "Arjun Verma", "age": 29, "gender": "Male", "seat_number": "T-1"},
            {"full_name": "Pooja Verma", "age": 28, "gender": "Female", "seat_number": "T-2"}
        ],
        "gross_fare": 75998.0,
        "discount_amount": 2500.0,
        "tax_amount": 3674.90,
        "net_amount": 77172.90,
        "year": 2026
    }
    
    res = send_booking_confirmation_email(dummy_booking, "arjun.verma@example.com")
    assert res["success"] is True
    assert res["recipient"] == "arjun.verma@example.com"
    
    # Check that latest_booking_email.html was generated
    html_file = os.path.join(os.path.dirname(__file__), "..", "latest_booking_email.html")
    assert os.path.exists(html_file)
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "BY-TEST-EMAIL-001" in content
    assert "Grand Kashmir & Dal Lake Paradise" in content
    assert "Arjun Verma" in content

def test_booking_and_resend_email_endpoint():
    """Verify booking creation and POST /api/bookings/{id}/send-email."""
    token = get_demo_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch available departure
    deps_res = client.get("/api/departures?status=Published", headers=headers)
    assert deps_res.status_code == 200
    departures = deps_res.json()
    dep = next((d for d in departures if d.get("available_seats", 0) > 0), departures[0])
    dep_id = dep["departure_id"]

    # Create a booking
    booking_data = {
        "departure_id": dep_id,
        "travellers": [
            {
                "full_name": "Kavita Rao",
                "age": 27,
                "gender": "Female",
                "id_proof_type": "Aadhaar",
                "id_proof_number": "9988-7766-5544",
                "phone": "+91 99112 23344"
            }
        ],
        "special_requests": "Window seat preferred"
    }
    create_res = client.post("/api/bookings", json=booking_data, headers=headers)
    assert create_res.status_code == 201
    booking = create_res.json()
    b_id = booking["booking_id"]
    ref = booking["booking_reference"]

    # Trigger resend email endpoint
    send_email_res = client.post(
        f"/api/bookings/{b_id}/send-email?recipient_email=kavita.rao@example.com",
        headers=headers
    )
    assert send_email_res.status_code == 200
    email_result = send_email_res.json()
    assert email_result["success"] is True
    assert email_result["recipient"] == "kavita.rao@example.com"

    # Verify latest_booking_email.html contains this newly booked ticket
    html_file = os.path.join(os.path.dirname(__file__), "..", "latest_booking_email.html")
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert ref in content
