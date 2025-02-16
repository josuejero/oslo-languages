// jest.esm.config.v6.cjs
// This configuration ensures that a broad set of ESM packages are transformed by Babel.
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
  'micromark-util-character',
  'micromark-factory-space' // New addition to cover the error source.
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
  // Ensure that any module from node_modules matching one of these packages is transformed.
  transformIgnorePatterns: [
    `/node_modules/(?!(?:${esmPackages.join('|')})/)`
  ],
  // Explicitly treat TS and TSX files as ESM.
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  maxWorkers: 1,
};
