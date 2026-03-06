import { YCClient, YCCompany } from '../../infrastructure/external-apis/YCClient';
import { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository';
import { logger } from '../../config/logger';

export class SyncYCCompaniesUseCase {
  constructor(
    private ycClient: YCClient,
    private companyRepository: ICompanyRepository
  ) {}

  async execute(batchFilter?: string): Promise<{ synced: number; errors: number }> {
    let companies: YCCompany[];

    if (batchFilter) {
      logger.info(`Syncing YC companies from batch: ${batchFilter}`);
      companies = await this.ycClient.fetchCompaniesByBatch(batchFilter);
    } else {
      logger.info('Syncing recent YC companies (last 3 batches)...');
      companies = await this.ycClient.fetchRecentBatches(3);
    }

    let synced = 0;
    let errors = 0;

    for (const ycCompany of companies) {
      try {
        // Check if company already exists
        const existing = await this.companyRepository.findByName(ycCompany.name);

        if (existing) {
          // Update existing company
          await this.companyRepository.update(existing.id, {
            website: ycCompany.website,
            industry: ycCompany.industry,
            employeeCount: ycCompany.team_size,
            ycBatch: ycCompany.batch,
            metadata: {
              slug: ycCompany.slug,
              oneLiner: ycCompany.one_liner,
              description: ycCompany.long_description,
              tags: ycCompany.tags,
              status: ycCompany.status,
              launchedAt: ycCompany.launched_at,
            },
          });
        } else {
          // Create new company
          await this.companyRepository.create({
            name: ycCompany.name,
            website: ycCompany.website,
            industry: ycCompany.industry,
            employeeCount: ycCompany.team_size,
            ycBatch: ycCompany.batch,
            metadata: {
              slug: ycCompany.slug,
              oneLiner: ycCompany.one_liner,
              description: ycCompany.long_description,
              tags: ycCompany.tags,
              status: ycCompany.status,
              launchedAt: ycCompany.launched_at,
            },
          });
        }

        synced++;
      } catch (error) {
        logger.error(`Failed to sync company ${ycCompany.name}:`, error);
        errors++;
      }
    }

    logger.info(`YC sync complete: ${synced} synced, ${errors} errors`);

    return { synced, errors };
  }
}
