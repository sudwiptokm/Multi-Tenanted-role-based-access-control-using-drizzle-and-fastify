import { FastifyReply, FastifyRequest } from "fastify";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "../../config/permissions";
import { createRole } from "../roles/roles.services";
import { CreateApplicationBody } from "./applications.schemas";
import { createApplication, getApplications } from "./applications.services";

export async function createApplicationHandler(
  request: FastifyRequest<{ Body: CreateApplicationBody }>,
  reply: FastifyReply
) {
  // Create application
  const { name } = request.body;
  const application = await createApplication({ name });

  const superAdminRolePromise = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as string[],
  });

  const applicationUserRolePromise = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS,
  });

  const [superAdminRole, applicationUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    applicationUserRolePromise,
  ]);

  if (superAdminRole.status === "rejected") {
    console.log("Error creating super admin role");
    throw superAdminRole.reason;
  }

  if (applicationUserRole.status === "rejected") {
    console.log("Error creating application user role");
    throw applicationUserRole.reason;
  }

  return {
    application,
    superAdminRole: superAdminRole.value,
    applicationUserRole: applicationUserRole.value,
  };
}

export async function getApplicationsHandler() {
  return getApplications();
}
