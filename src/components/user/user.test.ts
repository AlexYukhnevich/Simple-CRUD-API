import {
  CreateUserDto,
  UpdateUserDto,
} from 'src/components/user/user.interface';
import { HttpStatus } from 'src/constants/http.constants';
import request from 'supertest';
import { app } from 'src/main';
import appEnv from 'src/config/env';
import { Server, IncomingMessage, ServerResponse } from 'http';

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

describe('Scenario 1', () => {
  let userId: string;
  const payload: CreateUserDto = {
    username: 'John Doe',
    age: 40,
    hobbies: ['programming', 'node.js'],
  };

  beforeAll(() => {
    server = app.listenServer(appEnv.port);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('1.Get users', () => {
    it('GET /api/users', async () => {
      const response = await request(server)
        .get('/api/users')
        .expect(HttpStatus.OK)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });
      expect(response.body).toEqual({ statusCode: HttpStatus.OK, data: [] });
    });
  });

  describe('2.Create user', () => {
    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        data: { ...payload, id: response.body.data.id },
      });

      userId = response.body.data.id;
    });
  });

  describe('3.Get user by id', () => {
    it('GET /api/users/:id', async () => {
      const response = await request(server)
        .get(`/api/users/${userId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        data: { id: userId, ...payload },
      });
    });
  });

  describe('4.Update user', () => {
    it('PUT /api/users/:id', async () => {
      const payload: UpdateUserDto = {
        username: 'Richard Miles',
        hobbies: ['traveling'],
      };

      const response = await request(server)
        .put(`/api/users/${userId}`)
        .send(payload)
        .expect(HttpStatus.OK)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        data: { ...payload, ...response.body.data },
      });
    });
  });

  describe('5.Delete user', () => {
    it('DELETE /api/users/:id', async () => {
      await request(server)
        .delete(`/api/users/${userId}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('6.Get user by id after removal', () => {
    it('GET /api/users/:id', async () => {
      const response = await request(server)
        .get(`/api/users/${userId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'User not found',
      });
    });
  });
});
