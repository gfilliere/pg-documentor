// @flow
export default class Column {
  name: string;
  type: string;
  comment: string;
  defaultValue: ?string;
  notNull: string;
  constructor(
    name: string,
    type: string,
    defaultValue: ?string,
    notNull: string,
    comment: string = '',
  ) {
    this.name = name;
    this.type = type;
    this.comment = comment;
    this.defaultValue = defaultValue;
    this.notNull = notNull;
  }
}
