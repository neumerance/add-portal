const express = require('express');
var cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const pluralize = require('pluralize');
const config = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
let RoomsController = require('./controllers/rooms_controller.js');
let UsersController = require('./controllers/users_controller.js');
const ROLES = ['superadmin', 'addpro', 'local', 'viewer'];

const users = [];
const connections = [];

// =======================
// configuration =========
// =======================
app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));
// app.use(cors())
// var corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200
// }
app.use(cors());

// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

// cdns
app.get('/cdn/erizo', function (req, res) {
  res.sendFile(`${__dirname}/erizo.js`);
});

// API ROUTES -------------------
const apiRoutes = express.Router();
// route to authenticate a user (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', (req, res) => {
  new UsersController(res, req).signup();
});
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', (req, res) => {
  new UsersController(res, req, app).authenticate();
});
// route middleware to verify a token
// all routes below this line is protected with auth token
apiRoutes.use((req, res, next) => {
  new UsersController(res, req, app, next).verifyToken();
});
// route to return all users (GET http://localhost:4000/api/users)
apiRoutes.get('/users', (req, res) => {
  new UsersController(res, req).index();
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
const emitRoomList = () => {
  RoomsController.getAllRooms((rooms) => {
    io.emit('broadcast::room#lists', rooms);
  });
}

io.sockets.use((socket, next) => {
  if (socket.handshake.query) {
    if (socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, app.get('superSecret'), (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Token is missing'));
    }
  } else {
    next(new Error('Authentication error'));
  }
}).on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: ', `${connections.length} ${pluralize('client', connections.length)} connected.`);

  // when user left the browser or got disconnected.
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: ', `${connections.length} ${pluralize('client', connections.length)} connected.`);
  });

  // when user is creating room
  socket.on('room#lists', (params) => {
    RoomsController.getAllRooms((rooms) => {
      socket.emit('broadcast::room#lists', rooms);
    });
  });

  // when user is creating room
  socket.on('room#create', (params) => {
    RoomsController.createRoom(params, (data) => {
      emitRoomList();
    });
  });

  // when user is deleting room
  socket.on('room#destroy', (params) => {
    RoomsController.deleteRoom(params, (data) => {
      emitRoomList();
    });
  });

  // when user is asking for room token
  socket.on('room#ask::token', (params) => {
    console.log('room#ask::token', params);
    RoomsController.getRoomToken(params, (data) => {
      socket.emit('room#receive::token', data);
    });
  });

});

emitRoomList();