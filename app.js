const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(app.get('port'));

//ROUTING
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});
app.get('/script/script.js', (req, res) => {
    res.sendFile(__dirname + '/pages/script.js');
});
app.get('/res/styles.css', (req, res) => {
    res.sendFile(__dirname + '/pages/res/styles.css');
});
app.get('/res/fonts/YesterdayDream.otf', (req, res) => {
    res.sendFile(__dirname + '/pages/res/fonts/YesterdayDream.otf');
});
app.get('/res/img/refresh.png', (req, res) => {
    res.sendFile(__dirname + '/pages/res/img/refresh.png');
});
app.get('/res/img/paysageMode.png', (req, res) => {
    res.sendFile(__dirname + '/pages/res/img/paysageMode.png');
});

//letIABLES
let players = [];
let games = [];

/*        
let createGame = {
    id: idGame,
    link: ,
    nomPartie: nickname, A DELETE
    namePlayers: [],
    idPlayers: [],
    turn: -1,
    gameboard: [-1,-1,-1,-1,-1,-1,-1,-1,-1],
    state: 0,
    private:
}
    // Si state est à 0: partie pas lancé, Si state est à 1: partie lancé, Si state est à 2: partie fini avec une demande pour rejouer,
*/
//Setters et getters generaux
function validNickname(nickname) {
    if(players.indexOf(nickname) === -1) {
        players.push(nickname);
        console.log(nickname + ' connected');
        return true;
    }
    else return false;
}
function deletePlayer(nickname) {
    players.splice(players.indexOf(nickname), 1);
    console.log(nickname + ' disconnected');
}
function createLink(length) {
    let result = '';
    let list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let listLength = list.length;
    for (let i = 0; i < length; i++ ) {
        result += list.charAt(Math.floor(Math.random() * listLength));
    }
    return result;
}
//Setters et getters pour une partie
function getPositionOfPlayer(id, nickname) {
    return games[id].namePlayers.indexOf(nickname);
}
function getPlayers(id) {
    return games[id].namePlayers;
}
function getNbPlayer(id) {
    return games[id].namePlayers.length;
}
function getIdWithLink(link) {
    let result = false; 
    games.forEach(game => {
        if((game.link == link) === undefined) return false;
        if (game.link == link) result = game.id;
    });
    return result;
}
function getLink(id) {
    return games[id].link;
}
function getTypeGame(id) {
    return games[id].private;
}

function getStateGame(id) {
    return games[id].state;
}
function setStateGame(id, state) {
    games[id].state = state;
}

function getNextPlayer(id) {
    if(games[id].turn === 1) games[id].turn = 0;
    else games[id].turn = 1;
    return games[id].idPlayers[games[id].turn];
}

function getGameboard(id) {
    return games[id].gameboard;
}
function updateGameboard(id, location, nickname) {
    if(games[id].gameboard[location] !== -1) return false;
    else {
        games[id].gameboard[location] = getPositionOfPlayer(id, nickname);
        return true;
    }
}

function checkVictory(id) {
    for(let i = 0; i < getNbPlayer(id); i++) {
        if((games[id].gameboard[0] === i && games[id].gameboard[1] === i && games[id].gameboard[2] === i )//LIGNE HORIZONTALE DU BAS       
        || (games[id].gameboard[3] === i && games[id].gameboard[4] === i && games[id].gameboard[5] === i )//LIGNE HORIZONTALE DU MILIEU     
        || (games[id].gameboard[6] === i && games[id].gameboard[7] === i && games[id].gameboard[8] === i )//LIGNE HORIZONTALE DU HAUT 
        || (games[id].gameboard[0] === i && games[id].gameboard[3] === i && games[id].gameboard[6] === i )//LIGNE VERTICALE DE GAUCHE
        || (games[id].gameboard[1] === i && games[id].gameboard[4] === i && games[id].gameboard[7] === i )//LIGNE VERTICALE DE MILIEU
        || (games[id].gameboard[2] === i && games[id].gameboard[5] === i && games[id].gameboard[8] === i )//LIGNE VERTICALE DE DROITE
        || (games[id].gameboard[6] === i && games[id].gameboard[4] === i && games[id].gameboard[2] === i )//DIAGONALE HAUT GAUCHE VERS BAS DROIT
        || (games[id].gameboard[0] === i && games[id].gameboard[4] === i && games[id].gameboard[8] === i ))//DIAGONALE BAS GAUCHE VERS HAUT DROIT
        {
            setStateGame(id, 0);
            return winner = games[id].namePlayers[i];
        }
    }
    if(getGameboard(id).indexOf(-1) === -1){
        setStateGame(id, 0);
        return winner = "egalite";
    }
    else return false;
}

//CLIENT-SERVER
io.on('connection', (socket) => {

    //Demande pour avoir un nickname
    socket.on('setNickname', function(nickname) {
        //Le nickname n'est pas valide
        if(validNickname(nickname) == false) {
            let err = nickname + " est déjà pris !";
            socket.emit('invalidNickname', err);
        }
        //Si il est valide
        else {
            socket.emit('validNickname', games);
        }
    });

    //Le client se déconnecte
    socket.on('deleteNickname', function(nickname){
        deletePlayer(nickname);
    });
    //Le client veut rafraichir l'affichage des salons
    socket.on('refresh', function(idPlayer) {
        io.in(idPlayer).emit('refreshed', games);
    });

    //Le client rejoint un salon 
    socket.on('joinGame', function(idGame, nickname, idPlayer, link) {
        try {
            if(link !== undefined) {
                idGame = getIdWithLink(link);
                if(idGame === false) throw new Error("Un link n'est pas bon.");
            }
            //Si il y a déjà 2 joueurs
            if (getNbPlayer(idGame) === 2) throw new Error(games[idGame].nomPartie + " est full !");
            else {
                //Sinon il rejoint et la partie commence
                games[idGame].namePlayers.push(nickname);
                games[idGame].idPlayers.push(idPlayer);
                
                //Il y a 2 joueurs donc on lance la partie
                //L'state de la partie est à 1 soit lancé
                setStateGame(idGame, 1);
                //On tire au hasard pour savoir qui commence
                games[idGame].turn = Math.floor(Math.random() * 2);
                socket.join(getLink(idGame));
                console.log(nickname + ' join ' + getLink(idGame));
                io.in(getLink(idGame)).emit('startGame', getPlayers(idGame),idGame);
            }
        }
        catch(e) {
            console.log("throw" + e);
            socket.emit('errorJoinGame', e);
            socket.emit('refreshed', games);
        }
    });
    //Le client créer un salon
    socket.on('createGame', function(nickname, idPlayer, privateState) {
        let idGame = games.length;
        let createGame = {
            id: idGame,
            link: createLink(15),
            nomPartie: nickname,
            namePlayers: [nickname],
            idPlayers: [idPlayer],
            turn: -1,
            gameboard: [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            state: 0,
            private: privateState
        }
        games.push(createGame);
        socket.join(getLink(idGame));
        console.log(nickname + ' join ' + getLink(idGame));
        socket.emit('validGame', idGame, getLink(idGame),getTypeGame(idGame));
    });
    //Le client se déconnecte
    socket.on('deletePlayerInRoom', function(idGame, nickname) {
        //Leave le socket
        console.log("deletePlayerInRoom idGame: " + idGame);
        socket.leave(getLink(idGame));
        console.log(nickname + ' leave ' + getLink(idGame));
        //On enleve le nickname et on reduit de 1 le nombre de personne dans le salon
        deletePlayer(nickname);
        games[idGame].namePlayers.splice(games[idGame].namePlayers.indexOf(nickname), 1);
        //Si il n'y a plus personne alors on supprime le salon
        if(getNbPlayer(idGame) === 0) games.splice(idGame, 1);
        //Si la personne qui se déconnecte etait dans une partie en cours
        else if(getStateGame(idGame) === 1) {
            io.in(getLink(idGame)).emit('endGame', "forfait");
        }
        else if(getStateGame(idGame) === 2) {
            setStateGame(idGame, 0);
            io.in(getLink(idGame)).emit('rematch', "annulee");
        }
    });
    //Début de la partie
    socket.on('beginGame', function(idGame, nickname, idPlayer) {
        if(getPositionOfPlayer(idGame, nickname) === games[idGame].turn) {
            io.in(idPlayer).emit('yourTurn', getGameboard(idGame));
        }
        else {
            io.in(idPlayer).emit('waitTurn');
        }
    });
    socket.on('gameTurn', function(idGame, placement, nickname) {
        updateGameboard(idGame, placement, nickname);
        //On regarde si quelqu'un a gagné si pas de winner
        let result = checkVictory(idGame);
        if(result === false) io.in(getNextPlayer(idGame)).emit('yourTurn', getGameboard(idGame));
        else io.in(getLink(idGame)).emit('endGame', result);
    });

    socket.on('requestRematch', function(idGame, nickname) {
        io.in(getLink(idGame)).emit('rematch', nickname + " veut une revanche !");
    });
    
    socket.on('restartGame', function(idGame) {
        //Si l'adversaire à déjà demander la revanche
        if(getStateGame(idGame) === 2) {
            games[idGame].gameboard = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
            games[idGame].turn = Math.floor(Math.random() * 2);
            io.in(getLink(idGame)).emit('startGame', undefined, idGame);
        }
        //Sinon demande de revanche
        else setStateGame(idGame, 2);
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
