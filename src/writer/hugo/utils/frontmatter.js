// @flow
import yaml from 'js-yaml';
import toml from 'toml-js';

export const FRONTMATTER_YAML = 'YAML';
export const FRONTMATTER_TOML = 'TOML';
export const FRONTMATTER_JSON = 'JSON';

type frontMatterFormat = 'YAML' | 'TOML' | 'JSON';

/**
 * Creates a hugo compatible frontmatter
 * https://gohugo.io/content-management/front-matter/
 */
export default function createFrontmatter(
  data: any,
  format: frontMatterFormat = FRONTMATTER_TOML,
) {
  switch (format) {
    case FRONTMATTER_YAML:
      return `---
${yaml.safeDump(data).trim()}
---
`;
    case FRONTMATTER_TOML:
      return `+++
${toml.dump(data).trim()}
+++
`;
    case FRONTMATTER_JSON:
      return `${JSON.stringify(data, null, 2).trim()}`;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
