const socket = io();
const params = jQuery.deparam(window.location.search);
let questionsLength = 0;
let currentQuestionNum = 0;
let correct = false;

socket.on('connect', function () {
    socket.emit('host-join-game', params);
    document.getElementById('cancel').style.display = 'none';
});

socket.on('noGameFound', function () {
    window.location.href = '../../';
});

socket.on('gameQuestions', function (data) {
    document.getElementById('gameTitle').innerHTML = `Game title: ${data.n}`;
    document.getElementById('gameType').innerHTML = `Game type: ${data.t}`;
    document.getElementById('gameLevel').innerHTML = `Game level: ${data.l}`;
    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    document.getElementById('playersAnswered').innerHTML =
        'Players Answered 0 / ' + data.playersInGame;
    document.getElementById('questionNum').innerHTML =
        `Question ${data.currentQuestionNum} / ${data.questionsLength}`;
    currentQuestionNum = data.currentQuestionNum;
    questionsLength = data.questionsLength;
});

socket.on('updatePlayersAnswered', function (data) {
    document.getElementById('playersAnswered').innerHTML =
        'Players Answered ' + data.playersAnswered + ' / ' + data.playersInGame;
});

socket.on('questionOver', function () {
    document.getElementById('nextQButton').style.display = 'block';
});

function nextQuestion() {
    document.getElementById('nextQButton').style.display = 'none';
    document.getElementById('answer1').style.filter = 'none';
    document.getElementById('answer2').style.filter = 'none';
    document.getElementById('answer3').style.filter = 'none';
    document.getElementById('answer4').style.filter = 'none';
    document.getElementById('playersAnswered').style.display = 'block';
    socket.emit('nextQuestion');
}

socket.on('GameOver', function () {
    document.getElementById('nextQButton').style.display = 'none';
    document.getElementById('finishButton').style.display = 'none';
    document.getElementById('cancel').style.display = 'block';
    const h2 = document.createElement('h2');
    h2.innerHTML = 'Game Over';
    h2.setAttribute('id', 'questionFinishTitle');
    document.getElementById('questionWrapper').innerHTML = '';
    document.getElementById('questionWrapper').appendChild(h2);
});

socket.on('currentUsers', function (data) {
    prepareUser(data);
});

socket.on('newScore', function (data) {
    for (let user of data) {
        document.getElementById(`${user.userId}_score`).innerHTML = 'Score: ' + user.gameData.score;
    }
});

socket.on('finishGame', function() {
    document.getElementById('nextQButton').style.display = 'none';
    document.getElementById('finishButton').style.display = 'block';
});

function endGame() {
    window.location.href = '/';
}

