const socket = io();
const params = jQuery.deparam(window.location.search);

socket.on('connect', function () {
    socket.emit('host-join-game', params);
    document.getElementById('cancel').style.display = 'none';
});

socket.on('noGameFound', function () {
    window.location.href = '../../';
});

socket.on('gameQuestions', function (data) {
    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    document.getElementById('playersAnswered').innerHTML =
        'Players Answered 0 / ' + data.playersInGame;
    document.getElementById('questionNum').innerHTML =
        `Question ${data.currentQuestionNum} / ${data.questionsLength}`;
});

socket.on('updatePlayersAnswered', function (data) {
    document.getElementById('playersAnswered').innerHTML =
        'Players Answered ' + data.playersAnswered + ' / ' + data.playersInGame;
});

socket.on('questionOver', function (data) {
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
    document.getElementById('answer1').style.display = 'none';
    document.getElementById('answer2').style.display = 'none';
    document.getElementById('answer3').style.display = 'none';
    document.getElementById('answer4').style.display = 'none';
    document.getElementById('question').innerHTML = 'GAME OVER';
    document.getElementById('playersAnswered').innerHTML = '';
    document.getElementById('cancel').style.display = 'block';
});

function endGame() {
    window.location.href = '/';
}
