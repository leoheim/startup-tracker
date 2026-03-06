import { Request, Response } from 'express';
import { GetLaunchesUseCase } from '../../application/use-cases/GetLaunches';
import { CreateLaunchUseCase } from '../../application/use-cases/CreateLaunch';
import { logger } from '../../config/logger';
import { z } from 'zod';

const createLaunchSchema = z.object({
  companyId: z.string().uuid(),
  platform: z.enum(['twitter', 'linkedin']),
  postUrl: z.string().url(),
  postId: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  authorHandle: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  likesCount: z.number().int().nonnegative().optional(),
  commentsCount: z.number().int().nonnegative().optional(),
  sharesCount: z.number().int().nonnegative().optional(),
  viewsCount: z.number().int().nonnegative().optional(),
});

export class LaunchController {
  constructor(
    private getLaunchesUseCase: GetLaunchesUseCase,
    private createLaunchUseCase: CreateLaunchUseCase
  ) {}

  async getAll(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const performanceTier = req.query.performanceTier as 'low' | 'medium' | 'high' | undefined;
      const companyId = req.query.companyId as string | undefined;

      const launches = await this.getLaunchesUseCase.execute({
        limit,
        offset,
        performanceTier,
        companyId,
      });

      res.json({
        success: true,
        data: launches,
        meta: {
          limit,
          offset,
          count: launches.length,
        },
      });
    } catch (error) {
      logger.error('Error fetching launches:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch launches',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validated = createLaunchSchema.parse(req.body);

      const data = {
        ...validated,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : undefined,
      };

      const launch = await this.createLaunchUseCase.execute(data);

      res.status(201).json({
        success: true,
        data: launch,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      logger.error('Error creating launch:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create launch',
      });
    }
  }
}
