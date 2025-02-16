// jest.esm.config.v4.cjs
const esmPkgList = [
  'remark',
  'unified',
  'remark-parse',
  'remark-html',
  'rehype',
  'mdast-util-from-markdown',
  'mdast-util-to-string',
  'micromark',
  'micromark-util-chunked',
  'micromark-util-combine-extensions',
  'decode-named-character-reference',
  'micromark-util-encode',
  'micromark-util-decode-numeric-character-reference',
  'micromark-util-normalize-identifier',
  'micromark-util-sanitize-uri'
];

module.exports = {
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      useESM: true,
      diagnostics: { warnOnly: true }
    }
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    `/node_modules/(?!(?:${esmPkgList.join('|')})/)`
  ],
  // Explicitly treat TS/TSX files as ESM; JS files are inferred.
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  maxWorkers: 1,
};
