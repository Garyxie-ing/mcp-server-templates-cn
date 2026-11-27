import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Build a configured MCP server.
 *
 * Demo content (replace with your own tools):
 * - Tool `echo`: returns the message it receives.
 * - Tool `demo_weather`: returns STATIC example data for "Example City".
 *   It does NOT call a real weather API. Replace the body with a real
 *   provider (e.g. Open-Meteo, Amap) before using it for real.
 * - Resource `example://greeting`: a short static greeting text.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "example-mcp-server",
    version: "0.1.0",
  });

  server.tool(
    "echo",
    "Echo back the message you send. Useful to check the server works.",
    { message: z.string().describe("The message to echo back") },
    async ({ message }) => ({
      content: [{ type: "text", text: `Echo: ${message}` }],
    }),
  );

  server.tool(
    "demo_weather",
    "Demo weather lookup. Returns STATIC example data only; wire in a real weather API before production use.",
    { city: z.string().describe("City name, e.g. Example City") },
    async ({ city }) => ({
      content: [
        {
          type: "text",
          text:
            `Demo data for ${city} (not live): sunny, 25°C, humidity 40%. ` +
            `Replace demo_weather with a real weather API before production use.`,
        },
      ],
    }),
  );

  server.resource(
    "greeting",
    "example://greeting",
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text:
            "Hello from the example MCP server! " +
            "This is a demo resource. Replace it with your own data source.",
        },
      ],
    }),
  );

  return server;
}
