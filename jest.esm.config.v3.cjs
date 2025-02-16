// jest.esm.config.v3.cjs
const esModules = [
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
  'micromark-util-normalize-identifier'
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
  // Force transformation for the following ESM packages:
  transformIgnorePatterns: [
    `/node_modules/(?!(?:${esModules.join('|')})/)`
  ],
  // Explicitly mark TypeScript files as ESM; JS files are auto-inferred.
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  maxWorkers: 1,
};
