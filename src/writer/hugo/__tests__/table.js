import { movieTable } from '../../../fixtures/sampleSchema';
import generateTable from '../table';

jest.mock('fs');

describe('generateTable', () => {
  const fs = require('fs'); // eslint-disable-line global-require
  beforeAll(() => {
    fs.mkdirSync('/memory');
    fs.mkdirSync('/memory/hugo');
    fs.mkdirSync('/memory/hugo/schema');
  });

  test('a file for the table is created', async () => {
    expect.assertions(1);
    await generateTable(movieTable, '/memory/hugo/schema');

    expect(
      fs.readFileSync('/memory/hugo/schema/movie.md', 'utf8'),
    ).toMatchSnapshot();
  });
});
