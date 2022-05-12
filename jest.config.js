module.exports = {
  testRunner: 'jest-circus',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './scripts/jest/setupTests.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/examples/',
    '/__utils__/',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  moduleNameMapper: {
    '^react-instantsearch-(.*)$':
      '<rootDir>/packages/react-instantsearch-$1/src/',
  },
  transformIgnorePatterns: ['node_modules/(?!(instantsearch.js)/)'],
  globals: {
    __DEV__: true,
  },
};
