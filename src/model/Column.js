// @flow
export default class Column {
  name: string;
  type: string;
  defaultValue: ?string;
  notNull: string;
  constructor(
    name: string,
    type: string,
    defaultValue: ?string,
    notNull: string,
  ) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this.notNull = notNull;
  }
}
