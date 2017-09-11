// @flow
import type Column from './Column';
import type Index from './Index';

export default class Table {
  name: string;
  oid: string;
  columns: Array<Column>;
  indexes: Array<Index>;
  constructor(
    name: string,
    oid: string,
    columns: Array<Column>,
    indexes: Array<Index>,
  ) {
    this.name = name;
    this.oid = oid;
    this.columns = columns;
    this.indexes = indexes;
  }
}
