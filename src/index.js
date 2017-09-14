// @flow
import dotenv from 'dotenv';
import { argv } from 'yargs';

import buildIntrospection from './instrospection';
import jsonWritter from './writer/json';
import hugoWritter from './writer/hugo';

try {
  dotenv.config();
  buildIntrospection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  })
    .then(schemas => {
      switch (argv.format) {
        case 'hugo':
          return hugoWritter({ output: argv.output }, schemas);

        default:
          return jsonWritter({ output: argv.output }, schemas);
      }
    })
    .then(() => {
      console.log('done');
    });
} catch (err) {
  console.log(err);
}
