// @flow
import dotenv from 'dotenv';
import program from 'commander';

import buildIntrospection from './instrospection';
import jsonWritter from './writer/json';
import hugoWritter from './writer/hugo';

program
  .version('1.0.0')
  .option('--format <format>', 'the export format', /^(json|hugo)$/i)
  .option('--destination <destination>', 'the output file / directory')
  .option(
    '--ignored-schemas <ignored-schemas>',
    'comma separated list of ignored scjemas',
  )
  .parse(process.argv);

if (program.format !== 'json' && program.format !== 'hugo') {
  console.error(`Unknown format ${program.format}`); // eslint-disable-line no-console
  process.exit(-1);
}

if (program.destination === undefined) {
  console.error(`Output destination is mandatory`); // eslint-disable-line no-console
  process.exit(-1);
}

try {
  dotenv.config();
  buildIntrospection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    },
    program.ignoredSchemas,
  )
    .then(schemas => {
      switch (program.format) {
        case 'hugo':
          return hugoWritter({ output: program.destination }, schemas);

        default:
          return jsonWritter({ output: program.destination }, schemas);
      }
    })
    .then(() => {
      console.log('done'); // eslint-disable-line no-console
    });
} catch (err) {
  console.log(err); // eslint-disable-line no-console
}
