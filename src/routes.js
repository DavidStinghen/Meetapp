import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FIleController from './app/controllers/FIleController';
import MeetupController from './app/controllers/MeetupController';

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

// route to list meetups
routes.get('/meetups', MeetupController.index);
// route to create a meetup
routes.post('/meetups', MeetupController.store);
// route to update a meetup
routes.put('/meetups/:id', MeetupController.update);
// route to delete a meetup
routes.delete('/meetups/:id', MeetupController.delete);

export default routes;
