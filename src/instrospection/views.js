// @flow
import getTableInfo from './getTableInfo';
import getColumns from './columns';

import type Schema from '../model/Schema';
import View from '../model/View';

const getViews = async (pool: any, schema: Schema) => {
  const views = await pool.query(`
SELECT c.oid,
  n.nspname as schema_name,
  c.relname as table_name,
  c.relkind
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname ~ '^(${schema.name})$'
AND c.relkind = 'v'
ORDER BY 2, 3;`);

  return Promise.all(
    views.rows.map(async rawView => {
      const tableParts = Promise.all([
        getColumns(pool, rawView.oid),
        getTableInfo(
          pool,
          `SELECT pg_catalog.pg_get_viewdef('${rawView.oid}'::pg_catalog.oid, true) as definition`,
          raw => raw.definition,
        ),
      ]);

      const [columns, definitions] = await tableParts;

      return new View(
        rawView.schema_name,
        rawView.table_name,
        columns,
        definitions[0],
      );
    }),
  );
};

export default getViews;
