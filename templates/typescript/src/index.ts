import http from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isAuthorized } from "./auth.js";
import { createMcpServer } from "./server.js";

const DEFAULT_PORT = 3000;

/**
 * HTTP request listener for the MCP server.
 *
 * - Auth: if `apiKey` is set, the `x-api-key` header must match, otherwise
 *   the request is rejected with 401 before any MCP handling.
 * - Transport: Streamable HTTP, stateless mode (no server-side sessions).
 *   A fresh MCP server + transport pair is created per request, so the
 *   server stays stateless and easy to scale behind a load balancer.
 */
export function createRequestListener(apiKey?: string) {
  return async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> => {
    if (!isAuthorized(req.headers, apiKey)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Unauthorized: missing or invalid x-api-key header",
          id: null,
          jsonrpc: "2.0",
        }),
      );
      return;
    }

    if (req.method !== "POST" && req.method !== "GET" && req.method !== "DELETE") {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: `Method ${req.method} not allowed`,
          id: null,
          jsonrpc: "2.0",
        }),
      );
      return;
    }

    try {
      const body = await readJsonBody(req);
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless mode
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: `Internal server error: ${error instanceof Error ? error.message : String(error)}`,
            id: null,
            jsonrpc: "2.0",
          }),
        );
      }
    }
  };
}

async function readJsonBody(
  req: http.IncomingMessage,
): Promise<Record<string, unknown> | undefined> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  if (!raw) {
    return undefined;
  }
  return JSON.parse(raw) as Record<string, unknown>;
}

export function startServer(
  port: number = DEFAULT_PORT,
  apiKey?: string,
): Promise<http.Server> {
  const server = http.createServer(createRequestListener(apiKey));
  return new Promise((resolve) => {
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Example MCP server listening on http://localhost:${port}/mcp`);
      if (!apiKey) {
        // eslint-disable-next-line no-console
        console.warn(
          "WARNING: API_KEY is not set, auth is disabled. Set API_KEY before production use.",
        );
      }
      resolve(server);
    });
  });
}

// Run as a standalone server when executed directly (`node dist/index.js`).
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  const apiKey = process.env.API_KEY || undefined;
  await startServer(port, apiKey);
}
