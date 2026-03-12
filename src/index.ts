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
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const SSE_URL = "https://mcp.skillssafe.com/sse";

async function main(): Promise<void> {
  const remoteClient = new Client(
    { name: "skillssafe-mcp-proxy", version: "1.0.0" },
    { capabilities: {} }
  );

  const sseTransport = new SSEClientTransport(new URL(SSE_URL));
  await remoteClient.connect(sseTransport);

  const remoteInfo = remoteClient.getServerVersion();
  const remoteCapabilities = remoteClient.getServerCapabilities();

  const server = new Server(
    { name: "skillssafe", version: remoteInfo?.version ?? "1.0.0" },
    { capabilities: remoteCapabilities ?? {} }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return await remoteClient.listTools();
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await remoteClient.callTool(request.params);
  });

  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

main().catch((err: Error) => {
  process.stderr.write(`SkillsSafe MCP error: ${err.message}\n`);
  process.exit(1);
});
