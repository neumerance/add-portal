const UserService = require('../services/user');

class UsersController {

  constructor(res, req, app = null, next = null) {
    this.service = new UserService(res, req, app, next);
  }

  index() {
    this.service.index();
  }

  signup() {
    this.service.create();
  }

  authenticate() {
    this.service.authenticate();
  }

  verifyToken() {  
    this.service.verifyToken();
  }

}

module.exports = UsersController;