// @flow
import type View from '../../../model/View';

export default function linkToview(view: View | string, text: ?string = null) {
  let schemaName = '';
  let name = '';
  if (typeof view === 'string') {
    const parts = view.match(/([a-zA-Z0-9]+)\."?([a-zA-Z0-9_]+)+"?/);
    if (parts === null || parts === undefined) {
      throw new Error(`Invalid regclass provided : ${view}`);
    }
    [, schemaName, name] = parts;
  } else {
    ({ schemaName, name } = view);
  }
  return `[${text ||
    `${schemaName}.${name}`}]({{< ref "${schemaName}/views/${name}.md" >}})`;
}
