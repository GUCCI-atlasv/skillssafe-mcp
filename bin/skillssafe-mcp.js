#!/usr/bin/env node
/**
 * SkillsSafe MCP Server
 * Proxies stdio ↔ remote SSE endpoint at mcp.skillssafe.com
 *
 * Usage:
 *   npx skillssafe-mcp
 *
 * Config for Claude Desktop / Cursor / Codex:
 *   { "command": "npx", "args": ["-y", "skillssafe-mcp"] }
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const SSE_URL = "https://mcp.skillssafe.com/sse";

async function main() {
  // Connect to SkillsSafe remote SSE server
  const remoteClient = new Client(
    { name: "skillssafe-mcp-proxy", version: "1.0.0" },
    { capabilities: {} }
  );
  const sseTransport = new SSEClientTransport(new URL(SSE_URL));
  await remoteClient.connect(sseTransport);

  // Get capabilities from remote
  const remoteInfo = remoteClient.getServerVersion();
  const remoteCapabilities = remoteClient.getServerCapabilities();

  // Create local stdio server that mirrors remote capabilities
  const server = new Server(
    { name: "skillssafe", version: remoteInfo?.version ?? "1.0.0" },
    { capabilities: remoteCapabilities ?? {} }
  );

  // Forward all tool calls to remote
  server.setRequestHandler({ method: "tools/list" }, async () => {
    return await remoteClient.listTools();
  });

  server.setRequestHandler({ method: "tools/call" }, async (request) => {
    return await remoteClient.callTool(request.params);
  });

  // Start stdio transport
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

main().catch((err) => {
  process.stderr.write(`SkillsSafe MCP error: ${err.message}\n`);
  process.exit(1);
});
