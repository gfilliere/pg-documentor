// @flow
import Schema from '../model/Schema';

const getSchemas = async (pool: any) => {
  const schemas = await pool.query(`SELECT n.nspname AS "name",
pg_catalog.pg_get_userbyid(n.nspowner) AS "owner"
FROM pg_catalog.pg_namespace n
WHERE n.nspname = 'movie'
ORDER BY 1;`);

  return schemas.rows.map(element => new Schema(element.name, element.owner));
};

export default getSchemas;
