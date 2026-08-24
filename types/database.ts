export interface CaseStudy {
  id: string;
  name: string;
  one_liner: string;
  category: string;
  year: string;
  accent_color: string;
  slug: string;
  featured: boolean;
  sort_order: number;
  status: 'published' | 'draft';
  client_name?: string;
  services?: string[];
  hero_image?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  pull_quote?: string;
  gallery_images?: string[];
  created_at: string;
  updated_at?: string;
}

export type CaseStudyInput = Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>;

export type ViewMode = 'grid' | 'list';

export interface CategoryCount {
  category: string;
  count: number;
}
