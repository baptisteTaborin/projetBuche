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
