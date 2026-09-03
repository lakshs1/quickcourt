import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/swagger.js";

extendZodWithOpenApi(z);

registry.registerPath({
  method: "get",
  path: "/preview/profiles",
  tags: ["Feed"],
  summary: "Get 5 preview student profiles for public unauthenticated landing page",
  responses: {
    200: { description: "List of 5 preview profiles with limited public fields" },
  },
});

registry.registerPath({
  method: "get",
  path: "/feed",
  tags: ["Feed"],
  summary: "Get paginated main student feed (5 profiles/page) with filter support",
  security: [{ BearerAuth: [] }],
  parameters: [
    { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
    { name: "limit", in: "query", required: false, schema: { type: "integer", default: 5 } },
    { name: "degree", in: "query", required: false, schema: { type: "string" } },
    { name: "year", in: "query", required: false, schema: { type: "string" } },
    { name: "lookingFor", in: "query", required: false, schema: { type: "string" } },
  ],
  responses: {
    200: { description: "Paginated profiles with connection status" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/feed/search",
  tags: ["Feed"],
  summary: "Search student profiles by query string",
  security: [{ BearerAuth: [] }],
  parameters: [
    { name: "q", in: "query", required: true, schema: { type: "string" } },
  ],
  responses: {
    200: { description: "Search results matching query" },
    401: { description: "Unauthorized" },
  },
});
