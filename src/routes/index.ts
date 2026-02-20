import { Router } from 'express';
import { authRoute } from '#routes/auth.routes';
import { userRoute } from '#routes/user.routes';
import { companyRoute } from '#routes/company.routes';
import { authenticate } from '#middlewares/auth.middleware';
import { authorizeRole } from '#middlewares/role.middleware';

const router = Router();

// Rutas públicas o que manejan su propia lógica interna
router.use('/auth', authRoute);

router.get('/me', authenticate);

// Rutas de recursos
router.use('/users', userRoute);
router.use('/company', companyRoute);

// // ADMIN y MANAGER
// Rutas misceláneas (ej. reportes)
router.get('/reports', authenticate, authorizeRole(1, 2));


export default router;

//Anterior 
// const router = Router();

// router.post(
//     '/auth/register',
//     validate(registerSchema),
//     registerController
// );

// router.post(
//     '/auth/login',
//     validate(loginSchema),
//     loginController
// );

// router.get('/me', authenticate)

// router.post(
//   '/users',
//   authenticate,
//   authorizeRole(1)
// );

// // ADMIN y MANAGER
// router.get(
//   '/reports',
//   authenticate,
//   authorizeRole(1, 2)
// );

// // GET    /api/users
// router.get('/users', authenticate, authorizeRole(1,2), getUsersController)

// // // GET    /api/users/:id
// router.get('/users/:id', authenticate, authorizeRole(1,2), getUserByIDController)

// // POST   /api/users
// router.post('/users', authenticate, authorizeRole(1), validate(userCreateSchema), createUserController)

// // PUT    /api/users/:id
// router.patch('/users/:id', authenticate, authorizeRole(1,2), validate(userUpdateSchema), updateUserController)

// // // PATCH  /api/users/:id/status
// // router.patch('/users/:id')

// // DELETE /api/users/:id
// router.delete('/users/:id', authenticate, authorizeRole(1), validate(userUpdateSchema), deleteUserController)

// // GET    /api/company/me
// router.get('/company/me', authenticate, companyController)
// // PUT    /api/company
// // GET    /api/company/users



// export default router;