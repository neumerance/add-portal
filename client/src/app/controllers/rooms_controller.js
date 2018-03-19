const nullFunc = () => {}

export default class RoomController {

  constructor(socket = null) {
    if (!socket) throw 'Missing socket instance.';
    this.io = socket;
  }

  subscribe(callback = nullFunc) {
    this.io.socket.emit('room#getList', {});
    this.io.socket.on('room#list', (rooms) => {
      console.log('received rooms: ', rooms);
      callback(rooms);
    });
  }

  createRoom(name = '', description = '', isP2p = false) {
    this.io.socket.emit('room#create', { name: name, description: description, isP2p: false });
  }

}
