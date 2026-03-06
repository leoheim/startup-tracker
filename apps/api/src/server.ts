import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './config/logger';
import { testConnection } from './infrastructure/database/db';
import { createRouter } from './presentation/routes';
import { errorHandler } from './presentation/middlewares/errorHandler';

async function startServer() {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow Vercel preview URLs and production URL
        const allowedOrigins = [
          env.FRONTEND_URL,
          /https:\/\/startup-tracker-.*\.vercel\.app$/,
          /https:\/\/.*-leonardoheimwork-6337s-projects\.vercel\.app$/,
        ];

        const isAllowed = allowedOrigins.some(allowed => {
          if (typeof allowed === 'string') {
            return allowed === origin;
          }
          return allowed.test(origin);
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info({
      method: req.method,
      path: req.path,
      query: req.query,
    });
    next();
  });

  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }
  logger.info('✅ Database connected successfully');

  // Routes
  app.use(`/api/${env.API_VERSION}`, createRouter());

  // Error handler (must be last)
  app.use(errorHandler);

  // Start server
  app.listen(env.PORT, () => {
    logger.info(`
    🚀 Server is running!
    📡 Port: ${env.PORT}
    🌍 Environment: ${env.NODE_ENV}
    📚 API Version: ${env.API_VERSION}
    `);
  });
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
