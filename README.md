# skillssafe-mcp

[![npm version](https://badge.fury.io/js/skillssafe-mcp.svg)](https://www.npmjs.com/package/skillssafe-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-com.skillssafe%2Fscanner-blue)](https://registry.modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**MCP server for [SkillsSafe](https://skillssafe.com)** — the security layer for AI agents.

Scan SKILL.md files, MCP configs, and system prompts for:
- 🔐 Credential theft & data exfiltration
- 💉 Prompt injection attacks
- 👻 Zero-width character attacks
- 🦠 ClawHavoc malware indicators
- 🐚 Shell injection & reverse shells
- 🔍 Scope creep & memory poisoning

**Free. No API key. No signup.**

## Quick Start

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "skillssafe": {
      "command": "npx",
      "args": ["-y", "skillssafe-mcp"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "skillssafe": {
      "command": "npx",
      "args": ["-y", "skillssafe-mcp"]
    }
  }
}
```

### Direct SSE (Remote)

For clients that support SSE transport:

```
https://mcp.skillssafe.com/sse
```

## Tools

### `scan_skill`

Scan an AI agent skill file for security threats before installation.

```
Parameters:
  url      - URL of skill to scan (GitHub raw URL, ClawHub URL, etc.)
  content  - Raw text content of skill to scan (alternative to url)
  lang     - Response language: "en" | "zh" | "ja" (default: "en")

Returns:
  decision    - INSTALL / REVIEW / BLOCK
  risk_score  - 0–100
  threats     - List of detected threats with severity
  scan_id     - ID for retrieving full report
```

### `get_report`

Retrieve a previously generated scan report.

```
Parameters:
  scan_id  - Scan ID returned by scan_skill
```

## Registry

- **Official MCP Registry**: `com.skillssafe/scanner`
- **Smithery**: [skillssafe](https://smithery.ai/server/skillssafe)
- **Glama**: [skillssafe-mcp](https://glama.ai/mcp/servers/GUCCI-atlasv/skillssafe-mcp)

## License

MIT © SkillsSafe
