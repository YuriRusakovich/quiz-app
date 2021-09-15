const socket = io();
const params = jQuery.deparam(window.location.search);

socket.on('connect', function () {
    params.socketID = socket.id;
    document.getElementById('users').innerHTML = 'There are no users...';
    socket.emit('player-join', params);
});

socket.on('noGameFound', function () {
    window.location.href = '../';
});

socket.on('hostDisconnect', function () {
    window.location.href = '../';
});

socket.on('gameStartedPlayer', function () {
    window.location.href = '/users/game/' + '?id=' + socket.id;
});

socket.on('currentUsers', function (data) {
    updateUsers(data);
});
