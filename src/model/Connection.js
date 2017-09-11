// @flow

export default class Connection {
  referer: string;
  referee: string;
  connectionName: string;
  definition: string;
  constructor(
    referer: string,
    referee: string,
    connectionName: string,
    definition: string,
  ) {
    this.referer = referer;
    this.referee = referee;
    this.connectionName = connectionName;
    this.definition = definition;
  }
}
