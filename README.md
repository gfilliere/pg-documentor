## PG Documentor

Automatically generate documentation for a PostgreSQL database

Two outputs are available at the moment :
- json : this will dump the DB structure in a JSON file
- hugo : this will generate the necessary content for a hugo generated websites.

### Installation :

Install globally or locally using your npm / yarn :
```
npm install -g pg-documentor
yarn global add pg-documentor
```
### Configuration :

Create a .env file in the folder you'll be running the script, containing a PostgreSQL connection string as accepted by [pg-connection-string](https://github.com/iceddev/pg-connection-string)
```
DB_CONNECTION_STRING='postgresql://user@uri:PORT/db_name'
```

### Usage :
```
pg-documentor --format hugo --destination ../path/to/hugo/content/ 
```
```
pg-documentor --format json --destination ../path/to/file.json
```

Additional command line option :
- `--ignored-schemas public` : allows ignoring a set of schemas (use a comma separated list of schemas to ignore multiple schemas)

