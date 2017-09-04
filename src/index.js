import dotenv from 'dotenv';
import buildIntrospection from './instrospection';

try {
  dotenv.config();
  buildIntrospection({
    client: 'postgres',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    },
  }).then(schemas => console.log(JSON.stringify(schemas, null, 4)));
} catch (err) {
  console.log(err);
}
