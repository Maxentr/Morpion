$(function() {
    var origin = window.location.origin;
    var socket = io.connect(origin);

    //param

    let submitButtonPressed;
    let nickname;
    let link = window.location.href;
    let privatee = 0;


    //game var
    let idGame;
    let idPlayer;
    let turn;
    let gameboard = [-1,-1,-1,-1,-1,-1,-1,-1,-1];


    //Refresh la page si elle vient d'un historique
    if(PerformanceNavigation.type == 2) LocationReload(true);

    //================================
    // ClIENT CLOSE PAGE
    //================================
    window.onbeforeunload = function() {
        if(nickname != undefined) socket.emit('deleteNickname', nickname);
        if(idGame != undefined) socket.emit('deletePlayerInRoom', idGame, nickname);
    }
    
    //================================
    // LINK
    //================================
    link = link.substr(link.indexOf('?')+1, link.length - link.indexOf('?'));
    if(link.indexOf('http') != -1) link = undefined;
    $('#input-code').val(link);



    //================================
    // FORM
    //================================
    $('.submitbutton').click(function() {
        submitButtonPressed = $(this).attr('name')
        if(submitButtonPressed == "public") link = undefined;
        if(submitButtonPressed == "private") privatee = 1;
        if(submitButtonPressed == "code") link = $('#input-code').val().trim();
    })
    $('form').submit(function(e) {
        e.preventDefault();
        nickname = $('#nickname-input').val();
        socket.emit('setNickname', nickname);
    })


    //================================
    // NICKNAME
    //================================
    //if nickname invalid or already take
    socket.on('invalidNickname', function() {
        let temp_input = $('#nickname-input');
        nickname = "";
        temp_input.val('');
        temp_input.attr('placeholder', 'pseudo déjà pris !');
    });

    //Valid nickname
    socket.on('validNickname', function() {
        idPlayer = socket.id;

        //Check if the player want to join a public/private game or create a private
        if(link != undefined) socket.emit('joinGame', undefined, nickname, idPlayer, link);
        else if(privatee == 1) socket.emit('createGame', nickname, idPlayer, privatee);
        else socket.emit('reqPublicGame');
    });


    //================================
    // GAME PARAM
    //================================
    //Results of request for a public game
    socket.on('resPublicGame', function(idGame) {
        if(idGame == null) {
            socket.emit('createGame', nickname, idPlayer, 0);
        }
        else {
            socket.emit('joinGame', idGame, nickname, idPlayer);
        }
    });

    //Invalid game
    socket.on('errorJoinGame', function() {
        window.location = window.location.pathname;
    });

    //Valid game
    socket.on('validGame', function(gameId, link, privateState) {
        idGame = gameId;
        privatee = privateState;
        refreshGameboardPls(gameboard, null);
        $('.allowCopy').attr('hidden', true);
        $('#main-menu').attr('hidden', true);
        $('#gameboard').attr('hidden', false);
        if(privatee == 0) {
            $('#game-info').text("En attente d'un adversaire ...");
        } else {
            $('.allowCopy').attr('hidden',false);
            $('#game-info').text("Cliquer sur la boite pour copier le lien dans le presse papier.");
            $('.allowCopy').val(window.location.href + "?" + link);
        }
    });

    //Copy link
    $('.allowCopy').click(function() {
        $(this).focus();
        $(this).select();
        document.execCommand('copy');
        $('.allowCopy').attr('hidden', true);
        $('#game-info').text("En attente de l'adversaire ...");
    });



    //================================
    // IN-GAME
    //================================
    socket.on('startGame', function(players, gameId) {
        idGame = gameId;
        if(players != undefined) turn = players.indexOf(nickname);
        $('#main-menu').attr('hidden', true);
        $('#popup-container').attr('hidden', true);
        $('#gameboard').attr('hidden', false);
        socket.emit('beginGame', idGame, nickname, idPlayer);
    });

    
    socket.on('waitTurn', function() {
        $('#game-info').text("En attente de ton tour.");
    });
    
    socket.on('yourTurn', function(refreshGameboard) {
        gameboard = refreshGameboard;
        refreshGameboardPls(gameboard, null);
        $('#game-info').text("C'est ton tour !");
        $('.game-btn').removeAttr("disabled", true);
    });

    //When a player hit a box
    $('#gameboard').on("click", ".game-btn", function() {
        let location = $(this).val();
        if(gameboard[location] == -1) {
            refreshGameboardPls(gameboard, location);
            $('.game-btn').attr("disabled", true);
            $('#game-info').text("En attente de ton tour.");
            socket.emit('gameTurn', idGame, location, nickname);
        }
    });

    //End of the game
    socket.on('endGame', function(result) {
        let btnRes = $('#rematch-button');
        let endText = $('#popup-text');
        btnRes.text("Revanche");
        btnRes.attr('hidden', false);
        btnRes.attr('disabled', false);
        
        $('#leave-button').attr('hidden', false);
        $('#gameboard').attr('hidden', true);
        $('#popup-container').attr('hidden', false);
        gameboard = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        refreshGameboardPls(gameboard, null); //??

        if(result === "forfait") {
            endText.text("L'adversaire à déclaré forfait !");
            $('#rematch-button').attr('hidden', true);
        } else {
            if(result === "egalite") endText.text("Egalité !");
            else if(nickname === result) endText.text("Tu as gagné !");
            else endText.text("Tu as perdu !");
        }
    });
    //TODO
    socket.on('adversaireLeave', function() {
        $('#rematch-button').attr('hidden', true);
    });

    //If opponent request rematch
    socket.on('rematch', function(msg) {
        if(msg === "annulee")  $('#rematch-button').attr('hidden', true);
        else $('#popup-text').text(msg);
    });

    //If player want to rematch
    $('#popup-container .block-btn').on("click", "#rematch-button", function() {
        let btnRes = $('#rematch-button');
        socket.emit('restartGame', idGame);
        btnRes.attr('disabled', true);
        btnRes.text("En attente ...");
        socket.emit('requestRematch', idGame, nickname);
    });
    //Si le client ne veut pas refaire une partie
    $('#popup-container .block-btn').on("click", "#leave-button", function() {
        if(privatee === 1) link = undefined;
        $('#rematch-button').attr('hidden', false);
        socket.emit('deletePlayerInRoom', idGame, nickname);
        socket.emit('refresh', idGame);
        $('#popup-container').attr('hidden', true);
        $('#main-menu').attr('hidden', false);
        idGame = undefined;
    });

    function refreshGameboardPls(gameboard, location) {
        if(location !== null) {
            gameboard[location] = turn;
        }
        for(let i = 0; i < gameboard.length; i++) {
            let temp_btn = ".btn" + i;
            if (gameboard[i] == 0)  $(temp_btn).css('background-color', "var(--main-blue)");
            else if (gameboard[i] == 1) $(temp_btn).css('background-color', "var(--main-gray)");
            else $(temp_btn).css('background-color', "var(--main-white)");
        }
    }
});
