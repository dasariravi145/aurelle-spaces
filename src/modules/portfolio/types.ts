/**
 * Portfolio Module Contracts
 * Defines architectural case studies, imagery, and spatial materiality specifications.
 */

export type ProjectTypology =
  | "residential-villa"
  | "luxury-apartment"
  | "commercial-workspace"
  | "hospitality"
  | "restoration";

export interface ProjectMedia {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  isCover?: boolean;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  location: string;
  typology: ProjectTypology;
  areaSqFt: number;
  yearCompleted?: number;
  synopsis: string;
  coverImage: ProjectMedia;
  gallery: ProjectMedia[];
  featured: boolean;
}

