import { Pool } from 'pg';

const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DEV_DB;
const pool = new Pool({
  connectionString
});

class Database {
  constructor() {
    this.client = '';
  }

  async query(text, params) {
    this.client = await pool.connect();
    return this.client.query(text, params);
  }

  close() {
    this.client.release();
  }
}

export default Database;
