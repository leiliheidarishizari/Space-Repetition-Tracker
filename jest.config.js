module.exports = {
    testEnvironment: 'jsdom', // Use jsdom to mock the browser environment
    transform: {
      '^.+\\.js$': 'babel-jest', // Use babel-jest for JavaScript transformation
    },
  };