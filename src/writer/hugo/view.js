// @flow
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

import type View from '../../model/View';
import type Column from '../../model/Column';

import generateFrontmatter from './utils/frontmatter';
import markdownTable from './utils/markdownTable';

const writeToFile = promisify(fs.writeFile);

const renderColumns = columns =>
  markdownTable(
    ['Column', 'Type', 'Modifiers'],
    columns.map((column: Column) => [
      column.name,
      column.type,
      [
        `${column.notNull ? 'not null' : ''}`,
        `${column.defaultValue ? `default ${column.defaultValue}` : ''}`,
      ]
        .filter(value => value !== '')
        .join(' '),
    ]),
  );

const renderViewDefinition = definition =>
  `
View Definition :

\`\`\`SQL
${definition}
\`\`\`
`;

const renderViewBody = (view: View) =>
  [renderColumns(view.columns), renderViewDefinition(view.definition)]
    .filter(value => value !== '')
    .join('\n');

const generateView = (view: View, destination: string) => {
  const frontmatter = generateFrontmatter({
    title: view.name,
    description: `Structure of view ${view.name}`,
  });

  const body = renderViewBody(view);

  return writeToFile(
    `${path.join(destination, view.name)}.md`,
    `${frontmatter}${body}`,
    'utf8',
  );
};

export default generateView;
