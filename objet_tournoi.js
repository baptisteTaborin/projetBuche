/*
 * 
Objet principal, concentre toutes les informations et les méthodes principales.


a.  init()
    Méthode d’initialisation d’un nouvel objet tournoi, il nécessite les informations suivantes pour fonctionner dans cet ordre.
    i.  Variables d’entrée
        String Nom     
            Comprendre Sport
        String Premier tour des phases Finales 
            « Trente-deuxième de finale », « Seizième de finale », « Huitième de finale », « Quart de finale », « Demi-finale »
        String Lieux
            Pour le moment non utilisé, pourrait être une liste
        Int Nombre de Poules
            Int [9] liste Durées des matchs (en minutes)
            [durée finale ; durée petite finale ; durée demi-finale ; durée quart de finale ; durée huitième de finale ; durée seizième de finale ; durée trente-deuxième de finale ; durée match de poule ; durée transition]
        Int [] [2] liste des horaires de début des créneaux allouées au sport.
            [[x,y],[x’,y’]…] où pour le premier créneau, le tournoi commence à l’heure x, minute y…
        Int [] [3] liste des dates des créneaux allouées au sport.
            [[x,y,z],[x’,y’,z’]…] où le premier créneau, le tournoi commence le x jour du mois y de l’année z (le mois est un Int)
        String [] Liste des Equipes 
            Pour le moment on n’utilise pas d’objet Equipe dans le code, on peut envisager un futur raccord avec un objet.
        String Type de remplissage des phases finales
            Le code propose pour le moment deux façons de faire : "remplissageTableauPhaseFinaleParClassementGeneral" ou encore «remplissageTableauPhaseFinaleParNumeroPoule".
            Le premier permet de classer des équipes en faisant un classement après les phases de poules. Une fois fait, le premier va affronter le dernier, le deuxième l’avant dernier etc… En modifiant juste les matches up si les deux équipes viennent de la même poule, on décale alors les curseurs 
            Le deuxième permet de faire affronter le premier de la poule A contre le deuxième de la poule B et, dans l’autre moitié du tableau, faire affronter le deuxième de la poule A contre le premier de la poule B.
    ii. Objets connectés
        Objet Poule
            Méthode init()
        Objet TableauxPhasesFinales
            Méthode init1()
        Objet Match
            Méthode init()


b.  validerPoules()
    Méthode qui envoie dans la BDD les noms des équipes associés aux matches de poule.
    i.  Objets connectés
        Objet Poule
            Méthode init2()
        Objet Resultat
            Méthode init()


c.  miseAJourPoules()
    Met à jour les classements internes des poules en enregistrant les résultats des matches mis à jour.
    i. Objets connectés
        Objet TableauxResultats
            Méthode resultats()


d.  lancementPhasesFinales()
    Lance le calcul du classement intermédiaires des équipes après les matches de poule et propose un arrangement pour le premier tour des phases finales.
    i.  Objets connectés
        Objet Poule
            Méthode classement()
        Objet TableauxPhasesFinales
            Méthode init2()


e.  validerPhasesFinales()
    Valide la proposition des équipes pour le premier tour des phases finales, les envoie dans la BDD.
    i. Objets connectés
        Objet Resultat
            Méthode init()


f.  miseAJourPhasesFinales()
    Mais à jour les matches finis dans les phases finales et complète les matches avec le nom des équipes qualifiées pour le tour suivant
    i.  Objets connectés
        Objet Resultat
            Méthode init()
        Objet Match
            Méthode initEquipeA()
            Méthode initEquipeB()
            Méthode initClassique()
        Objet TableauxPhasesFinales
            Méthode phasesFinales()
            Méthode resultats()
    ii. Autres méthodes dans l’objet
        Méthode initialisationPetiteFInale()


g.  initialisationPetiteFinale()
    Initialise la petite finale lorsque les demi-finales sont résolues.
    i.  Objets connectés
        Objet PetiteFinale
            Méthode init()


h.  classementFinal()
    Calcul le classement final à la fin du tournoi
    i.  Objets connectés
        Objet Classement
            Méthode init()


i.  reaffecterEquipeDansPoule()
    Interverti deux équipes dans les poules, à faire avant de valider les poules. Permet ainsi d’avoir un équilibrage.
    i.  Variables d’entrée
    String EquipeA
        Nom de l’équipe à changer A
    String EquipeB
        Nom de l’équipe à changer A
    ii. Objets connectés
        Objet Poule


j.  resultat()
    Enregistre les résultats de la BDD et les répercute soit sur les poules, soir sur les phases finales. Se limite pour le moment aux confrontation 1 vs 1 avec un score.
    i.    Variables d’entrée
        Int idMatch
            Code attribué au match par la BDD
        String EquipeA
        String EquipeB
        Int scoreEquipeA
            Pour le moment limité aux confrontations avec un score. 
        Int scoreEquipeB
    ii. Objets connectés
        Objet Match
            Méthode resultatClassique()
    iii.  Autres méthodes dans l’objet
        Méthode miseAJourPoules()

 * 
 * 
 * 
 * 
 * 
*/



var poules = require('../code_matches_matrices/objet_poules');
var tableauxPhasesFinales = require('../code_matches_matrices/objet_tableaux_phases_finales');
var petiteFinale = require('../code_matches_matrices/petite_finale');
var classement = require('../code_matches_matrices/classement');
var match = require('../code_matches_matrices/objet_match');
var planningObj = require('../code_matches_matrices/objet_planning');
var resultat = require('../code_matches_matrices/objet_resultat');
const http= require("http");

module.exports = {

/*
On crée un objet tournoi qui va prendre en compte tous les paramètres du tournoi au sein de la bûche. 
Sport, premier tour des phases finales, lieux, nb de poules, durées des matches, liste des horaires, liste des équipes,
comment sélectionner les équipes à la fin des poules.
*/

        init: function(nom,premierTourPhasesFi,lieux,nbPoules,listeDurees,listeHoraires,listeDates,listeEqupes,typeRemplissagePhaseFi){
            //nom du sport
            this.nom = nom;
            //Nom du premier tour des phases finales : "Demi-finale", "Quart de finale", "Huitième de finale", 
            //"Seizième de finale", "Trente-deuxième de finale"
            this.premierTourPhasesFi = premierTourPhasesFi;
            //liste des lieux où se dérouleront le tournoi - POUR LE MOMENT NON UTILISE
            this.lieux = lieux;
            //Nombre de poule, attention à ce que ce soit réaliste
            this.nbPoules = nbPoules;
            //[durFi,durPetiteFi,durDemiFi,durQuartFi,durHuiFi, durSeizFi, durTrenFi, durMatchPoule, durTransition] 
            this.listeDurees = listeDurees;
            /*horaires de début, la liste a autant d'arguments qe de séquences du tournoi. 
            le premier nombre représente l'heure, le deuxième les minutes
            ex : [[17,0],[16,30]]
            */
            this.listeHoraires =listeHoraires;
            //dates des séquences ex :[[16,5,2018],[18,5,2018]]
            this.listeDates = listeDates;
            //Liste où on entrepose les différentes plannings
            this.listePlannings = [];
            //nombre de jours différents où se déroule ce tournoi
            this.nombreSequences = listeDates.length;
            this.nbEqupes = listeEqupes.length;
            this.listeEqupes=listeEqupes;
            // On crée l'objet poule qui va être associé au tournoi
            this.poule = Object.create(poules);
            this.poule.init(listeEqupes,this.nbPoules);

            //On s'intéresse aux tableaux de résultats des poules
            this.tableauxResultatsPoules = this.poule.tableauxResultats;
            
            this.nbEquipesParPouleComplete = Math.floor(this.nbEqupes/this.nbPoules)+1;
            this.nbPoulesIncomplètes = this.nbPoules*this.nbEquipesParPouleComplete-this.nbEqupes; //On suppose qu'une poule incomplète n'a qu'une équipe en moins

            this.nbMatchesPoulesGeneral = (this.nbEquipesParPouleComplete-1)*(this.nbPoules*this.nbEquipesParPouleComplete/2-this.nbPoulesIncomplètes);
            
            //Pour savoir comment créer le planning, on explique sur chaque créneau alloué au tournoi ce qui est prévu :
            // "tout" ; "poules" ; "poule 1" ; "poule 2" ; "poule 3"... ; "huitième" ; "finale"...(trente-deuxième, seizième, huitième, quart, demi, petite, finale)
            // Cela se présente sous la forme : [[CRENEAU 1],[CRENEAU 2],[CRENEAU 3]...] : [[["poule 1"],["poule 2"],["poule 3"],["poule 4"]],[["huitième"],["quart"]],[["demi"],["petite"],["finale"]]];



            this.listeMatchesPoules = [];
            for (var i = 0 ; i < this.nbMatchesPoulesGeneral ; i++){
                var matchPoule = Object.create(match);
                matchPoule.init(lieux, nom, "Poule",listeDurees);
                this.listeMatchesPoules.push(matchPoule);

            }
            


            this.tableauxPhasesFinales = Object.create(tableauxPhasesFinales);
            tableauxPhasesFinales.init1(this.premierTourPhasesFi,this.nbPoules,this.nbEqupes,"normal");
           
            this.listeMatchesPhasesFinales =[];
            //On prépare les créneaux des matchs des phases finales sans le nom des équipes (pour anticiper les plannings)
            for (var j = 0;j<this.tableauxPhasesFinales.tableauVide[0].length-1 ; j++){
                for (var w = 1 ; w < this.tableauxPhasesFinales.tableauVide.length ; w += Math.pow(2,j+1)) {
                    var typeMatch;
                    switch (this.tableauxPhasesFinales.tableauVide[0].length-j){
                        case 2:
                            typeMatch = "finale";
                            break;
                        case 3:
                            typeMatch = "demi-finale";
                            break;
                        case 4:
                            typeMatch = "quart de finale";
                            break;
                        case 5:
                            typeMatch = "huitième de finale";
                            break;
                        case 6:
                            typeMatch = "seizième de finale";
                            break;
                        case 7:
                            typeMatch = "trente-deuxième de finale";
                            break;
                    }
                    var matchPhaseFinale = Object.create(match);
                    matchPhaseFinale.init(lieux, nom, typeMatch, listeDurees);

                    this.listeMatchesPhasesFinales.push(matchPhaseFinale);

                }
            }
            var matchPetiteFinale= Object.create(match);
            matchPetiteFinale.init(lieux, nom, "petite finale", listeDurees);
            this.listeMatchesPhasesFinales.push(matchPetiteFinale);

            //Pour savoir comment remplir le premier tour des phasesFi : "remplissageTableauPhaseFinaleParClassementGeneral" ou "remplissageTableauPhaseFinaleParNumeroPoule"
            this.typeRemplissagePhaseFi = typeRemplissagePhaseFi;

          
        },
 
        //Valide la répartition des équipes dans les poules afin de remplir la liste des matchs de poules de l'objet tournoi
        validerPoules: function(){
            this.poule.init2();
            var rangMatchPoule = 0;
            for (var i = 0 ; i< this.nbPoules ; i++){
                var tableau = this.poule.tableauxResultatsObjets[i];
                for (var j = 0 ; j < tableau.listeEqupes.length ; j++ ){
                    for (var k = tableau.listeEqupes.length-1; k > j; k--){
                        var equipeA = tableau.listeEqupes[j];
                        var equipeB = tableau.listeEqupes[k];
                        this.listeMatchesPoules[rangMatchPoule].initClassique(equipeA,equipeB,i+1);

                        var objResultatA = Object.create(resultat);
                        var objResultatB = Object.create(resultat);
                        objResultatA.init(this.listeMatchesPoules[rangMatchPoule].id,equipeA);
                        objResultatB.init(this.listeMatchesPoules[rangMatchPoule].id,equipeB);

                        rangMatchPoule+=1;
                    }
                }
            }
        },
        // Met à jour les résultats lorsque un match de poule est fini
        miseAJourPoules: function(){
            this.tableauxResultatsObjets = this.poule.tableauxResultatsObjets;
            for (var i = 0 ; i < this.listeMatchesPoules.length ; i++){
                if (this.listeMatchesPoules[i].statut === "fini"){
                    this.tableauxResultatsObjets[this.listeMatchesPoules[i].numeroPoule-1].resultats(this.listeMatchesPoules[i]);
                    this.listeMatchesPoules[i].statut = "enregistre"
                }
            }
   

        },
        
        validerPhasesFinales: function(){
            for (var w = 1 ; w < this.tableauxPhasesFinales.tableau.length ; w += 2){
                var equipeA = this.tableauxPhasesFinales.tableau[w][0];
                var equipeB = this.tableauxPhasesFinales.tableau[w+1][0];
                this.listeMatchesPhasesFinales[(w-1)/2].initClassique(equipeA,equipeB,0);

                var objResultatA = Object.create(resultat);
                var objResultatB = Object.create(resultat);
                objResultatA.init(this.listeMatchesPhasesFinales[(w-1)/2].id,equipeA);
                objResultatB.init(this.listeMatchesPhasesFinales[(w-1)/2].id,equipeB);

            }
        },
        // lit la liste des matches de phases finales, si l'un est fini, il renvoit le résultat dans l'objet tournoi phases finales pour mettre à jour le tableau et récupère le nom des équipes pour les prochaines phases.
        miseAJourPhasesFinales: function(){
            var compteur = Math.pow(2,tableauxPhasesFinales.phasesFinales(this.listeMatchesPhasesFinales[0].typeMatch)-1);
            var tailleListe = this.listeMatchesPhasesFinales.length;
            for (var j = 0; j <tailleListe-1 ; j++){
                if (this.listeMatchesPhasesFinales[j].statut === "fini"){
                    this.tableauxPhasesFinales.resultats(this.listeMatchesPhasesFinales[j]);
                    if ( j % 2 === 0 ){
                        this.listeMatchesPhasesFinales[j+compteur].initEquipeA(this.listeMatchesPhasesFinales[j].classement[0][0]);  
                    } else {
                        this.listeMatchesPhasesFinales[j+compteur-1].initEquipeB(this.listeMatchesPhasesFinales[j].classement[0][0]);
                    }

                    var objResultat = Object.create(resultat);
                        
                    objResultat.init(this.listeMatchesPhasesFinales[j+compteur].id,this.listeMatchesPhasesFinales[j].classement[0][0]);

                    this.listeMatchesPhasesFinales[j].statut = "enregistre";
                }
                if (j%2 ===1){
                    compteur--;
                }
            } //Si les demi finales sont finies, on lance la petite finale
            
            if (this.listeMatchesPhasesFinales[tailleListe-4].statut === "enregistre" && this.listeMatchesPhasesFinales[tailleListe-3].statut === "enregistre" && this.listeMatchesPhasesFinales[tailleListe-1].statut === "pas commencé / pas fini"){
                this.initialisationPetiteFinale();
                this.listeMatchesPhasesFinales[tailleListe-1].initClassique(this.listeMatchesPhasesFinales[tailleListe-4].classement[1][0],this.listeMatchesPhasesFinales[tailleListe-3].classement[1][0],0);
            
                var objResultatA = Object.create(resultat);
                var objResultatB = Object.create(resultat);
                        
                objResultatA.init(this.listeMatchesPhasesFinales[tailleListe-1].id,this.listeMatchesPhasesFinales[tailleListe-4].classement[1][0]);
                objResultatB.init(this.listeMatchesPhasesFinales[tailleListe-1].id,this.listeMatchesPhasesFinales[tailleListe-3].classement[1][0]);
            
            }
            if (this.listeMatchesPhasesFinales[tailleListe-1].statut === "fini"){
                this.petiteFinale.tableauxPetiteFinaleObj.resultats(this.listeMatchesPhasesFinales[tailleListe-1]);
                console.log("Le tournoi est fini");
                this.listeMatchesPhasesFinales[tailleListe-1].statut = "enregistre";
            }
        },

        // Pour le moment crée les tableaux de phases finales. On va développer par la suite cette fonction pour calculer le classement après les phases finales
        lancementPhasesFinales: function(){

            this.poule.classement();
            this.classementGeneralAvantPhasesFinales = this.poule.classement;
            tableauxPhasesFinales.init2(this.classementGeneralAvantPhasesFinales,this.typeRemplissagePhaseFi);
           
  
        },

        //Méthode qui crée l'objet petite finale une fois que les demi-finales sont résulues
        initialisationPetiteFinale: function(){
            this.petiteFinale = Object.create(petiteFinale);
            this.petiteFinale.init(this.tableauxPhasesFinales);
        },
        //Calcul le classement final du tournoi
        classementFinal : function(){
            this.classementFinal = Object.create(classement);
            this.classementFinal.init("classement final", this.classementGeneralAvantPhasesFinales, this.tableauxPhasesFinales.tableau, this.petiteFinale.tableau, this.classementGeneralAvantPhasesFinales);
        },

        afficherPoule : function(){
            console.log(this.poule.tableauxRemplis);
        },
        //Pour changer deux équipe dans les poules
        reaffecterEquipeDansPoule : function(equipeA,equipeB){
            var tableau = this.poule.tableauxRemplis;
            var indexEquipeA = -1;
            var pouleEquipeA;
            var indexEquipeB = -1;
            var pouleEquipeB;
            for (var i = 0 ; i< tableau.length ; i++){
                if (tableau[i].indexOf(equipeA) != -1){
                    indexEquipeA = tableau[i].indexOf(equipeA);
                    pouleEquipeA = i+1;
                }
                if (tableau[i].indexOf(equipeB) != -1){
                    indexEquipeB = tableau[i].indexOf(equipeB);
                    pouleEquipeB = i+1;
                }
            }
            if (indexEquipeA != -1 && indexEquipeB != -1){
                tableau[pouleEquipeA-1][indexEquipeA] = equipeB;
                tableau[pouleEquipeB-1][indexEquipeB] = equipeA;
            }

        },

        creationPlanning : function(date,horaireDebut,listeMatches,lieu,nbTerrains, repartitionTournoi,type){
            var planning = Object.create(planningObj);
            planning.init(date,horaireDebut,listeMatches,this.listeDurees,lieu,nbTerrains,repartitionTournoi,type);
            planning.construction();
            this.listePlannings.push(planning);
        },

        resultat : function(idMatch, equipeA, scoreEquipeA, equipeB, scoreEquipeB){
            var index = -1;
            for (var i; i < listeMatchesPoules.length ; i++){
                if (listeMatchesPoules[i].id === idMatch){
                    index = i;
                    if (this.listeMatchesPoules[i].equipe1 === equipeA){
                        this.listeMatchesPoules[i].resultatClassique(scoreEquipeA, scoreEquipeB);
                    } else {
                        this.listeMatchesPoules[i].resultatClassique(scoreEquipeB, scoreEquipeA);
                    }
                    //Si on veut modifier le score d'un match et ainsi recalculer les résultats
                    if (this.listeMatchesPoules[i].statut = "enregistre"){this.listeMatchesPoules[i].statut = "fini"}
                    this.miseAJourPoules();
                }
            }
            if (index === -1){
                for (var i; i < listeMatchesPhasesFinales.length ; i++){
                    if (listeMatchesPhasesFinales[i].id === idMatch){
                        index = i;
                        if (this.listeMatchesPhasesFinales[i].equipe1 === equipeA){
                            this.listeMatchesPhasesFinales[i].resultatClassique(scoreEquipeA, scoreEquipeB);
                        } else {
                            this.listeMatchesPhasesFinales[i].resultatClassique(scoreEquipeB, scoreEquipeA);
                        }
                        this.miseAJourPhasesFinales();
                    }
                }
            }
            if (index === -1) {console.log("Erreur, cette id ne correspond à rien")}
            
        },


        decrire : function(){
            var resultat = "C'est un tournoi de " + this.nom + " qui se déroulera le(s) "
            for (var i = 0 ; i < this.nombreSequences ; i++){
                resultat = resultat + "\n" + this.listeDates[i][0] +"/"+ this.listeDates[i][1] +"/"+this.listeDates[i][2] 
                + " à partir de " + this.listeHoraires[i][0]+"h"+this.listeHoraires[i][1];
            }
            resultat = resultat + " à/au " + this.lieux +". \n Le tournoi s'organise autour de poules de "+ this.nbPoules + 
            " qui méneront à un " + this.premierTourPhasesFi + " jusqu'à la finale. \n La finale durera " + this.listeDurees[0] +"min"
            + "\n La petite-finale durera " + this.listeDurees[1] +"min"+ "\n Une demi-finale durera " + this.listeDurees[2] +"min"
            + "\n Un quart de finale durera " + this.listeDurees[3] +"min"+ "\n Une huitième de finale durera " + this.listeDurees[4] +"min"
            + "\n Une seizième de finale durera " + this.listeDurees[4] +"min"+ "\n Une trente-deuxième de finale durera " + this.listeDurees[4] +"min"
            + "\n Un match de poule dure "+ this.listeDurees[5] + "min" +" \n Ils seront tous séparé d'un temps de "+this.listeDurees[6]+"min";
            console.log(resultat);
            },
    

        
    
        }
    



