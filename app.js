const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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

//VARIABLES
let lesJoueurs = [];
let lesParties = [];
/*        
let unePartieCree = {
    id: idPartie,
    lien: ,
    nomPartie: pseudo,
    nomJoueurs: [],
    idJoueurs: [],
    leTour: -1,
    jeu: [-1,-1,-1,-1,-1,-1,-1,-1,-1],
    Etat: 0,
    privee:
}
    // Si l'Etat est à 0: partie pas lancé, Si l'Etat est à 1: partie lancé, Si l'Etat est à 2: partie fini avec une demande pour rejouer,
*/
//Setters et getters generaux
function estUnPseudoValide(unPseudo) {
    if(lesJoueurs.indexOf(unPseudo) === -1) {
        lesJoueurs.push(unPseudo);
        console.log(unPseudo + ' connected');
        return true;
    }
    else return false;
}
function supprimerUnJoueur(unPseudo) {
    lesJoueurs.splice(lesJoueurs.indexOf(unPseudo), 1);
    console.log(unPseudo + ' disconnected');
}
function createLien(uneLongueur) {
    var resultat = '';
    var liste = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var longueurListe = liste.length;
    for ( var i = 0; i < uneLongueur; i++ ) {
        resultat += liste.charAt(Math.floor(Math.random() * longueurListe));
    }
    return resultat;
}
//Setters et getters pour une partie
function getPositionJoueur(unId, unPseudo) {
    return lesParties[unId].nomJoueurs.indexOf(unPseudo);
}
function getJoueurs(unId) {
    return lesParties[unId].nomJoueurs;
}
function getNbJoueurs(unId) {
    return lesParties[unId].nomJoueurs.length;
}
function getIdAvecLien(unLien) {
    let resultat = false; 
    lesParties.forEach(unePartie => {
        if((unePartie.lien == unLien) === undefined) return false;
        if (unePartie.lien == unLien) resultat = unePartie.id;
    });
    return resultat;
}
function getLien(unId) {
    return lesParties[unId].lien;
}
function getPrivee(unId) {
    return lesParties[unId].privee;
}
function getEtat(unId) {
    return lesParties[unId].Etat;
}
function setEtat(unId, unEtat) {
    lesParties[unId].Etat = unEtat;
}
function getLeProchainJoueur(unId) {
    if(lesParties[unId].leTour === 1) lesParties[unId].leTour = 0;
    else lesParties[unId].leTour = 1;
    // On retourne le pseudo du joueur.
    return lesParties[unId].idJoueurs[lesParties[unId].leTour];
}
function getLeJeu(unId) {
    return lesParties[unId].jeu;
}
function setLeJeu(unId, unPlacement, unPseudo) {
    if(lesParties[unId].jeu[unPlacement] !== -1) return false;
    else {
        lesParties[unId].jeu[unPlacement] = getPositionJoueur(unId, unPseudo);
        return true;
    }
}

function checkVictoire(unId) {
    for(var i = 0; i < getNbJoueurs(unId); i++) {
        if((lesParties[unId].jeu[0] === i && lesParties[unId].jeu[1] === i && lesParties[unId].jeu[2] === i )//LIGNE HORIZONTALE DU BAS       
        || (lesParties[unId].jeu[3] === i && lesParties[unId].jeu[4] === i && lesParties[unId].jeu[5] === i )//LIGNE HORIZONTALE DU MILIEU     
        || (lesParties[unId].jeu[6] === i && lesParties[unId].jeu[7] === i && lesParties[unId].jeu[8] === i )//LIGNE HORIZONTALE DU HAUT 
        || (lesParties[unId].jeu[0] === i && lesParties[unId].jeu[3] === i && lesParties[unId].jeu[6] === i )//LIGNE VERTICALE DE GAUCHE
        || (lesParties[unId].jeu[1] === i && lesParties[unId].jeu[4] === i && lesParties[unId].jeu[7] === i )//LIGNE VERTICALE DE MILIEU
        || (lesParties[unId].jeu[2] === i && lesParties[unId].jeu[5] === i && lesParties[unId].jeu[8] === i )//LIGNE VERTICALE DE DROITE
        || (lesParties[unId].jeu[6] === i && lesParties[unId].jeu[4] === i && lesParties[unId].jeu[2] === i )//DIAGONALE HAUT GAUCHE VERS BAS DROIT
        || (lesParties[unId].jeu[0] === i && lesParties[unId].jeu[4] === i && lesParties[unId].jeu[8] === i ))//DIAGONALE BAS GAUCHE VERS HAUT DROIT
        {
            setEtat(unId, 0);
            return gagnant = lesParties[unId].nomJoueurs[i];
        }
    }
    if(getLeJeu(unId).indexOf(-1) === -1){
        setEtat(unId, 0);
        return gagnant = "egalite";
    }
    else return false;
}

//CLIENT-SERVER
io.on('connection', (socket) => {

    //Demande pour avoir un pseudo
    socket.on('setPseudo', function(pseudo) {
        //Le pseudo n'est pas valide
        if(estUnPseudoValide(pseudo) == false) {
            let err = pseudo + " est déjà pris !";
            socket.emit('pseudoRefuse', err);
        }
        //Si il est valide
        else {
            socket.emit('pseudoValide', lesParties);
        }
    });

    //Le client se déconnecte
    socket.on('suppPseudo', function(pseudo){
        supprimerUnJoueur(pseudo);
    });
    //Le client veut rafraichir l'affichage des salons
    socket.on('refresh', function(idJoueur) {
        io.in(idJoueur).emit('refreshed', lesParties);
    });

    //Le client rejoint un salon 
    socket.on('joinRoom', function(idPartie, pseudo, idJoueur, lien) {
        try {
            if(lien != undefined) {
                idPartie = getIdAvecLien(lien);
                if(idPartie === false) throw new Error("Un lien n'est pas bon.");
            }
            //Si il y a déjà 2 joueurs
            if (getNbJoueurs(idPartie) === 2) throw new Error(lesParties[idPartie].nomPartie + " est full !");
            else {
                //Sinon il rejoint et la partie commence
                lesParties[idPartie].nomJoueurs.push(pseudo);
                lesParties[idPartie].idJoueurs.push(idJoueur);
                
                //Il y a 2 joueurs donc on lance la partie
                //L'Etat de la partie est à 1 soit lancé
                setEtat(idPartie, 1);
                //On tire au hasard pour savoir qui commence
                lesParties[idPartie].leTour = Math.floor(Math.random() * 2);
                socket.join(getLien(idPartie));
                console.log(pseudo + ' join ' + getLien(idPartie));
                io.in(getLien(idPartie)).emit('startJeu', getJoueurs(idPartie),idPartie);
            }
        }
        catch(e) {
            console.log("trow" + e);
            socket.emit('erreurRoom', e);
            socket.emit('refreshed', lesParties);
        }
    });
    //Le client créer un salon
    socket.on('createRoom', function(pseudo, idJoueur, unePartiePrivee) {
        let idPartie = lesParties.length;
        let unePartieCree = {
            id: idPartie,
            lien: createLien(15),
            nomPartie: pseudo,
            nomJoueurs: [pseudo],
            idJoueurs: [idJoueur],
            leTour: -1,
            jeu: [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            Etat: 0,
            privee: unePartiePrivee
        }
        lesParties.push(unePartieCree);
        socket.join(getLien(idPartie));
        console.log(pseudo + ' join ' + getLien(idPartie));
        socket.emit('PartieValide', idPartie, getLien(idPartie),getPrivee(idPartie));
    });
    //Le client se déconnecte
    socket.on('suppRoom', function(idPartie, pseudo) {
        //Leave le socket
        console.log("suppRoom idPartie: " + idPartie);
        socket.leave(getLien(idPartie));
        console.log(pseudo + ' leave ' + getLien(idPartie));
        //On enleve le pseudo et on reduit de 1 le nombre de personne dans le salon
        supprimerUnJoueur(pseudo);
        lesParties[idPartie].nomJoueurs.splice(lesParties[idPartie].nomJoueurs.indexOf(pseudo), 1);
        //Si il n'y a plus personne alors on supprime le salon
        if(getNbJoueurs(idPartie) === 0) lesParties.splice(idPartie, 1);
        //Si la personne qui se déconnecte etait dans une partie en cours
        else if(getEtat(idPartie) === 1) {
            io.in(getLien(idPartie)).emit('finJeu', "forfait");
        }
        else if(getEtat(idPartie) === 2) {
            setEtat(idPartie, 0);
            io.in(getLien(idPartie)).emit('revanche', "annulee");
        }
    });
    //Début de la partie
    socket.on('debutJeu', function(idPartie, pseudo, idJoueur) {
        if(getPositionJoueur(idPartie, pseudo) === lesParties[idPartie].leTour) {
            io.in(idJoueur).emit('tonTour', getLeJeu(idPartie));
        }
        else {
            io.in(idJoueur).emit('waitTour');
        }
    });
    socket.on('tourJeu', function(idPartie, placement, pseudo) {
        setLeJeu(idPartie, placement, pseudo);
        //On regarde si quelqu'un a gagné si pas de gagnant
        let resultat = checkVictoire(idPartie);
        if(resultat == false) io.in(getLeProchainJoueur(idPartie)).emit('tonTour', getLeJeu(idPartie));
        else io.in(getLien(idPartie)).emit('finJeu', resultat);
    });

    socket.on('demandeRevanche', function(idPartie, pseudo) {
        io.in(getLien(idPartie)).emit('revanche', pseudo + " veut une revanche !");
    });
    
    socket.on('restartJeu', function(idPartie) {
        //Si l'adversaire à déjà demander la revanche
        if(getEtat(idPartie) === 2) {
            lesParties[idPartie].jeu = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
            lesParties[idPartie].leTour = Math.floor(Math.random() * 3);
            io.in(getLien(idPartie)).emit('startJeu', undefined, idPartie);
        }
        //Sinon demande de revanche
        else setEtat(idPartie, 2);
    });
});

http.listen(8000, () => {
    console.log(`listening on port 8000`);
});
