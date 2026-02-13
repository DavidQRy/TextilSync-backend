import { Router } from 'express';
import { companyController, companyUpdateController } from '#controllers/company.controller';
import { authenticate } from '#middlewares/auth.middleware';
import validate from '#middlewares/validate.middleware';
import { authorizeRole } from '#middlewares/role.middleware';
import { updateCompanySchema } from '#schemas/company.schema';

const router = Router();

router.use(authenticate);

// GET    /api/company/me
router.get('/me', companyController);

// // PUT    /api/company
router.put('company', authorizeRole(1), validate(updateCompanySchema), companyUpdateController)
// // GET    /api/company/users

export const companyRoute = router;