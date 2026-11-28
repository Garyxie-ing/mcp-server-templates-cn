# MCP Server 脚手架模板 + 中文生态目录

[English](README.en.md)

> 想用就先 Fork，再按模板改。

一句话：MCP（Model Context Protocol）是让 AI 应用调用外部工具和数据的开放协议；这个仓库给你两个能直接跑的 MCP Server 模板，再加一份只收真实项目的中文场景工具目录。

## 里面有什么

```
mcp-server-templates-cn/
├── templates/
│   ├── typescript/   # TypeScript 模板：官方 TS SDK，Streamable HTTP，API Key 鉴权，vitest 测试，Docker
│   └── python/       # Python 模板：官方 Python SDK 2.x（MCPServer），Streamable HTTP，API Key 鉴权，pytest 测试，Docker
├── registry/
│   ├── tools.yaml    # 中文场景优先的 MCP 工具目录（只收核实过的真实项目）
│   └── README.md     # 目录格式与投稿方式
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

## 模板怎么用

两个模板结构相同，都有一个演示工具 `echo`、一个演示工具 `demo_weather`（静态示例数据，不是真实天气）和一个演示资源 `example://greeting`，都用 Streamable HTTP 传输，都带 API Key 鉴权（请求头 `x-api-key`，缺 key 返回 401）。

**TypeScript：**

```bash
cd templates/typescript
npm install
cp .env.example .env   # 填入 API_KEY
npm run build
npm start              # http://localhost:3000/mcp
npm test               # 7 个测试：鉴权单元测试 + 真实 MCP 客户端端到端测试
```

**Python：**

```bash
cd templates/python
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # 填入 API_KEY
python server.py       # http://localhost:8000/mcp
pip install -r requirements-dev.txt && python -m pytest -v   # 6 个测试
```

改成你自己的服务：打开模板里的 `src/server.ts`（TypeScript）或 `server.py`（Python），把 `echo` / `demo_weather` 换成你的工具，把 `example://greeting` 换成你的资源。两个模板的 README 里有更详细的说明和 Docker 部署方法。

客户端连接（以 Claude Code 为例）：

```bash
claude mcp add example-mcp-server --transport http http://localhost:3000/mcp --header "x-api-key: your-strong-key"
```

## 目录怎么查

`registry/tools.yaml` 是中文场景优先的 MCP 工具目录，目前收录 11 条（2026-11-27 核实），其中中文场景 7 条：高德地图、飞书 / Lark（官方）、钉钉文档、快递100（官方）、OFD 电子发票、12306 火车票查询、语雀（官方）；另有 4 条国际通用对照：Filesystem、Fetch、Memory（官方参考实现）、GitHub（官方）。

收录标准：只收真实可验证的项目，URL 必须能打开，不编造、不写占位条目。**未找到真实 MCP Server 的类别不收录**：企业微信（未找到专用 Server）、政务查询（未找到）。想加新条目按 `registry/README.md` 里的流程提 PR。

## 贡献

欢迎提 PR：加目录条目、加新模板、修文档。先读 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## English summary

MCP (Model Context Protocol) is an open protocol that lets AI applications call external tools and data. This repo gives you two ready-to-run MCP Server templates (TypeScript with the official TS SDK, Python with the official Python SDK 2.x) — both with Streamable HTTP transport, API key auth, demo tool and resource, tests, and Docker — plus a registry of MCP tools focused on Chinese services (`registry/tools.yaml`, verified entries only, 11 entries as of 2026-11-27).

**Fork this repo first, then adapt a template.** See each template's README for quick start, tests, and Docker deployment. Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
