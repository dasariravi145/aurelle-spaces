/**
 * Studio Administration Module Contracts
 * Defines administration permissions, dashboard summaries, and audit logs.
 */

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "editor" | "consultant";
  isActive: boolean;
}

export interface DashboardMetrics {
  totalEnquiries: number;
  pendingEnquiries: number;
  activeProjects: number;
  totalArticles: number;
}

