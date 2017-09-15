// @flow
import getTableInfo from './getTableInfo';

import Trigger from '../model/Trigger';

export default (pool: any, oid: string) =>
  getTableInfo(
    pool,
    `
SELECT t.tgname as name, pg_catalog.pg_get_triggerdef(t.oid, true) definition
FROM pg_catalog.pg_trigger t
WHERE t.tgrelid = '${oid}' AND (NOT t.tgisinternal OR (t.tgisinternal AND t.tgenabled = 'D'))
ORDER BY 1;`,
    raw => new Trigger(raw.name, raw.definition),
  );
