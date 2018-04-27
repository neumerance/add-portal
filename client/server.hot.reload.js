/* eslint no-console:0 */
/* eslint consistent-return:0 */
const path          = require('path');
const webpack       = require('webpack');
const express       = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config        = require('./webpack.hot.reload.config');
const chalk         = require('chalk');
const https         = require('https');
const fs = require('fs');
const app       = express();
const compiler  = webpack(config);
const appConfig = require('./config');

const keysPath = process.env.addKeys || appConfig.keysPath;

var options = {
  key: fs.readFileSync(keysPath+'server.key'),
  cert: fs.readFileSync(keysPath+'server.crt'),
  requestCert: false,
  rejectUnauthorized: false
};


app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));

app.use(hotMiddleware(compiler));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let server = null;
if (appConfig.ssl) {
  server = require('https').createServer(options, app);
} else {
  server = require('http').createServer(app);
}

const port = appConfig.ssl ? appConfig.https_port : appConfig.http_port
server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(
    `
      =====================================================
      -> Server (${chalk.bgBlue('Hot reload')}) 🏃 (running) on ${chalk.green(`${appConfig.protocol}://localhost`)}:${chalk.green(`${port}`)}
      =====================================================
    `
  );
});
