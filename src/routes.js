import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

// route to store a new user
routes.post('/users', UserController.store);

export default routes;


