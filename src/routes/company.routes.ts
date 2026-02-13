import { Router } from 'express';
import { companyController } from '#controllers/company.controller';
import { authenticate } from '#middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// GET    /api/company/me
router.get('/me', companyController);

// // PUT    /api/company
router.put('company',)
// // GET    /api/company/users

export const companyRoute = router;