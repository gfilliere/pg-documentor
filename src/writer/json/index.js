// @flow
import { promisify } from 'util';
import fs from 'fs';
import type Schema from '../../model/Schema';

type configShape = {
  output: string,
};

const writeToFile = promisify(fs.writeFile);

export default (config: configShape, schemas: Array<Schema>) =>
  writeToFile(config.output, JSON.stringify(schemas, null, 2));
