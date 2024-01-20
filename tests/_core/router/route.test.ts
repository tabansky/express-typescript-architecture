import { Server } from 'http';

import { Route } from '../../../src/_core/router/route';
import app from '../../../src/app';

let server: Server;

describe('Route', () => {
  beforeAll((done) => {
    server = app.listen(8080);

    server.once('listening', () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Route group', async () => {
    const group = Route.group([
      Route.get('/login', 'AuthController.login'),
      Route.post('/confirm', 'AuthController.confirm'),
      Route.patch('/logoutAll', 'AuthController.logoutAllOtherSessions'),
      Route.put('/register', 'AuthController.register'),
      Route.delete('/forgot', 'AuthController.forgot'),
      Route.route('/validateConfirmationToken', ['POST', 'HEAD', 'PUT'], 'AuthController.validateConfirmationToken'),
    ]).middleware('Auth').prefix('/v1').prefix('/api');

    expect(JSON.parse(JSON.stringify(group))).toEqual({
      'routes': [
        {
          'handler': 'AuthController.login',
          'methods': ['GET', 'HEAD'],
          'middleware': ['Auth'],
          'pattern': '/api/v1/login',
          'validator': {},
        },
        {
          'handler': 'AuthController.confirm',
          'methods': ['POST'],
          'middleware': ['Auth'],
          'pattern': '/api/v1/confirm',
          'validator': {},
        },
        {
          'handler': 'AuthController.logoutAllOtherSessions',
          'methods': ['PATCH'],
          'middleware': ['Auth'],
          'pattern': '/api/v1/logoutAll',
          'validator': {},
        },
        {
          'handler': 'AuthController.register',
          'methods': ['PUT'],
          'middleware': ['Auth'],
          'pattern': '/api/v1/register',
          'validator': {},
        },
        {
          'handler': 'AuthController.forgot',
          'methods': ['DELETE'],
          'middleware': ['Auth'],
          'pattern': '/api/v1/forgot',
          'validator': {},
        },
        {
          'handler': 'AuthController.validateConfirmationToken',
          'methods': ['POST', 'HEAD', 'PUT'],
          'middleware': ['Auth'],
          'pattern': '/api/v1/validateConfirmationToken',
          'validator': {},
        },
      ],
    });
  });

  test('Route resource', async () => {
    const resource = Route.resource('/test', 'AuthController').middleware({
      '*': ['Auth'],
    });

    expect(JSON.parse(JSON.stringify(resource))).toEqual({
      'resource': 'test',
      'controller': 'AuthController',
      'routes': [
        {
          'pattern': '/test',
          'handler': 'AuthController.index',
          'methods': ['GET','HEAD'],
          'middleware': ['Auth'],
          'validator': {},
        },
        {
          'pattern': '/test',
          'handler': 'AuthController.store',
          'methods': ['POST'],
          'middleware': ['Auth'],
          'validator': {},
        },
        {
          'pattern': '/test/:id',
          'handler': 'AuthController.edit',
          'methods': ['GET','HEAD'],
          'middleware': ['Auth'],
          'validator': {},
        },
        {
          'pattern': '/test/:id',
          'handler': 'AuthController.update',
          'methods': ['PUT','PATCH'],
          'middleware': ['Auth'],
          'validator': {},
        },
        {
          'pattern': '/test/:id',
          'handler': 'AuthController.destroy',
          'methods': ['DELETE'],
          'middleware': ['Auth'],
          'validator': {},
        },
      ],
    });
  });
});
