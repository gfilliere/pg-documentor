// @flow
import type Schema from '../model/Schema';
import Table from '../model/Table';
import Column from '../model/Column';
import Index from '../model/Index';
import Connection from '../model/Connection';
import Trigger from '../model/Trigger';

const getTables = async (pool: any, schema: Schema) => {
  const tables = await pool.query(`SELECT c.oid,
  n.nspname as schema_name,
  c.relname as table_name,
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
        raw => new Column(raw.attname, raw.type, raw.default, raw.attnotnull),
      );
      const rawIndexes = await pool.query(`
SELECT c2.relname as name, i.indisprimary as isPrimary, i.indisunique isUnique, pg_catalog.pg_get_indexdef(i.indexrelid, 0, true) as definition
FROM pg_catalog.pg_class c, pg_catalog.pg_class c2, pg_catalog.pg_index i
  LEFT JOIN pg_catalog.pg_constraint con ON (conrelid = i.indrelid AND conindid = i.indexrelid AND contype IN ('p','u','x'))
WHERE c.oid = '${rawTable.oid}' AND c.oid = i.indrelid AND i.indexrelid = c2.oid
ORDER BY i.indisprimary DESC, i.indisunique DESC, c2.relname;
      `);
      const indexes = rawIndexes.rows.map(
        raw => new Index(raw.name, raw.definition, raw.isprimary, raw.isunique),
      );

      const hasReferencesToRaw = await pool.query(`
SELECT  confrelid::pg_catalog.regclass as connection, conname as name,
  pg_catalog.pg_get_constraintdef(r.oid, true) as definition
FROM pg_catalog.pg_constraint r
WHERE r.conrelid = '${rawTable.oid}' AND r.contype = 'f' ORDER BY 1;
      `);
      const hasReferencesTo = hasReferencesToRaw.rows.map(
        raw =>
          new Connection(
            `${rawTable.schema_name}.${rawTable.table_name}`,
            raw.connection,
            raw.name,
            raw.definition,
          ),
      );
      const isReferencedByRaw = await pool.query(`
SELECT conrelid::pg_catalog.regclass as connection, conname as name, 
  pg_catalog.pg_get_constraintdef(c.oid, true) as definition
FROM pg_catalog.pg_constraint c
WHERE c.confrelid = '${rawTable.oid}' AND c.contype = 'f' ORDER BY 1;
      `);
      const isReferencedBy = isReferencedByRaw.rows.map(
        raw =>
          new Connection(
            raw.connection,
            `${rawTable.schema_name}.${rawTable.table_name}`,
            raw.name,
            raw.definition,
          ),
      );

      const triggersRaw = await pool.query(`
SELECT t.tgname as name, pg_catalog.pg_get_triggerdef(t.oid, true) definition
FROM pg_catalog.pg_trigger t
WHERE t.tgrelid = '${rawTable.oid}' AND (NOT t.tgisinternal OR (t.tgisinternal AND t.tgenabled = 'D'))
ORDER BY 1;
      `);
      const triggers = triggersRaw.rows.map(
        raw => new Trigger(raw.name, raw.definition),
      );

      const inheritedTablesRaw = await pool.query(`
SELECT c.oid::pg_catalog.regclass regclass
FROM pg_catalog.pg_class c, pg_catalog.pg_inherits i 
WHERE c.oid=i.inhparent AND i.inhrelid = '${rawTable.oid}' ORDER BY inhseqno;
`);
      const inheritedTables = inheritedTablesRaw.rows.map(raw => raw.regclass);

      const childTablesRaw = await pool.query(`
SELECT c.oid::pg_catalog.regclass regclass
FROM pg_catalog.pg_class c, pg_catalog.pg_inherits i 
WHERE c.oid=i.inhrelid AND i.inhparent = '${rawTable.oid}'
ORDER BY c.oid::pg_catalog.regclass::pg_catalog.text;
`);
      const childTables = childTablesRaw.rows.map(raw => raw.regclass);

      return new Table(
        rawTable.schema_name,
        rawTable.table_name,
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
