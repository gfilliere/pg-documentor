// @flow
import Table from '../model/Table';
import Column from '../model/Column';

const getTables = async (pgClient: any) => {
  const query = pgClient.raw(`SELECT c.oid,
  n.nspname,
  c.relname,
  c.relkind
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname ~ '^(movie)$'
AND c.relkind = 'r'
ORDER BY 2, 3;`);

  const tables = await query;

  return Promise.all(
    tables.rows.map(async rawTable => {
      const rawColumns = await pgClient.raw(`
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
      console.log(columns);
      return new Table(rawTable.name, rawTable.owner, columns);
    }),
  );

  // return tables.rows.map(element => );
};

export default getTables;
