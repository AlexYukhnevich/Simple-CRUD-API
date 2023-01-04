/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { DatabaseTables } from 'src/constants/db.constants';

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

  async find(model: DatabaseTables) {
    return Promise.resolve(this.tables[model]);
  }

  async findOne(model: DatabaseTables, id: string) {
    return Promise.resolve(
      this.tables[model].find((entity) => entity.id === id)
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

  async update<T extends object>(model: DatabaseTables, id: string, data: T) {
    const foundUser = await this.findOne(model, id);

    if (!foundUser) {
      return null;
    }

    this.tables[model] = await Promise.resolve(
      this.tables[model].map((entity) =>
        entity.id === id ? { ...entity, ...data } : entity
      )
    );

    return { ...foundUser, ...data };
  }

  async delete(model: DatabaseTables, id: string) {
    const foundUser = await this.findOne(model, id);

    if (!foundUser) {
      return null;
    }

    this.tables[model] = await Promise.resolve(
      this.tables[model].filter((entity) => entity.id !== id)
    );

    return foundUser;
  }
}

export default new Database({
  name: 'simple_crud_api',
  tables: {
    [DatabaseTables.Users]: [],
  },
});
