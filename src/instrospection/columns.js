// @flow
import getTableInfo from './getTableInfo';

import Column from '../model/Column';

export default (pool: any, oid: string) =>
  getTableInfo(
    pool,
    `
SELECT a.attname,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as type,
  pg_catalog.col_description('${oid}', a.attnum) as comment,
  (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid) for 128)
   FROM pg_catalog.pg_attrdef d
   WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef) as default,
  a.attnotnull
FROM pg_catalog.pg_attribute a
WHERE a.attrelid = '${oid}' AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY a.attnum;`,
    raw =>
      new Column(
        raw.attname,
        raw.type,
        raw.default,
        raw.attnotnull,
        raw.comment,
      ),
  );
