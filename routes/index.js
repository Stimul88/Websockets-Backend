const combineRouters = require('koa-combine-routers');

const index = require('./index/index.js');
const users = require('./users');

const router = combineRouters(
  index,
  users,
);

module.exports = router;
