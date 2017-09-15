// @flow
import getTableInfo from './getTableInfo';

import Index from '../model/Index';

export default (pool: any, oid: string) =>
  getTableInfo(
    pool,
    `
SELECT c2.relname as name, i.indisprimary as isPrimary, i.indisunique isUnique, pg_catalog.pg_get_indexdef(i.indexrelid, 0, true) as definition
FROM pg_catalog.pg_class c, pg_catalog.pg_class c2, pg_catalog.pg_index i
  LEFT JOIN pg_catalog.pg_constraint con ON (conrelid = i.indrelid AND conindid = i.indexrelid AND contype IN ('p','u','x'))
WHERE c.oid = '${oid}' AND c.oid = i.indrelid AND i.indexrelid = c2.oid
ORDER BY i.indisprimary DESC, i.indisunique DESC, c2.relname;
      `,
    raw => new Index(raw.name, raw.definition, raw.isprimary, raw.isunique),
  );
