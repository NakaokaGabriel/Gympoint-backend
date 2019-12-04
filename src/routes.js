import { Router } from 'express';

import authAuthorization from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import EnrollmentController from './app/controllers/EnrollmentController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Middleware intecepts routes
routes.use(authAuthorization);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.post('/enrollments', EnrollmentController.store);

export default routes;
