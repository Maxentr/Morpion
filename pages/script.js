$(function() {
    var origin = window.location.origin;
    var socket = io.connect(origin);
    let nickname;
    let idGame;
    let idPlayer;
    let turn;
    let gameboard = [];
    let privatee = 0;
    
    //Si il y a un lien
    let link = window.location.href;
    link = link.substr(link.indexOf('?')+1, link.length - link.indexOf('?')); 
    //Si il n'y a pas de lien
    if(link.indexOf('http') !== -1) link = undefined;
    //Si le jeu est en mode portrait
    //Refresh la page si elle vient d'un historique
    if(PerformanceNavigation.type === 2) LocationReload(true);

    //Quand la page est fermé
    window.onbeforeunload = function() {
        if(nickname !== undefined) socket.emit('deleteNickname', nickname);
        if(idGame !== undefined) socket.emit('deletePlayerInRoom', idGame, nickname);
    }

    //Quand le nickname est rentré alors on le vérifie
    $('.form-menu-principal').submit(function(e) {
       e.preventDefault();
        nickname = $('#input-menu-principal').val();
        socket.emit('setNickname', nickname);
    });

    //Si le nickname n'est pas valide / déjà pris
    socket.on('invalidNickname', function() {
        let temp_input = $('#input-menu-principal');
        nickname = "";
        temp_input.val('');
        temp_input.attr('placeholder', 'nickname déjà pris !');
    });

    //Si il est valide alors on affiche les salons
    socket.on('validNickname', function(games) {
        idPlayer = socket.id;
        if(link !== undefined) {
            socket.emit('joinGame', undefined, nickname, idPlayer, link);
        }
        else {
            $('.form-menu-principal').attr('disabled', true);
            $('.form-menu-principal button').attr('disabled', true);
            $('#menu-principal').attr('hidden', true);
            $('#menu-partie').attr('hidden', false);
            refreshGameContainer(games);
        }
    });

    //Si le client veut rejoindre un salon
    $('#partie-container').on("click", ".btn-join", function(){
        idGame = $(this).val();
        socket.emit('joinGame', idGame, nickname, idPlayer);
    });
    // Si le client veut créer une partie publique
    $('#menu-partie div').on("click", "#btn-partie-publique", function() {
        //Envoie d'une demande pour créer une partie
        idGame = -9;
        privatee = 0;
        socket.emit('createGame', nickname, idPlayer, privatee)
    });
    $('#menu-partie div').on("click", "#btn-partie-privee", function() {
        //Envoie d'une demande pour créer une partie
        idGame = -9;
        privatee = 1;
        socket.emit('createGame', nickname, idPlayer, privatee);
    });
    socket.on('validGame', function(gameId, link, privateState) {
        //Partie validée, affichage de celle-ci
        idGame = gameId;
        privatee = privateState;
        $('#menu-partie').attr('hidden', true);
        $('#menu-jeu').attr('hidden', false);
        $('.allowCopy').attr('hidden',false);
        if(privatee === 0) {
            $('#info-jeu').text("En attente d'un adversaire ...");
            $('.allowCopy').attr('hidden', true);    
        }
        else {
            $('#info-jeu').text("Cliquer sur la boite pour copier le lien dans le presse papier.");
            $('.allowCopy').val(window.location.href + "?" + link);
        }
    });

    //Copie le lien
    $('.allowCopy').click(function() {
        $(this).focus();
        $(this).select();
        document.execCommand('copy');
        $('.allowCopy').attr('hidden', true);
        $('#info-jeu').text("En attente de l'adversaire ...");
    });

    //Si le salon qu'il veut rejoindre est full
    socket.on('errorJoinGame', function() {
        window.location = window.location.pathname;
    });
    //Si le client a reussit à rejoindre le salon alors on commence la partie
    socket.on('startGame', function(players, gameId) {
        idGame = gameId;
        if(players != undefined) turn = players.indexOf(nickname);
        $('#menu-principal').attr('hidden', true);
        $('#menu-partie').attr('hidden', true);
        $('#menu-fin').attr('hidden', true);
        $('#menu-jeu').attr('hidden', false);
        socket.emit('beginGame', idGame, nickname, idPlayer);
    });
    //Si ton tour
    socket.on('yourTurn', function(refreshGameboard) {
        gameboard = refreshGameboard;
        refreshGameboardPls(gameboard, null);
        $('#info-jeu').text("C'est ton tour !");
        $('.btn-jeu').removeAttr("disabled", true);
    });
    //Bouton du jeu
    $('#menu-jeu').on("click", ".btn-jeu", function() {
        let location = $(this).val();
        if(gameboard[location] === -1) {
            refreshGameboardPls(gameboard, location);
            $('.btn-jeu').attr("disabled", true);
            $('#info-jeu').text("En attente de ton tour.");
            socket.emit('gameTurn', idGame, location, nickname);
        }
    });
    //Si c'est pas ton tour
    socket.on('waitTurn', function() {
        $('#info-jeu').text("En attente de ton tour.");
    });

    //Fin du jeu affichage et reset des variables
    socket.on('endGame', function(result) {
        let btnRes = $('#btn-rejouer');
        let endText = $('#menu-fin p');
        btnRes.attr('hidden', false);
        btnRes.attr('disabled', false);
        btnRes.text("Rejouer");
        $('#btn-quitter').attr('hidden', false);
        $('#menu-jeu').attr('hidden', true);
        $('#menu-fin').attr('hidden', false);
        gameboard = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        refreshGameboardPls(gameboard, null);
        if(result === "forfait") {
            endText.text("L'adversaire à déclaré forfait !");
            $('#btn-rejouer').attr('hidden', true);
        }
        else {
            if(result === "egalite") endText.text("Egalité !");
            else if(nickname === result) endText.text("Tu as gagné !");
            else endText.text("Tu as perdu !");
        }
    });
    //Si l'adversaire leave
    socket.on('adversaireLeave', function() {
        $('#btn-rejouer').attr('hidden', true);
    });
    //Si l'adversaire veut une rematch
    socket.on('rematch', function(msg) {
        if(msg === "annulee")  $('#btn-rejouer').attr('hidden', true);
        else $('#menu-fin p').text(msg);
    });

    //Si le client veut refaire une partie
    $('#menu-fin .block-btn').on("click", "#btn-rejouer", function() {
        let btnRes = $('#btn-rejouer');
        socket.emit('restartGame', idGame);
        btnRes.attr('disabled', true);
        btnRes.text("En attente ...");
        socket.emit('requestRematch', idGame, nickname);
    });
    //Si le client ne veut pas refaire une partie
    $('#menu-fin .block-btn').on("click", "#btn-quitter", function() {
        if(privatee === 1) link = undefined;
        $('#btn-rejouer').attr('hidden', false);
        socket.emit('deletePlayerInRoom', idGame, nickname);
        socket.emit('refresh', idGame);
        $('#menu-fin').attr('hidden', true);
        $('#menu-partie').attr('hidden', false);
        idGame = undefined;
    });
    //Fonction d'affichage
    function refreshGameContainer(games) {
        $('#erreur p').text('');
        $('.partie-name').empty();
        $('.partie-button').empty();

        let temp_element = [];
        //Tri des parties privées et des parties en cours
        games.forEach(Element => {
            if(Element.state == 0 && Element.private == 0) {
                temp_element.push(Element);
            }
        });
        if(temp_element.length == 0) {
            $('#erreur').text("Il n'y a pas de salon");
        }
        else {
            temp_element.forEach(Element => {
                $('.table-parties').append($('<tr>').append($('<td>').append($('<p>').text("Partie de " + Element.nomPartie))).append($('<td>').append($('<button value="' + Element.id + '">').text("Jouer contre ⚔️").addClass("button btn-join"))));
            });
        }
    }
    function refreshGameboardPls(gameboard, location) {
        if(location !== null) {
            gameboard[location] = turn;
        }
        for(let i = 0; i < gameboard.length; i++) {
            let temp_btn = ".btn" + i;
            if (gameboard[i] === 0)  $(temp_btn).css('background-color', "var(--main-blue)");
            else if (gameboard[i] === 1) $(temp_btn).css('background-color', "var(--main-gray)");
            else $(temp_btn).css('background-color', "var(--main-white)");
        }
    }
});
