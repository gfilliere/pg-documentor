import { movieSchema } from '../../../fixtures/sampleSchema';
import generateSchema from '../schema';
import deleteDirectory from '../utils/deleteDirectory';

jest.mock('fs');

describe('generateSchema', () => {
  const fs = require('fs'); // eslint-disable-line global-require
  beforeAll(() => {
    fs.mkdirSync('/memory');
    fs.mkdirSync('/memory/hugo');
  });

  beforeEach(async () => {
    await deleteDirectory('/memory/hugo/movie');
  });

  test('a file for each table is created', async () => {
    expect.assertions(2);
    await generateSchema(movieSchema, '/memory/hugo');

    expect(fs.existsSync('/memory/hugo/movie/movie.md', 'utf8')).toBe(true);
    expect(fs.existsSync('/memory/hugo/movie/movie_has_image.md', 'utf8')).toBe(
      true,
    );
  });

  test('an _index.md is generated and valid', async () => {
    expect.assertions(1);
    await generateSchema(movieSchema, '/memory/hugo');

    expect(
      fs.readFileSync('/memory/hugo/movie/_index.md', 'utf8'),
    ).toMatchSnapshot();
  });
});
