// @flow
import type Schema from '../model/Schema';
import Table from '../model/Table';
import Column from '../model/Column';

const getTables = async (pool: any, schema: Schema) => {
  const tables = await pool.query(`SELECT c.oid,
  n.nspname,
  c.relname,
  c.relkind
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname ~ '^(${schema.name})$'
AND c.relkind = 'r'
ORDER BY 2, 3;`);

  return Promise.all(
    tables.rows.map(async rawTable => {
      const rawColumns = await pool.query(`
      SELECT a.attname,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as type,
  (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid) for 128)
   FROM pg_catalog.pg_attrdef d
   WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef) as default,
  a.attnotnull
FROM pg_catalog.pg_attribute a
WHERE a.attrelid = '${rawTable.oid}' AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY a.attnum;`);
      const columns = rawColumns.rows.map(
        rawColumn =>
          new Column(
            rawColumn.attname,
            rawColumn.type,
            rawColumn.default,
            rawColumn.attnotnull,
          ),
      );

      return new Table(rawTable.nspname, rawTable.relname, columns);
    }),
  );
};

export default getTables;
