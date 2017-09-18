// @flow

import Schema from '../model/Schema';
import Table from '../model/Table';
import View from '../model/View';
import Column from '../model/Column';
import Index from '../model/Index';
import Connection from '../model/Connection';
import Trigger from '../model/Trigger';

const abstractSchema = new Schema('abstract', 'postgres');
const movieSchema = new Schema('movie', 'postgres');
const mediaSchema = new Schema('media', 'postgres');

const elementTable = new Table(
  'abstract',
  'element',
  [
    new Column('active', 'boolean', 'false', 'true'),
    new Column('data', 'jsonb', `'{}'::jsonb`, 'false'),
  ],
  [],
  [],
  [],
  [],
  [],
  ['movie.movie', 'movie.movie_has_image', 'media.image'],
);

abstractSchema.setTables([elementTable]);

const movieTable = new Table(
  'movie',
  'movie',
  [
    new Column('active', 'boolean', 'false', 'true'),
    new Column('data', 'jsonb', `'{}'::jsonb`, 'false'),
    new Column('id', 'bigint', null, 'true'),
    new Column('gid', 'global_id', null, 'true'),
    new Column('title', 'text', null, 'true'),
    new Column('id_poster', 'bigint', null, 'true'),
  ],
  [
    new Index(
      'movie_pkey',
      'CREATE UNIQUE INDEX movie_pkey ON movie.movie USING btree (id)',
      true,
      true,
    ),
    new Index(
      'movie_movie_gid_idx',
      'CREATE INDEX movie_movie_gid_idx ON movie.movie USING btree (gid)',
      false,
      false,
    ),
  ],
  [
    new Connection(
      'movie.movie',
      'media.image',
      'movie_id_poster_fkey',
      'FOREIGN KEY (id_poster) REFERENCES media.image(id)',
    ),
  ],
  [
    new Connection(
      'movie.movie_has_image',
      'movie.movie',
      'movie_has_image_id_movie_fkey',
      'FOREIGN KEY (id_movie) REFERENCES movie.movie(id)',
    ),
  ],
  [
    new Trigger(
      'movie_movie_compute_gid',
      'CREATE TRIGGER movie_movie_compute_gid BEFORE INSERT OR UPDATE ON movie.movie FOR EACH ROW EXECUTE PROCEDURE abstract.compute_gid()',
    ),
  ],
  ['abstract.element'],
  [],
);

const movieHasImageTable = new Table(
  'movie',
  'movie_has_image',
  [
    new Column('active', 'boolean', 'false', 'true'),
    new Column('data', 'jsonb', `'{}'::jsonb`, 'false'),
    new Column('id_movie', 'bigint', null, 'true'),
    new Column('id_image', 'bigint', null, 'true'),
    new Column('rank', 'integer', null, 'true'),
  ],
  [
    new Index(
      'movie_has_image_pkey',
      'CREATE UNIQUE INDEX movie_has_image_pkey ON movie.movie_has_image USING btree (id_movie, id_image)',
      true,
      true,
    ),
  ],
  [
    new Connection(
      'movie.movie_has_image',
      'media.image',
      'movie_has_image_id_image_fkey',
      'FOREIGN KEY (id_image) REFERENCES media.image(id)',
    ),
    new Connection(
      'movie.movie_has_image',
      'movie.movie',
      'movie_has_image_id_movie_fkey',
      'FOREIGN KEY (id_movie) REFERENCES movie.movie(id)',
    ),
  ],
  [],
  [],
  ['abstract.element'],
  [],
);

movieSchema.setTables([movieTable, movieHasImageTable]);

const activeMoviesView = new View(
  'movie',
  'active_movie',
  [
    new Column('data', 'jsonb', `'{}'::jsonb`, 'false'),
    new Column('id', 'bigint', null, 'true'),
    new Column('gid', 'global_id', null, 'true'),
    new Column('title', 'text', null, 'true'),
    new Column('id_poster', 'bigint', null, 'true'),
  ],
  `SELECT movie.gid,\n    movie.id,\n    movie_localized.locale,\n    COALESCE(movie_localized.title, movie.title) AS title,\n    movie.title AS original_title,\n    movie.id_poster\n    FROM movie.movie ON\n    WHERE movie.active`,
);

movieSchema.setViews([activeMoviesView]);

const imageTable = new Table(
  'media',
  'image',
  [
    new Column('active', 'boolean', 'false', 'true'),
    new Column('data', 'jsonb', `'{}'::jsonb`, 'false'),
    new Column('id', 'bigint', null, 'true'),
    new Column('gid', 'global_id', null, 'true'),
    new Column('title', 'text', null, 'true'),
    new Column('alt', 'text', null, 'true'),
    new Column('path', 'bigint', null, 'true'),
  ],
  [
    new Index(
      'image_pkey',
      'CREATE UNIQUE INDEX image_pkey ON media.image USING btree (id)',
      true,
      true,
    ),
    new Index(
      'image_path_key',
      'CREATE UNIQUE INDEX image_path_key ON media.image USING btree (path)',
      false,
      true,
    ),
    new Index(
      'media_image_gid_idx',
      'CREATE INDEX media_image_gid_idx ON media.image USING btree (gid)',
      true,
      true,
    ),
  ],
  [],
  [
    new Connection(
      'movie.movie_has_image',
      'media.image',
      'movie_has_image_id_image_fkey',
      'FOREIGN KEY (id_image) REFERENCES media.image(id)',
    ),
    new Connection(
      'movie.movie_has_image',
      'media.image',
      'movie_id_poster_fkey',
      'FOREIGN KEY (id_poster) REFERENCES media.image(id)',
    ),
  ],
  [
    new Trigger(
      'media_image_compute_gid',
      'CREATE TRIGGER media_image_compute_gid BEFORE INSERT OR UPDATE ON media.image FOR EACH ROW EXECUTE PROCEDURE abstract.compute_gid()',
    ),
  ],
  ['abstract.element'],
  [],
);

mediaSchema.setTables([imageTable]);

export default [abstractSchema, movieSchema, mediaSchema];

export {
  abstractSchema,
  movieSchema,
  mediaSchema,
  elementTable,
  movieTable,
  movieHasImageTable,
  imageTable,
};
