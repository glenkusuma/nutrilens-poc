export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  setupFiles: ["./jest.setup.js"],
};
