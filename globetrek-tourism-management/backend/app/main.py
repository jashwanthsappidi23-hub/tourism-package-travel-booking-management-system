import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.config import settings
from backend.app.database import init_db
from backend.app.routers import (
    auth, destinations, packages, itineraries, departures,
    bookings, payments, cancellations, refunds, guides,
    resources, reports
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A full-stack tourism package and travel booking management system with 3NF relational database."
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(destinations.router, prefix=settings.API_PREFIX)
app.include_router(packages.router, prefix=settings.API_PREFIX)
app.include_router(itineraries.router, prefix=settings.API_PREFIX)
app.include_router(departures.router, prefix=settings.API_PREFIX)
app.include_router(bookings.router, prefix=settings.API_PREFIX)
app.include_router(payments.router, prefix=settings.API_PREFIX)
app.include_router(cancellations.router, prefix=settings.API_PREFIX)
app.include_router(refunds.router, prefix=settings.API_PREFIX)
app.include_router(guides.router, prefix=settings.API_PREFIX)
app.include_router(resources.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Serve Frontend static assets and SPA routes when frontend/dist is present
DIST_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
)

if os.path.isdir(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.api_route("/favicon.svg", methods=["GET", "HEAD"], include_in_schema=False)
    def favicon():
        fav_path = os.path.join(DIST_DIR, "favicon.svg")
        if os.path.exists(fav_path):
            return FileResponse(fav_path)
        return {"status": "not found"}

    @app.api_route("/robots.txt", methods=["GET", "HEAD"], include_in_schema=False)
    def robots():
        robots_path = os.path.join(DIST_DIR, "robots.txt")
        if os.path.exists(robots_path):
            return FileResponse(robots_path, media_type="text/plain")
        return {"status": "not found"}

    @app.api_route("/sitemap.xml", methods=["GET", "HEAD"], include_in_schema=False)
    def sitemap():
        sitemap_path = os.path.join(DIST_DIR, "sitemap.xml")
        if os.path.exists(sitemap_path):
            return FileResponse(sitemap_path, media_type="application/xml")
        return {"status": "not found"}

    @app.api_route("/llms.txt", methods=["GET", "HEAD"], include_in_schema=False)
    def llmstxt():
        candidates = [
            os.path.join(DIST_DIR, "llms.txt"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "llms.txt")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "llms.txt"))
        ]
        for path in candidates:
            if os.path.exists(path):
                return FileResponse(path, media_type="text/plain; charset=utf-8")
        return {"status": "not found"}

    @app.api_route("/llms-full.txt", methods=["GET", "HEAD"], include_in_schema=False)
    def llms_full():
        candidates = [
            os.path.join(DIST_DIR, "llms-full.txt"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "llms-full.txt")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "llms-full.txt"))
        ]
        for path in candidates:
            if os.path.exists(path):
                return FileResponse(path, media_type="text/plain; charset=utf-8")
        return {"status": "not found"}

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
    def serve_frontend(full_path: str):
        if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc"):
            return {"detail": "Not Found"}
        target_file = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        index_file = os.path.join(DIST_DIR, "index.html")
        return FileResponse(index_file)
else:
    @app.get("/")
    def root():
        return {
            "system": settings.PROJECT_NAME,
            "status": "online",
            "documentation": "/docs",
            "version": settings.VERSION
        }
