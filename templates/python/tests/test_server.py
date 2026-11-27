"""Tests for the Python example MCP server.

Two layers:
1. Unit tests: call the tool/resource functions directly.
2. HTTP tests: drive the real Starlette app with httpx ASGI transport —
   JSON-RPC over Streamable HTTP, covering auth (401 without/wrong key)
   and the full initialize -> tools/list -> tools/call -> resources/read flow.
"""

import json
import os

import httpx
import pytest

os.environ["API_KEY"] = "test-key-123"

from server import create_app, demo_weather, echo, greeting  # noqa: E402

API_KEY = "test-key-123"


# ---------------------------------------------------------------- unit tests
def test_echo_returns_message():
    assert echo("hello") == "Echo: hello"


def test_demo_weather_is_labelled_demo():
    text = demo_weather("Example City")
    assert "Demo data for Example City" in text
    assert "not live" in text


def test_greeting_resource():
    assert "Hello from the example MCP server!" in greeting()


# ------------------------------------------------------------ HTTP tests
def parse_response(resp: httpx.Response) -> dict:
    """Parse a Streamable HTTP response: plain JSON or SSE `data:` lines."""
    content_type = resp.headers.get("content-type", "")
    if "application/json" in content_type:
        return resp.json()
    payloads = []
    for line in resp.text.splitlines():
        if line.startswith("data: "):
            payloads.append(json.loads(line[6:]))
    assert payloads, f"no JSON-RPC payload in response: {resp.text[:500]!r}"
    return payloads[-1]


@pytest.fixture
async def client():
    # The Streamable HTTP session manager only starts inside the app's
    # lifespan, so run the lifespan around the whole HTTP session.
    from asgi_lifespan import LifespanManager

    app = create_app()
    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        # NOTE: the SDK's DNS-rebinding protection only allows hosts with a
        # port (localhost:* / 127.0.0.1:*), so the base URL needs ":8000".
        async with httpx.AsyncClient(transport=transport, base_url="http://localhost:8000") as c:
            yield c


async def mcp_request(client, payload, api_key=API_KEY, session_id=None):
    headers = {
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json",
    }
    if api_key is not None:
        headers["x-api-key"] = api_key
    if session_id:
        headers["mcp-session-id"] = session_id
    resp = await client.post("/mcp", json=payload, headers=headers)
    return resp


async def initialize(client):
    resp = await mcp_request(
        client,
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-03-26",
                "capabilities": {},
                "clientInfo": {"name": "test-client", "version": "0.1.0"},
            },
        },
    )
    assert resp.status_code == 200, resp.text[:500]
    data = parse_response(resp)
    assert data["result"]["serverInfo"]["name"] == "example-mcp-server"
    return resp.headers.get("mcp-session-id")


async def test_auth_missing_key_returns_401(client):
    resp = await mcp_request(client, {"jsonrpc": "2.0", "id": 1, "method": "ping"}, api_key=None)
    assert resp.status_code == 401


async def test_auth_wrong_key_returns_401(client):
    resp = await mcp_request(
        client, {"jsonrpc": "2.0", "id": 1, "method": "ping"}, api_key="wrong-key"
    )
    assert resp.status_code == 401


async def test_tools_list_and_call_and_resource_read(client):
    session_id = await initialize(client)

    resp = await mcp_request(
        client, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"}, session_id=session_id
    )
    assert resp.status_code == 200, resp.text[:500]
    tools = parse_response(resp)["result"]["tools"]
    names = sorted(t["name"] for t in tools)
    assert names == ["demo_weather", "echo"]

    resp = await mcp_request(
        client,
        {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {"name": "echo", "arguments": {"message": "hello"}},
        },
        session_id=session_id,
    )
    assert resp.status_code == 200, resp.text[:500]
    content = parse_response(resp)["result"]["content"]
    assert content[0]["text"] == "Echo: hello"

    resp = await mcp_request(
        client,
        {
            "jsonrpc": "2.0",
            "id": 4,
            "method": "tools/call",
            "params": {"name": "demo_weather", "arguments": {"city": "Example City"}},
        },
        session_id=session_id,
    )
    assert resp.status_code == 200, resp.text[:500]
    content = parse_response(resp)["result"]["content"]
    assert "Demo data for Example City" in content[0]["text"]

    resp = await mcp_request(
        client,
        {
            "jsonrpc": "2.0",
            "id": 5,
            "method": "resources/read",
            "params": {"uri": "example://greeting"},
        },
        session_id=session_id,
    )
    assert resp.status_code == 200, resp.text[:500]
    contents = parse_response(resp)["result"]["contents"]
    assert "Hello from the example MCP server!" in contents[0]["text"]
