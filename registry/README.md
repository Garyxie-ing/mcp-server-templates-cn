# MCP 工具目录 / Registry

中文场景优先的 MCP Server 目录。收录标准见 `tools.yaml` 文件头注释：**只收真实可验证的项目**，URL 必须能打开，不编造、不写占位条目。

## 目录格式

每条一个 YAML 对象，字段如下：

| 字段 | 说明 |
| --- | --- |
| `name` | 目录内唯一标识，小写短横线命名 |
| `description` | 中文一句话说明 |
| `description_en` | 英文一句话说明 |
| `category` | `maps` / `office` / `logistics` / `finance` / `travel` / `knowledge` / `filesystem` / `web` / `memory` / `devtools` |
| `url` | 仓库或官网地址（必须真实可打开） |
| `language` | 主要实现语言（以仓库 GitHub 语言统计为准） |
| `auth` | `none` / `api_key` / `oauth` / `token` |
| `status` | `official`（官方发布）/ `community`（社区维护） |

## 目前的覆盖情况（2026-11-27 核实）

已收录 11 条，其中中文场景 7 条：

- 地图：高德地图（社区版 + 官方托管端点）
- 办公协同：飞书 / Lark（官方）、钉钉文档、语雀（官方）
- 物流：快递100（官方）
- 发票：ofdkit（OFD 电子发票读取）
- 出行：12306 火车票查询

**未收录的类别（核实后确认无真实项目，暂留空）：**

- 企业微信：未找到专用的企业微信 MCP Server（只有群机器人消息推送类工具，不是企微 API 接入），未收录。
- 政务查询：未找到中国政务查询类 MCP Server，未收录。
- 如你知道符合标准的项目，欢迎按下面的流程提交。

## 如何提交新条目（提 PR）

1. Fork 本仓库，在 `registry/tools.yaml` 末尾按同样格式追加一条。
2. 提交前自查：
   - `url` 能打开，指向真实仓库或官网；
   - `description` / `description_en` 各一句话，写清它能干什么、需要什么凭证；
   - `language` 与仓库实际主要语言一致；
   - `category` 用上面列表里的值，不要新造分类。
3. YAML 语法检查：`python3 -c "import yaml,sys; yaml.safe_load(open('registry/tools.yaml'))"`（需安装 `pyyaml`），或用任意 YAML 校验工具。
4. 发 PR，标题写 `registry: add <name>`，正文里写一句话说明这个工具是干什么的。

只有符合收录标准的条目会被合并；无法验证的、只有占位链接的不会合并。
