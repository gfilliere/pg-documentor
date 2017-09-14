import linkToTable from '../linkToTable';
import { movieTable } from '../../../../fixtures/sampleSchema';

describe('linkToTable', () => {
  test('generates markdown for a link', () => {
    expect(linkToTable(movieTable)).toEqual(
      '[movie.movie]({{< ref "movie/movie.md" >}})',
    );
  });

  test('link text can be changed', () => {
    expect(linkToTable(movieTable, 'text')).toEqual(
      '[text]({{< ref "movie/movie.md" >}})',
    );
  });

  test('accepts pg_catalog.regclass table names', () => {
    expect(linkToTable('movie.movie', 'text')).toEqual(
      '[text]({{< ref "movie/movie.md" >}})',
    );
  });

  test('pg_catalog.regclass with quotes are handled', () => {
    expect(linkToTable('movie."user"', 'text')).toEqual(
      '[text]({{< ref "movie/user.md" >}})',
    );
  });

  test('pg_catalog.regclass with underscore are handled', () => {
    expect(linkToTable('movie.movie_has_poster', 'text')).toEqual(
      '[text]({{< ref "movie/movie_has_poster.md" >}})',
    );
  });
});
