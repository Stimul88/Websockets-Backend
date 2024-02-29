const Router = require("koa-router");
let users = require('../../db/dbUsers')

const router = new Router();


router.get('', (ctx) => {
  // ctx.response.body = 'hello';
  ctx.response.body = users;
})

module.exports = router;