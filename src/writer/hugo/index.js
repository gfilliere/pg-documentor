// @flow
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import type Schema from '../../model/Schema';
import generateTable from './table';

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

const generateSchema = (schema: Schema, destination) => {
  const schemaDirectory = path.join(destination, schema.name);
  fs.mkdirSync(schemaDirectory);

  return Promise.all(
    schema.tables.map(table => generateTable(table, schemaDirectory)),
  );
};

export default async (config: configShape, schemas: Array<Schema>) => {
  // clean directory
  await deleteDirectory(config.output);
  // recreate folder
  fs.mkdirSync(config.output);
  return Promise.all(
    schemas.map(schema => generateSchema(schema, config.output)),
  );
};
