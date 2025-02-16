// jest.esm.config.cjs - NEW VERSION
const modulesToTransform = [
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
  'micromark-util-decode-numeric-character-reference'
];

module.exports = {
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      useESM: true, // Enable ESM mode for TypeScript files
      diagnostics: { warnOnly: true },
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    '^.+\\.js$': 'babel-jest', // Transform JS files using babel-jest
  },
  transformIgnorePatterns: [
    `/node_modules/(?!(?:${modulesToTransform.join('|')})/)`
  ],
  // Only mark TypeScript files explicitly as ESM; JS files are auto‑inferred.
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  maxWorkers: 1,
};
