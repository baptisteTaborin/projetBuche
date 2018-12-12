/*
Encore en chantier, permettra de créer les plannings des matchs en évitant une superposition pour une même équipe. Pour le moment n’est pas fonctionnel. Ne prend pas en compte les différents lieux, la superposition des matches de phases différentes dans les phases finales et le rassemblement des poules dans une zone spatiale et temporelle donnée. Ce n’est qu’une phase du tournoi (s’il est divisé en plusieurs jours)


a.  init ()
    Initialise le planning d’un tournoi.
    i.  Variables d’entrée
        Int [3] Date de début de la phase du tournoi
            [x,y,z] le match commence le jour x du mois y de l’année z (le mois est un Int)
        Int [2] Horaire de début e la phase du tournoi
            [x,y] le match commence à l’heure x, minute y.
        Objet Match [] listeMatches
            Liste des matches qui doivent avoir lieu dans cette phase.
        Int [9] listeDurees
            Liste des durées en minutes des différents matches et pauses. [durée finale ; durée petite finale ; durée demi-finale ; durée quart de finale ; durée huitième de finale ; durée seizième de finale ; durée trente-deuxième de finale ; durée match de poule ; durée transition]
        String lieu
            Pour le moment ne maîtrise qu’une zone géographique.
        Int nbTerrains
            Nombre de terrain sur ce lieu.

b.  construction()
    Construit le planning en ajoutant les équipes sur les terrains disponibles. Si sur un même créneau horaire, deux matches de deux phases finales différentes ont lieu, on décale au créneau horaire suivant. Marche aussi pour distinguer une poule de la première phase finale.
    i.  Autres méthodes dans l’objet
        Méthode phasesFinales
        Méthode conversionMinutes
        Méthode additionHoraire
    ii. Objets connectés
        Objet Match
            Méthode initDate()

c.  miseAJour()
        PAS OPTIMISE !! On met à jour le nom des équipes en appliquant la même fonction que "construction" voir construction().

d.  conversionMinutes()
    On convertit les minutes en format horaire : 6 -> [0,6]
    i.  Variables d’entrée
        Int minutes

e.  additionHoraire
    Permet d’additionner deux horaires en respectant notre nomenclature.
    i.  Variables d’entrée
        Int [2] heure1
        Int [2] heure2

f.  phasesFinales() 
    Attribue à un type de phase finale un nombre. (Diffère légèrement de celui de tableauxPhasesFinales en ajoutant poule et en différenciant finale de petite finale.
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
            s« Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale », « Finale », « Petite finale » ou « poule »

*/





module.exports = {


init : function(date,horaireDebut,listeMatches,listeDurees,lieu,nbTerrains,){
    this.date = date;
    this.horaireDebut = horaireDebut;
    this.listeMatches = listeMatches;
    this.listeDurees = listeDurees;
    this.lieu = lieu;
    this.nbTerrains = nbTerrains;
},



construction : function(){
    var horaireDebut = this.horaireDebut;
    var dureeTransition = this.listeDurees[this.listeDurees.length-1];
    this.tableau = [["Horaire Début","Horaire Fin","Equipe 1", "Equipe 2", "Contexte","Lieux","Terrain"]];
    var i = 0;
    var typeMatch = this.listeMatches[i].typeMatch;
    while (i < this.listeMatches.length){
        var j = 0;
        while (j< this.nbTerrains){
            //On checke les superpositions de matches potentiels
            if (this.phasesFinales(typeMatch) != this.phasesFinales(this.listeMatches[i].typeMatch)){
                break;
            }

            var horaireFin = this.additionHoraire(horaireDebut,this.conversionMinutes(this.listeMatches[i].duree));
            var equipe1 = this.listeMatches[i].equipe1;
            var equipe2 = this.listeMatches[i].equipe2;
            if (this.listeMatches[i].typeMatch === "poule"){
                var contexte = "poule "+ this.listeMatches[i].numeroPoule;
            } else {
                var contexte = this.listeMatches[i].typeMatch;                
            }

            //On rentre l'horaire du match
            this.listeMatches[i].initDate(this.date,horaireDebut);

            this.tableau.push([horaireDebut,horaireFin,equipe1,equipe2,contexte,this.lieu, "Terrain n°"+(j+1)]);
            i+=1;
            j+=1;
        }
        horaireDebut = this.additionHoraire(horaireFin, this.conversionMinutes(dureeTransition));
    }

},
// PAS OPTIMISE !! On met à jour le nom des équipes en appliquant la même fonction que "construction"
miseAJour : function(){
    var horaireDebut = this.horaireDebut;
    var dureeTransition = this.listeDurees[this.listeDurees.length-1];
    this.tableau = [["Horaire Début","Horaire Fin","Equipe 1", "Equipe 2", "Contexte","Lieux","Terrain"]];
    var i = 0;
    var typeMatch = this.listeMatches[i].typeMatch;
    while (i < this.listeMatches.length){
        var j = 0;
        while (j< this.nbTerrains){
            //On checke les superpositions de matches potentiels
            if (this.phasesFinales(typeMatch) != this.phasesFinales(this.listeMatches[i].typeMatch)){
                break;
            }

            var horaireFin = this.additionHoraire(horaireDebut,this.conversionMinutes(this.listeMatches[i].duree));
            var equipe1 = this.listeMatches[i].equipe1;
            var equipe2 = this.listeMatches[i].equipe2;
            if (this.listeMatches[i].typeMatch === "poule"){
                var contexte = "poule "+ this.listeMatches[i].numeroPoule;
            } else {
                var contexte = this.listeMatches[i].typeMatch;                
            }

            //On rentre l'horaire du match
            this.listeMatches[i].initDate(this.date,horaireDebut);

            this.tableau.push([horaireDebut,horaireFin,equipe1,equipe2,contexte,this.lieu, "Terrain n°"+(j+1)]);
            i+=1;
            j+=1;
        }
        horaireDebut = this.additionHoraire(horaireFin, this.conversionMinutes(dureeTransition));
    }
},

//on convertit les minutes en format horaire : 6 -> [0,6]
conversionMinutes : function(minutes){
    
    var reste = Math.ceil(minutes/60)-1;
    var min = minutes%60;
    var heures = reste;
    return [heures,min];
},

additionHoraire : function (heure1,heure2){
    var minutes = heure1[1]+heure2[1];
    var reste = Math.ceil(minutes/60)-1;
    var minutes = minutes%60;
    if (minutes === 0){reste +=1}
    var heures = reste + heure1[0]+heure2[0];
    return [heures,minutes];
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
