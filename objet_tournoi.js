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

                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/matches/new/algo/',
                    method: 'PUT',
                    headers: {
                        'Content-Type': "application/json",
                        'charset' : "utf-8",
                    }
                  };
                  
                  const req = http.request(options, (res) => {
                    console.log("STATUS: " + res.statusCode);
                    console.log("HEADERS: " + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                      console.log("BODY: " + chunk);
                      matchPhaseFinale.id = chunk.id_match;
                    });
                    res.on('end', () => {
                      console.log('No more data in response.');
                    });
                  });
                  
                  req.on('error', (e) => {
                    console.error("problem with request: " + e.message);
                  });
                  
                  // write data to request body
                  req.write(JSON.stringify(matchPoule));
                  req.end();
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

                    const options = {
                        hostname: 'localhost',
                        port: 3000,
                        path: '/matches/new/algo/',
                        method: 'PUT',
                        headers: {
                            'Content-Type': "application/json",
                            'charset' : "utf-8",
                        }
                      };
                      
                      const req = http.request(options, (res) => {
                        console.log("STATUS: " + res.statusCode);
                        console.log("HEADERS: " + JSON.stringify(res.headers));
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                          console.log("BODY: " + chunk);
                          matchPhaseFinale.id = chunk.id_match;
                        });
                        res.on('end', () => {
                          console.log('No more data in response.');
                        });
                      });
                      
                      req.on('error', (e) => {
                        console.error("problem with request: " + e.message);
                      });
                      
                      // write data to request body
                      req.write(JSON.stringify(matchPhaseFinale));
                      req.end();
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
                for (var j = 0 ; j <tableau.listeEqupes.length ; j++ ){
                    for (var k = tableau.listeEqupes.length-1; k > j; k--){
                        var equipeA = tableau.listeEqupes[j];
                        var equipeB = tableau.listeEqupes[k];
                        this.listeMatchesPoules[rangMatchPoule].initClassique(equipeA,equipeB,i+1);

                        var objResultatA = Object.create(resultat);
                        var objResultatB = Object.create(resultat);
                        objResultatA.init(this.listeMatchesPoules[rangMatchPoule].id,equipeA);
                        objResultatB.init(this.listeMatchesPoules[rangMatchPoule].id,equipeB);

                        const options = {
                            hostname: 'localhost',
                            port: 3000,
                            path: '/resultats/new/algo/',
                            method: 'PUT',
                            headers: {
                                'Content-Type': "application/json",
                                'charset' : "utf-8",
                            }
                          };
                          
                          const req = http.request(options, (res) => {
                            console.log("STATUS: " + res.statusCode);
                            console.log("HEADERS: " + JSON.stringify(res.headers));
                            res.setEncoding('utf8');
                            res.on('data', (chunk) => {
                              console.log("BODY: " + chunk);
                            });
                            res.on('end', () => {
                              console.log('No more data in response.');
                            });
                          });
                          
                          req.on('error', (e) => {
                            console.error("problem with request: $" + e.message);
                          });
                          
                          // write data to request body
                          req.write(JSON.stringify(objResultatA));
                          req.write(JSON.stringify(objResultatB));
                          req.end();


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

                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/resultats/new/algo/',
                    method: 'PUT',
                    headers: {
                        'Content-Type': "application/json",
                        'charset' : "utf-8",
                    }
                    };
                    
                    const req = http.request(options, (res) => {
                        console.log("STATUS: " + res.statusCode);
                        console.log("HEADERS: " + JSON.stringify(res.headers));
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                          console.log("BODY: " + chunk);
                          matchPhaseFinale.id = chunk.id_match;
                        });
                        res.on('end', () => {
                          console.log('No more data in response.');
                        });
                      });
                      
                      req.on('error', (e) => {
                        console.error("problem with request: " + e.message);
                      });
                    
                    // write data to request body
                    req.write(JSON.stringify(objResultatA));
                    req.write(JSON.stringify(objResultatB));
                    req.end();
            }
        },
        // lis la liste des matches de phases finales, si l'un est fini, il renvoie le résultat dans l'objet tournoi phases finales pour mettre à jour le tableau et récupère le nom des équipes pour les prochaines phases.
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

                    const options = {
                        hostname: 'localhost',
                        port: 3000,
                        path: '/resultats/new/algo/',
                        method: 'PUT',
                        headers: {
                            'Content-Type': "application/json",
                            'charset' : "utf-8",
                        }
                        };
                        
                        const req = http.request(options, (res) => {
                            console.log("STATUS: " + res.statusCode);
                            console.log("HEADERS: " + JSON.stringify(res.headers));
                            res.setEncoding('utf8');
                            res.on('data', (chunk) => {
                              console.log("BODY: " + chunk);
                              matchPhaseFinale.id = chunk.id_match;
                            });
                            res.on('end', () => {
                              console.log('No more data in response.');
                            });
                          });
                          
                          req.on('error', (e) => {
                            console.error("problem with request: " + e.message);
                          });
                        
                        // write data to request body
                        req.write(JSON.stringify(objResultat));
                        req.end();

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

                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/resultats/new/algo/',
                    method: 'PUT',
                    headers: {
                        'Content-Type': "application/json",
                        'charset' : "utf-8",
                    }
                    };
                    
                    const req = http.request(options, (res) => {
                        console.log("STATUS: " + res.statusCode);
                        console.log("HEADERS: " + JSON.stringify(res.headers));
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                          console.log("BODY: " + chunk);
                          matchPhaseFinale.id = chunk.id_match;
                        });
                        res.on('end', () => {
                          console.log('No more data in response.');
                        });
                      });
                      
                      req.on('error', (e) => {
                        console.error("problem with request: " + e.message);
                      });
                    
                    // write data to request body
                    req.write(JSON.stringify(objResultatA));
                    req.write(JSON.stringify(objResultatB));
                    req.end();
            
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
    



