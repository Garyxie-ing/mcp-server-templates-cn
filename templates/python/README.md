# Example MCP Server — Python Template

[English below](#english)

一个开箱即用的 MCP Server 模板（Python），用官方 MCP Python SDK 2.x（`MCPServer`，即 FastMCP 的后继，同样的装饰器写法），Streamable HTTP 传输，带简单的 API Key 鉴权、演示工具与资源、测试和 Docker 部署。

## 这是什么 / What is it

- **传输**：Streamable HTTP（`POST /mcp`），由 uvicorn 提供服务。
- **鉴权**：请求头 `x-api-key` 必须与环境变量 `API_KEY` 一致，否则返回 401。没设 `API_KEY` 时鉴权关闭，仅供本地演示。
- **演示内容**：
  - 工具 `echo`：把收到的消息原样返回。
  - 工具 `demo_weather`：返回**静态示例数据**（不是真实天气），接入真实天气 API 前请替换它。
  - 资源 `example://greeting`：一段静态问候文本。

## 快速开始

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # 填入 API_KEY（生产环境必须设一个强随机值）
python server.py       # 默认监听 http://localhost:8000/mcp
```

## 测试

```bash
pip install -r requirements-dev.txt
python -m pytest -v
```

测试分两层：直接调用工具/资源函数的单元测试；用 httpx + ASGI 传输驱动真实应用的 HTTP 测试，覆盖无 key 返回 401、错 key 返回 401、initialize → tools/list → tools/call → resources/read 全流程。

注意：测试里用的 base URL 必须是带端口的 `http://localhost:8000`，因为 SDK 2.x 的 DNS 重绑定防护只放行 `localhost:*` / `127.0.0.1:*` 这类带端口的 Host。

## 改成你自己的工具

1. 打开 `server.py`，用 `@mcp.tool()` 加工具（函数签名即参数定义，docstring 即工具说明），用 `@mcp.resource("example://...")` 加资源。
2. 改名：改 `MCPServer("example-mcp-server", version="0.1.0")` 和 `pyproject.toml` 里的 `name` / `version`。
3. 鉴权在 `ApiKeyMiddleware`，启动逻辑在文件末尾的 `__main__` 部分。

## Docker 部署

```bash
docker build -t example-mcp-server .
docker run -p 8000:8000 -e API_KEY=your-strong-key example-mcp-server
```

docker-compose：

```yaml
services:
  mcp-server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - API_KEY=${API_KEY:?set API_KEY in .env}
    restart: unless-stopped
```

## 客户端怎么连

以 Claude Code 为例（Streamable HTTP）：

```bash
claude mcp add example-mcp-server --transport http http://localhost:8000/mcp --header "x-api-key: your-strong-key"
```

---

## English

A ready-to-use MCP Server template (Python) built with the official MCP Python SDK 2.x (`MCPServer`, the successor of `FastMCP`, same decorator style), Streamable HTTP transport, simple API key auth, demo tool and resource, tests, and Docker deployment.

- **Transport**: Streamable HTTP (`POST /mcp`), served by uvicorn.
- **Auth**: the `x-api-key` header must match the `API_KEY` environment variable, otherwise the server returns 401. If `API_KEY` is not set, auth is disabled (local demos only).
- **Demo content**: tool `echo` (echoes your message), tool `demo_weather` (returns **static example data** — replace it with a real weather API), resource `example://greeting` (static greeting text).

Quick start: `python3 -m venv .venv`, `source .venv/bin/activate`, `pip install -r requirements.txt`, copy `.env.example` to `.env`, `python server.py` (listens on `http://localhost:8000/mcp` by default). Run tests with `pip install -r requirements-dev.txt` then `python -m pytest -v`. To add your own tools, edit `server.py` with `@mcp.tool()` / `@mcp.resource()`. Docker: `docker build -t example-mcp-server .` then `docker run -p 8000:8000 -e API_KEY=your-strong-key example-mcp-server`.
