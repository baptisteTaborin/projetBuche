/*
Objet qui gère les poules du tournoi


a.  init()
    Initialise l’objet, crée les réceptacles vides des informations à venir plus une première proposition de remplissage aléatoire des poules.
    i.  Variables d’entrée
        String [] listeEqupes 
            Liste des noms des équipes du tournoi.
        Int nbPoules
            Nombre de poules souhaité.
    ii. Autres méthodes dans l’objet
    Méthode constructionRandom()


b.  init2()
    Initialise les tableaux de résultat des poules suite à leur validation et crée le classement intermédiaire inter poules.
    i.  Objets connectés
        Objet TableauxResultats
            Méthode init()
        Objet Classement


c.  classement()
    Calcul le classement intermédiaire à la fin de la phase des poules.
    i.  Objet connectés
        Objet Classement
          Méthode init()


d.  constructionVide()
    Construit un tableau vide pour les poules. N’est pas utilisé.


e.  constructionRandom()
    Construit un tableau rempli avec les poules ordonnées au hasard, une ligne représente une poule, une équipe est un string
 * 
 * 
 * 
 * 
*/



var tableauxResultats = require('../code_matches_matrices/objet_tableaux_resultats');
var classement = require('../code_matches_matrices/classement');

module.exports = {

//On initialise l'objet, la méthode construit les réceptacles vides plus une première proposition de remplissage des poules
    init : function (listeEqupes,nbPoules){
        this.listeEqupes = listeEqupes;
        this.nbEqpes = listeEqupes.length;
        this.nbPoules= nbPoules;
        this.nbEqupParPoule = Math.ceil(this.nbEqpes/this.nbPoules);
        this.tableauxRemplis = this.constructionRandom();
        this.tableauxResultats = [];
        this.tableauxResultatsObjets = [];
    },
//Une fois que l'on a validé les équipes, on commence à remplir les tableaux
    init2 : function(){
        for (var i = 0; i<this.nbPoules;i++){
            var tableauI = Object.create(tableauxResultats);
            // On remplit le tableau en éliminant les cases vides crées s'il n'y a pas assez d'équipes pour le match.
            var sousListeEqupes =[];
            for (var j = 1; j < this.tableauxRemplis[i].length; j++){
                if (this.tableauxRemplis[i][j] != ''){
                    sousListeEqupes.push(this.tableauxRemplis[i][j])
                }
            }
            tableauI.init(sousListeEqupes);
            this.tableauxResultatsObjets.push(tableauI);
            this.tableauxResultats.push(tableauI.tableau);
        }
        this.classementObjet = Object.create(classement);

        
    },
    decrire : function(){
        console.log("Il y a "+this.nbPoules+" pour ce tournoi de " +this.nbEqpes+ " équipes.");
    },

    classement : function(){
        this.classementObjet.init("classement general poules",this.tableauxResultats);
        this.classement = this.classementObjet.classement;
    },

    constructionVide : function(){
        var matrice = [];
	    for (var i = 0; i < this.nbPoules; i++)
	    {
		    matrice.push([]);
		    for (var j=0; j< this.nbEquipParPoule; j++)
		    {
		        matrice[i].push("équipe "+(i*this.nbEquipParPoule+j+1));
		    }
	    }
	    return matrice;
    },
    constructionRandom : function(){
        var matrice = [];
        var liste = this.listeEqupes;
        for (var i = 0; i<this.nbPoules; i++){
            matrice.push(["Poule "+(i+1)]);
        }
        for (var j = 0; j<this.nbEqupParPoule;j++){
            for (var i = 0; i<this.nbPoules; i++){
                var equipe = Math.floor(Math.random() * Math.floor(this.nbEqpes-j*this.nbPoules-i));
                if (liste.length != 0){
                    matrice[i].push(liste[equipe]);
                    liste.splice(equipe,1);
                }else {
                    matrice[i].push("");
                }
            }
        }
        return matrice
        },

}
