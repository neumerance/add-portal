const config = {};
config.port = 4000;
config.ssl = false;
config.http_port = 4000;
config.https_port = 4001;
config.protocol = (config.ssl ? 'https' : 'http');
config.serviceId = '17100';
config.serviceKey = '5ae9dae6d7199862d41f5f91';
config.serviceEndpoint = 'http://192.168.0.106:3000/';
config.mysqlHost = 'localhost';
config.mysqlUsername = 'root';
config.mysqlPassword = 'abc';
config.mysqlDatabase = 'addserver';
config.secret = '81ce0eabbee722ae74ca2eac4d4fe4c3623b2e0ed5d8de38f6ba94eda4f6e97e4a657587003db01e3e17013a107293ad18d07ff023ebf3bec6d4f91ffe80cb04';
config.keysPath = '/usr/local/etc/addkeys/';
module.exports = config;