
import { registerController } from '#controllers/register';
import validate from '#middlewares/validate';
import { registerSchema } from '#schemas/register';
import { RegisterBody } from '#types/register';
import { Router } from 'express';


const router = Router();

router.post(
    '/auth/register',
    validate<RegisterBody>(registerSchema),
    registerController
);


export default router;