import path from 'path';
import fs from 'fs';
import db from './server/db/db';

const filePath = path.join(__dirname, 'travis.txt');
fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
  if (!err) {
    await db.query(data);
  } else {
    console.log(err);
  }
});
