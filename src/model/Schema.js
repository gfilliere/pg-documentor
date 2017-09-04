// @flow
import type Table from './Table';

export default class Schema {
  name: string;
  owner: string;
  tables: Array<Table>;
  constructor(name: string, owner: string) {
    this.name = name;
    this.owner = owner;
    this.tables = [];
  }

  setTables(tables: Array<Table>) {
    this.tables = tables;
  }
}
