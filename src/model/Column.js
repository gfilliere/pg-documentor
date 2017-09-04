export default class Column {
  name: string;
  type: string;
  defaultValue: string;
  notNull: string;
  constructor(name, type, defaultValue, notNull) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this.notNull = notNull;
  }
}
