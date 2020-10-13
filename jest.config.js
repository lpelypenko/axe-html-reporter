const config = {
    cacheDirectory: '<rootDir>/build/.jestcache',
    collectCoverage: true,
    coverageDirectory: '<rootDir>/build/.jestcoverage',
    coverageReporters: ['lcov', 'text', 'html', 'text-summary', 'json-summary'],
    rootDir: process.cwd(),
    testPathIgnorePatterns: ['/.build/', '/node_modules/', 'eslintrc.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)sx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            tsConfig:  'tsconfig.json'
        }
    },
    testEnvironment: 'node',
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};

module.exports = config;
