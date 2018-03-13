const N = require('../core/lib/nuve');
const config = require('../config');

const errorCallback = (msg = '') => {
  console.log('Error', msg);  
}

const nullFunc = () => {}

class RoomsController {
  constructor() {
    this.api = N.API;
    this.api.init(config.serviceId, config.serviceKey, config.serviceEndpoint);
  }

  joinRoom() {
  }

  getOrCreateRoom() {
  }
  
  getRooms(callback = nullFunc) {
    this.api.getRooms(
      (roomList) => {
        const rooms = JSON.parse(roomList);
        callback(rooms);
      }, 
      errorCallback('Unable to get all rooms')
    );
  }

  getRoom(roomId) {    
  }

  createRoom(params, callback = nullFunc) {
    this.api.createRoom(
      params.name, (room) => {
        callback(room);
        console.log(`Room ${params.name} with id ${room._id} has been created`);
      }, 
      errorCallback(
        `Failed to create room: ${JSON.stringify(params)}`
      ), 
      { p2p: params.isP2p, data: { description: params.description } }
    );
  }

  destroyRoom(roomId) {
  }

  roomExists() {   
  }
}

module.exports = RoomsController;