module.exports = {

    init : function(idMatch,nomEquipe){
        this.idMatch = idMatch;
        this.nomEquipe = nomEquipe;
        this.termine = false;
    },

    termine : function(classement, score){
        this.classement = classement;
        this.score = score;
        this.termine = true;
    },
//Dans le cas où il n'y a pas de classement
    termine : function (classement){
        this.classement = classement;
        this.termine = true;
    }



}