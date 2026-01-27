
import { loginController } from '#controllers/login';
import { registerController } from '#controllers/register';
import validate from '#middlewares/validate';
import { loginSchema } from '#schemas/login';
import { registerSchema } from '#schemas/register';
import { loginBody } from '#types/login';
import { RegisterBody } from '#types/register';
import { Router } from 'express';


const router = Router();

router.post(
    '/auth/register',
    validate<RegisterBody>(registerSchema),
    registerController
);

router.post(
    '/auth/login',
    validate<loginBody>(loginSchema),
    loginController
);


export default router;