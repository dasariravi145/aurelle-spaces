/**
 * Aurelle Spaces — Role-Based Access Control (RBAC) Foundation
 * 
 * Defines granular studio permissions and role hierarchies.
 * Enforces server-side permission checks that default to denying access.
 */

import type { AdminRole } from "@/lib/db/types";
import { ForbiddenError } from "@/lib/errors/app-error";

export type Permission =
  | "cms:read"
  | "cms:write"
  | "cms:publish"
  | "cms:delete"
  | "media:read"
  | "media:upload"
  | "media:delete"
  | "enquiries:read"
  | "enquiries:write"
  | "enquiries:assign"
  | "chat:read"
  | "automations:read"
  | "automations:manage"
  | "admin_users:manage"
  | "audit:read"
  | "settings:manage";

const ALL_PERMISSIONS: readonly Permission[] = [
  "cms:read",
  "cms:write",
  "cms:publish",
  "cms:delete",
  "media:read",
  "media:upload",
  "media:delete",
  "enquiries:read",
  "enquiries:write",
  "enquiries:assign",
  "chat:read",
  "automations:read",
  "automations:manage",
  "admin_users:manage",
  "audit:read",
  "settings:manage",
] as const;

/**
 * Permission assignment per role.
 * Super Admin: Full system control
 * Editor: Content creation, media management, enquiry review
 * Viewer: Read-only access to permitted sections
 */
const ROLE_PERMISSIONS: Record<AdminRole, readonly Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  studio_director: ALL_PERMISSIONS, // Alias for executive leadership
  lead_architect: [
    "cms:read",
    "cms:write",
    "cms:publish",
    "media:read",
    "media:upload",
    "enquiries:read",
    "enquiries:write",
    "chat:read",
  ],
  editor: [
    "cms:read",
    "cms:write",
    "cms:publish",
    "media:read",
    "media:upload",
    "enquiries:read",
    "enquiries:write",
    "chat:read",
  ],
  viewer: [
    "cms:read",
    "media:read",
    "enquiries:read",
    "chat:read",
  ],
};

/**
 * Check whether a specific role possesses the requested permission.
 * Denies access by default if role or permission is unrecognized.
 */
export function hasPermission(role: AdminRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Assert that the given role possesses the required permission.
 * Throws a typed ForbiddenError if authorization fails.
 */
export function requirePermission(role: AdminRole | undefined | null, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError(
      `Access denied: Current role '${role || "anonymous"}' does not possess required permission '${permission}'.`
    );
  }
}

/**
 * Human-readable label for administrative roles.
 */
export function getRoleDisplayName(role: AdminRole): string {
  switch (role) {
    case "super_admin":
      return "Super Administrator";
    case "studio_director":
      return "Studio Director";
    case "lead_architect":
      return "Lead Architect";
    case "editor":
      return "Studio Editor";
    case "viewer":
      return "Studio Viewer";
    default:
      return "Administrator";
  }
}

