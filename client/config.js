const config = {};
config.ssl = false;
config.keysPath = '/usr/local/etc/addkeys/';
config.http_port = 8000;
config.https_port = 8001;
config.protocol = (config.ssl ? 'https' : 'http');
config.addServerPort = (config.ssl ? '4001' : '4000');
config.addServerIp = '192.168.0.111';
config.addServerHost = `${config.protocol}://${config.addServerIp}:${config.addServerPort}`;
module.exports = config;