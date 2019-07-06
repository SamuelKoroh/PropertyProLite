import { Pool } from 'pg';

let connectionString;
if (process.env.NODE_ENV === 'test') {
  connectionString = 'postgres://postgres@127.0.0.1:5432/travis_ci_test';
} else {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${
    process.env.DB_HOST
  }:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

const pool = new Pool({
  connectionString
});

export default {
  query: (text, params) => pool.query(text, params),
  release: () => pool.release()
};
