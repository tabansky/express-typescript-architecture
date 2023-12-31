import axios from 'axios';
import { Server } from 'http';

import app from '../../src/app';

let server: Server;

describe('Auth controller', () => {
  beforeAll((done) => {
    server = app.listen(8080);

    server.once('listening', () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Body validation error', async () => {
    try {
      await axios.post('http://localhost:8080/api/login', {});
    } catch (err) {
      const { response: { data: { status, message, details } } } = err;

      expect(status).toEqual(400);
      expect(message).toEqual('Request validation error');
      expect(details).toEqual({
        errors: [
          {
            message: '"email" is required',
            path: ['email'],
            type: 'any.required',
            context: {
              key: 'email',
              label: 'email',
            },
          },
        ],
      });
    }
  });

  // test('register', async () => {
  //   const response = await axios.post('http://localhost:8080/api/register', {});

  //   expect(response.status).toEqual(201);
  // });

  // test('login', async () => {
  //   const response = await axios.post('http://localhost:8080/api/login', {});

  //   expect(response.status).toEqual(201);
  // });

  // test('logout', () => {

  // });

  // test('logoutAll', () => {

  // });
});
