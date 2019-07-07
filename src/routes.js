import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

// route to store a new user
routes.post('/users', UserController.store);
// route to create a new session
routes.post('/session', SessionController.store);

export default routes;
