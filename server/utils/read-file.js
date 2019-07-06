import fs from 'fs';

const readScript = (filePath) => {
  let result;
  fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (!err) {
      result = data;
    }
  });
  return result;
};

export default readScript;
