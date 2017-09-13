import markdownList from '../markdownList';

test('generates valid markdown', () => {
  expect(markdownList(['item 1', 'item 2', 'item 3'])).toEqual(`- item 1
- item 2
- item 3`);
});

test('handles nested lists valid markdown', () => {
  expect(markdownList(['item 1', ['subitem 1', 'subitem 2'], 'item 3']))
    .toEqual(`- item 1
  - subitem 1
  - subitem 2
- item 3`);
});
