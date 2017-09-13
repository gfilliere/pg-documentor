import markdownTable from '../markdownTable';

test('generates valid markdown', () => {
  expect(
    markdownTable(
      ['header 1', 'header 2', 'header 3'],
      [
        ['row 1 col 1', 'row 1 col 2', 'row 1 col 3'],
        ['row 2 col 1', 'row 2 col 2', 'row 2 col 3'],
        ['row 3 col 1', 'row 3 col 2', 'row 3 col 3'],
      ],
    ),
  ).toEqual(`
header 1 | header 2 | header 3
----|----|----
row 1 col 1 | row 1 col 2 | row 1 col 3
row 2 col 1 | row 2 col 2 | row 2 col 3
row 3 col 1 | row 3 col 2 | row 3 col 3
`);
});
