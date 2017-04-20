function TimetableError (message) {
  this.name = "TimetableError";
  this.message = message;
  this.stack = (new Error()).stack;
}

TimetableError.prototype = Object.create(Error.prototype);