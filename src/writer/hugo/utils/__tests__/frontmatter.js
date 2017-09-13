import frontmatter, {
  FRONTMATTER_JSON,
  FRONTMATTER_YAML,
  FRONTMATTER_TOML,
} from '../frontmatter';

const sampleFrontMatter = {
  title: 'spf13-vim 3.0 release and new website',
  description:
    'spf13-vim is a cross platform distribution of vim plugins and resources for Vim.',
  tags: ['.vimrc', 'plugins', 'spf13-vim', 'vim'],
  date: '2012-04-06',
  categories: ['Development', 'VIM'],
  slug: 'spf13-vim-3-0-release-and-new-website',
};

test('generates valid toml', () => {
  expect(frontmatter(sampleFrontMatter, FRONTMATTER_TOML)).toMatchSnapshot();
});

test('generates valid yaml', () => {
  expect(frontmatter(sampleFrontMatter, FRONTMATTER_YAML)).toMatchSnapshot();
});

test('generates valid JSON', () => {
  expect(frontmatter(sampleFrontMatter, FRONTMATTER_JSON)).toMatchSnapshot();
});
