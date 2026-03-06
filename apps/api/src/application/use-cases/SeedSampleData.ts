import { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository';
import { ILaunchRepository } from '../../domain/interfaces/ILaunchRepository';
import { logger } from '../../config/logger';

export class SeedSampleDataUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private launchRepository: ILaunchRepository
  ) {}

  async execute(): Promise<{ launches: number; message: string }> {
    try {
      logger.info('Starting to seed sample data...');

      // Get first 10 companies
      const companies = await this.companyRepository.findAll(10, 0);

      if (companies.length === 0) {
        throw new Error('No companies found. Please sync YC companies first.');
      }

      const sampleLaunches = [
        // High performers
        {
          platform: 'twitter' as const,
          likesCount: 2500,
          commentsCount: 350,
          sharesCount: 180,
          viewsCount: 45000,
          content: 'Excited to launch our revolutionary AI platform that helps developers write better code 10x faster! 🚀',
          authorHandle: 'founder_ai',
        },
        {
          platform: 'linkedin' as const,
          likesCount: 1800,
          commentsCount: 220,
          sharesCount: 95,
          viewsCount: 32000,
          content: 'Today we are launching the future of cloud infrastructure. Join us on this journey!',
          authorHandle: 'cloud_ceo',
        },
        {
          platform: 'twitter' as const,
          likesCount: 3200,
          commentsCount: 480,
          sharesCount: 220,
          viewsCount: 68000,
          content: 'After 2 years of building, we are finally launching! Meet the fastest data analytics platform ever built.',
          authorHandle: 'data_founder',
        },
        // Medium performers
        {
          platform: 'linkedin' as const,
          likesCount: 450,
          commentsCount: 65,
          sharesCount: 28,
          viewsCount: 12000,
          content: 'Launching our new SaaS platform for small businesses. Check it out!',
          authorHandle: 'saas_startup',
        },
        {
          platform: 'twitter' as const,
          likesCount: 680,
          commentsCount: 92,
          sharesCount: 45,
          viewsCount: 18000,
          content: 'Today is the day! Our productivity app is now available for everyone.',
          authorHandle: 'productivity_co',
        },
        {
          platform: 'linkedin' as const,
          likesCount: 520,
          commentsCount: 78,
          sharesCount: 32,
          viewsCount: 15000,
          content: 'Excited to share our healthcare solution that is making a real difference!',
          authorHandle: 'health_tech',
        },
        // Low performers
        {
          platform: 'twitter' as const,
          likesCount: 45,
          commentsCount: 8,
          sharesCount: 2,
          viewsCount: 1200,
          content: 'Check out our new app',
          authorHandle: 'startup_x',
        },
        {
          platform: 'linkedin' as const,
          likesCount: 32,
          commentsCount: 5,
          sharesCount: 1,
          viewsCount: 890,
          content: 'Launching today!',
          authorHandle: 'new_company',
        },
        {
          platform: 'twitter' as const,
          likesCount: 67,
          commentsCount: 12,
          sharesCount: 3,
          viewsCount: 2100,
          content: 'Our product is live now. Give it a try!',
          authorHandle: 'tech_startup',
        },
        {
          platform: 'linkedin' as const,
          likesCount: 28,
          commentsCount: 4,
          sharesCount: 0,
          viewsCount: 650,
          content: 'New product launch',
          authorHandle: 'startup_co',
        },
      ];

      let created = 0;
      for (let i = 0; i < sampleLaunches.length && i < companies.length; i++) {
        const launch = sampleLaunches[i];
        const company = companies[i];

        try {
          await this.launchRepository.create({
            companyId: company.id,
            platform: launch.platform,
            postUrl: `https://${launch.platform}.com/${launch.authorHandle}/status/${Math.random().toString(36).substr(2, 9)}`,
            content: launch.content,
            authorHandle: launch.authorHandle,
            likesCount: launch.likesCount,
            commentsCount: launch.commentsCount,
            sharesCount: launch.sharesCount,
            viewsCount: launch.viewsCount,
            publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
          });
          created++;
        } catch (error) {
          logger.error(`Failed to create launch for company ${company.name}:`, error);
        }
      }

      logger.info(`Successfully seeded ${created} sample launches`);
      return {
        launches: created,
        message: `Successfully created ${created} sample launches with realistic engagement data`,
      };
    } catch (error) {
      logger.error('Failed to seed sample data:', error);
      throw error;
    }
  }
}
