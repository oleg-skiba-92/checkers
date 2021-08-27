import { Client } from 'pg';
import { ILogger, Logger } from '../../libs';
import { IDataService, IDataTable } from '../../models/db.model';
import { DB_FUNCTIONS } from '../../common/data-base/functions';
import { DB_TABLES } from '../../common/data-base/tabels';

class DataService implements IDataService {
  private client: Client;
  private log: ILogger = new Logger('DataService');

  async initialise(): Promise<boolean> {
    try {
      this.client = new Client({
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        // ssl: {
        //   rejectUnauthorized: false
        // }
      });
      await this.client.connect();
    } catch (e) {
      this.log.error(`Database initialise error: ${e.message}`, e.stack);
      return false;
    }

    try {
      // await this.dropTables(DB_TABLES);
      await this.initialiseTables(DB_TABLES);
      await this.initialiseFunctions(DB_FUNCTIONS);
      await this.initialiseTriggers(DB_TABLES);
    } catch (e) {
      this.log.error(`Data tables initialise error: ${e.message}`, e.stack);
      return false;
    }

    return true;
  }

  async reinitDB(oldTables: IDataTable[] = []) {
    await this.dropTables([...oldTables, ...DB_TABLES]);
    await this.initialiseTables(DB_TABLES);
  }

  getObject<T>(entity: string, key: string, value: string | number): Promise<T> {
    const query = `SELECT * FROM ${entity} WHERE ${key} = $1`;

    return this.client.query<T>(query, [value])
      .then((res) => res.rows.length === 0 ? null : res.rows[0]);
  }

  createObject<T>(entity: string, data: T): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const query = `INSERT INTO ${entity}(${keys.join(', ')})
      VALUES(${values.map((v, i) => `$${i + 1}`)})
      ON CONFLICT DO NOTHING
      RETURNING *`;

    return this.client.query<T>(query, values)
      .then((res) => res.rows.length === 0 ? null : res.rows[0]);
  }

  updateObject<T>(entity: string, key: string, value: string, data: T): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const query = `UPDATE ${entity}
      SET ${keys.map((k, i) => `${k} = $${i + 1}`).join(', ')}
      WHERE ${key} = '${value}'
      RETURNING *`;

    return this.client.query<T>(query, values)
      .then((res) => res.rows.length === 0 ? null : res.rows[0]);
  }

  private initialiseTables(tables: IDataTable[]): Promise<any[]> {
    return Promise.all(tables.map((table) => {
      const cols = table.cols.map((col) => [col.name, col.type, ...col.keys].join(' '));
      const query = `CREATE TABLE IF NOT EXISTS ${table.name} (${cols.join(', ')});`;
      return this.client.query(query);
    }));
  }

  private initialiseFunctions(functions: string[]): Promise<any[]> {
    return Promise.all(functions.map((fn) => this.client.query(fn)));
  }

  private initialiseTriggers(tables: IDataTable[]): Promise<any[]> {
    let q = tables.reduce((qqq, table) => {
      return [...qqq, ...(table.triggers || []).map((trigger) => {
        const query = `
DROP TRIGGER IF EXISTS ${trigger.name} ON ${table.name};
CREATE TRIGGER ${trigger.name}
${trigger.onType} ${trigger.event} ON  ${table.name}
FOR EACH ROW
EXECUTE PROCEDURE ${trigger.fnName}();
      `;
        return this.client.query(query);
      })];
    }, []);

    return Promise.all(q);
  }

  private dropTables(tables: IDataTable[]): Promise<any> {
    const query = `DROP TABLE IF EXISTS ${tables.map((table) => table.name).join(', ')};`;
    return this.client.query(query);
  }
}

export const dataService: IDataService = new DataService();
