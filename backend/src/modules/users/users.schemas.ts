import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/swagger.js";

extendZodWithOpenApi(z);

export const onboardSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    year: z.string().min(1, "Year is required"),
    bio: z.string().optional(),
    about: z.string().optional(),
    photoUrl: z.string().optional(),
    location: z.string().optional(),
    availability: z.string().optional(),
    lookingFor: z.string().min(1, "Looking for text is required"),
    skills: z.array(z.string()).min(1, "At least 1 skill is required"),
    interests: z.array(z.string()).optional(),
    projects: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          githubUrl: z.string().optional(),
          demoUrl: z.string().optional(),
        })
      )
      .optional(),
    achievements: z
      .array(
        z.object({
          title: z.string().min(1),
          organization: z.string().optional(),
          year: z.number().optional(),
        })
      )
      .optional(),
    socialLinks: z
      .array(
        z.object({
          platform: z.string().min(1),
          url: z.string().url("Invalid link URL"),
        })
      )
      .optional(),
  })
  .openapi("OnboardRequest");

export const updateProfileSchema = onboardSchema.partial().extend({
  name: z.string().min(2).optional(),
}).openapi("UpdateProfileRequest");

registry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["Users"],
  summary: "Get full profile of current authenticated user",
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: "Full user profile data" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "post",
  path: "/users/onboard",
  tags: ["Users"],
  summary: "Complete initial onboarding profile setup",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: onboardSchema } } } },
  responses: {
    200: { description: "Profile onboarded successfully" },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "put",
  path: "/users/me",
  tags: ["Users"],
  summary: "Update current user profile",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: updateProfileSchema } } } },
  responses: {
    200: { description: "Profile updated successfully" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Get public profile of another user",
  security: [{ BearerAuth: [] }],
  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
  responses: {
    200: { description: "Public user profile" },
    404: { description: "User not found" },
  },
});
