// @flow
import getTableInfo from './getTableInfo';
import getColumns from './columns';
import getIndexes from './indexes';
import getForeignKeys from './foreignKeys';
import getReferencedBy from './referencedBy';
import getTriggers from './triggers';

import Table from '../model/Table';
import type Schema from '../model/Schema';

const getTables = async (pool: any, schema: Schema) => {
  const tables = await pool.query(`
SELECT c.oid,
  n.nspname as schema_name,
  c.relname as table_name,
  c.relkind,
  pg_catalog.obj_description(c.oid, 'pg_class') AS "comment"
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname ~ '^(${schema.name})$'
AND c.relkind = 'r'
ORDER BY 2, 3;`);

  return Promise.all(
    tables.rows.map(async rawTable => {
      const tableParts = Promise.all([
        getColumns(pool, rawTable.oid),
        getIndexes(pool, rawTable.oid),
        getForeignKeys(
          pool,
          rawTable.oid,
          rawTable.schema_name,
          rawTable.table_name,
        ),
        getReferencedBy(
          pool,
          rawTable.oid,
          rawTable.schema_name,
          rawTable.table_name,
        ),
        getTriggers(pool, rawTable.oid),
        getTableInfo(
          pool,
          `
SELECT c.oid::pg_catalog.regclass regclass
FROM pg_catalog.pg_class c, pg_catalog.pg_inherits i 
WHERE c.oid=i.inhparent AND i.inhrelid = '${rawTable.oid}' ORDER BY inhseqno;`,
          raw => raw.regclass,
        ),
        getTableInfo(
          pool,
          `
SELECT c.oid::pg_catalog.regclass regclass
FROM pg_catalog.pg_class c, pg_catalog.pg_inherits i 
WHERE c.oid=i.inhrelid AND i.inhparent = '${rawTable.oid}'
ORDER BY c.oid::pg_catalog.regclass::pg_catalog.text;`,
          raw => raw.regclass,
        ),
      ]);

      const [
        columns,
        indexes,
        hasReferencesTo,
        isReferencedBy,
        triggers,
        inheritedTables,
        childTables,
      ] = await tableParts;

      return new Table(
        rawTable.schema_name,
        rawTable.table_name,
        rawTable.comment,
        columns,
        indexes,
        hasReferencesTo,
        isReferencedBy,
        triggers,
        inheritedTables,
        childTables,
      );
    }),
  );
};

export default getTables;
