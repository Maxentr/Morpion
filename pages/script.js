$(function() {
    const socket = io();
    let pseudo;
    let idPartie;
    let idJoueur;
    let positionJeu;
    let grilleJeu = [];
    let privee = 0;
    
    //Si il y a un lien
    let unLien = window.location.href;
    unLien = unLien.substr(unLien.indexOf('?')+1, unLien.length - unLien.indexOf('?')); 
    //Si il n'y a pas de lien
    if(unLien.indexOf('http') != -1) unLien = undefined;
    //Si le jeu est en mode portrait
    //Refresh la page si elle vient d'un historique
    if(PerformanceNavigation.type === 2) LocationReload(true);

    //Quand la page est fermé
    window.onbeforeunload = function() {
        if(pseudo !== undefined) socket.emit('suppPseudo', pseudo);
        if(idPartie !== undefined) socket.emit('suppRoom', idPartie, pseudo);
    }

    //Quand le pseudo est rentré alors on le vérifie
    $('.form-menu-principal').submit(function(e) {
       e.preventDefault();
        pseudo = $('#input-menu-principal').val();
        socket.emit('setPseudo', pseudo);
    });

    //Si le pseudo n'est pas valide / déjà pris
    socket.on('pseudoRefuse', function(err) {
        let temp_input = $('#input-menu-principal');
        pseudo = "";
        temp_input.val('');
        temp_input.attr('placeholder', 'Pseudo déjà pris !');
    });

    //Si il est valide alors on affiche les salons
    socket.on('pseudoValide', function(lesParties) {
        idJoueur = socket.id;
        if(unLien != undefined) {
            socket.emit('joinRoom', undefined, pseudo, idJoueur, unLien);
        }
        else {
            $('form-menu-principal').attr('disabled', true);
            $('form-menu-principal button').attr('disabled', true);
            $('#menu-principal').attr('hidden', true);
            $('#menu-partie').attr('hidden', false);
            rafraichirLAffichageDesParties(lesParties);
        }
    });

    //Bouton pour rafraichir l'affichage des salons
    /*$('.salon-flex').on("click", "#refresh", function() {

        let ref = $('#refresh');
        ref.addClass('animate');
        ref.one('animationend',
            function (e) {
                ref.removeClass('animate');
                socket.emit('refresh', idJoueur);
            });
    });
    socket.on('refreshed', function(lesParties) {
        refreshRoom(lesParties);
    });
    */

    //Si le client veut rejoindre un salon
    $('#partie-container').on("click", ".btn-join", function(){
        idPartie = $(this).val();
        socket.emit('joinRoom', idPartie, pseudo, idJoueur);
    });
    // Si le client veut créer une partie publique
    $('#menu-partie div').on("click", "#btn-partie-publique", function() {
        //Envoie d'une demande pour créer une partie
        idPartie = -9;
        privee = 0;
        socket.emit('createRoom', pseudo, idJoueur, privee)
    });
    $('#menu-partie div').on("click", "#btn-partie-privee", function() {
        //Envoie d'une demande pour créer une partie
        idPartie = -9;
        privee = 1;
        socket.emit('createRoom', pseudo, idJoueur, privee);
    });
    socket.on('PartieValide', function(unIdPartie, unLien, tempPrivee) {
        //Partie validée, affichage de celle-ci
        idPartie = unIdPartie;
        privee = tempPrivee;
        $('#menu-partie').attr('hidden', true);
        $('#menu-jeu').attr('hidden', false);
        $('.allowCopy').attr('hidden',false);
        if(privee == 0) { 
            $('#info-jeu').text("En attente d'un adversaire ...");
            $('.allowCopy').attr('hidden', true);    
        }
        else {
            $('#info-jeu').text("Cliquer sur la boite pour copier le lien dans le presse papier.");
            $('.allowCopy').val(window.location.href + "?" + unLien);
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
    socket.on('erreurRoom', function(msg) {
        window.location = window.location.pathname;
    });
    //Si le client a reussit à rejoindre le salon alors on commence la partie
    socket.on('startJeu', function(lesJoueurs, unIdPartie) {
        idPartie = unIdPartie;
        if(lesJoueurs != undefined) positionJeu = lesJoueurs.indexOf(pseudo);
        $('#menu-principal').attr('hidden', true);
        $('#menu-partie').attr('hidden', true);
        $('#menu-fin').attr('hidden', true);
        $('#menu-jeu').attr('hidden', false);
        socket.emit('debutJeu', idPartie, pseudo, idJoueur);
    });
    //Si ton tour
    socket.on('tonTour', function(uneGrilleJeu) {
        grilleJeu = uneGrilleJeu;
        rafraichirGrilleJeu(grilleJeu, null);
        $('#info-jeu').text("C'est ton tour !");
        $('.btn-jeu').removeAttr("disabled", true);
    });
    //Boutton du jeu
    $('#menu-jeu').on("click", ".btn-jeu", function() {
        let placement = $(this).val();
        if(grilleJeu[placement] === -1) {
            rafraichirGrilleJeu(grilleJeu, placement);
            $('.btn-jeu').attr("disabled", true);
            $('#info-jeu').text("En attente de ton tour.");
            socket.emit('tourJeu', idPartie, placement, pseudo);
        }
    });
    //Si c'est pas ton tour
    socket.on('waitTour', function() {
        $('#info-jeu').text("En attente de ton tour.");
    });

    //Fin du jeu affichage et reset des variables
    socket.on('finJeu', function(name) {
        let btnRes = $('#btn-rejouer');
        let texteFin = $('#menu-fin p');
        btnRes.attr('hidden', false);
        btnRes.attr('disabled', false);
        btnRes.text("Rejouer");
        $('#btn-quitter').attr('hidden', false);
        $('#menu-jeu').attr('hidden', true);
        $('#menu-fin').attr('hidden', false);
        grilleJeu = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        rafraichirGrilleJeu(grilleJeu, null);
        if(name === "forfait") {
            texteFin.text("L'adversaire à déclaré forfait !");
            $('#btn-rejouer').attr('hidden', true);
        }
        else {
            if(name === "egalite") texteFin.text("Egalité !");
            else if(pseudo === name) texteFin.text("Tu as gagné !");
            else texteFin.text("Tu as perdu !");
        }
    });
    //Si l'adversaire leave
    socket.on('adversaireLeave', function() {
        $('#btn-rejouer').attr('hidden', true);
    });
    //Si l'adversaire veut une revanche
    socket.on('revanche', function(msg) {
        if(msg == "annulee")  $('#btn-rejouer').attr('hidden', true);
        else $('#menu-fin p').text(msg);
    });

    //Si le client veut refaire une partie
    $('#menu-fin .block-btn').on("click", "#btn-rejouer", function() {
        let btnRes = $('#btn-rejouer');
        socket.emit('restartJeu', idPartie);
        btnRes.attr('disabled', true);
        btnRes.text("En attente ...");
        socket.emit('demandeRevanche', idPartie, pseudo);
    });
    //Si le client ne veut pas refaire une partie
    $('#menu-fin .block-btn').on("click", "#btn-quitter", function() {
        if(privee == 1) unLien = undefined;
        $('#btn-rejouer').attr('hidden', false);
        socket.emit('suppRoom', idPartie, pseudo);
        socket.emit('refresh', idPartie);
        $('#menu-fin').attr('hidden', true);
        $('#menu-partie').attr('hidden', false);
        idPartie = undefined;
    });
    //Fonction d'affichage
    function rafraichirLAffichageDesParties(lesParties) {
        $('#erreur p').text('');
        $('.partie-name').empty();
        $('.partie-button').empty();

        let temp_element = [];
        //Tri des parties privées et des parties en cours
        lesParties.forEach(Element => {
            if(Element.Etat == 0 || Element.privee != 1) {
                temp_element.push(Element);
            }
        });
        if(temp_element.length === 0) {
            $('#erreur').text("Il n'y a pas de salon");
        }
        else {
            temp_element.forEach(Element => {
                $('.table-parties').append($('<tr>').append($('<td>').append($('<p>').text("Partie de " + Element.nomPartie))).append($('<td>').append($('<button value="' + Element.id + '">').text("Jouer contre ⚔️").addClass("button btn-join"))));
            });
        }
    }
    function rafraichirGrilleJeu(uneGrilleDeJeu, placement) {
        if(placement !== null) {
            uneGrilleDeJeu[placement] = positionJeu;
        }
        for(let i = 0; i < uneGrilleDeJeu.length; i++) {
            let temp_btn = ".btn" + i;
            if (uneGrilleDeJeu[i] == 0)  $(temp_btn).css('background-color', "var(--main-blue)");
            else if (uneGrilleDeJeu[i] == 1) $(temp_btn).css('background-color', "var(--main-gray)");
            else $(temp_btn).css('background-color', "var(--main-white)");
        }
    }
});