import { Request, Response } from 'express';
import { SeedSampleDataUseCase } from '../../application/use-cases/SeedSampleData';
import { logger } from '../../config/logger';

export class SeedController {
  constructor(private seedSampleDataUseCase: SeedSampleDataUseCase) {}

  async seedData(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Seeding sample data...');
      const result = await this.seedSampleDataUseCase.execute();

      res.json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      logger.error('Failed to seed data:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed sample data',
      });
    }
  }
}
