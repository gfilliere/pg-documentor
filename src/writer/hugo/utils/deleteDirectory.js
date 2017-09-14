import fs from 'fs';
import rimraf from 'rimraf';

export default directory =>
  new Promise((resolve, reject) => {
    rimraf(directory, fs, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
