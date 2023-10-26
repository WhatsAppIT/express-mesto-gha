class RepeatError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 405;
  }
}

module.exports = RepeatError;
