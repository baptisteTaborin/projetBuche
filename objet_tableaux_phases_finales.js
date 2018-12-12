/* Gère les phases finales en suivant la progression des équipes dans les tableaux.
 * 
 * 
a.  init1()
    Crée le tableau vide, permet de déterminer le nombre de matches pour créer les objets adéquats.
    i.  Variables d’entrée
        String premierTourPhasesFi
            « Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale »
        Int nbPoules
            *Nombre de poules
        Int nbEquipe
            Nombre d’équipes
        String type
            Permet de différencier un tableau général de celui de la petite finale. « petite finale » ou « normal »
    ii. Autres méthodes dans l’objet
        Méthode phasesFinales()
        Méthode constructionVIde()


b.  init2()
    Remplie la première colonne du tableau à la fin de la phase des poules.
    i.  Variables d’entrée
        Tableau classement
            String typeRemplissage
                Le code propose pour le moment deux façons de faire : "remplissageTableauPhaseFinaleParClassementGeneral" ou encore «remplissageTableauPhaseFinaleParNumeroPoule".
                Le premier permet de classer des équipes en faisant un classement après les phases de poules. Une fois fait, le premier va affronter le dernier, le deuxième l’avant dernier etc… En modifiant juste les matches up si les deux équipes viennent de la même poule, on décale alors les curseurs 
                Le deuxième permet de faire affronter le premier de la poule A contre le deuxième de la poule B et, dans l’autre moitié du tableau, faire affronter le deuxième de la poule A contre le premier de la poule B.
    ii. Autres méthodes dans l’objet
        selectionPhaseFinales()
        remplissageTableauPhaseFinale()


c.  remplissageTableauPhaseFinale()
    Check le type de remplissage souhaité et applique alors la bonne méthode pour répartir les équipes sur la première colonne du tableau des phases finales.
    i.  Autres méthodes dans l’objet
        remplissageTableauPhaseFinaleParClassementGeneral()
        remplissageTableauPhaseFinaleParNumeroPoule()


d.  constructionVide()
        Cree le tableau des phases finales vide. 


e.  selectionPhasesFinales()
        On trie les équipes qualifiées, dans le cas de la petite finale, on regarde celle qui sont en demi-finale mais pas en finale pour désigner les qualifiées. Elle produit un tableau comme le suivant :


f.  remplissageTableauPhaseFinaleParClassementGeneral()
        Remplissage en utilisant le classement général après les poules. On fait affronter les équipes par symétrie et si deux équipes proviennent de la même poule, on décale tout d’un cran.

g.  remplissageTableauPhaseFinaleParNumeroPoule()
        Remplissage en faisant affronter le premier de la poule A contre le deuxième de la poule B et dans l’autre côté du tableau des affrontements, on fait affronter le premier de la poule B contre le premier de la poule A.


h.  resultats()
    Met à jour le tableau des phases finales en inscrivant le nom des équipes gagnantes sur les colonnes de droite.
    i.  Variables d’entrée
        Objet Match
    ii. Autres méthodes dans l’objet
        Méthode phasesFinales()


i.  phasesFinales()
    Attribue à un type de phase finale un nombre. 
        Petite finale <-> 1
        Finale <-> 1
        Demi-finale <-> 2
        Quart de finale <-> 3
        Huitième de finale <-> 4
        Seizième de finale <-> 5
        Trente-deuxième de finale <-> 6
    i.  Variables d’entrée
        String premierTourPhasesFi
            « Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale », « Finale », « Petite finale »

*/


module.exports = {
    
   
//Construction des tableaux vides
    init1 : function(premierTourPhasesFi,nbPoules,nbEquipe,type){
        this.premierTourPhasesFi = premierTourPhasesFi;

        this.nbPoules
        this.nbPhasesFi = this.phasesFinales(premierTourPhasesFi);
        
        this.tableauVide = this.constructionVide();
        
        this.nbEquipe = nbEquipe;
        //utilisé pour distinguer phase petite finale
        this.type = type;
        

    },
    
//Remplissage de la première colonne
    init2 : function(classement, typeRemplissage){
        this.typeRemplissage = typeRemplissage;
        this.classementGeneralAvantPhasesFinales = classement;

        if (Math.pow(2,this.nbPhasesFi-1) < this.nbPoules){
            console.log("Attention, il y a plus de Poules que de matches de premier tour");
        
        }
        if (Math.pow(2,this.nbPhasesFi)>this.nbEquipe){
            this.impossible = "Impossible couillon";
            console.log("Attention, il n'y a pas assez d'équipe dans le tournoi pour le premier tour");
        }else{
            this.equipesSelectionnes = this.selectionPhaseFinales();
            this.remplissageTableauPhaseFinale();
        }
    },
//Fait appel à la bonne méthode en fonction des préférences de l'utilisateur.
    remplissageTableauPhaseFinale : function(){
        if (this.typeRemplissage == "remplissageTableauPhaseFinaleParClassementGeneral" ){
            this.tableau = this.remplissageTableauPhaseFinaleParClassementGeneral();
        }
        if (this.typeRemplissage == "remplissageTableauPhaseFinaleParNumeroPoule" ){
            this.tableau = this.remplissageTableauPhaseFinaleParNumeroPoule();
        }
    },

    decrire : function(){
        console.log("Les phases finales commencent par les matchs de "+this.premierTourPhases)
    },
//Construit le tableau vide
    constructionVide: function(){
        switch (this.nbPhasesFi){
            case 1:
                var matrice = [["Petite Finale", "Vainqueur"]];
                break;
            case 2:
                var matrice = [["Demi-Finales","Finales","Vainqueur"]];
                break;
            case 3:
                var matrice = [["Quarts de Finale","Demi-Finales","Finales","Vainqueur"]];
                break;
            case 4:
                var matrice = [["Huitièmes de Finale","Quarts de Finale","Demi-Finales","Finales","Vainqueur"]];
                break;
            case 5:
                var matrice = [["Seizièmes de Finale","Huitièmes de Finale","Quarts de Finale","Demis-Finales","Finales","Vainqueur"]];
                break;
            case 6:
                var matrice = [["Trente-Deuxièmes de Finale","Seizièmes de Finale","Huitièmes de Finale","Quarts de Finale","Demi-Finales","Finales","Vainqueur"]];
                break;
        }
        for (var i = 0; i<(Math.pow(2,this.nbPhasesFi)) ; i++)
        {
            matrice.push([]);
            for (var j=0; j<=(this.nbPhasesFi); j++)
            {
                matrice[i+1].push("");
            }
        }
	return matrice;
    },


//On trie les équipes qualifiées, dans le cas de la petite finale, on regarde celle qui sont en demi-finale mais pas en finale pour désigner les qualifiées
    selectionPhaseFinales : function(){
        var equipesSelectionnes = [["Classement", "Nom de l'Equipe", "N° de Poule", "Classement dans la Poule"]];

        if (this.type != "petite finale"){
            for (var i = 0; i< Math.pow(2,this.nbPhasesFi); i++){
                var equipe =this.classementGeneralAvantPhasesFinales[i+1];
                equipesSelectionnes.push([equipe[0],equipe[1],equipe[8],equipe[2]]);
            }
        } else { //On convertit la liste des équipes qualifiées en petite finale
            equipesSelectionnes.push([1,this.classementGeneralAvantPhasesFinales[0],0,0]);
            equipesSelectionnes.push([1,this.classementGeneralAvantPhasesFinales[1],1,0]);
        }
        return equipesSelectionnes;
    },

//Remplissage en utilisant le classement général après les poules. On fait affronter les équipes par symétrie. 
    remplissageTableauPhaseFinaleParClassementGeneral : function(){
        var tableau = this.tableauVide;
        var qualifies = this.equipesSelectionnes;
        for (var i=0; i<qualifies.length/2-1; i++){
            tableau[i*2+1][0] = qualifies[i+1][1];
        } 
        for (var j=0; j <qualifies.length/2-1; j++){
            var w =0;
            var installe = "Non";
            while (w <qualifies.length/2-1 && installe === "Non"){
                if ( tableau[(w+1)*2][0]=== "" && qualifies[w+1][2] != qualifies[qualifies.length-1-j][2]){
                    tableau[(w+1)*2][0]=qualifies[qualifies.length-j-1][1];
                    installe = "Oui";
                }
                w +=1;
            }
        }
        return tableau;
    },
    //Que si on ne prend TOUTES les equipes, tous les 1ers et tous les 2e de poules
    remplissageTableauPhaseFinaleParNumeroPoule : function(){
        var tableau = this.tableauVide;
        var qualifies = this.equipesSelectionnes;
        var moitie = (this.tableauVide.length-1)/2;
        for (var i = 1 ; i < (qualifies.length) ; i++ ){
            var classementDansPoule = qualifies[i][3];
            var numeroPoule = qualifies[i][2];
            if (numeroPoule % 2 == 0 && classementDansPoule == 2){
                tableau[numeroPoule][0] = qualifies[i][1];
            }
            if (numeroPoule % 2 == 0 && classementDansPoule == 1){
                tableau[numeroPoule+moitie][0] = qualifies[i][1];
            }
            if (numeroPoule % 2 == 1 && classementDansPoule == 1){
                tableau[numeroPoule][0] = qualifies[i][1];
            }
            if (numeroPoule % 2 == 1 && classementDansPoule == 2){
                tableau[numeroPoule+moitie][0] = qualifies[i][1];
            }
        }
        return tableau;
    },

//inscrit dans la bonne case le vainqueur du match
    resultats : function(match){


            var equipeA = match.equipe1;

            var equipeB = match.equipe2;

            var scoreEquipeA= match.scoreEquipe1;
            var scoreEquipeB= match.scoreEquipe2;
            var typeMatch = match.typeMatch;
            var indexEquipeA;
            var indexEquipeB;
            var phasesFinales = this.phasesFinales(typeMatch);
            for (var i = 1; i< this.tableau.length ; i++){ 
                if (this.tableau[i].lastIndexOf(equipeA.toLowerCase()) === (this.nbPhasesFi-phasesFinales)){
                    indexEquipeA = i;
                }
                if (this.tableau[i].lastIndexOf(equipeB.toLowerCase()) === (this.nbPhasesFi-phasesFinales)){
                    indexEquipeB = i;
                }
            } 
            if (!indexEquipeA){
                return console.log( equipeA + " n'a pas atteint cette phase");
            } 
            if (!indexEquipeB){
                return console.log( equipeB + " n'a pas atteint cette phase");
            } 
            if (scoreEquipeA > scoreEquipeB){
                this.tableau[Math.min(indexEquipeA,indexEquipeB)][this.nbPhasesFi-phasesFinales+1]=equipeA;
                
            }if (scoreEquipeA < scoreEquipeB ){
                this.tableau[Math.min(indexEquipeA,indexEquipeB)][this.nbPhasesFi-phasesFinales+1]=equipeB;
                
            }
            match.statut = "enregistre";
        },
        

        
    
//Convertit une phase finale en un nombre   
    phasesFinales : function(premierTourPhasesFi) {
        switch (premierTourPhasesFi.toLowerCase()){
            case "petite finale":
                return 1;
                break;
            case "finale":
                return 1;
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
            default:
                return console.log("Remplissez seulement par \"Trente-deuxième de finale\" ; \"Seizième de finale\" ; \"Huitième de finale\" ; \"Quart de finale\" ; \"Demi-finale\" ; \"Finale\"")
        }
            
    }

}
