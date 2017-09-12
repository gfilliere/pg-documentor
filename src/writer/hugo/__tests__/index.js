import schemaDefinition from '../../../fixtures/sampleSchema';
import hugoWritter from '../index';

jest.mock('fs');

describe('HugoWritter', () => {
  beforeAll(() => {
    const fs = require('fs').default; // eslint-disable-line global-require
    fs.mkdirSync('/memory/');
  });

  test('output folder is emptied during generation', async () => {
    const fs = require('fs').default; // eslint-disable-line global-require
    fs.mkdirSync('/memory/hugo');
    fs.writeFileSync('/memory/hugo/todelete');
    expect.assertions(1);
    await hugoWritter({ output: '/memory/hugo/' }, schemaDefinition);
    expect(fs.existsSync('/memory/hugo/todelete')).toBe(false);
  });

  test('generates 1 folder by schema', async () => {
    expect.assertions(3);
    await hugoWritter({ output: '/memory/hugo/' }, schemaDefinition);

    const fs = require('fs').default; // eslint-disable-line global-require

    expect(fs.existsSync('/memory/hugo/abstract')).toBe(true);
    expect(fs.existsSync('/memory/hugo/movie')).toBe(true);
    expect(fs.existsSync('/memory/hugo/media')).toBe(true);
  });
});
