import { Router } from 'express';

import authAuthorization from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import StudentsOrdersController from './app/controllers/StudentsOrdersController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import UnansweredController from './app/controllers/UnansweredController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Middleware intecepts routes
routes.use(authAuthorization);

routes.get('/students?:name', StudentsController.show);
routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

routes.get('/students/:id/help-orders', StudentsOrdersController.index);
routes.post(
  '/students/:student_id/help-orders',
  StudentsOrdersController.store
);

routes.post('/help-orders/:id/answer', HelpOrdersController.store);

routes.get('/help-orders/unanswered', UnansweredController.index);

export default routes;
