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
    pool,
    `
SELECT confrelid::pg_catalog.regclass as connection, conname as name, 
  pg_catalog.pg_get_constraintdef(r.oid, true) as definition
FROM pg_catalog.pg_constraint r
WHERE r.conrelid = '${oid}' AND r.contype = 'f' ORDER BY 1;`,
    raw =>
      new Connection(
        raw.connection,
        `${schemaName}.${tableName}`,
        raw.name,
        raw.definition,
      ),
  );
