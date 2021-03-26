module.exports = {
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).js?(x)'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageReporters: ['html', 'text'],
  coverageDirectory: 'docs/coverage',
};
