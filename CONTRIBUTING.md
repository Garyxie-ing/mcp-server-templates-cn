# 贡献指南 / Contributing

欢迎贡献！这个仓库接受三类贡献：目录条目、新模板、文档与修 bug。

## 基本规则

- 所有改动都走 Pull Request，不要直接推 main。
- 一个 PR 只做一件事（一条目录条目、一个模板、一次修 bug）。
- 不要提交 `node_modules/`、`__pycache__/`、`.venv/`、`dist/`、`.env`、构建产物。
- 示例里的人名、公司、API Key 一律用 `example` / `test` / 占位值，不要放真实私人信息。

## 加目录条目

1. Fork 本仓库，在 `registry/tools.yaml` 末尾按同样格式追加一条。
2. 自查清单（缺一不可）：
   - `url` 能打开，指向真实仓库或官网；
   - `description` / `description_en` 各一句话，写清它能干什么、需要什么凭证；
   - `language` 与仓库实际主要语言一致；
   - `category` 用 `registry/README.md` 列表里的值，不要新造分类；
   - `status` 是 `official` 还是 `community` 要如实写。
3. YAML 语法检查：`python3 -c "import yaml; yaml.safe_load(open('registry/tools.yaml'))"`。
4. 发 PR，标题写 `registry: add <name>`，正文一句话说明这个工具是干什么的。

只有符合收录标准的条目会被合并；无法验证的、只有占位链接的不会合并。

## 加新模板

1. 在 `templates/` 下新建一个目录，名字用小写短横线，例如 `templates/go/`。
2. 新模板必须包含：
   - 能真实运行的最小服务（含至少一个工具和一个资源）；
   - 鉴权（至少做到本仓库现有模板同等水平：API Key + 401）；
   - 测试，且测试必须真实跑通（在 PR 里贴出运行命令和结果）；
   - `Dockerfile`；
   - `README.md`（中英双语简要说明：怎么用、怎么改工具、怎么跑测试、怎么部署）；
   - `.env.example`（只放占位值）。
3. 在根 `README.md` 的结构图和模板列表里加上新模板，在 `CHANGELOG.md` 里记一笔。
4. 发 PR，标题写 `template: add <name>`。

## 修文档 / 修 bug

- 直接提 PR，标题写清改了什么，例如 `docs: fix <问题>` 或 `fix: <问题>`。
- 改代码的话，先在本地跑通相关模板的测试再提交。

## 提 Issue

- 缺工具、模板跑不通、文档写错了，都可以提 Issue。
- 提 Issue 时请写清：你用的模板、运行环境（Node/Python 版本）、复现步骤、期望结果和实际结果。
