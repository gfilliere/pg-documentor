// @flow
export default function getMarkdownTable(
  headers: Array<string>,
  values: Array<Array<string>>,
) {
  return `
${headers.map(value => value.trim()).join(' | ')}
${headers.map(() => '----').join('|')}
${values.map(row => `${row.map(value => value.trim()).join(' | ')}`).join('\n')}
`;
}
