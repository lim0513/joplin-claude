# Joplin Aide

在 [Joplin](https://joplinapp.org/) 里和 Claude 对话——Claude 可以读取、搜索、创建、编辑你的笔记和笔记本,由你本机安装的 [Claude Code](https://claude.com/claude-code) CLI 驱动。

[English](README.md)


## 功能

- **对话面板** — 侧边栏面板,流式回复、工具调用状态条,头部实时显示 Claude 将针对的当前笔记
- **完整的笔记工具** — 列出/搜索/读取笔记和笔记本,创建笔记与笔记本,更新、删除笔记
- **写操作确认** — 所有创建/修改/删除都要在面板里确认,支持按请求类型"本会话内一直允许";另有默认关闭的(危险)AUTO MODE 全自动模式
- **动态工具授权** — 放行清单(默认 WebSearch/WebFetch)之外的工具会弹确认卡,而不是被静默拒绝
- **会话历史** — 🕐 按钮列出历史对话,加载后恢复完整记录并接回原会话继续聊
- **用你的 Claude Code 登录** — 无需管理 API key,走 `claude` CLI 和你的现有订阅
- **多语言** — 英文、简体中文、日语(跟随 Joplin 语言设置)

## 工作原理

MCP 代理是随插件内置的零依赖脚本,由 Claude Code 用 **Joplin 自带的 Electron 运行时**启动(`ELECTRON_RUN_AS_NODE=1`),用户无需单独安装 Node.js。所有工具调用转发到插件的本地控制服务,真正的读写通过 Joplin data API 完成——写操作在这里等待用户确认。

## 安装

1. 从 [最新 Release](https://github.com/lim0513/joplin-aide/releases/latest) 下载 `plugin.jpl`
2. Joplin → **工具 → 选项 → 插件**
3. 点击齿轮图标,选择**从文件安装**
4. 选中下载的 `.jpl`,重启 Joplin

## 环境要求

- Joplin 桌面版 2.8+
- 已安装并登录 [Claude Code](https://claude.com/claude-code) CLI(`claude` 在 PATH 上,或在设置里填完整路径)

## 开发

```bash
npm install
npm run dist
```

`dist/` 可通过 Joplin 的 **Development plugins** 设置加载(指向项目根目录);`publish/plugin.jpl` 为安装包。

## 致谢

与 [Claude](https://claude.com)(Anthropic)联合开发。

## 许可

MIT
