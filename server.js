var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));




var people = [];

var params = {
  colors: [
    '#F7CE4C',
    '#00CC76',
    '#EC4E3A',
    '#85D0EE',
  ]
}


app.get('/', function (req, res) {
  res.render('index', {
    params: params
  });
});


io.on('connection', function (socket) {
  console.log("Quelqu'un s'est connecté !", socket.id);
  
  const newPerson = {
    id: socket.id,
    x: 50,
    y: 50,
    color: params.colors[Math.floor(Math.random() * params.colors.length)]
  };

  people.push(newPerson);

  socket.emit('hello', {
    people: people
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
    
    updatePeopleList(data.person);
    
    socket.broadcast.emit('someoneHasMoved', {
      person: data.person
    });
  });
  
  socket.on('newColor', function(data) {
    console.log("Quelqu'un a changé sa couleur", data.person.id);
    console.log(data);
    
    updatePeopleList(data.person);
    
    socket.broadcast.emit('someoneHasChangedColor', {
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

function updatePeopleList(person) {
  for (let i = 0; i < people.length; i++) {
    if (people[i].id == person.id) {
      people[i] = person;
    }
  }
}
