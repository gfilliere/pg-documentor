// @flow
import type Column from './Column';

export default class Table {
  name: string;
  oid: string;
  columns: Array<Column>;
  constructor(name: string, oid: string, columns: Array<Column>) {
    this.name = name;
    this.oid = oid;
    this.columns = columns;
  }
}
