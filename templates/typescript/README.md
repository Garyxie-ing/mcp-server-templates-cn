# Example MCP Server — TypeScript Template

[English below](#english)

一个开箱即用的 MCP Server 模板（TypeScript），用 Streamable HTTP 传输，带简单的 API Key 鉴权、演示工具与资源、测试和 Docker 部署。

## 这是什么 / What is it

- **传输**:Streamable HTTP（无状态模式），不用已废弃的 SSE 传输。
- **鉴权**:请求头 `x-api-key` 必须与环境变量 `API_KEY` 一致，否则返回 401。没设 `API_KEY` 时鉴权关闭，仅供本地演示。
- **演示内容**:
  - 工具 `echo`：把收到的消息原样返回。
  - 工具 `demo_weather`：返回**静态示例数据**（不是真实天气），接入真实天气 API 前请替换它。
  - 资源 `example://greeting`：一段静态问候文本。

## 快速开始

```bash
npm install
cp .env.example .env   # 填入 API_KEY（生产环境必须设一个强随机值）
npm run build
npm start              # 默认监听 http://localhost:3000/mcp
```

开发模式（改完自动重启，需先 build 一次）：

```bash
npm run dev
```

## 测试

```bash
npm test
```

测试用真实的 MCP 客户端（SDK 的 `Client` + `StreamableHTTPClientTransport`）连本地服务，覆盖：无 key 返回 401、错 key 返回 401、列出工具、调用 `echo` / `demo_weather`、读取问候资源；另有鉴权函数的单元测试。

## 改成你自己的工具

1. 打开 `src/server.ts`，在 `createMcpServer()` 里用 `server.tool(name, description, zodSchema, handler)` 加工具，用 `server.resource(name, uri, handler)` 加资源。
2. 改名：在 `src/server.ts` 里改 `name` / `version`，在 `package.json` 里改 `name`。
3. 鉴权在 `src/auth.ts`，传输与启动逻辑在 `src/index.ts`。

## Docker 部署

```bash
docker build -t example-mcp-server .
docker run -p 3000:3000 -e API_KEY=your-strong-key example-mcp-server
```

docker-compose：

```yaml
services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=${API_KEY:?set API_KEY in .env}
    restart: unless-stopped
```

## 客户端怎么连

以 Claude Code 为例（Streamable HTTP）：

```bash
claude mcp add example-mcp-server --transport http http://localhost:3000/mcp --header "x-api-key: your-strong-key"
```

---

## English

A ready-to-use MCP Server template (TypeScript) with Streamable HTTP transport, simple API key auth, demo tool and resource, tests, and Docker deployment.

- **Transport**: Streamable HTTP (stateless mode). The old SSE transport is not used.
- **Auth**: the `x-api-key` header must match the `API_KEY` environment variable, otherwise the server returns 401. If `API_KEY` is not set, auth is disabled (local demos only).
- **Demo content**: tool `echo` (echoes your message), tool `demo_weather` (returns **static example data** — replace it with a real weather API), resource `example://greeting` (static greeting text).

Quick start: `npm install`, copy `.env.example` to `.env`, `npm run build`, `npm start` (listens on `http://localhost:3000/mcp` by default). Run tests with `npm test`. To add your own tools, edit `createMcpServer()` in `src/server.ts`. Docker: `docker build -t example-mcp-server .` then `docker run -p 3000:3000 -e API_KEY=your-strong-key example-mcp-server`.
