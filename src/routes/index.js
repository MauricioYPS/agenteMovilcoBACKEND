import { Router } from 'express';
import healthRoutes from './health.routes.js';
import exampleRoutes from './example.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/examples', exampleRoutes);

export default router;
