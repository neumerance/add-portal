const db = require('../../models');
const ErrorHandler = require('./errorHandler');
const SuccessHandler = require('./successHandler');
const nullFunc = () => {};

class UserLocalSocketService {

  constructor(socket) {
    this.socket = socket;
    this.errorHandler = new ErrorHandler(socket);
    this.successHandler = new SuccessHandler(socket);
    this.init();
  }

  init() {
    this.socket.on('admin#ask::userLocal#lists', (_params) => {
      this.index((resp) => {
        if (resp.status == 200) { this.socket.emit('userLocal#lists', resp.data) }
      });
    }); 

    this.socket.on('admin#ask::userLocal#creation', (params) => {
      this.create(params, (resp) => {
        if (resp.status == 200) {
          this.index((_resp) => {
            if (_resp.status == 200) {
              this.socket.emit('broadcast::userLocal#lists', _resp.data);
            }
          });
        }
      });
    });
  }

  index(callback = nullFunc) {
    db.userLocals.findAll({}).then((resp) => {
      this.successHandler.handleSuccess(resp, callback);
    }).catch((error) => {
      this.errorHandler.handleError(error, callback);
    });
  }

  create(params, callback = nullFunc) {
    db.userLocals.create(params).then((resp) => {
      resp.message = 'Local has been created'
      this.successHandler.handleSuccess(resp, callback);
    }).catch((error) => {
      this.errorHandler.handleError(error, callback);
    });
  }

}

module.exports = UserLocalSocketService;