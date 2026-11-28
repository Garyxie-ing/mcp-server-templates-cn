# 更新日志 / Changelog

## Unreleased

- `registry/tools.yaml`：新增 `media` 分类与 B站 `bilibili-mcp` 条目（视频搜索、字幕/弹幕、评论、热门榜、UP主数据；扫码登录），目录共 12 条（中文场景 8 条）。

## 0.1.0 — 2026-11-27

首版。

- `templates/typescript/`：TypeScript MCP Server 模板（官方 TS SDK 1.32.2，Streamable HTTP 无状态模式，API Key 鉴权，演示工具 `echo` / `demo_weather`，演示资源 `example://greeting`，vitest 测试 7 个全部通过，Dockerfile + docker-compose 说明）。
- `templates/python/`：Python MCP Server 模板（官方 Python SDK 2.3.0，`MCPServer`，Streamable HTTP，API Key 鉴权，同款演示工具与资源，pytest 测试 6 个全部通过，Dockerfile + docker-compose 说明）。
- `registry/tools.yaml`：中文场景优先的 MCP 工具目录，首批收录 11 条（中文场景 7 条：高德地图、飞书 / Lark、钉钉文档、快递100、OFD 电子发票、12306、语雀；国际对照 4 条：Filesystem、Fetch、Memory、GitHub），全部逐条核实、URL 全部返回 200。
- 未收录：企业微信（未找到专用 MCP Server）、政务查询（未找到），不写占位条目。
