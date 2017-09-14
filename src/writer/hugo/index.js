// @flow
import fs from 'fs';

import deleteDirectory from './utils/deleteDirectory';
import generateSchema from './schema';
import type Schema from '../../model/Schema';

type configShape = {
  output: string,
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
