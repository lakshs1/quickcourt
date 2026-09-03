import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/swagger.js";

extendZodWithOpenApi(z);

export const sendConnectionSchema = z
  .object({
    receiverId: z.string().uuid().openapi({ example: "7af1b4a9-de22-4518-845c-83ca8d0dbd93" }),
  })
  .openapi("SendConnectionRequest");

export const updateConnectionSchema = z
  .object({
    status: z.enum(["accepted", "rejected"]).openapi({ example: "accepted" }),
  })
  .openapi("UpdateConnectionRequest");

registry.registerPath({
  method: "post",
  path: "/connections",
  tags: ["Connections"],
  summary: "Send connection request to another student",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: sendConnectionSchema } } } },
  responses: {
    201: { description: "Connection request sent" },
    400: { description: "Self connection or duplicate pending request" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/connections",
  tags: ["Connections"],
  summary: "List all connections categorized into pendingReceived, pendingSent, and accepted",
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: "Categorized user connections" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/connections/{id}",
  tags: ["Connections"],
  summary: "Accept or reject incoming connection request",
  security: [{ BearerAuth: [] }],
  parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
  request: { body: { content: { "application/json": { schema: updateConnectionSchema } } } },
  responses: {
    200: { description: "Connection request status updated" },
    403: { description: "Forbidden - only recipient can update status" },
    404: { description: "Connection request not found" },
  },
});
