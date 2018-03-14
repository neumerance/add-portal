const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const pluralize = require('pluralize');
const config = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('./models/user'); // get our mongoose model

const users = [];
const connections = [];

// =======================
// configuration =========
// =======================
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res){
  res.sendFile(`${__dirname}/index.html`);
});

// API ROUTES -------------------
const apiRoutes = express.Router(); 
// we'll get to these in a second
app.get('/setup', function(req, res) {

  // create a sample user
  var user = new User({ 
    email: 'neumerance@live.com', 
    password: 'password',
    role: 1 
  });

  // save the sample user
  user.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true, data: user });
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

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
}); 

// route middleware to verify a token
// apiRoutes.use(function(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });

//   }
// });  

// route to return all users (GET http://localhost:4000/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
server.listen(process.env.PORT || config.port);
console.log(`MCGI ADD-PORTAL is running in port ${config.port}`);

// =======================
// socket.io =============
// =======================
io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: ', `${connections.length} ${pluralize('client', connections.length)} connected.`);

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: ', `${connections.length} ${pluralize('client', connections.length)} connected.`);
  });
});