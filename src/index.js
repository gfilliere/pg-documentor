// @flow
import dotenv from 'dotenv';
import { argv } from 'yargs';

import buildIntrospection from './instrospection';
import jsonWritter from './writer/json';

try {
  dotenv.config();
  buildIntrospection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  })
    .then(schemas =>
      jsonWritter(
        {
          output: argv.output,
        },
        schemas,
      ),
    )
    .then(console.log('done'));
} catch (err) {
  console.log(err);
}
