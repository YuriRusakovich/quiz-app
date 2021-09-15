const socket = io();

socket.on('connect', function () {
    socket.emit('requestDbNames');
});

socket.on('gameNamesData', function (data) {
    for (let i = 0; i < Object.keys(data).length; i++) {
        const div = document.getElementById('game-list');
        const button = document.createElement('button');
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        div.appendChild(button);
    }
});

function startGame(data) {
    window.location.href = '/host/' + '?id=' + data;
}
