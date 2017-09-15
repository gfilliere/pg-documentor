// @flow
import type Column from './Column';

export default class View {
  schemaName: string;
  name: string;
  columns: Array<Column>;
  definition: string;
  constructor(
    schemaName: string,
    name: string,
    columns: Array<Column>,
    definition: string,
  ) {
    this.schemaName = schemaName;
    this.name = name;
    this.columns = columns;
    this.definition = definition;
  }
}
