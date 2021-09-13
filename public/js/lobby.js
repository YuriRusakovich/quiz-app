const socket = io();

socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);
    params.socketID = socket.id;
    document.getElementById('users').innerHTML = "There are no users...";
    socket.emit('player-join', params);
});

socket.on('noGameFound', function(){
    window.location.href = '../';
});

socket.on('hostDisconnect', function(){
    window.location.href = '../';
});

socket.on('gameStartedPlayer', function(){
    window.location.href="/player/game/" + "?id=" + socket.id;
});

socket.on('currentUsers', function(data){
    const div =  document.getElementById('users');
    div.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        const user = document.createElement('div');
        const userName = document.createElement('div');
        user.setAttribute('class', 'user_wrapper');
        user.setAttribute('id', data[i].userId);
        const img = document.createElement('img');
        img.setAttribute('src', '../img/user.png');
        img.setAttribute('class', 'user_img');
        userName.innerHTML = data[i].name;
        user.appendChild(img);
        user.appendChild(userName);
        div.appendChild(user);
    }
});


