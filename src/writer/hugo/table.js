// @flow
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

import type Table from '../../model/Table';
import type Column from '../../model/Column';
import type Index from '../../model/Index';
import type Connection from '../../model/Connection';
import type Trigger from '../../model/Trigger';

import generateFrontmatter from './utils/frontmatter';
import markdownTable from './utils/markdownTable';
import markdownList from './utils/markdownList';

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

const renderList = (header: string, items: Array<any>, renderer: Function) => {
  if (items.length < 1) {
    return '';
  }
  return `${header}:
${markdownList(items.map(renderer))}
`;
};

const renderIndexes = indexes =>
  renderList(
    'Indexes',
    indexes,
    (index: Index) => `__${index.name}__: ${index.definition}`,
  );

const renderFK = refs =>
  renderList(
    'Foreign-key constraints',
    refs,
    (ref: Connection) => `__${ref.connectionName}__: ${ref.definition}`,
  );

const renderReferences = refs =>
  renderList(
    'Referenced by',
    refs,
    (ref: Connection) =>
      `TABLE ${ref.referer} CONSTRAINT __${ref.connectionName}__: ${ref.definition}`,
  );

const renderTriggers = triggers =>
  renderList(
    'Triggers',
    triggers,
    (ref: Trigger) => `__${ref.name}__ : ${ref.definition}`,
  );

const renderInherited = tables =>
  renderList('Inherits', tables, (table: string) => table);

const renderChildTables = tables =>
  renderList('Child Tables', tables, (table: string) => table);

const renderTableBody = table =>
  [
    renderColumns(table.columns),
    renderIndexes(table.indexes),
    renderFK(table.hasReferencesTo),
    renderReferences(table.isReferencedBy),
    renderTriggers(table.triggers),
    renderInherited(table.inheritedTables),
    renderChildTables(table.childTables),
  ]
    .filter(value => value !== '')
    .join('\n');

const generateTable = (table: Table, destination: string) => {
  const frontmatter = generateFrontmatter({
    title: table.name,
    description: `Structure of table ${table.name}`,
  });

  const body = renderTableBody(table);

  return writeToFile(
    `${path.join(destination, table.name)}.md`,
    `${frontmatter}${body}`,
    'utf8',
  );
};

export default generateTable;
