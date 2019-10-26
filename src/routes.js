import { Router } from 'express';

import authAuthorization from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authAuthorization);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

export default routes;
