// @flow
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import type Schema from '../../model/Schema';

type configShape = {
  output: string,
};

const deleteDirectory = directory =>
  new Promise((resolve, reject) => {
    rimraf(directory, fs, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

const generateSchema = (schema, destination) => {
  const schemaDirectory = path.join(destination, schema.name);
  fs.mkdirSync(schemaDirectory);
};

export default async (config: configShape, schemas: Array<Schema>) => {
  // clean directory
  await deleteDirectory(config.output);
  // recreate folder
  fs.mkdirSync(config.output);
  schemas.forEach(schema => generateSchema(schema, config.output));
};
