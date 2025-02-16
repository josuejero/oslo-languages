// jest.esm.config.v5.cjs
// This configuration forces Babel (via babel-jest and ts-jest) to transform a list of ESM packages.
const esmPackages = [
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
  'micromark-util-sanitize-uri',
  'micromark-util-character'
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
    `/node_modules/(?!(?:${esmPackages.join('|')})/)`
  ],
  // Only TS and TSX files are explicitly treated as ESM
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  maxWorkers: 1,
};
