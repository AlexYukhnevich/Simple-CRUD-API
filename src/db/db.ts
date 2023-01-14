/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { DatabaseTables } from '../constants/db.constants';
import { isObject } from '../utils/typeCheck.utils';
import { MessageType } from '../constants/process.constants';

type DbEntity = { id: string; [key: string]: unknown };

interface Db {
  name: string;
  tables: {
    [key in DatabaseTables]: DbEntity[];
  };
}

class Database implements Db {
  public readonly name: Db['name'];
  public tables: Db['tables'];

  constructor({ name, tables }: Db) {
    this.name = name;
    this.tables = tables;
  }

  async find(model: DatabaseTables, data: Record<string, any> = {}) {
    return Promise.resolve(this.tables[model]);
  }

  async findOne(model: DatabaseTables, data: { id: string }) {
    return Promise.resolve(
      this.tables[model].find((entity) => entity.id === data.id)
    );
  }

  async create<T extends object>(model: DatabaseTables, body: T) {
    return new Promise((resolve) => {
      const id = uuidv4();
      const createdEntity: { id: string; [key: string]: unknown } = {
        id,
        ...body,
      };

      this.tables[model].push(createdEntity);
      resolve(createdEntity);
    });
  }

  async update<T extends object>(
    model: DatabaseTables,
    data: { id: string; data: T }
  ) {
    const foundUser = await this.findOne(model, { id: data.id });

    if (!foundUser) {
      return null;
    }

    this.tables[model] = await Promise.resolve(
      this.tables[model].map((entity) =>
        entity.id === data.id ? { ...entity, ...data.data } : entity
      )
    );

    return { ...foundUser, ...data.data };
  }

  async delete(model: DatabaseTables, data: { id: string }) {
    const foundUser = await this.findOne(model, data);

    if (!foundUser) {
      return null;
    }

    this.tables[model] = await Promise.resolve(
      this.tables[model].filter((entity) => entity.id !== data.id)
    );

    return foundUser;
  }
}

export const database = new Database({
  name: 'simple_crud_api',
  tables: {
    [DatabaseTables.Users]: [],
  },
});

// Cluster implementation
// Listen data provided from the active worker
type DatabaseMessage = {
  type: string;
  method: string;
  model: string;
  data?: any;
};

const validateProcessMessage = (msg: unknown): msg is DatabaseMessage =>
  isObject(msg) &&
  msg.type === MessageType.Database &&
  ['method', 'model'].every((field) => field in msg);

const handleDatabaseProcess = async (msg: unknown) => {
  if (validateProcessMessage(msg)) {
    const { method, model, data = {} } = msg;
    // @ts-ignore
    const res = await database[method](model, data);
    process.send?.({ type: model, data: res ?? null });
  }
};

process.on('message', handleDatabaseProcess);
