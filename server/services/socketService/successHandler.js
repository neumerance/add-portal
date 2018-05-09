const nullFunc = () => {};

class SuccessHandler {
  
  constructor(socket = null) {
    this.socket = socket;
  }
  
  handleSuccess(response, callback = nullFunc) {
    callback({ status: 200, data: response });
    if (this.socket && response.message) {
      this.socket.emit('success#message', response.message);
    }
  }
}

module.exports = SuccessHandler;