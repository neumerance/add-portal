const express = require('express');
var cors = require('cors');
const app = express();
const pluralize = require('pluralize');
const config = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const fs = require('fs');
let RoomsController = require('./controllers/rooms_controller.js');
let UsersController = require('./controllers/users_controller.js');
const ROLES = ['superadmin', 'addpro', 'local', 'viewer'];

const users = [];
const connections = [];
const keysPath = process.env.addKeys || config.keysPath;
var options = {
  key: fs.readFileSync(keysPath+'server.key'),
  cert: fs.readFileSync(keysPath+'server.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

let server = null;
if (config.ssl) {
  server = require('https').createServer(options, app);
} else {
  server = require('http').createServer(app);
}
const io = require('socket.io').listen(server);

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
const port = config.ssl ? config.https_port : config.http_port;
server.listen(process.env.PORT || port);
console.log(`MCGI ADD-PORTAL is running in endpoint ${config.protocol}://0.0.0.0:${port}`);

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

  // when user is ask for rooms
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