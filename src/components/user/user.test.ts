import request from 'supertest';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { CreateUserDto, UpdateUserDto, User } from './user.interface';
import {
  HttpStatus,
  ERROR_MESSAGES,
  userFieldsCollection,
} from '../../constants';
import { app } from '../../main';
import appEnv from '../../config/env';

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

process.env.PORT = appEnv.testPort.toString();

describe('Scenario 1', () => {
  let userId: string;
  const payload: CreateUserDto = {
    username: 'John Doe',
    age: 40,
    hobbies: ['programming', 'node.js'],
  };

  beforeAll(() => {
    server = app.listenServer(appEnv.testPort);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('1. Get users', () => {
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

  describe('2. Create user', () => {
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

  describe('3. Get user by id', () => {
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

  describe('4. Update user', () => {
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

  describe('5. Delete user', () => {
    it('DELETE /api/users/:id', async () => {
      await request(server)
        .delete(`/api/users/${userId}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('6. Get user by id after removal', () => {
    it('GET /api/users/:id', async () => {
      const response = await request(server)
        .get(`/api/users/${userId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        errorMessage:
          ERROR_MESSAGES[HttpStatus.NOT_FOUND]?.entityNotFound('User'),
      });
    });
  });
});

describe('Scenario 2', () => {
  const users: User[] = [];

  beforeAll(() => {
    server = app.listenServer(appEnv.testPort);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('1. Update non-existent user', () => {
    const userId = 'c237a063-8e28-4274-8de8-8a9b0033c7aa';

    it('PUT /api/users/:id', async () => {
      const payload: UpdateUserDto = {
        username: 'Richard Miles',
        hobbies: ['traveling'],
      };

      const response = await request(server)
        .put(`/api/users/${userId}`)
        .send(payload)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        errorMessage:
          ERROR_MESSAGES[HttpStatus.NOT_FOUND]?.entityNotFound('User'),
      });
    });
  });

  describe('2. Create a new user', () => {
    const payload: CreateUserDto = {
      username: 'John Doe',
      age: 40,
      hobbies: ['programming', 'node.js'],
    };

    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      const createdUser = { ...payload, id: response.body.data.id };

      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        data: createdUser,
      });

      users.push(createdUser);
    });
  });

  describe('3. Get all users', () => {
    it('GET /api/users', async () => {
      const response = await request(server)
        .get('/api/users')
        .expect(HttpStatus.OK)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({ statusCode: HttpStatus.OK, data: users });
    });
  });

  describe('4. Update first user', () => {
    it('PUT /api/users/:id', async () => {
      const [user] = users;
      const payload: UpdateUserDto = {
        username: 'Richard Miles',
        hobbies: ['traveling'],
      };

      const response = await request(server)
        .put(`/api/users/${user?.id}`)
        .send(payload)
        .expect(HttpStatus.OK)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      const updatedUser = response.body.data;
      expect({ ...user, ...payload }).toEqual(updatedUser);
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        data: updatedUser,
      });
    });
  });

  describe('5. Delete first user', () => {
    it('DELETE /api/users/:id', async () => {
      const [user] = users;
      await request(server)
        .delete(`/api/users/${user?.id}`)
        .expect(HttpStatus.NO_CONTENT);

      users.splice(0);
    });
  });

  describe('6. Get all users', () => {
    it('GET /api/users', async () => {
      const response = await request(server)
        .get('/api/users')
        .expect(HttpStatus.OK)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(users).toEqual([]);
      expect(response.body).toEqual({ statusCode: HttpStatus.OK, data: users });
    });
  });
});

describe('Scenario 3 - error cases', () => {
  beforeAll(() => {
    server = app.listenServer(appEnv.testPort);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('1. Create User with extra fields in payload', () => {
    const payload = {
      username: 'John Doe',
      age: 40,
      hobbies: ['programming', 'node.js'],
      gender: 'Male', // NOTE: field "gender" does not exist in user entity
    };

    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.extraFields([
          'gender',
        ]),
      });
    });
  });

  describe('2. Create User with missing required fields in payload', () => {
    // NOTE: field "hobbies" should be defined in user entity
    const payload = {
      username: 'John Doe',
      age: 40,
    };

    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.requiredFields([
          ...userFieldsCollection,
        ]),
      });
    });
  });

  describe('3. Create User with incorrect field data type in payload', () => {
    const payload = {
      username: 'John Doe',
      age: '40', // NOTE: field "age" must have "number" data type (int)
      hobbies: [],
    };

    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: ERROR_MESSAGES[
          HttpStatus.BAD_REQUEST
        ]?.incorrectFieldDataType('age', 'int'),
      });
    });
  });

  describe('4. Create User with incorrect age range in payload', () => {
    const payload = {
      username: 'John Doe',
      age: 101, // NOTE: field "age" must have range from 0 to 100
      hobbies: [],
    };

    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: ERROR_MESSAGES[
          HttpStatus.BAD_REQUEST
        ]?.incorrectFieldRange('age', { min: 1, max: 100 }),
      });
    });
  });

  describe('5. Create User with incorrect data type in "hobbies" array in payload', () => {
    const payload = {
      username: 'John Doe',
      age: 28,
      hobbies: [{ name: 'programming' }], // NOTE: field "hobbies" must have "string[]" type
    };

    it('POST /api/users', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: ERROR_MESSAGES[
          HttpStatus.BAD_REQUEST
        ]?.incorrectArrayFieldDataType('hobbies', 'string'),
      });
    });
  });

  describe('6. Get user by incorrect pattern (not UUID)', () => {
    const userId = '606b1b19-81a1-4f05-b14a-0d39528ffea'; // NOTE: missing one character at the end

    it('GET /api/users/:id', async () => {
      const response = await request(server)
        .get(`/api/users/${userId}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: ERROR_MESSAGES[
          HttpStatus.BAD_REQUEST
        ]?.incorrectParamPattern('id', 'UUID'),
      });
    });
  });

  describe('7. Endpoint not found', () => {
    it('GET /api/roles', async () => {
      const response = await request(server)
        .get(`/api/roles`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          res.body = JSON.parse(res.text);
        });

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        errorMessage:
          ERROR_MESSAGES[HttpStatus.NOT_FOUND]?.entityNotFound('Endpoint'),
      });
    });
  });
});
