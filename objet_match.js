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
