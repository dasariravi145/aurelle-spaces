/**
 * Authentication Layer Contracts
 */

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "editor" | "consultant";
}

export interface AuthSession {
  user: SessionUser | null;
  expiresAt?: string;
  isAuthenticated: boolean;
}

