import { Request, Response } from 'express';
import { SyncYCCompaniesUseCase } from '../../application/use-cases/SyncYCCompanies';
import { logger } from '../../config/logger';

export class SyncController {
  constructor(private syncYCCompaniesUseCase: SyncYCCompaniesUseCase) {}

  async syncYCCompanies(req: Request, res: Response) {
    try {
      const batch = req.query.batch as string | undefined;

      logger.info('Starting YC companies sync...');

      const result = await this.syncYCCompaniesUseCase.execute(batch);

      res.json({
        success: true,
        data: result,
        message: `Successfully synced ${result.synced} companies, ${result.errors} errors`,
      });
    } catch (error) {
      logger.error('Error syncing YC companies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync YC companies',
      });
    }
  }
}
