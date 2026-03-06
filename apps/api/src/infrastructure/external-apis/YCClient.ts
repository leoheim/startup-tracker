import { logger } from '../../config/logger';

export interface YCCompany {
  id: number;
  name: string;
  slug: string;
  former_names: string[];
  small_logo_url: string;
  website: string;
  all_locations: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  highlight_black: boolean;
  highlight_latinx: boolean;
  highlight_women: boolean;
  industry: string;
  subindustry: string;
  launched_at: number;
  tags: string[];
  tags_highlighted: string[];
  top_company: boolean;
  isHiring: boolean;
  nonprofit: boolean;
  batch: string;
  status: string;
  industries: string[];
  regions: string[];
  stage: string;
  app_video_public: boolean;
  demo_day_video_public: boolean;
  app_answers: any | null;
  question_answers: boolean;
  url: string;
  api: string;
  meta: {
    hasW25Recs: boolean;
  };
}

export class YCClient {
  private readonly API_URL = 'https://yc-oss.github.io/api/companies/all.json';

  async fetchAllCompanies(): Promise<YCCompany[]> {
    try {
      logger.info('Fetching YC companies from public API...');

      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new Error(`YC API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }

      const companies: YCCompany[] = data as YCCompany[];

      logger.info(`Successfully fetched ${companies.length} YC companies`);

      return companies;
    } catch (error) {
      logger.error('Failed to fetch YC companies:', error);
      throw error;
    }
  }

  async fetchCompaniesByBatch(batch: string): Promise<YCCompany[]> {
    const allCompanies = await this.fetchAllCompanies();
    return allCompanies.filter((company) => company.batch === batch);
  }

  async fetchRecentBatches(count: number = 3): Promise<YCCompany[]> {
    const allCompanies = await this.fetchAllCompanies();

    // Get unique batches and sort by most recent
    const batches = [...new Set(allCompanies.map((c) => c.batch))]
      .sort()
      .reverse()
      .slice(0, count);

    return allCompanies.filter((company) => batches.includes(company.batch));
  }
}
