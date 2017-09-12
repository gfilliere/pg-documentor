import schemaDefinition from '../../../fixtures/sampleSchema';
import jsonWritter from '../index';

jest.mock('fs');

describe('jsonwritter', () => {
  beforeEach(() => {
    const fs = require('fs').default;
    fs.mkdirSync('/memory/');
  });
  test('standard JSON output', async () => {
    expect.assertions(1);
    await jsonWritter({ output: '/memory/schema.json' }, schemaDefinition);

    const fs = require('fs').default;
    const buffer = fs.readFileSync('/memory/schema.json');

    expect(buffer.toString('utf8')).toMatchSnapshot();
  });
});
