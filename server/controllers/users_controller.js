const User = require('../models/user');
const jwt = require('jsonwebtoken');

class UsersController {

  constructor() {
    this.model = User;
  }

  signup(res, req) {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 3
    });
    
    user.save((err) => {
      if (err) {
        console.log('Error: ', err);
        return res.status(500).send({ 
            success: false, 
            message: 'Something went wrong, please try again or contact us.' 
        });
      }
      res.json({
        message: 'Successfully signed up.',
        data: { email: user.email, role: user.role }
      });
    });
  }

  authenticate(res, req, app) {
    // find the user
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          const payload = {
            admin: user.admin 
          };
          var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60*60*24 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }   
      }
    });
  }
  
  getAllUsers(res) {
    this.model.find({}, (err, users) => {
      if (err) {
        console.log('Error: ', err);
        res.json([]);
      } else {
        res.json(users);
      }
    });
  }

  verifyToken(app, apiRoutes) {
    apiRoutes.use((req, res, next) => {
      console.log('being called')
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];

      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });

      }
    });  
  }

}

module.exports = UsersController;