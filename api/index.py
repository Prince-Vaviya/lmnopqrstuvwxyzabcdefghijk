import sys
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "backend"))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
frontend_dist = os.path.join(root_dir, "frontend", "dist")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

# Serve frontend build assets if they exist in dist
assets_dir = os.path.join(frontend_dist, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="static-assets")

# Catch-all route to serve index.html for React SPA
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    # Check if specific static file requested exists
    candidate = os.path.join(frontend_dist, full_path)
    if full_path and os.path.exists(candidate) and os.path.isfile(candidate):
        return FileResponse(candidate)
    
    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    return {"message": "AeroTrade UK API is online. Frontend static bundle not found.", "status": "api_only"}
