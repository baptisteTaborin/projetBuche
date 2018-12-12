
module.exports = {
    //On initialise le classement en différanciant le cas du classement après les poules ou final
    init: function(type, listeTableauxResultats,tableauPhasesFinales,tableauPetiteFinale,classementGeneralApresPoules){
        this.type = type;
        this.listeTableauxResultats=listeTableauxResultats;
        if (type == "classement general poules"){
            this.classement = this.classementGeneralApresPoules();
        }
        if (type == "classement final"){
            this.classementApresPoules = classementGeneralApresPoules;
            this.tableauPhasesFinales = tableauPhasesFinales;
            this.tableauPetiteFinale = tableauPetiteFinale;
            this.classement = this.classementFinal();
        }
    },

    /*
      On calcule le classement après les poules.
      Pour cela on compare les différents résultats marquées dans les tableaux de résultats 
      poules. Par ordre d'importance : Classement dans la poule, points totaux, goal average
      points marqués, points encaissés, nombre de victoires.
    */
    classementGeneralApresPoules: function(){
        var classementGeneral = [["Classement Général", "Equipe", "Classement Poule", "Score", "Goal Average", "PM", "PE", "Nb Victoires","N° de Poule"],
        [1,"Initialisation",10000,-1,-10000,0,1000,-1]]; //On initialise avec un résultat impossible
        for (var i =0; i < this.listeTableauxResultats.length; i++){
            var tableau = this.listeTableauxResultats[i];
            for (var j = 1; j<tableau.length;j++){
                var limite = classementGeneral.length;
                var remplacement = "Non";
                var w =1;
                while (w < limite && remplacement === "Non"){
                    if ((classementGeneral[w][2] > tableau[j][8]) ||

                    ((classementGeneral[w][2] === tableau[j][8]) && (classementGeneral[w][3] < tableau[j][7]))||

                    ((classementGeneral[w][2] === tableau[j][8]) && classementGeneral[w][3] === tableau[j][7] &&
                    classementGeneral[w][4] < tableau[j][6]) ||
                    ((classementGeneral[w][2] < tableau[j][8]) && (classementGeneral[w][3] === tableau[j][7]) && 
                    (classementGeneral[w][4]===tableau[j][6]) && (tableau[j][4] > classementGeneral[w][5] )) ||

                    ((classementGeneral[w][2] === tableau[j][8]) && (classementGeneral[w][3] === tableau[j][7]) && 
                    (classementGeneral[w][4]===tableau[j][6]) && (tableau[j][4] === classementGeneral[w][5]) && 
                    (tableau[j][5] < classementGeneral[w][6]))||

                    ((classementGeneral[w][2] === tableau[j][8]) && (classementGeneral[w][3] === tableau[j][7]) &&
                    (classementGeneral[w][4]===tableau[j][6]) && (tableau[j][4] === classementGeneral[w][5]) && 
                    (tableau[j][5] === classementGeneral[w][6])) && (tableau[j][1] > classementGeneral[w][7]))
                    {
                        classementGeneral.splice(w,0,[0,tableau[j][0],tableau[j][8],tableau[j][7]
                        ,tableau[j][6],tableau[j][4],tableau[j][5],tableau[j][1],i+1]);
                        remplacement = "Oui";
                    }
                    w +=1;
                }
                if (remplacement === "Non") {
                classementGeneral.push([0,tableau[j][0],tableau[j][8],tableau[j][7]
                ,tableau[j][6],tableau[j][4],tableau[j][5],tableau[j][1],i+1]); 
                }
            }

        }
        for (var i =1 ; i < classementGeneral.length; i++){
            classementGeneral[i][0]=i;
        }
        classementGeneral.splice(-1,1); //On retire l'initialisation
       return classementGeneral;
    },

//Calcul le classement final après les phases finales, classe les équipes dans les phases finales puis fusionne avec le classement post-poules.
    classementFinal : function(){

        var classement = [];
        var classementFinal = [["Classement","Equipe"]];
        var n = this.tableauPhasesFinales[0].length;
        for (j=0 ; j<n ; j++){
            for (i=1; i<this.tableauPhasesFinales.length; i++){

                if (classement.indexOf(this.tableauPhasesFinales[i][n-1-j]) == -1 && this.tableauPhasesFinales[i][n-1-j] != ''){
                    classement.push(this.tableauPhasesFinales[i][n-1-j]);
                    classementFinal.push([Math.pow(2,j),this.tableauPhasesFinales[i][n-1-j]]);
                }
            }
        }//On ajoute le bon classement avec les résultats de la petite finale. A complétement modifier si on veut aller plus loin que la petite finale
        var equipe3 = this.tableauPetiteFinale[1][1];
        classementFinal[3][0] = 3;
        if (classementFinal[3][1] != equipe3){
            var equipe4 = classementFinal[3][1];
            classementFinal[3][1]=equipe3;
            classementFinal[4][1]=equipe4;
        }
        for (i = classementFinal.length; i<this.classementApresPoules.length;i++){
            classementFinal.push([this.classementApresPoules[i][0],this.classementApresPoules[i][1]]);
        }
        return classementFinal;

    }

}