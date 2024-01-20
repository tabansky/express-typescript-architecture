
import { Route } from '@core/router';
import { loginSchema, registerSchema, confirmationSchema, forgotSchema } from 'src/validators/auth/auth.schemas';

export default Route.group([
  Route.post('/validate', 'AuthController.validateConfirmationToken').validator('bodySchema', confirmationSchema),
  Route.post('/register', 'AuthController.register').validator('bodySchema', registerSchema),
  Route.post('/login', 'AuthController.login').validator('bodySchema', loginSchema),
  Route.post('/forgot', 'AuthController.forgot').validator('bodySchema', forgotSchema),
  Route.post('/confirm', 'AuthController.confirm').validator('querySchema', confirmationSchema),
  Route.post('/logout', 'AuthController.logout'),
  Route.post('/logout-other-sessions', 'AuthController.logoutAllOtherSessions'),
]).prefix('/auth');
