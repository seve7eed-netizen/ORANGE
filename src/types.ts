export interface Project {
  id: string;
  title: string;
  client: string;
  period: string;
  scope: string[];
  description: string;
  tools: string[];
  coverImage: string;
  additionalImages: string[];
  videoUrl?: string; // Optional embedded video link (YouTube, Vimeo, or direct link)
  category: 'photography' | 'videography' | 'editing' | 'retouching';
  featured?: boolean;
}

export type CategoryFilter = 'all' | 'photography' | 'videography' | 'editing' | 'retouching';

export interface ServiceDetail {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  capabilities: string[];
}
