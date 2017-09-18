## PG Documentor

Automatically generate documentation for a PostgreSQL database

Two outputs are available at the moment :
- json : this will dump the DB structure in a JSON file
- hugo : this will generate the necessary content for a hugo generated websites.

Usage :
```
pg-documentor --format hugo --destination ../path/to/hugo/content/ 
```
```
pg-documentor --format json --destination ../path/to/file.json
```

Additional command line option :
- `--ignored-schemas public` : allows ignoring a set of schemas (use a comma separated list of schemas to ignore multiple schemas)

