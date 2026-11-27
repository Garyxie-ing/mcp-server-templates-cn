import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { startServer } from "../src/index.js";

const API_KEY = "test-key-123";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = await startServer(0, API_KEY); // port 0 = random free port
  const port = (server.address() as AddressInfo).port;
  baseUrl = `http://127.0.0.1:${port}/mcp`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("HTTP auth", () => {
  it("returns 401 without an API key", async () => {
    const res = await fetch(baseUrl, {
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          capabilities: {},
          clientInfo: { name: "test", version: "0.1.0" },
          protocolVersion: "2025-03-26",
        },
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    expect(res.status).toBe(401);
  });

  it("returns 401 with a wrong API key", async () => {
    const res = await fetch(baseUrl, {
      body: JSON.stringify({ id: 1, jsonrpc: "2.0", method: "ping" }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "wrong-key",
      },
      method: "POST",
    });
    expect(res.status).toBe(401);
  });
});

describe("MCP over Streamable HTTP (real client)", () => {
  it(
    "lists tools, calls echo and demo_weather, reads the greeting resource",
    async () => {
      const transport = new StreamableHTTPClientTransport(new URL(baseUrl), {
        requestInit: { headers: { "x-api-key": API_KEY } },
      });
      const client = new Client(
        { name: "test-client", version: "0.1.0" },
        { capabilities: {} },
      );
      try {
        await client.connect(transport);

        const tools = await client.listTools();
        const names = tools.tools.map((t) => t.name).sort();
        expect(names).toEqual(["demo_weather", "echo"]);

        const echo = await client.callTool({
          arguments: { message: "hello" },
          name: "echo",
        });
        const echoText = (echo.content as Array<{ text: string }>)[0].text;
        expect(echoText).toBe("Echo: hello");

        const weather = await client.callTool({
          arguments: { city: "Example City" },
          name: "demo_weather",
        });
        const weatherText = (weather.content as Array<{ text: string }>)[0]
          .text;
        expect(weatherText).toContain("Demo data for Example City");

        const resource = await client.readResource({
          uri: "example://greeting",
        });
        const greetingText = (
          resource.contents[0] as { text: string }
        ).text;
        expect(greetingText).toContain("Hello from the example MCP server!");
      } finally {
        await client.close();
      }
    },
    30_000,
  );
});
