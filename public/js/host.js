const socket = io();
const params = jQuery.deparam(window.location.search);

socket.on('connect', function() {
    document.getElementById('users').innerHTML = "There are no users...";
    socket.emit('host-join', params);
});

socket.on('showGamePin', function(data){
    document.getElementById('gamePinText').innerHTML = data.pin;
});

socket.on('updateUsersLobby', function(data){
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

function startGame(){
    socket.emit('startGame');
}
function endGame(){
    window.location.href = "/";
}

socket.on('gameStarted', function(id){
    window.location.href="/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function(){
    window.location.href = '../../';
});

