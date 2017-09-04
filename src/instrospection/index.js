import knex from 'knex';
import getSchemas from './schemas';
import getTables from './tables';

export default async function buildInstrospection(setup) {
  const pgClient = knex(setup);
  const schemas = await getSchemas(pgClient);

  return Promise.all(
    schemas.map(async schema => {
      schema.setTables(await getTables(pgClient, schema));
      return schema;
    }),
  );
}
