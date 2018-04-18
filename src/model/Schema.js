// @flow
import type Table from './Table';
import type View from './View';

export default class Schema {
  name: string;
  owner: string;
  comment: string;
  tables: Array<Table>;
  views: Array<View>;
  constructor(name: string, owner: string, comment: string) {
    this.name = name;
    this.owner = owner;
    this.comment = comment;
    this.tables = [];
    this.views = [];
  }

  setTables(tables: Array<Table>) {
    this.tables = tables;
  }
  setViews(views: Array<View>) {
    this.views = views;
  }
}
