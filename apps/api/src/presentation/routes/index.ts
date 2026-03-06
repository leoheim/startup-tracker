import { Router, Request, Response } from 'express';
import { CompanyRepository } from '../../infrastructure/database/repositories/CompanyRepository';
import { LaunchRepository } from '../../infrastructure/database/repositories/LaunchRepository';
import { YCClient } from '../../infrastructure/external-apis/YCClient';

import { CompanyController } from '../controllers/CompanyController';
import { LaunchController } from '../controllers/LaunchController';
import { SyncController } from '../controllers/SyncController';
import { SeedController } from '../controllers/SeedController';

import { GetLaunchesUseCase } from '../../application/use-cases/GetLaunches';
import { CreateLaunchUseCase } from '../../application/use-cases/CreateLaunch';
import { SyncYCCompaniesUseCase } from '../../application/use-cases/SyncYCCompanies';
import { SeedSampleDataUseCase } from '../../application/use-cases/SeedSampleData';

export function createRouter(): Router {
  const router = Router();

  // Initialize repositories
  const companyRepository = new CompanyRepository();
  const launchRepository = new LaunchRepository();

  // Initialize external clients
  const ycClient = new YCClient();

  // Initialize use cases
  const getLaunchesUseCase = new GetLaunchesUseCase(launchRepository);
  const createLaunchUseCase = new CreateLaunchUseCase(
    launchRepository,
    companyRepository
  );
  const syncYCCompaniesUseCase = new SyncYCCompaniesUseCase(
    ycClient,
    companyRepository
  );
  const seedSampleDataUseCase = new SeedSampleDataUseCase(
    companyRepository,
    launchRepository
  );

  // Initialize controllers
  const companyController = new CompanyController(companyRepository);
  const launchController = new LaunchController(
    getLaunchesUseCase,
    createLaunchUseCase
  );
  const syncController = new SyncController(syncYCCompaniesUseCase);
  const seedController = new SeedController(seedSampleDataUseCase);

  // Health check
  router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Company routes
  router.get('/companies', (req: Request, res: Response) => companyController.getAll(req, res));
  router.get('/companies/:id', (req: Request, res: Response) => companyController.getById(req, res));
  router.post('/companies', (req: Request, res: Response) => companyController.create(req, res));

  // Launch routes
  router.get('/launches', (req: Request, res: Response) => launchController.getAll(req, res));
  router.post('/launches', (req: Request, res: Response) => launchController.create(req, res));

  // Sync routes
  router.post('/sync/yc', (req: Request, res: Response) => syncController.syncYCCompanies(req, res));

  // Seed routes
  router.post('/seed/sample-data', (req: Request, res: Response) => seedController.seedData(req, res));

  return router;
}
