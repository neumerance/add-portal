const config = {};
config.ssl = false;
config.addServerHost = `${config.ssl ? 'https' : 'http'}://0.0.0.0:${config.ssl ? '4000' : '4001'}`;
config.keysPath = '/usr/local/etc/addkeys/';
config.http_port = 8000;
config.https_port = 8001;
config.protocol = (config.ssl ? 'https' : 'http');
module.exports = config;
