"""Example MCP Server template (Python).

Built with the official MCP Python SDK 2.x: ``MCPServer`` (the successor
of ``FastMCP`` — same decorator style: ``@mcp.tool()`` / ``@mcp.resource()``).

Demo content (replace with your own tools):
- Tool ``echo``: returns the message it receives.
- Tool ``demo_weather``: returns STATIC example data for "Example City".
  It does NOT call a real weather API. Replace the body with a real
  provider (e.g. Open-Meteo, Amap) before using it for real.
- Resource ``example://greeting``: a short static greeting text.

Auth: if the ``API_KEY`` environment variable is set (non-empty), every
request must carry the same value in the ``x-api-key`` header, otherwise
it is rejected with 401. If ``API_KEY`` is not set, auth is disabled
(local development only) and a warning is printed at startup.

Transport: Streamable HTTP (``/mcp``), served by uvicorn.
"""

import os

from mcp.server import MCPServer
from starlette.applications import Starlette
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

DEFAULT_PORT = 8000

mcp = MCPServer("example-mcp-server", version="0.1.0")


class ApiKeyMiddleware(BaseHTTPMiddleware):
    """Reject requests without a matching ``x-api-key`` header (401)."""

    async def dispatch(self, request: Request, call_next):
        expected = os.environ.get("API_KEY")
        if expected:
            provided = request.headers.get("x-api-key")
            if provided != expected:
                return JSONResponse(
                    {"error": "Unauthorized: missing or invalid x-api-key header"},
                    status_code=401,
                )
        return await call_next(request)


@mcp.tool()
def echo(message: str) -> str:
    """Echo back the message you send. Useful to check the server works."""
    return f"Echo: {message}"


@mcp.tool()
def demo_weather(city: str) -> str:
    """Demo weather lookup. Returns STATIC example data only; wire in a real weather API before production use."""
    return (
        f"Demo data for {city} (not live): sunny, 25°C, humidity 40%. "
        "Replace demo_weather with a real weather API before production use."
    )


@mcp.resource("example://greeting")
def greeting() -> str:
    """A short static greeting text."""
    return (
        "Hello from the example MCP server! "
        "This is a demo resource. Replace it with your own data source."
    )


def create_app() -> Starlette:
    """Build the Starlette app: MCPServer Streamable HTTP + API key auth."""
    app = mcp.streamable_http_app()
    app.add_middleware(ApiKeyMiddleware)
    return app


if __name__ == "__main__":
    import uvicorn

    if not os.environ.get("API_KEY"):
        print(
            "WARNING: API_KEY is not set, auth is disabled. "
            "Set API_KEY before production use."
        )
    port = int(os.environ.get("PORT", str(DEFAULT_PORT)))
    uvicorn.run(create_app(), host="0.0.0.0", port=port)
