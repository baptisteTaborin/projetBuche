/*
 * Concentre les informations sur les rencontres. Actuellement ne marche qu’avec les 1vs1 avec des scores.
 * 
 * 
a.  init()
    Initialise l’objet avec deux équipes.
    i.  Variables d’entrée
        String Sport
            Nom du sport
        String typeMatch
            Type de match : « Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale », « Finale », « Petite finale » ou « poule »
        Int [9] liste Durées des matchs (en minutes)
            [durée finale ; durée petite finale ; durée demi-finale ; durée quart de finale ; durée huitième de finale ; durée seizième de finale ; durée trente-deuxième de finale ; durée match de poule ; durée transition]
    ii. Autres méthodes dans l’objet
        Méthode phasesFinales()


b.  initDate()
    Implémente la date, n’est pas utilisé actuellement, servira pour la partie planning.
    i.  Variables d’entrée
        Int [2] Horaire de début du match
            [x,y] le match commence à l’heure x, minute y…
        Int [3] Dates de début du match
            [x,y,z] le match commence le jour x du mois y de l’année z (le mois est un Int)


c.  initClasique()
    Implémente les deux équipes et récupère le numéro de la poule.
    i.  Variables d’entrée
        String equipe1
        String equipe2
        Int numeroPoule


d.  initEquipeA()
    Initialise l’équipe A.
    i.  Variables d’enrée
        String equipeA


e.  initEquipeB()
    Initialise l’équipe B.
    i.  Variables d’entrée
        String equipeB


f.  resultatClassique
    Le résultat dans un match se présente sous forme de liste de listes. Toutes les équipes présente dans une même sous liste sont ex-aequo. Plus le rang dans la liste principale est faible, mieux on est classé. Exemple : si scoreEquipe1 > scoreEquipe2 alors classement = [ [Equipe1] , [Equipe2] ]. En cas d’égalité : classement = [ [Equipe1 , Equipe2] , [ ] ].
    i.  Variables d’entrée
        Int scoreEquipe1
        Int scoreEquipe2


g.  initDifferent()
    Initialise avec une liste de participant. Ne sert à rien pour le moment.
    i.  Variables d’entrée
        String [] listeParticipants


h.  typeMatch()
    Change la propriété typeMatch.
    i.  Variables d’entrée
        String typeMatch
        Type de match : « Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale », « Finale », « Petite finale » ou « poule »


i.  phasesFinales() 
    Attribue à un type de phase finale un nombre. (diffère légèrement de celui de tableauxPhasesFinales en ajoutant poule et en différenciant finale de petite finale.
    Petite finale <-> 1
    Finale <-> 0
    Demi-finale <-> 2
    Quart de finale <-> 3
    Huitième de finale <-> 4
    Seizième de finale <-> 5
    Trente-deuxième de finale <-> 6
    Poule <-> 7
i.  Variables d’entrée
    String premierTourPhasesFi
    « Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale », « Finale », « Petite finale » ou « poule »

 * 
 * 
*/




module.exports = {

    //affrontement conventionnel 2 equipes avec des scores
    init : function(lieu, sport, typeMatch, listeDurees){
        //this.lieu = lieu;
        this.sport = sport;
        this.typeMatch = typeMatch.toLowerCase();
        this.duree = listeDurees[this.phasesFinales(this.typeMatch)];
        this.statut = "pas commencé / pas fini";
        this.id = 0;
        this.equipe1 = "/";
        this.equipe2 = "/";
    },

    initDate : function(date,horaire){
        this.date = date;
        this.horaire = horaire;
    },
    
    initClassique : function(equipe1,equipe2, numeroPoule){
        this.equipe1 = equipe1;
        this.equipe2 = equipe2;
        if (this.typeMatch === "poule"){this.numeroPoule = numeroPoule;}
    },

    //Ces deux initis sont utilisées pour les phases finales, lorsqu'une équipe se qualifie
    initEquipeA(equipeA){
        this.equipe1 = equipeA;
    },
    initEquipeB(equipeB){
        this.equipe2 = equipeB;
    },

//Le résultat dans un match se présente sous forme de liste de listes. Toutes les équipes présente dans une même sous liste sont ex-aequo.Plus le rang dans la liste principale est faible, mieux on est classé
    resultatClassique : function(scoreEquipe1, scoreEquipe2){
        this.scoreEquipe1 = scoreEquipe1;
        this.scoreEquipe2 = scoreEquipe2;
        this.statut = "fini";
        this.classement = [[],[]];
        if (scoreEquipe1 > scoreEquipe2){
            this.classement[0].push(this.equipe1);
            this.classement[1].push(this.equipe2);
        }
        if (scoreEquipe1 < scoreEquipe2){
            this.classement[0].push(this.equipe2);
            this.classement[1].push(this.equipe1);
        }
        if (scoreEquipe1 === scoreEquipe2){
            this.classement[0].push(this.equipe2);
            this.classement[0].push(this.equipe1);
        }
    },
// Initialisation si plusieurs équipes
    initDifferent : function(listeParticipants){
        this.listeParticipants;
    },
    //typeMatch = {Poule,Trente-Deuxième de finale, Seizième de finale, Huitième de finale, Quart de Finale, Demi-finale, finale, petite finale}
    typeMatch : function(typeMatch){
        this.typeMatch = typeMatch.toLowerCase();
    },
    
    phasesFinales : function(premierTourPhasesFi)
    {
        switch (premierTourPhasesFi.toLowerCase()){
            case "petite finale":
                return 1;
                break;
            case "finale":
                return 0;
                break;
            case "demi-finale":
                return 2;
                break;
            case "quart de finale":
                return 3;
                break;
            case "huitième de finale":
                return 4;
                break;
            case "seizième de finale":
                return 5;
                break;
            case "trente-deuxième de finale":
                return 6;
                break;
            case "poule":
                return 7; 
                break;
            default:
                return console.log("Remplissez seulement par \"Poule\" \"Trente-deuxième de finale\" ; \"Seizième de finale\" ; \"Huitième de finale\" ; \"Quart de finale\" ; \"Demi-finale\" ; \"Finale\"")
        }
            
    }
}
