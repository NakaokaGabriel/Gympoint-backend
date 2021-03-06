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

routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);
routes.get('/students?:name', StudentsController.index);
routes.delete('/students/:id', StudentsController.delete);
routes.get('/students/:id', StudentsController.show);

routes.get('/plans', PlansController.index);
routes.get('/plans/:id', PlansController.show);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.get('/enrollments/:id', EnrollmentController.show);
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

routes.get('/help-orders/unanswered', UnansweredController.index);

routes.get('/help-orders', HelpOrdersController.index);
routes.get('/help-orders/:id', HelpOrdersController.show);
routes.post('/help-orders/:id/answer', HelpOrdersController.store);

export default routes;
