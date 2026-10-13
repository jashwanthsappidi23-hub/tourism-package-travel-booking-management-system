import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health_and_root():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_destinations_listing():
    res = client.get("/api/destinations")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 10
    dest_names = [d["name"] for d in data]
    assert "Goa" in dest_names
    assert "Kashmir" in dest_names
    assert "Manali" in dest_names

def test_packages_filtering():
    # Filter by category
    res = client.get("/api/packages?category=Beach")
    assert res.status_code == 200
    beach_pkgs = res.json()
    assert len(beach_pkgs) >= 1
    assert beach_pkgs[0]["category"] == "Beach"

    # Filter by search
    res = client.get("/api/packages?search=Kashmir")
    assert res.status_code == 200
    kash_pkgs = res.json()
    assert len(kash_pkgs) >= 1
    assert "Kashmir" in kash_pkgs[0]["title"]

def test_demo_login_and_me():
    res = client.post("/api/auth/demo-login/admin")
    assert res.status_code == 200
    token = res.json()["access_token"]

    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["role"] == "Administrator"

def test_dashboard_stats_and_sql_runner():
    res = client.get("/api/reports/dashboard-stats")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_destinations"] >= 10
    assert stats["active_tour_packages"] >= 15
    assert stats["total_revenue"] > 0

    # Test Live SQL View Runner
    view_res = client.get("/api/reports/run-query?query_key=view_available_departures")
    assert view_res.status_code == 200
    view_data = view_res.json()
    assert view_data["row_count"] > 0
    assert "available_seats" in view_data["columns"]

def test_worldwide_destinations_and_packages():
    # Verify 50+ worldwide destinations
    res = client.get("/api/destinations")
    assert res.status_code == 200
    destinations = res.json()
    assert len(destinations) >= 50
    dest_names = [d["name"] for d in destinations]
    assert "Paris" in dest_names
    assert "Interlaken and Lucerne" in dest_names
    assert "Tokyo and Kyoto" in dest_names
    assert "Bali" in dest_names
    assert "Dubai" in dest_names
    assert "New York" in dest_names
    assert "Sydney" in dest_names
    assert "Cape Town" in dest_names
    assert "Rio de Janeiro" in dest_names
    assert "Petra" in dest_names

    # Filter by continent
    europe_res = client.get("/api/destinations?continent=Europe")
    assert europe_res.status_code == 200
    europe_dests = europe_res.json()
    assert any(d["name"] == "Paris" for d in europe_dests)
    assert any(d["name"] == "Rome" for d in europe_dests)

    # Verify worldwide packages from Section 1
    pkg_res = client.get("/api/packages?search=Paris")
    assert pkg_res.status_code == 200
    paris_pkgs = pkg_res.json()
    assert len(paris_pkgs) >= 1
    assert paris_pkgs[0]["title"] == "Paris Romantic Getaway"
    assert paris_pkgs[0]["base_price"] == 75000.0

    swiss_res = client.get("/api/packages?search=Swiss")
    assert swiss_res.status_code == 200
    swiss_pkgs = swiss_res.json()
    assert len(swiss_pkgs) >= 1
    assert swiss_pkgs[0]["title"] == "Swiss Alps Adventure"
    assert swiss_pkgs[0]["base_price"] == 150000.0

def test_countries_and_categories_endpoints():
    # Verify countries
    c_res = client.get("/api/resources/countries")
    assert c_res.status_code == 200
    countries = c_res.json()
    assert len(countries) >= 35
    c_names = [c["country_name"] for c in countries]
    assert "France" in c_names
    assert "Japan" in c_names
    assert "Switzerland" in c_names

    # Verify categories
    cat_res = client.get("/api/resources/categories")
    assert cat_res.status_code == 200
    categories = cat_res.json()
    assert len(categories) >= 14
    cat_names = [c["name"] for c in categories]
    assert "Adventure tourism" in cat_names
    assert "Eco-tourism" in cat_names
