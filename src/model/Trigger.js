// @flow

export default class Trigger {
  name: string;
  definition: string;
  constructor(name: string, definition: string) {
    this.name = name;
    this.definition = definition;
  }
}
