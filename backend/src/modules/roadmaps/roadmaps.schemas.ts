import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/swagger.js";

extendZodWithOpenApi(z);

registry.registerPath({
  method: "get",
  path: "/roadmaps/me",
  tags: ["Roadmaps"],
  summary: "Get personalized skill recommendations and curated learning resources",
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: "Skill suggestions and curated resource links" },
    401: { description: "Unauthorized" },
  },
});
