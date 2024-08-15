import fastify from "fastify";
import guard from "fastify-guard";
import jwt from "jsonwebtoken";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { logger } from "./logger";

type User = {
  id: string;
  scopes: string[];
  applicationId: string;
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.decorateRequest("user", null);

  app.addHook("onRequest", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return;
    }
    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, "secret") as User;

      request.user = decoded;
    } catch (error) {}
  });

  // Register plugins
  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (error, request, reply) => {
      logger.error(error);
      return reply.status(403).send({
        message: "Unauthorized",
      });
    },
  });

  // Register routes
  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });

  return app;
}
