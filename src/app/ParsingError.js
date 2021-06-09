export default class ParsingError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ParsingError';
  }
}
