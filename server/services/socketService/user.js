const db = require('../../models');
const nullFunc = () => {};

class UserSocketService {

  static index(callback = nullFunc) {
    db.users.findAll({
      include: [
        {
          model: db.userLocals
        }
      ]
    }).then((resp) => {
      callback({ status: 200, data: resp });
    }).catch((error) => {
      callback({ status: 500, error: error });
    });
  }

  static create(params, callback = nullFunc) {
    db.users.create(params).then((resp) => {
      callback(resp);
    });
  }

}

module.exports = UserSocketService;