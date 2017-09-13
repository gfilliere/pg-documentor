import schemaDefinition from '../../../fixtures/sampleSchema';
import jsonWritter from '../index';

jest.mock('fs');

describe('jsonwritter', () => {
  const fs = require('fs'); // eslint-disable-line global-require
  beforeEach(() => {
    fs.mkdirSync('/memory/');
  });
  test('standard JSON output', async () => {
    expect.assertions(1);
    await jsonWritter({ output: '/memory/schema.json' }, schemaDefinition);

    expect(fs.readFileSync('/memory/schema.json', 'utf8')).toMatchSnapshot();
  });
});
