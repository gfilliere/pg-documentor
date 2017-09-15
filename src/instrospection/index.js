// @flow
import { Pool } from 'pg';
import getSchemas from './schemas';
import getTables from './tables';
import getViews from './views';

export default async function buildInstrospection(
  setup: any,
  ignoredSchemas: ?string,
) {
  const pool = new Pool(setup);
  const schemas = await getSchemas(pool, ignoredSchemas);

  return Promise.all(
    schemas.map(async schema => {
      schema.setTables(await getTables(pool, schema));
      schema.setViews(await getViews(pool, schema));
      return schema;
    }),
  ).then(completeSchemas => {
    pool.end();
    return completeSchemas;
  });
}
