// @flow
import getTableInfo from './getTableInfo';

import Connection from '../model/Connection';

export default (
  pool: any,
  oid: string,
  schemaName: string,
  tableName: string,
) =>
  getTableInfo(
    oid,
    `
SELECT confrelid::pg_catalog.regclass as connection, conname as name,
  pg_catalog.pg_get_constraintdef(r.oid, true) as definition
FROM pg_catalog.pg_constraint c
WHERE c.confrelid = '${oid}' AND c.contype = 'f' ORDER BY 1;`,
    raw =>
      new Connection(
        `${schemaName}.${tableName}`,
        raw.connection,
        raw.name,
        raw.definition,
      ),
  );
