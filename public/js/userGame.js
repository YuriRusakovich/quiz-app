const socket = io();
let playerAnswered = false;
let correct = false;
let name;
let score = 0;
const params = jQuery.deparam(window.location.search);

socket.on('connect', function () {
    params.socketID = socket.id;
    socket.emit('player-join-game', params);
    setAnswersEnabled();
    document.getElementById('cancel').style.display = 'none';
});

socket.on('noGameFound', function () {
    window.location.href = '../../';
});

function answerSubmitted(num) {
    if (playerAnswered === false) {
        playerAnswered = true;
        socket.emit('playerAnswer', num);
        setAnswersDisabled();
        document.getElementById('message').style.display = 'block';
        document.getElementById('message').innerHTML =
            'Answer Submitted! Waiting on other players...';
    }
}

socket.on('answerResult', function (data) {
    if (data === true) {
        correct = true;
    }
});

socket.on('questionOver', function () {
    if (correct === true) {
        document.getElementById('message').innerHTML = 'Correct!';
    } else {
        document.getElementById('message').innerHTML = 'Incorrect!';
    }
    setAnswersDisabled();
    socket.emit('getScore');
});

socket.on('newScore', function (data) {
    for (let user of data) {
        document.getElementById(`${user.userId}_score`).innerHTML = 'Score: ' + user.gameData.score;
        if (user.currentIsCorrect && playerAnswered) {
            document.getElementById(`${user.userId}_img`).style.border = '2px solid green';
            user.currentIsCorrect = false;
        } else if (playerAnswered) {
            document.getElementById(`${user.userId}_img`).style.border = '2px solid red';
            user.currentIsCorrect = false;
        }
    }
});

socket.on('nextQuestionPlayer', function () {
    correct = false;
    playerAnswered = false;
    setAnswersEnabled();
    const images = document.getElementsByClassName('user_img');
    for (let image of images) {
        image.style.border = '2px solid grey';
    }
});

socket.on('hostDisconnect', function () {
    window.location.href = '../../';
});

socket.on('playerGameData', function (data) {
    prepareUser(data);
});

socket.on('gameData', function(data) {
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = `Question: ${data.q1}`;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
});

socket.on('GameOver', function () {
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = 'Game Over';
    document.getElementById('answer1').style.display = 'none';
    document.getElementById('answer2').style.display = 'none';
    document.getElementById('answer3').style.display = 'none';
    document.getElementById('answer4').style.display = 'none';
    const images = document.getElementsByClassName('user_img');
    for (let image of images) {
        image.style.border = '2px solid grey';
    }
    document.getElementById('cancel').style.display = 'block';
});

function setAnswersEnabled() {
    document.getElementById('answer1').disabled = false;
    document.getElementById('answer2').disabled = false;
    document.getElementById('answer3').disabled = false;
    document.getElementById('answer4').disabled = false;
}

function setAnswersDisabled() {
    document.getElementById('answer1').disabled = true;
    document.getElementById('answer2').disabled = true;
    document.getElementById('answer3').disabled = true;
    document.getElementById('answer4').disabled = true;
}

function endGame() {
    window.location.href = '/';
}
