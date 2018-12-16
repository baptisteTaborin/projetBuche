var tournoi = require('../code_matches_matrices/objet_tournoi');
/*
Dans ce fichier nous allons tester le fonctionnement général de la création et des mises à jour d'un tournoi.
On procède dans l'ordre: crétaion du cadre, création d'une répartition en poules, on modifie cette répartition, on la valide.
On lance les matches de poules, une fois tous finis on génère le tableau des phases finales, on valide cette répartition puis
on génère tous les matches de phases finales. Enfin, on calcule le classement final.
L'aléatoire ne concerne que les répartitions dans les poules, et les résultats de matches.
*/

module.exports = {
    
    test : function(){
        // On crée une liste d'équipe. Ici on n construit 32 pour le test.
        var listeEqupes = ['equipe1','equipe2','equipe3','equipe4',
        'equipe5','equipe6','equipe7','equipe8','equipe9','equipe10',
        'equipe11','equipe12','equipe13','equipe14','equipe15','equipe16'
        ,'equipe17','equipe18','equipe19','equipe20','equipe21','equipe22','equipe23','equipe24'
        ,'equipe25','equipe26','equipe27','equipe28','equipe29','equipe30','equipe31','equipe32'];
        
        /* On crée l'objet tournoi (voir le fichier correspondant).
        Ainsi on crée tous les objets matches, poules comme phase finale, qui sont envoyés dans la BDD. On pourra ainsi dans le futur
        générer automatiquement des plannings à ce stade là.
        */
        var tournoiTest = Object.create(tournoi);
        tournoiTest.init("Volley","Quart de finale",['Cratère'],8,[10,10,8,7,7,6,6,6,3],[[17,00]],[[03,03,2018]],listeEqupes,"remplissageTableauPhaseFinaleParClassementGeneral",["tout"]);
        tournoiTest.decrire();
        
        //On affiche le tableau des poules qui a été généré aléatoirement
        console.log("\nProposition de Poule : \n")
        tournoiTest.afficherPoule();
        
        //On intervertit 2 équipes dans ces poules
        console.log("\n")
        tournoiTest.reaffecterEquipeDansPoule("equipe1","equipe2");
        //On valide les poules afin de générer la liste des matches de poules avec les bons noms d'équipes.
        tournoiTest.validerPoules();
        
        //On attribue un résultat aléatoire à chaque match
        for (var i = 0 ; i < tournoiTest.listeMatchesPoules.length ; i++){
            tournoiTest.listeMatchesPoules[i].resultatClassique(Math.floor(Math.random() * 10),Math.floor(Math.random() * 10));
        }
        //On met à jour les poules pour obtenir le classement final des phases de poules, nécessaire pour la qualification au tour suivant
        tournoiTest.miseAJourPoules();
        //On génère un tableau des phases finales que l'on pourra par la suite modifier manuellement
        tournoiTest.lancementPhasesFinales();
        //On valide le tableau des phases finales, on complète les objets de matches de phases finales avec le nom des équipes.
        tournoiTest.validerPhasesFinales();

        //On attribue un résultat aléatoire à chaque match, en refusant l'égalité
        for (var i = 0 ; i < tournoiTest.listeMatchesPhasesFinales.length ; i++){
            resultatEquipeA =Math.floor(Math.random() * 10);
            resultatEquipeB =Math.floor(Math.random() * 10);          
            if (resultatEquipeA===resultatEquipeB){
                resultatEquipeB+=1;
            }
            tournoiTest.listeMatchesPhasesFinales[i].resultatClassique(resultatEquipeA,resultatEquipeB);
            //On met à jour les phases finales après chaque matches afin de mettre à jour les objets matchs suivants avec les noms des équipes qualifiées
            tournoiTest.miseAJourPhasesFinales();
        }
        //Les matches sont finis, on calcule le classement final
        tournoiTest.classementFinal();
        
        console.log("\nComposition finale des poules (equipe1 intervertie avec equipe2) :\n")
        tournoiTest.afficherPoule();

        console.log("\nResultats par poules :\n", tournoiTest.tableauxResultatsPoules);
        console.log("\nClassement après les matchs de poules :\n",tournoiTest.classementGeneralAvantPhasesFinales);
        console.log("\nEquipes qualifiées pour le premier tour :\n",tournoiTest.tableauxPhasesFinales.equipesSelectionnes);
        console.log("\nTableaux des phases finales complétées :\n",tournoiTest.tableauxPhasesFinales.tableau);
        console.log("\nTableau de la petite finale :\n",tournoiTest.petiteFinale.tableau);
        console.log("\nClassement final du tournoi :\n",tournoiTest.classementFinal.classement);
    } 
}

var test2 = require('../code_matches_matrices/main')

test2.test();


