// @flow
import path from 'path';
import fs from 'fs';

import type Schema from '../../model/Schema';
import type Table from '../../model/Table';
import generateTable from './table';
import generateFrontmatter from './utils/frontmatter';
import markdownList from './utils/markdownList';
import linkToTable from './utils/linkToTable';

export default (schema: Schema, destination: string) => {
  const schemaDirectory = path.join(destination, schema.name);
  fs.mkdirSync(schemaDirectory);

  const frontmatter = generateFrontmatter({
    title: schema.name,
    description: `Content of the ${schema.name} schema`,
    alwaysopen: false,
  });
  fs.writeFileSync(
    path.join(schemaDirectory, '_index.md'),
    `${frontmatter}

${markdownList(schema.tables.map((table: Table) => linkToTable(table)))}
    `,
    'utf8',
  );

  return Promise.all(
    schema.tables.map(table => generateTable(table, schemaDirectory)),
  );
};
