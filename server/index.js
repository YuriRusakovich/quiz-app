import path from 'path';
import { createServer } from 'http';
import express from 'express';
import { Server }  from 'socket.io';
import 'mongoose';
import { MongoClient } from 'mongodb';
import LiveGames from './utils/liveGames.js';
import Users from './utils/users.js';

const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);
const publicPath = path.join(__dirname, '/../public');
const port = 3000;
let app = express();
let server = createServer(app);
let io = new Server(server, { cors: { origin: '*' }});

const url = "mongodb://localhost:27017/";
const games = new LiveGames();
const users = new Users();

app.use(express.static(publicPath));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

io.on('connection', (socket) => {
    socket.on('requestDbNames', function(){
        MongoClient.connect(url, function(err, db){
            if (err) throw err;
            let dbo = db.db('api');
            dbo.collection("games").find().toArray(function(err, res) {
                if (err) throw err;
                socket.emit('gameNamesData', res);
                db.close();
            });
        });
    });

    socket.on('host-join', (data) =>{
        MongoClient.connect(url, function(err, db) {
            if (err) {
                throw err;
            }
            const dbo = db.db('api');
            const query = { id: parseInt(data.id) };
            dbo.collection('games')
                .find(query)
                .toArray(function(err, result){
                if (err) {
                    throw err;
                }
                if (result[0] !== undefined) {
                    const gamePin = Math.floor(Math.random() * 90000) + 10000;
                    games.addGame(gamePin, socket.id, false, {playersAnswered: 0, questionLive: false, gameid: data.id, question: 1});
                    const game = games.getGame(socket.id);
                    socket.join(game.pin.toString());
                    socket.emit('showGamePin', {
                        pin: game.pin
                    });
                } else {
                    socket.emit('noGameFound');
                }
                db.close();
            });
        });
    });

    socket.on('startGame', () => {
        const game = games.getGame(socket.id);
        game.gameLive = true;
        socket.emit('gameStarted', game.hostId);
    });

    socket.on('player-join', (params) => {
        let gameFound = false;
        for (let i = 0; i < games.games.length; i++) {
            if (params.pin === games.games[i].pin.toString()) {
                const hostId = games.games[i].hostId;
                users.addUser(hostId, socket.id, params.name, {score: 0, answer: 0}, false);
                socket.join(params.pin.toString());
                const usersInGame = users.getUsers(hostId);
                socket.to(params.pin.toString()).emit('updateUsersLobby', usersInGame);
                socket.to(params.pin.toString()).emit('currentUsers', usersInGame);
                socket.emit('currentUsers', usersInGame);
                gameFound = true;
            }
        }
        if(gameFound === false){
            socket.emit('noGameFound');
        }
    });

    socket.on('disconnect', () => {
        let game = games.getGame(socket.id);
        if (game) {
            if (game.gameLive === false) {
                games.removeGame(socket.id);
                const playersToRemove = users.getUsers(game.hostId);
                for (let i = 0; i < playersToRemove.length; i++) {
                    users.removeUser(playersToRemove[i].userId);
                }
                socket.to(game.pin.toString()).emit('hostDisconnect');
                socket.leave(game.pin.toString());
            }
        } else {
            const player = users.getUser(socket.id);
            if (player) {
                const hostId = player.hostId;
                game = games.getGame(hostId);
                const pin = game.pin;
                if (game.gameLive === false) {
                    users.removeUser(socket.id);
                    const usersInGame = users.getUsers(hostId);
                    socket.to(pin.toString()).emit('updateUsersLobby', usersInGame);
                    for (let j = 0; j < usersInGame.length; j++) {
                        socket.to(usersInGame[j].userId).emit('currentUsers', usersInGame);
                    }
                    socket.emit('currentUsers', usersInGame);
                    socket.leave(pin.toString());
                }
            }
        }
    });

    socket.on('player-join-game', (data) => {
        const player = users.getUser(data.id);
        if (player) {
            const game = games.getGame(player.hostId);
            socket.join(game.pin.toString());
            player.userId = socket.id;
            users.updateUser(player.userId, data.socketID);
            setTimeout(() => {
                const playerData = users.getUsers(game.hostId);
                socket.emit('playerGameData', playerData);
            }, 200);
        } else {
            socket.emit('noGameFound');
        }
    });

    socket.on('host-join-game', (data) => {
        const oldHostId = data.id;
        const game = games.getGame(oldHostId);
        if (game) {
            game.hostId = socket.id;
            socket.join(game.pin.toString());
            const playerData = users.getUsers(oldHostId);
            for (let i = 0; i < Object.keys(users.users).length; i++) {
                if (users.users[i].hostId === oldHostId) {
                    users.users[i].hostId = socket.id;
                }
            }
            const gameid = game.gameData['gameid'];
            MongoClient.connect(url, function(err, db){
                if (err) {
                    throw err;
                }
                const dbo = db.db('api');
                const query = { id: parseInt(gameid) };
                dbo.collection("games").find(query).toArray(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    const question = res[0].questions[0].question;
                    const answer1 = res[0].questions[0].answers[0];
                    const answer2 = res[0].questions[0].answers[1];
                    const answer3 = res[0].questions[0].answers[2];
                    const answer4 = res[0].questions[0].answers[3];
                    const correctAnswer = res[0].questions[0].correct;
                    const questionsLength = res[0].questions.length;

                    socket.emit('gameQuestions', {
                        q1: question,
                        a1: answer1,
                        a2: answer2,
                        a3: answer3,
                        a4: answer4,
                        correct: correctAnswer,
                        playersInGame: playerData.length,
                        questionsLength: questionsLength,
                        currentQuestionNum: game.gameData.question
                    });
                    setTimeout(() => {
                        socket.to(game.pin.toString()).emit('gameData', {
                            q1: question,
                            a1: answer1,
                            a2: answer2,
                            a3: answer3,
                            a4: answer4
                        });
                    }, 200);
                    db.close();
                });
            });

            socket.to(game.pin.toString()).emit('gameStartedPlayer');
            game.gameData.questionLive = true;
        }else{
            socket.emit('noGameFound');
        }
    });

    socket.on('playerAnswer', function(num){
        const player = users.getUser(socket.id);
        const hostId = player.hostId;
        const playerNum = users.getUsers(hostId);
        const game = games.getGame(hostId);
        if (game.gameData.questionLive === true) {
            player.gameData.answer = num;
            game.gameData.playersAnswered += 1;

            const gameQuestion = game.gameData.question;
            const gameid = game.gameData.gameid;

            MongoClient.connect(url, function(err, db){
                if (err) {
                    throw err;
                }

                const dbo = db.db('api');
                const query = { id: parseInt(gameid) };
                dbo.collection("games").find(query).toArray(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    const correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    if (num === parseInt(correctAnswer)) {
                        player.gameData.score += 100;
                        socket.emit('answerResult', true);
                        player.currentIsCorrect = true;
                    }
                    if (game.gameData.playersAnswered === playerNum.length) {
                        game.gameData.questionLive = false;
                        socket.to(game.pin.toString()).emit('updatePlayersAnswered', {
                            playersInGame: playerNum.length,
                            playersAnswered: game.gameData.playersAnswered
                        });
                        socket.to(game.pin.toString()).emit('questionOver');
                        socket.emit('questionOver');
                    } else {
                        socket.to(game.pin.toString()).emit('updatePlayersAnswered', {
                            playersInGame: playerNum.length,
                            playersAnswered: game.gameData.playersAnswered
                        });
                    }

                    db.close();
                });
            });
        }
    });

    socket.on('getScore', function(){
        const player = users.getUser(socket.id);
        const hostId = player.hostId;
        const players = users.getUsers(hostId);
        const game = games.getGame(hostId);
        socket.emit('newScore', players);
        socket.to(game.pin.toString()).emit('newScore', players);
    });

    socket.on('nextQuestion', function(){
        const playerData = users.getUsers(socket.id);
        for(let i = 0; i < Object.keys(users.users).length; i++){
            if (users.users[i].hostId === socket.id) {
                users.users[i].gameData.answer = 0;
            }
        }
        const game = games.getGame(socket.id);
        game.gameData.playersAnswered = 0;
        game.gameData.questionLive = true;
        game.gameData.question += 1;
        const gameid = game.gameData.gameid;

        MongoClient.connect(url, function(err, db) {
            if (err) {
                throw err;
            }
            const dbo = db.db('api');
            const query = { id: parseInt(gameid) };
            dbo.collection("games").find(query).toArray(function(err, res) {
                if (err) {
                    throw err;
                }

                if (res[0].questions.length >= game.gameData.question) {
                    let questionNum = game.gameData.question;
                    questionNum = questionNum - 1;
                    const question = res[0].questions[questionNum].question;
                    const answer1 = res[0].questions[questionNum].answers[0];
                    const answer2 = res[0].questions[questionNum].answers[1];
                    const answer3 = res[0].questions[questionNum].answers[2];
                    const answer4 = res[0].questions[questionNum].answers[3];
                    const correctAnswer = res[0].questions[questionNum].correct;
                    const questionsLength = res[0].questions.length;

                    socket.emit('gameQuestions', {
                        q1: question,
                        a1: answer1,
                        a2: answer2,
                        a3: answer3,
                        a4: answer4,
                        correct: correctAnswer,
                        playersInGame: playerData.length,
                        questionsLength: questionsLength,
                        currentQuestionNum: game.gameData.question
                    });
                    setTimeout(() => {
                        socket.to(game.pin.toString()).emit('gameData', {
                            q1: question,
                            a1: answer1,
                            a2: answer2,
                            a3: answer3,
                            a4: answer4
                        });
                    }, 200);
                    db.close();
                } else {
                    socket.to(game.pin.toString()).emit('GameOver');
                    socket.emit('GameOver');
                }
            });
        });
        socket.to(game.pin.toString()).emit('nextQuestionPlayer');
    });

});

