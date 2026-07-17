import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',

  roots: ['<rootDir>/src'],

  moduleFileExtensions: ['js', 'json', 'ts'],

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },

  collectCoverageFrom: ['**/*.(t|j)s'],

  coverageDirectory: 'coverage',

  testEnvironment: 'node',
};

export default config;
