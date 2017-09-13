import schemaDefinition from '../../../fixtures/sampleSchema';
import hugoWritter from '../index';

jest.mock('fs');

describe('HugoWritter', () => {
  const fs = require('fs'); // eslint-disable-line global-require
  beforeAll(() => {
    fs.mkdirSync('/memory/');
  });

  test('output folder is emptied during generation', async () => {
    fs.mkdirSync('/memory/hugo');
    fs.writeFileSync('/memory/hugo/todelete');
    expect.assertions(1);
    await hugoWritter({ output: '/memory/hugo/' }, schemaDefinition);
    expect(fs.existsSync('/memory/hugo/todelete')).toBe(false);
  });

  test('generates 1 folder by schema', async () => {
    expect.assertions(3);
    await hugoWritter({ output: '/memory/hugo/' }, schemaDefinition);

    expect(fs.existsSync('/memory/hugo/abstract')).toBe(true);
    expect(fs.existsSync('/memory/hugo/movie')).toBe(true);
    expect(fs.existsSync('/memory/hugo/media')).toBe(true);
  });
});
