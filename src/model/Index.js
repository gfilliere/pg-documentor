// @flow
export default class Index {
  name: string;
  definition: string;
  primary: boolean;
  unique: boolean;
  constructor(
    name: string,
    definition: string,
    primary: boolean,
    unique: boolean,
  ) {
    this.name = name;
    this.definition = definition;
    this.primary = primary;
    this.unique = unique;
  }
}
