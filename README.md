# Joplin Claude

Chat with Claude inside [Joplin](https://joplinapp.org/) — Claude can read, search, create and edit your notes and notebooks, powered by your locally installed [Claude Code](https://claude.com/claude-code) CLI.

[中文说明](README-CN.md)

> **Status: early development.** No packaged release yet — build from source (see Development).

## Features

- **Chat panel** — a side panel with streaming replies, tool-activity chips, and a header showing which note Claude is targeting (updates live as you switch notes)
- **Full note access via tools** — list/search/read notes and notebooks, create notes and notebooks, update or delete notes
- **Write confirmation** — every create/update/delete waits for your Approve/Decline in the panel (configurable)
- **Conversation history** — the clock button lists past conversations; loading one restores the transcript and resumes the Claude session
- **Uses your Claude Code login** — no API key to manage; requests go through the `claude` CLI with your existing subscription

## How it works

```
Panel (webview)  ←→  Plugin host (Node)
                        ├─ spawns: claude -p --output-format stream-json --mcp-config ...
                        ├─ local control server (127.0.0.1, random port)
                        └─ writes MCP stdio proxy to the plugin dataDir
claude CLI  ── spawns ──►  MCP proxy  ── HTTP ──►  control server ──► joplin.data
```

The MCP proxy is a zero-dependency script shipped inside the plugin. Claude Code launches it using **Joplin's own Electron runtime** (`ELECTRON_RUN_AS_NODE=1`), so users need no separate Node.js install. Every tool call is forwarded to the plugin's local control server, where the real work happens through the Joplin data API — including the user-confirmation step for writes.

## Requirements

- Joplin desktop 2.8+
- [Claude Code](https://claude.com/claude-code) CLI installed and logged in (`claude` on PATH, or set the full path in settings)

## Settings

**Tools → Options → Joplin Claude**: CLI command/path, model override, write-confirmation toggle, extra CLI arguments (advanced).

## Development

```bash
npm install
npm run dist
```

`dist/` is loadable via Joplin's **Development plugins** setting (point it at the project root). `publish/plugin.jpl` is the installable package.

## Credits

Co-developed with [Claude](https://claude.com) (Anthropic).

## License

MIT
