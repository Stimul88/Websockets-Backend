const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const WS = require('ws');
const chat = require('./db/dbChat')



const app = new Koa();

const router = require('./routes')

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));


app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = {'Access-Control-Allow-Origin': '*',};

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(router());

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server:server
});

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {

    const splitMessage = message.toString().split(' ')
    const obj = {
      name: splitMessage[0],
      message: splitMessage[1]
    }

    chat.push(obj);

    const eventData = JSON.stringify({chat: [obj]})
    console.log(eventData)

    Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(eventData))

  })
  ws.send(JSON.stringify({chat}));

});


server.listen(port)

