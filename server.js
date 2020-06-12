var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var people = [];

server.listen(3000);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.render('index');
});


io.on('connection', function (socket) {
  console.log("Quelqu'un s'est connecté !", socket.id);

  const newPerson = {
    id: socket.id,
    x: 50,
    y: 50
  };

  people.push(newPerson);

  socket.emit('hello', {
    list: people
  });

  socket.emit('helloNewPerson', {
    person: newPerson
  });

  socket.broadcast.emit('someoneHasConnected', {
    person: newPerson
  });

  socket.on('newMove', function(data) {
    console.log("Quelqu'un s'est déplacé", data.person.id);
    console.log(data);

    socket.broadcast.emit('someoneHasMoved', {
      person: data.person
    });
  });

  socket.on('disconnect', function () {
    console.log("Quelqu'un s'est déconnecté", socket.id);

    people = people.filter(function(person) {
      console.log(person.id);
      return person.id !== socket.id;
    });

    io.sockets.emit('someoneHasDisconnected', {
      id: socket.id
    })
  })
});
