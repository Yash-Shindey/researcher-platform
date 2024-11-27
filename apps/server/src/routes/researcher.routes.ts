import { Router } from 'express';
import researcherController from '../controllers/researcherController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

// Bind the methods to maintain 'this' context
router.get('/dashboard-metrics', (req, res) => researcherController.getDashboardMetrics(req, res));
router.get('/', (req, res) => researcherController.getResearchers(req, res));
router.get('/filters', (req, res) => researcherController.getFilters(req, res));

export default router;
