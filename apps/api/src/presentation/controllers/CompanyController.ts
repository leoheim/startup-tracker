import { Request, Response } from 'express';
import { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository';
import { logger } from '../../config/logger';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  industry: z.string().optional(),
  employeeCount: z.number().int().positive().optional(),
});

export class CompanyController {
  constructor(private companyRepository: ICompanyRepository) {}

  async getAll(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const companies = await this.companyRepository.findAll(limit, offset);

      res.json({
        success: true,
        data: companies,
        meta: {
          limit,
          offset,
          count: companies.length,
        },
      });
    } catch (error) {
      logger.error('Error fetching companies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch companies',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const company = await this.companyRepository.findById(id);

      if (!company) {
        return res.status(404).json({
          success: false,
          error: 'Company not found',
        });
      }

      res.json({
        success: true,
        data: company,
      });
    } catch (error) {
      logger.error('Error fetching company:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch company',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validated = createCompanySchema.parse(req.body);
      const company = await this.companyRepository.create(validated);

      res.status(201).json({
        success: true,
        data: company,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      logger.error('Error creating company:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create company',
      });
    }
  }
}
