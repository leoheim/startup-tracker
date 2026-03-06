import { Router } from 'express';
import { CompanyRepository } from '../../infrastructure/database/repositories/CompanyRepository';
import { LaunchRepository } from '../../infrastructure/database/repositories/LaunchRepository';
import { YCClient } from '../../infrastructure/external-apis/YCClient';

import { CompanyController } from '../controllers/CompanyController';
import { LaunchController } from '../controllers/LaunchController';
import { SyncController } from '../controllers/SyncController';

import { GetLaunchesUseCase } from '../../application/use-cases/GetLaunches';
import { CreateLaunchUseCase } from '../../application/use-cases/CreateLaunch';
import { SyncYCCompaniesUseCase } from '../../application/use-cases/SyncYCCompanies';

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

  // Initialize controllers
  const companyController = new CompanyController(companyRepository);
  const launchController = new LaunchController(
    getLaunchesUseCase,
    createLaunchUseCase
  );
  const syncController = new SyncController(syncYCCompaniesUseCase);

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Company routes
  router.get('/companies', (req, res) => companyController.getAll(req, res));
  router.get('/companies/:id', (req, res) => companyController.getById(req, res));
  router.post('/companies', (req, res) => companyController.create(req, res));

  // Launch routes
  router.get('/launches', (req, res) => launchController.getAll(req, res));
  router.post('/launches', (req, res) => launchController.create(req, res));

  // Sync routes
  router.post('/sync/yc', (req, res) => syncController.syncYCCompanies(req, res));

  return router;
}
