let player = {};
let step = 5;

$(function(){

  socket.on('hello', function (data) {
    console.log("On vient d'arriver : on affiche la liste des gens connectés");
    console.log('Données reçues :');
    console.log(data);

    data.people.forEach(function(person) {
      addPerson(person);
    })
  });

  socket.on('helloNewPerson', function(data) {
    player = data.person;
  });

  socket.on('someoneHasConnected', function (data) {
    console.log("Quelqu'un vient de se connecter : on l'affiche");
    console.log('Données reçues :');
    console.log(data);

    addPerson(data.person);
  });

  socket.on('someoneHasDisconnected', function (data) {
    console.log("Quelqu'un vient de partir : on le supprime");
    console.log('Données reçues :');
    console.log(data);

    removePerson(data.id);
  });

  socket.on('someoneHasMoved', function (data) {
    console.log('Nouvelle direction à appliquer !');
    console.log('Données reçues :');
    console.log(data);

    movePerson(data.person);
  });

  socket.on('someoneHasChangedColor', function (data) {
    console.log('Nouvelle couleur à appliquer !');
    console.log('Données reçues :');
    console.log(data);

    setPersonColor(data.person);
  });
  

  function addPerson(person) {
    $('#people').append('<div class="person" data-id="'+person.id+'"></div>');
  
    movePerson(person);
    setPersonColor(person);
  }

  function removePerson(personId) {
    $('.person[data-id="'+personId+'"]').remove();
  }

  function movePerson(person) {
    let personDOM = $('.person[data-id="'+person.id+'"]');
    personDOM.css({
      'left': person.x + '%',
      'top': person.y + '%',
    });
  }

  function setPersonColor(person) {
    let personDOM = $('.person[data-id="'+person.id+'"]');
    personDOM.css({
      'background': person.color
    });
  }



  $('.button-color').click(function(){
    let color = $(this).data('color');
    
    player.color = color;
    
    socket.emit('newColor', {
      person: player
    });
    
    setPersonColor(player);
  });
  


  $('.button-direction').click(function() {
    let direction = $(this).data('direction');

    updatePlayerPosition(direction);
  });

  $(document).keydown(function(e) {
    let direction = null;

    if (e.keyCode == 37) direction = 'left';
    if (e.keyCode == 38) direction = 'up';
    if (e.keyCode == 39) direction = 'right';
    if (e.keyCode == 40) direction = 'down';

    updatePlayerPosition(direction);
  });

  function updatePlayerPosition(direction) {
    if (direction == 'left') {
      player.x -= step;
    }

    if (direction == 'right') {
      player.x += step;
    }

    if (direction == 'up') {
      player.y -= step;
    }

    if (direction == 'down') {
      player.y += step;
    }

    socket.emit('newMove', {
      person: player
    });

    movePerson(player);
  }

});
