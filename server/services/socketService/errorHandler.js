const nullFunc = () => {};

class ErrorHandler {
  
  constructor(socket = null) {
    this.socket = socket
  }
  
  handleError(error, callback = nullFunc) {
    callback({ status: 500, error: error });
    if (this.socket) {
      this.socket.emit('error#message', error.message || 'Something went wrong, please try again or contact support.' );
    }
  }
}

module.exports = ErrorHandler;