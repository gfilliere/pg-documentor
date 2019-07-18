// @flow
import Schema from '../model/Schema';

const getSchemas = async (pool: any, ignoredSchemas: ?string) => {
  const ignoredSchemasList = ['information_schema'];
  if (ignoredSchemas) {
    ignoredSchemasList.push(...ignoredSchemas.split(','));
  }
  const schemas = await pool.query(`SELECT n.nspname AS "name",
pg_catalog.pg_get_userbyid(n.nspowner) AS "owner",
pg_catalog.obj_description(n.oid, 'pg_namespace') AS "comment"
FROM pg_catalog.pg_namespace n
WHERE n.nspname !~ '^pg_' AND n.nspname NOT IN (${ignoredSchemasList
    .map(value => `'${value}'`)
    .join(',')})
ORDER BY 1;`);

  return schemas.rows.map(
    element => new Schema(element.name, element.owner, element.comment),
  );
};

export default getSchemas;
