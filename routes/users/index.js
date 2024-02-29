const Router = require("koa-router");
let users = require('../../db/dbUsers')

const router = new Router();

router.post('/users', (ctx) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = 'users';

  const { name } = ctx.request.body


  if ( users.some(us => us.name === name)) {
    ctx.response.status = 400;
    ctx.response.body = { status: "users exists" };

    return;
  }

  console.log(ctx.request.body)

  users.push({ name });

  ctx.response.body = { status: "OK"};
});


router.delete('/users/:name', (ctx) => {

  const { name } = ctx.params;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if ( users.every(us => us.name !== name)) {
    ctx.response.status = 400;
    ctx.response.body = { status: "users doesn\'t exists" };

    return;
  }

  users = users.filter(us => us.name !== name);

  ctx.response.body = { status: "OK" };
});

module.exports = router;