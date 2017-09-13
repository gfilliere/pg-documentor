// @flow

function isIterableAndNotString(obj) {
  // checks for null and undefined
  if (obj === null) {
    return false;
  }
  if (typeof obj === 'string') {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export default function markdownList(entries: Array<any>, level: number = 0) {
  return `${entries
    .map(
      entry =>
        isIterableAndNotString(entry)
          ? markdownList(entry, level + 3)
          : `${Array(level).join(' ')}- ${entry}`,
    )
    .join('\n')}`;
}
