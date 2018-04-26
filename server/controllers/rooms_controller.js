const N = require('../core/lib/nuve');
const config = require('../config');
N.API.init(config.serviceKey, config.serviceId, config.serviceEndpoint);
const nullFunc = () => {};
const ROLES = { 1: 'admin', 2: 'addpro', 3: 'viewer' };

class RoomsController {

  static createRoom(params, callback = nullFunc) {
    N.API.createRoom(params.roomName, (roomID) => {
      callback({ status: 200, data: roomID });
    }, (e) => {
      this.errorCallback(e);
    }, { data: { 
      description: params.description }, 
      p2p: params.p2p,
      mediaConfiguration: (params.mediaConfiguration || 'default')
    });
  }

  static deleteRoom(params, callback = nullFunc) {
    N.API.deleteRoom(params.roomId, () => {
      callback();
    }, (e) => {
      this.errorCallback(e, callback);
    });    
  }

  static getAllRooms(callback = nullFunc) {
    N.API.getRooms((roomList) => {
      const rooms = JSON.parse(roomList);
      callback({ status: 200, data: rooms });
    }, (error) => { this.errorCallback(error, callback) });    
  }

  static getRoomToken(params, callback = nullFunc) {
    N.API.createToken(params.roomId, params.username, ROLES[params.role], (token) => {
      callback({ status: 200, data: token });
    }, (error) => { 
      console.log('error', error);
      this.errorCallback(error, callback) 
    });    
  }

  static errorCallback(error, callback = nullFunc) {
    console.log('error', error);
    callback({ status: 500, error: error, data: null });
  }

}
module.exports = RoomsController;