export type Platform = 'twitter' | 'linkedin';
export type PerformanceTier = 'low' | 'medium' | 'high';

export interface Launch {
  id: string;
  companyId: string;
  platform: Platform;
  postUrl: string;
  postId?: string;
  content?: string;
  videoUrl?: string;
  authorHandle?: string;
  publishedAt?: Date;

  // Engagement metrics
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;

  // Performance
  engagementScore?: number;
  performanceTier?: PerformanceTier;

  rawData?: Record<string, any>;
  lastScrapedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLaunchInput {
  companyId: string;
  platform: Platform;
  postUrl: string;
  postId?: string;
  content?: string;
  videoUrl?: string;
  authorHandle?: string;
  publishedAt?: Date;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  viewsCount?: number;
  rawData?: Record<string, any>;
}
