var tableauxPhasesFinales = require('../code_matches_matrices/objet_tableaux_phases_finales');

module.exports = {
  
    init: function(tableauxPhasesFinales){
        this.tableauxPhasesFinales = tableauxPhasesFinales;
        this.equipesPetiteFinale = this.equipesQualifiees();
        this.tableau = this.tableau();
    },

//Extrait du tableauPhasesFinales les perdants des demis finales.
    equipesQualifiees: function(){
        var equipesQualifiees= [];
        var equipeQualifiesFinales = [];
        //On extrait les équipes qui sont arrivées en demi finales puis celles arrivées en finale. On retire les dernières aux premières
        var tailleLigne = this.tableauxPhasesFinales.tableau[0].length;
        for (i =0; i < this.tableauxPhasesFinales.tableau.length-1; i++){
             if (this.tableauxPhasesFinales.tableau[i+1][tailleLigne-3] != ''){
                 equipesQualifiees.push(this.tableauxPhasesFinales.tableau[i+1][tailleLigne-3]);
             }
             if (this.tableauxPhasesFinales.tableau[i+1][tailleLigne-2] != ''){
                 equipeQualifiesFinales.push(this.tableauxPhasesFinales.tableau[i+1][tailleLigne-2]);
             }
        } // On retire les équipes qualifiées en finale.
        for (i = 0; i <equipeQualifiesFinales.length; i ++){
            if ( equipesQualifiees.indexOf(equipeQualifiesFinales[i]) != -1){
             equipesQualifiees.splice(equipesQualifiees.indexOf(equipeQualifiesFinales[i]),1);
            }
        }
        return equipesQualifiees;
    },

    // Nous faisons le choix pour le moment de limiter les matchs dans les phases finales à ceux classique PLUS la petite finale. Par la suite on pourra aisément
    // modifier le code pour ajouter les demis des perdants des quarts. 
    tableau: function(){
        this.tableauxPetiteFinaleObj = Object.create(tableauxPhasesFinales);
        this.tableauxPetiteFinaleObj.init1("Finale", 1,2,"petite finale");
        this.tableauxPetiteFinaleObj.init2(this.equipesPetiteFinale,"remplissageTableauPhaseFinaleParClassementGeneral");
        return this.tableauxPetiteFinaleObj.tableau;
     },














}


