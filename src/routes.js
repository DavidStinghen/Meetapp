import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FIleController from './app/controllers/FIleController';

const routes = new Router();
const upload = multer(multerConfig);

// route to store a new user
routes.post('/users', UserController.store);
// route to create a new session
routes.post('/session', SessionController.store);

// route to authorization
routes.use(authMiddleware);

// route to update user data
routes.put('/users', UserController.update);

// route to include a file
routes.post('/files', upload.single('file'), FIleController.store);

export default routes;
