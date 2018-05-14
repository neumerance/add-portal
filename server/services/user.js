const db = require('../models');
const jwt = require('jsonwebtoken');

const nullFunc = () => {};

class UserService {

  constructor(res, req, app = null, next = null) {
    this.res = res;
    this.req = req;
    this.app = app;
    this.next = next;
  }

  index() {
    db.users.findAll({
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt']
    }).then((response) => {
      this.res.json({ success: true, data: response });
    }).catch((error) => {
      this.respondWithException(error);
    });
  }

  create() {
    db.users.create(this.req.body).then((response) => {
      this.res.json(response);
    }).catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        this.res.json({ success: false, errors: error.errors.map((e) => { return e.message }) });
      } else {
        this.respondWithException(error);
      }
    });
  }

  show() {
    db.users.findOne({
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      where: {
        id: this.req.body.id
      }
    }).then((response) => {
      this.res.json({ success: true, data: response });
    }).catch((error) => {
      this.respondWithException(error);
    });
  }

  destroy() {
    db.users.destroy({
      where: {
        id: this.req.body.id
      }
    }).then((response) => {
      this.res.json({ success: true, data: response });
    }).catch((error) => {
      this.respondWithException(error);
    });
  }

  authenticate() {
    db.users.findOne({
      where: {
        email: this.req.body.email,
        status: 1
      },
      include: [ 
        { 
          model: db.userLocals
        } 
      ]
    }).then((user) => {
      if (!user) {
        this.res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (user.password != this.req.body.password) {
          this.res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = jwt.sign({role: user.role}, this.app.get('superSecret'), {
            expiresIn: 60*60*24 // expires in 24 hours
          });          
          this.res.json({
            success: true,
            message: 'Enjoy your token!',
            user: { 
              id: user.id, 
              email: user.email, 
              firstname: user.firstname,
              lastname: user.lastname,
              role: user.role,
              local: user.userLocal 
            },
            token: token
          });
        }   
      }
    }).catch((error) => {
      this.respondWithException(error);
    });
  }

  verifyToken() {
    var token = this.req.body.token || this.req.query.token || this.req.headers['x-access-token'];
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, this.app.get('superSecret'), (err, decoded) => {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          this.req.decoded = decoded;   
          this.next();
        }
      });
    } else {
      return this.res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
    }
  }
  
  respondWithException(error) {
    console.log('error', error);
    this.res.status(500).send({ 
      success: false, 
      message: 'something went wrong',
      stacktrace: error
    });
  }

}

module.exports = UserService;