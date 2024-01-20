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

  test('User not found', async () => {
    try {
      await axios.post('http://localhost:8080/api/login', {});
    } catch (err) {
      const { response: { data: { status, message, details } } } = err;

      expect(status).toEqual(404);
      expect(message).toEqual('Not found');
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
