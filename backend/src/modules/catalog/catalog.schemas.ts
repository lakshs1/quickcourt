import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/swagger.js";

extendZodWithOpenApi(z);

registry.registerPath({
  method: "get",
  path: "/catalog/skills",
  tags: ["Catalog"],
  summary: "Get skills catalog (autocomplete/search)",
  parameters: [{ name: "q", in: "query", required: false, schema: { type: "string" } }],
  responses: {
    200: { description: "List of matching skills" },
  },
});

registry.registerPath({
  method: "get",
  path: "/skills",
  tags: ["Catalog"],
  summary: "Get skills catalog (alias)",
  parameters: [{ name: "q", in: "query", required: false, schema: { type: "string" } }],
  responses: {
    200: { description: "List of matching skills" },
  },
});

registry.registerPath({
  method: "get",
  path: "/catalog/interests",
  tags: ["Catalog"],
  summary: "Get interests catalog (autocomplete/search)",
  parameters: [{ name: "q", in: "query", required: false, schema: { type: "string" } }],
  responses: {
    200: { description: "List of matching interests" },
  },
});

registry.registerPath({
  method: "get",
  path: "/interests",
  tags: ["Catalog"],
  summary: "Get interests catalog (alias)",
  parameters: [{ name: "q", in: "query", required: false, schema: { type: "string" } }],
  responses: {
    200: { description: "List of matching interests" },
  },
});
