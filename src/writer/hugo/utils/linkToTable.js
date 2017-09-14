// @flow
import type Table from '../../../model/Table';

export default function linkToTable(
  table: Table | string,
  text: ?string = null,
) {
  let schemaName = '';
  let name = '';
  if (typeof table === 'string') {
    const parts = table.match(/([a-zA-Z0-9]+)\."?([a-zA-Z0-9_]+)+"?/);
    if (parts === null || parts === undefined) {
      throw new Error(`Invalid regclass provided : ${table}`);
    }
    [, schemaName, name] = parts;
  } else {
    ({ schemaName, name } = table);
  }
  return `[${text ||
    `${schemaName}.${name}`}]({{< ref "${schemaName}/${name}.md" >}})`;
}
