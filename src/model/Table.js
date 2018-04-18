// @flow
import type Column from './Column';
import type Index from './Index';
import type Connection from './Connection';
import type Trigger from './Trigger';

export default class Table {
  schemaName: string;
  name: string;
  comment: string;
  columns: Array<Column>;
  indexes: Array<Index>;
  hasReferencesTo: Array<Connection>;
  isReferencedBy: Array<Connection>;
  triggers: Array<Trigger>;
  inheritedTables: Array<string>;
  childTables: Array<string>;
  constructor(
    schemaName: string,
    name: string,
    comment: string,
    columns: Array<Column>,
    indexes: Array<Index>,
    hasReferencesTo: Array<Connection>,
    isReferencedBy: Array<Connection>,
    triggers: Array<Trigger>,
    inheritedTables: Array<string>,
    childTables: Array<string>,
  ) {
    this.schemaName = schemaName;
    this.name = name;
    this.comment = comment;
    this.columns = columns;
    this.indexes = indexes;
    this.hasReferencesTo = hasReferencesTo;
    this.isReferencedBy = isReferencedBy;
    this.triggers = triggers;
    this.inheritedTables = inheritedTables;
    this.childTables = childTables;
  }
}
