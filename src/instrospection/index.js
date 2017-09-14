// @flow
import { Pool } from 'pg';
import getSchemas from './schemas';
import getTables from './tables';

export default async function buildInstrospection(setup: any) {
  const pool = new Pool(setup);
  const schemas = await getSchemas(pool);

  return Promise.all(
    schemas.map(async schema => {
      schema.setTables(await getTables(pool, schema));
      return schema;
    }),
  ).then(completeSchemas => {
    pool.end();
    return completeSchemas;
  });
}
