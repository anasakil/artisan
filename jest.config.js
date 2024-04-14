module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!bson).+\\.js$" 
  ],
  transform: {
    "^.+\\.js$": "babel-jest", 
  },
};
