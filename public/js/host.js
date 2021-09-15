const socket = io();
const params = jQuery.deparam(window.location.search);

socket.on('connect', function () {
    document.getElementById('users').innerHTML = 'There are no users...';
    socket.emit('host-join', params);
    document.getElementById('start').disabled = true;
});

socket.on('showGamePin', function (data) {
    document.getElementById('gamePinText').innerHTML = data.pin;
});

socket.on('updateUsersLobby', function (data) {
    if (data.length) {
        document.getElementById('start').disabled = false;
    }
    updateUsers(data);
});

function startGame() {
    socket.emit('startGame');
}
function endGame() {
    window.location.href = '/';
}

socket.on('gameStarted', function (id) {
    window.location.href = '/host/game/' + '?id=' + id;
});

socket.on('noGameFound', function () {
    window.location.href = '../../';
});
