// @flow
import path from 'path';
import fs from 'fs';

import type Schema from '../../model/Schema';
import type Table from '../../model/Table';
import type View from '../../model/View';
import generateTable from './table';
import generateView from './view';
import generateFrontmatter from './utils/frontmatter';
import markdownList from './utils/markdownList';
import linkToTable from './utils/linkToTable';
import linkToView from './utils/linkToView';

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
    {{% children %}}
    `,
    'utf8',
  );

  if (schema.tables.length) {
    fs.mkdirSync(path.join(schemaDirectory, 'tables'));
    const tablesFrontmatter = generateFrontmatter({
      title: 'Tables',
      description: `Tables of the ${schema.name} schema`,
      alwaysopen: false,
    });
    fs.writeFileSync(
      path.join(schemaDirectory, 'tables', '_index.md'),
      `${tablesFrontmatter}
${markdownList(schema.tables.map((table: Table) => linkToTable(table)))}
    `,
      'utf8',
    );
  }
  if (schema.views.length) {
    fs.mkdirSync(path.join(schemaDirectory, 'views'));
    const viewsFrontmatter = generateFrontmatter({
      title: 'Views',
      description: `Views of the ${schema.name} schema`,
      alwaysopen: false,
    });
    fs.writeFileSync(
      path.join(schemaDirectory, 'views', '_index.md'),
      `${viewsFrontmatter}
${markdownList(schema.views.map((view: View) => linkToView(view)))}
    `,
      'utf8',
    );
  }
  return Promise.all([
    ...schema.tables.map(table =>
      generateTable(table, path.join(schemaDirectory, 'tables')),
    ),
    ...schema.views.map(view =>
      generateView(view, path.join(schemaDirectory, 'views')),
    ),
  ]);
};
