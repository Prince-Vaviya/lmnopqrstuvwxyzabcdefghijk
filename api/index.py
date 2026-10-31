import sys
import os
import urllib.parse
from fastapi.responses import FileResponse, Response

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "backend"))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
dist_dir = os.path.join(root_dir, "frontend", "dist")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app as fastapi_app

async def app(scope, receive, send):
    if scope["type"] == "http":
        qs = scope.get("query_string", b"").decode("utf-8")
        parsed_qs = urllib.parse.parse_qsl(qs, keep_blank_values=True)
        
        target_path = None
        cleaned_params = []
        for k, v in parsed_qs:
            if k == "__path__":
                target_path = v
            else:
                cleaned_params.append((k, v))
        
        target_path = target_path or ""
        new_query_string = urllib.parse.urlencode(cleaned_params).encode("utf-8")
        
        # 1. API routes -> Delegate to FastAPI backend
        if target_path.startswith("api/"):
            clean_api_path = f"/{target_path}"
            scope["path"] = clean_api_path
            scope["raw_path"] = clean_api_path.encode("utf-8")
            scope["query_string"] = new_query_string
            await fastapi_app(scope, receive, send)
            return

        # 2. Static Assets (/assets/*, favicon.svg, etc.)
        candidate = os.path.join(dist_dir, target_path)
        if target_path and os.path.exists(candidate) and os.path.isfile(candidate):
            response = FileResponse(candidate)
            await response(scope, receive, send)
            return

        # 3. SPA Fallback -> index.html
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            response = FileResponse(index_file)
            await response(scope, receive, send)
            return

        response = Response(content="AeroTrade UK App Ready", media_type="text/plain")
        await response(scope, receive, send)
        return

    await fastapi_app(scope, receive, send)
