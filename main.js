var tournoi = require('../code_matches_matrices/objet_tournoi');

module.exports = {
    
    test : function(){
        var listeEqupes = ['equipe1','equipe2','equipe3','equipe4',
        'equipe5','equipe6','equipe7','equipe8','equipe9','equipe10',
        'equipe11','equipe12','equipe13','equipe14','equipe15','equipe16'
        ,'equipe17','equipe18','equipe19','equipe20','equipe21','equipe22','equipe23','equipe24'
    , 'equipe25','equipe26','equipe27','equipe28','equipe29','equipe30','equipe31','equipe32'];
        var tournoiTest = Object.create(tournoi);
        tournoiTest.init("Volley","Quart de finale",['Cratère'],8,[10,10,8,7,7,6,6,6,3],[[17,00]],[[03,03,2018]],listeEqupes,"remplissageTableauPhaseFinaleParClassementGeneral",["tout"]);
        tournoiTest.decrire();
        tournoiTest.afficherPoule();
        tournoiTest.reaffecterEquipeDansPoule("equipe1","equipe2");
        tournoiTest.validerPoules();

        for (var i = 0 ; i < tournoiTest.listeMatchesPoules.length ; i++){
            tournoiTest.listeMatchesPoules[i].resultatClassique(Math.floor(Math.random() * 10),Math.floor(Math.random() * 10));
        }
        tournoiTest.miseAJourPoules();
        tournoiTest.lancementPhasesFinales();
        tournoiTest.validerPhasesFinales();


        for (var i = 0 ; i < tournoiTest.listeMatchesPhasesFinales.length ; i++){
            resultatEquipeA =Math.floor(Math.random() * 10);
            resultatEquipeB =Math.floor(Math.random() * 10);          
            if (resultatEquipeA===resultatEquipeB){
                resultatEquipeB+=1;
            }
            tournoiTest.listeMatchesPhasesFinales[i].resultatClassique(resultatEquipeA,resultatEquipeB);
            tournoiTest.miseAJourPhasesFinales();
        }

        
  
        tournoiTest.classementFinal();
        

        tournoiTest.afficherPoule();

        console.log(tournoiTest.tableauxResultatsPoules);
        console.log(tournoiTest.classementGeneralAvantPhasesFinales);
        console.log(tournoiTest.tableauxPhasesFinales.equipesSelectionnes);
        console.log(tournoiTest.tableauxPhasesFinales.tableau);
        console.log(tournoiTest.petiteFinale.tableau);
        console.log(tournoiTest.classementFinal.classement);


    }
}
