// @flow
import type Column from './Column';
import type Index from './Index';
import type Connection from './Connection';

export default class Table {
  name: string;
  oid: string;
  columns: Array<Column>;
  indexes: Array<Index>;
  hasReferencesTo: Array<Connection>;
  isReferencedBy: Array<Connection>;
  constructor(
    name: string,
    oid: string,
    columns: Array<Column>,
    indexes: Array<Index>,
    hasReferencesTo: Array<Connection>,
    isReferencedBy: Array<Connection>,
  ) {
    this.name = name;
    this.oid = oid;
    this.columns = columns;
    this.indexes = indexes;
    this.hasReferencesTo = hasReferencesTo;
    this.isReferencedBy = isReferencedBy;
  }
}
