import Schema from '../model/Schema';

const getSchemas = async pgClient => {
  const query = pgClient.raw(`SELECT n.nspname AS "name",
pg_catalog.pg_get_userbyid(n.nspowner) AS "owner"
FROM pg_catalog.pg_namespace n
WHERE n.nspname !~ '^pg_' AND n.nspname <> 'information_schema'
ORDER BY 1;`);

  const schemas = await query;

  return schemas.rows.map(element => new Schema(element.name, element.owner));
};

export default getSchemas;
