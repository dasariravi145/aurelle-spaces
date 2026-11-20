/**
 * Services Module Contracts
 * Defines service offerings, scope of work, and consultation packages.
 */

export type ServiceCategory =
  | "residential-architecture"
  | "commercial-architecture"
  | "interior-design"
  | "landscape-spatial"
  | "turnkey-execution";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ServiceCategory;
  deliverables: string[];
  featured: boolean;
}

