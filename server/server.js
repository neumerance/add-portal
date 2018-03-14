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
let UsersController = require('./controllers/users_controller.js');
UsersController = new UsersController();

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
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', (req, res) => {
  UsersController.authenticate(res, req, app);
}); 
// route to authenticate a user (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', (req, res) => {
  UsersController.signup(res, req);
}); 
// route middleware to verify a token
UsersController.verifyToken(app, apiRoutes);
// route to return all users (GET http://localhost:4000/api/users)
apiRoutes.get('/users', function(req, res) {
  UsersController.getAllUsers(res);
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