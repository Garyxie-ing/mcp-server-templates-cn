# MCP Server Templates + Chinese Ecosystem Registry

> Fork first, then adapt a template.

In one sentence: MCP (Model Context Protocol) is an open protocol that lets AI applications call external tools and data. This repo gives you two ready-to-run MCP Server templates, plus a registry of MCP tools focused on Chinese services — verified real projects only.

[Read this in Chinese （中文版）](README.md)

## What's inside

```
mcp-server-templates-cn/
├── templates/
│   ├── typescript/   # TypeScript template: official TS SDK, Streamable HTTP, API key auth, vitest tests, Docker
│   └── python/       # Python template: official Python SDK 2.x (MCPServer), Streamable HTTP, API key auth, pytest tests, Docker
├── registry/
│   ├── tools.yaml    # MCP tool registry, Chinese services first (verified real projects only)
│   └── README.md     # Registry format and how to contribute
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

## How to use the templates

Both templates have the same structure: a demo tool `echo`, a demo tool `demo_weather` (static sample data, not real weather), and a demo resource `example://greeting`. Both use Streamable HTTP transport with API key auth (request header `x-api-key`; missing key returns 401).

**TypeScript (official TS SDK 1.32.2):**

```bash
cd templates/typescript
npm install
cp .env.example .env   # fill in API_KEY
npm run build
npm start              # http://localhost:3000/mcp
npm test               # 7 tests: auth unit tests + end-to-end tests with a real MCP client
```

**Python (official Python SDK 2.3.0):**

```bash
cd templates/python
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in API_KEY
python server.py       # http://localhost:8000/mcp
pip install -r requirements-dev.txt && python -m pytest -v   # 6 tests
```

To make it your own service: open `src/server.ts` (TypeScript) or `server.py` (Python) and replace `echo` / `demo_weather` with your tools and `example://greeting` with your resource. Each template's README has more detail and Docker deployment instructions.

Connecting a client (Claude Code example):

```bash
claude mcp add example-mcp-server --transport http http://localhost:3000/mcp --header "x-api-key: your-strong-key"
```

## How to browse the registry

`registry/tools.yaml` is an MCP tool registry with Chinese services first — 12 entries as of 2026-11-28 (verified one by one): 8 Chinese services — Amap, Feishu / Lark (official), DingTalk Docs, Kuaidi100 (official), OFD e-invoice, 12306 train-ticket lookup, Yuque (official), Bilibili — plus 4 international references: Filesystem, Fetch, Memory (official reference implementations), GitHub (official).

Inclusion rule: only real, verifiable projects; every URL must open. Nothing is invented and no placeholder entries are written. **Categories with no real MCP Server found are not listed**: WeChat Work (no dedicated Server found) and government-service queries (none found). To add an entry, follow the process in `registry/README.md` and open a PR.

## Contributing

PRs are welcome: add registry entries, add new templates, fix docs. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT — see [LICENSE](LICENSE).

## Related projects

- [GEO Website Template](https://github.com/Garyxie-ing/geo-website-template) — a forkable brand website template optimised for AI search
- [Multi-AI Workbench](https://github.com/Garyxie-ing/multi-ai-workbench) — manage tasks, prompts and resources across multiple AIs in one interface, zero API cost
