$(function() {
    const socket = io();
    let pseudo;
    let room;
    let id;
    let pos;
    let room_grille = [];

    //Si le jeu est en mode portrait
    //Refresh la page si elle vient d'un historique
    if(PerformanceNavigation.type === 2) LocationReload(true);

    //Quand la page est fermé
    window.onbeforeunload = function() {
        if(pseudo !== undefined) socket.emit('suppPseudo', pseudo);
        if(room !== undefined) socket.emit('suppRoom', room, pseudo);
    }

    //Quand le pseudo est rentré alors on le vérifie
    $('#Menu-pseudo').submit(function(e) {
       e.preventDefault();
        pseudo = $('#inputPseudo').val();
        socket.emit('setPseudo', pseudo);
    });

    //Si le pseudo n'est pas valide / déjà pris
    socket.on('pseudoRefuse', function(err) {
        let temp_input = $('#inputPseudo');
        pseudo = "";
        temp_input.val('');
        temp_input.attr('placeholder', 'Pseudo déjà pris !');
    });

    //Si il est valide alors on affiche les salons
    socket.on('pseudoValid', function(rooms) {
        id = socket.id;
        $('#Menu-pseudo').attr('hidden', true);
        $('#Menu-salon').attr('hidden', false);
        refreshRoom(rooms);
    });

    //Fonction d'affichage
    function refreshRoom(rooms) {
        let aff = $('.salon-flex');
        $('#erreur p').text('');
        aff.empty();
        aff.append($('<button id="refresh">'));
        aff.append($('<div>').append($('<h4>').text("Adversaire en ligne")));
        aff.append($('<div>').append($('<p>')).attr("id", "erreur"));

        let temp_element = [];
        rooms.forEach(Element => {
            if(Element.inGame < 1) {
                temp_element.push(Element);
            }
        });
        if(temp_element.length === 0) {
            $('#erreur').text("Il n'y a pas de salon");
        }
        else {
            temp_element.forEach(Element => {
                aff.append($('<div>').append($('<p>').text(Element.name)).append($('<button value="' + Element.id + '">').text("Jouer").addClass("btn btn-join")));
            });
        }
        aff.append($('<button type="button" value="' + rooms.length + '">').text("Créer une partie privée").attr('id', "buttonPrivate"));
    }

    //Bouton pour rafraichir l'affichage des salons
    $('.salon-flex').on("click", "#refresh", function() {

        let ref = $('#refresh');
        ref.addClass('animate');
        ref.one('animationend',
            function (e) {
                ref.removeClass('animate');
                socket.emit('refresh', id);
            });
    });
    socket.on('refreshed', function(rooms) {
        refreshRoom(rooms);
    });

    //Si le client veut rejoindre un salon
    $('.salon-flex').on("click", ".btn-join", function(){
        room = $(this).val();
        socket.emit('joinRoom', room, pseudo, id);
    });

    // Si le client veut créer une partie privée
    $('.salon-flex').on("click", "#buttonPrivate", function() {
        room = $(this).val();
        socket.emit('createRoom', pseudo, room, id)
        $('#Menu-salon').attr('hidden', true);
        $('#Jeu').attr('hidden', false);
        $('#textJeu').text("En attente d'un adversaire ...");
    });
    //Si le salon qu'il veut rejoindre est full
    socket.on('roomFull', function(msg) {
        $('#erreur p').text(msg);
    });
    //Si le client a reussit à rejoindre le salon alors on commence la partie
    socket.on('startJeu', function() {
        $('#Menu-salon').attr('hidden', true);
        $('#Fin').attr('hidden', true);
        $('#Jeu').attr('hidden', false);
        socket.emit('debutJeu', room, pseudo, id);
    });
    //Si ton tour
    socket.on('tonTour', function(position, valeur, grille) {
        room_grille = grille;
        if(valeur !== -1) {
            let color;
            $('.salon-flex');
            let temp = '#' + valeur;
            if(position === 1) color = 'red';
            else color = 'blue';
            $(temp).css('backgroundColor', color);
        }
        pos = position;
        $('#textJeu').text("C'est ton tour !");
        $('.btnJeu').removeAttr("disabled", true);
    });
    //Boutton du jeu
    $('#Jeu').on("click", ".btnJeu", function() {
        let val = $(this).val();
        if(room_grille[val] === -1) {
            let color;
            if(pos === 1) color = 'blue';
            else color = 'red';
            $(this).css('backgroundColor',color);
            $('.btnJeu').attr("disabled", true);
            $('#textJeu').text("En attente de ton tour.");
            socket.emit('tourJeu', room, val, pos);
        }
    });
    //Si c'est pas ton tour
    socket.on('waitTour', function() {
        $('#textJeu').text("En attente de ton tour.");
    });

    //Fin du jeu affichage et reset des variables
    socket.on('finJeu', function(name) {
        let finp = $('#Fin p');
        $('#Jeu').attr('hidden', true);
        $('#Fin').attr('hidden', false);
        $('.btnJeu').css('backgroundColor', '#FFF');
        let btn = $('#Fin .block-btn');
        btn.empty();
        if(name === "forfait") finp.text("L'adversaire à déclaré forfait !");

        else {
            if(name === "egalite") finp.text("Egalité !");
            else if(pseudo === name) finp.text("Tu as gagné !");
            else finp.text("Tu as perdu !");
            $('#btnRestart').attr('disabled', false);
            btn.append($('<button type="button">').text("Rejouer").attr('id', "btnRestart").addClass('btnPlay'));
        }
        btn.append($('<button type="button">').text("Partir").attr('id', "btnQuitter"));
    });
    //Si l'adversaire leave
    socket.on('adversaireLeave', function() {
        $('#btnRestart').remove();
    });

    //Si le client veut refaire une partie
    $('#Fin .block-btn').on("click", "#btnRestart", function() {
        let btnRes = $('#btnRestart');
        socket.emit('restartJeu', room);
        btnRes.attr('disabled', true);
        btnRes.text("En attente de la réponse de l'adversaire ...");
    });
    //Si le client ne veut pas refaire une partie
    $('#Fin .block-btn').on("click", "#btnQuitter", function() {
        socket.emit('suppRoom', room, pseudo);
        socket.emit('refresh', id);
        $('#Fin').attr('hidden', true);
        $('#Menu-salon').attr('hidden', false);
        room = undefined;
    });
});