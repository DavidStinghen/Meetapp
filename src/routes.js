import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// route to store a new user
routes.post('/users', UserController.store);
// route to create a new session
routes.post('/session', SessionController.store);

// route to authorization
routes.use(authMiddleware);

// route to update user data
routes.put('/users', UserController.update);

export default routes;
