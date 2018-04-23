const N = require('../core/lib/nuve');
N.API.init('5adc8d6889a13d91110f0436', '26042', 'http://192.168.0.108:3000/');
const nullFunc = () => {};

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

  errorCallback(error, callback = nullFunc) {
    callback({ status: 500, error: error, data: null });
  }

}
module.exports = RoomsController;