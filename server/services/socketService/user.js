const db = require('../../models');
const ErrorHandler = require('./errorHandler');
const SuccessHandler = require('./successHandler');
const nullFunc = () => {};

class UserSocketService {

  constructor(socket) {
    this.socket = socket;
    this.errorHandler = new ErrorHandler(socket);
    this.successHandler = new SuccessHandler(socket);
    this.init();
  }

  init() {
    this.socket.on('admin#ask::user#lists', (_params) => {
      this.index((resp) => {
        if (resp.status == 200) { this.socket.emit('user#lists', resp.data) }
      });
    }); 

    this.socket.on('admin#ask::user#creation', (params) => {
      this.create(params, (resp) => {
        if (resp.status == 200) {
          this.index((_resp) => {
            if (_resp.status == 200) {
              this.socket.emit('broadcast::user#lists', _resp.data);
            }
          });
        }
      });
    });

    this.socket.on('admin#ask::user#update', (params) => {
      this.update(params, (resp) => {
        if (resp.status == 200) {
          this.index((_resp) => {
            if (_resp.status == 200) {
              this.socket.emit('broadcast::user#lists', _resp.data);
            }
          });
        }
      });
    });

    this.socket.on('admin#ask::user#destroy', (params) => {
      this.destroy(params, (resp) => {
        if (resp.status == 200) {
          this.index((_resp) => {
            if (_resp.status == 200) {
              this.socket.emit('broadcast::user#lists', _resp.data);
            }
          });
        }
      });
    });
  }

  index(callback = nullFunc) {
    db.users.findAll({
      where: {
        status: 1
      },
      include: [
        {
          model: db.userLocals
        }
      ]
    }).then((resp) => {
      this.successHandler.handleSuccess(resp, callback);
    }).catch((error) => {
      this.errorHandler.handleError(error, callback);
    });
  }

  create(params, callback = nullFunc) {
    db.users.create(params).then((resp) => {
      resp.message = 'User has been created'
      this.successHandler.handleSuccess(resp, callback);
    }).catch((error) => {
      this.errorHandler.handleError(error, callback);
    });
  }

  update(params, callback = nullFunc) {
    db.users.update(params, { where: { id: params.id } }).then((resp) => {
      this.successHandler.handleSuccess({ message: 'User has been updated' }, callback);
    }).catch((error) => {
      this.errorHandler.handleError(error, callback);
    });
  }

  destroy(params, callback = nullFunc) {
    params.status = 0;
    this.update(params, callback);
  }

}

module.exports = UserSocketService;