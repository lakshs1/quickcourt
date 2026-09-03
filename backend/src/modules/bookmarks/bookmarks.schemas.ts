import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/swagger.js";

extendZodWithOpenApi(z);

export const addBookmarkSchema = z
  .object({
    bookmarkedUserId: z.string().uuid().openapi({ example: "7af1b4a9-de22-4518-845c-83ca8d0dbd93" }),
  })
  .openapi("AddBookmarkRequest");

registry.registerPath({
  method: "post",
  path: "/bookmarks",
  tags: ["Bookmarks"],
  summary: "Bookmark a student profile",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: addBookmarkSchema } } } },
  responses: {
    201: { description: "Profile bookmarked successfully" },
    400: { description: "Self bookmark error" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/bookmarks/{bookmarkedUserId}",
  tags: ["Bookmarks"],
  summary: "Remove bookmark for a student profile",
  security: [{ BearerAuth: [] }],
  parameters: [{ name: "bookmarkedUserId", in: "path", required: true, schema: { type: "string" } }],
  responses: {
    200: { description: "Bookmark removed" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/bookmarks",
  tags: ["Bookmarks"],
  summary: "List all bookmarked profiles for current user",
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: "List of bookmarked profiles with full student details" },
    401: { description: "Unauthorized" },
  },
});
