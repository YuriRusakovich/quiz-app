import path from 'path';
import { createServer } from 'http';
import express from 'express';
import { Server, Socket }  from 'socket.io';
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
                users.addUser(hostId, socket.id, params.name, {score: 0, answer: 0});
                socket.join(params.pin.toString());
                const usersInGame = users.getUsers(hostId);
                socket.to(params.pin.toString()).emit('updateUsersLobby', usersInGame);
                for (let j = 0; j < usersInGame.length; j++) {
                    socket.to(usersInGame[j].userId).emit('currentUsers', usersInGame);
                }
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
});

