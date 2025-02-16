// jest.esm.config.v2.cjs
const esmModules = [
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
  'micromark-util-decode-numeric-character-reference'
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
    `/node_modules/(?!(?:${esmModules.join('|')})/)`
  ],
  // Only explicitly mark TS and TSX as ESM (JS files are auto‑inferred)
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  maxWorkers: 1,
};
