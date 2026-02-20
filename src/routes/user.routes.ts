import { Router } from 'express';
import { 
  getUsersController, 
  getUserByIDController, 
  createUserController, 
  updateUserController, 
  deleteUserController 
} from '#controllers/user.controller';
import { authenticate } from '#middlewares/auth.middleware';
import { authorizeRole } from '#middlewares/role.middleware';
import validate from '#middlewares/validate.middleware';
import { userCreateSchema, userUpdateSchema } from '#schemas/user.schema';

const router = Router();

router.use(authenticate);

// GET    /api/users
router.get('/', authorizeRole(1, 2), getUsersController);

// GET    /api/users/:id
router.get('/:id', authorizeRole(1, 2), getUserByIDController);

// POST   /api/users
router.post('/', authorizeRole(1), validate(userCreateSchema), createUserController);

// PATCH    /api/users/:id
router.patch('/:id', authorizeRole(1, 2), validate(userUpdateSchema), updateUserController);

// // DELETE /api/users/:id
router.delete('/:id', authorizeRole(1), deleteUserController);

// PATCH  /api/users/:id/status
// router.patch('/users/:id')

export const userRoute = router;