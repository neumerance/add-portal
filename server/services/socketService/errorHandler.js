const nullFunc = () => {};

class ErrorHandler {
  
  constructor(socket = null) {
    this.socket = socket
  }
  
  handleError(error, callback = nullFunc) {
    console.log('Error: ', error)
    callback({ status: 500, error: error });
    if (error.errors) {
      const err_msgs = error.errors.map((err) => { err.message })
      error.message = err_msgs.join('<br />')
    }
    if (this.socket) {
      this.socket.emit('error#message', error.message || 'Something went wrong, please try again or contact support.' );
    }
  }
}

module.exports = ErrorHandler;