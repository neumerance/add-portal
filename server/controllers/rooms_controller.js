const N = require('../core/lib/nuve');
const config = require('../config');

const errorCallback = (msg = '') => {
  console.log('Error', msg);  
}

const nullFunc = () => {}

class RoomsController {
  constructor() {
    N.API.init(config.serviceId, config.serviceKey, config.serviceEndpoint);
  }

  joinRoom() {
  }

  getOrCreateRoom() {
  }
  
  getRooms(callback = nullFunc) {
    console.log('N.API', N.API);
    N.API.getRooms(function(roomList) {
      var rooms = JSON.parse(roomList);
      for(var i in rooms) {
        console.log('Room ', i, ':', rooms[i].name);
      }
      callback(rooms);
    }, (error) => { errorCallback(`Unable to get all rooms: ${error}`) });
  }

  getRoom(roomId) {    
  }

  createRoom(params, callback = nullFunc) {
    this.api.createRoom(
      params.name, (room) => {
        callback(room);
        console.log(`Room ${params.name} with id ${room._id} has been created`);
      }, 
      () => { errorCallback(`Failed to create room: ${JSON.stringify(params)}`) }, 
      { p2p: params.isP2p, data: { description: params.room_description } }
    );
  }

  destroyRoom(roomId) {
  }

  roomExists() {   
  }
}

module.exports = RoomsController;