
import { Route } from '@core/router';
import { loginSchema } from 'validators/auth/login.schemas';

export default Route.group([
  Route.post('/login', 'AuthController.login').validator('bodySchema', loginSchema),
  Route.post('/register', 'AuthController.register'),
  Route.post('/logout', 'AuthController.logout'),
  Route.post('/logoutAll', 'AuthController.logoutAll'),
]);
