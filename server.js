const http = require('http');
const Koa = require('koa');
const WS = require('ws');
const dbChat = require('./db/dbChat')
let dbUsers = require('./db/dbUsers')

const app = new Koa();


const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server
});

wsServer.on('connection', (ws) => {
  let clientNam = undefined;

  ws.on('message', (message) => {

    const data = JSON.parse(message.toString())

    const { user } = data;
    const { chat } = data;


    if(user) {

      clientNam = user.name;

      const nameData = dbUsers.find(name => name.name === user.name);
      if (!nameData) {
        dbUsers.push(user)


        const eventData = JSON.stringify({user});

        Array.from(wsServer.clients)
          .filter(client => client.readyState === WS.OPEN)
          .forEach(client => client.send(eventData));

        return;
      }
      ws.send(JSON.stringify({"busy": "Никнейм занят! Необходимо выбрать другой!"}));
      return;
    }


    if(chat) {
      dbChat.push(chat);

      const eventData = JSON.stringify({chat});

      Array.from(wsServer.clients)
        .filter(client => client.readyState === WS.OPEN)
        .forEach(client => client.send(eventData));
    }
  })



  ws.on('close', () => {

    const index = dbUsers.findIndex(el => el.name === clientNam);


    dbUsers.splice(index, 1)


    Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(JSON.stringify({ dbUsers: dbUsers })));

    clientNam = undefined;

    console.log('close')
  });

  ws.send(JSON.stringify({ dbUsers: dbUsers }));
  ws.send(JSON.stringify({ dbChat: dbChat }));

});

server.listen(port)

