
import { Route } from '@core/router';
import { loginSchema, registerSchema, confirmationSchema, forgotSchema } from 'validators/auth/auth.schemas';

export default Route.group([
  Route.get('/validate', 'AuthController.validateConfirmationToken').validator('querySchema', confirmationSchema),
  Route.post('/forgot', 'AuthController.forgot').validator('bodySchema', forgotSchema),
  Route.post('/confirm', 'AuthController.confirm').validator('querySchema', confirmationSchema),
  Route.post('/login', 'AuthController.login').validator('bodySchema', loginSchema),
  Route.post('/register', 'AuthController.register').validator('bodySchema', registerSchema),
  Route.post('/logout', 'AuthController.logout'),
  Route.post('/logoutAll', 'AuthController.logoutAll'),
]);
