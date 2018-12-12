module.exports = {


 //Extrait les équipes et construit un tableau vide.
        init : function(listeEqupes){
            this.listeEqupes = listeEqupes;
            this.tableau = this.constructionVide();

        },

   //Construit le tableau vide 
        constructionVide:function(){
            var matrice = [["Equipes", "Victoires", "Défaites", "Nuls", "Points Marqués", "Points Encaissés", 
            "Goal Average", "Point","Classement"]];
            for (var i = 1; i<=this.listeEqupes.length ; i++)
            {
                matrice.push([]);
                for (var j=0; j<9; j++)
                {
                    matrice[i].push(0);
                    if (j===0){
                        matrice[i][j] = this.listeEqupes[i-1].toLowerCase();
                    }
                }
            }
            return matrice;
        },
// Met à jour le tableau en fonction des résultats
        resultats : function(match){
            var equipeA = match.equipe1;
            var equipeB = match.equipe2;

            var indexEquipeA;
            var indexEquipeB;

            for (var i = 1; i< this.tableau.length ; i++){
                if (this.tableau[i].indexOf(equipeA.toLowerCase()) === 0){
                    indexEquipeA = i;
                }
                if (this.tableau[i].indexOf(equipeB.toLowerCase()) === 0){
                    indexEquipeB = i;
                }
            } 
            if (!indexEquipeA){
                return console.log( equipeA + " n'est pas dans cette poule");
            } 
            if (!indexEquipeB){
                return console.log( equipeB + "n'est pas dans cette poule");
            }
            var scoreEquipeA = match.scoreEquipe1;
            var scoreEquipeB = match.scoreEquipe2;

            if (scoreEquipeA > scoreEquipeB){
                this.tableau[indexEquipeA][1]+=1;
                this.tableau[indexEquipeA][4]+=scoreEquipeA;
                this.tableau[indexEquipeA][5]+=scoreEquipeB;
                this.tableau[indexEquipeA][6]+=(scoreEquipeA-scoreEquipeB);
                this.tableau[indexEquipeA][7]+=3;
                this.tableau[indexEquipeB][2]+=1;
                this.tableau[indexEquipeB][4]+=scoreEquipeB;
                this.tableau[indexEquipeB][5]+=scoreEquipeA;
                this.tableau[indexEquipeB][6]+=(scoreEquipeB-scoreEquipeA);
            }   if (scoreEquipeA < scoreEquipeB){
                    this.tableau[indexEquipeB][1]+=1;
                    this.tableau[indexEquipeB][4]+=scoreEquipeB;
                    this.tableau[indexEquipeB][5]+=scoreEquipeA;
                    this.tableau[indexEquipeB][6]+=(scoreEquipeB-scoreEquipeA);
                    this.tableau[indexEquipeB][7]+=3;
                    this.tableau[indexEquipeA][2]+=1;
                    this.tableau[indexEquipeA][4]+=scoreEquipeA;
                    this.tableau[indexEquipeA][5]+=scoreEquipeB;
                    this.tableau[indexEquipeA][6]+=(scoreEquipeA-scoreEquipeB);
            }   if (scoreEquipeA === scoreEquipeB){
                    this.tableau[indexEquipeA][3]+=1;
                    this.tableau[indexEquipeA][4]+=scoreEquipeA;
                    this.tableau[indexEquipeA][5]+=scoreEquipeB;
                    this.tableau[indexEquipeA][6]+=(scoreEquipeA-scoreEquipeB);
                    this.tableau[indexEquipeA][7]+=1;
                    this.tableau[indexEquipeB][3]+=1;
                    this.tableau[indexEquipeB][4]+=scoreEquipeB;
                    this.tableau[indexEquipeB][5]+=scoreEquipeA;
                    this.tableau[indexEquipeB][6]+=(scoreEquipeB-scoreEquipeA);
                    this.tableau[indexEquipeB][7]+=1;
            }
            //On reset le classement pour le recalculer derrière
            for (var j = 1 ; j<=this.listeEqupes.length; j++){
                this.tableau[j][8] = 0;
            }
            this.classer();
    
        },
        
        classer : function(){
            var max = [this.tableau[1][7],1];
            for (var i =0; i<this.listeEqupes.length; i++){
                /* Pour le classement, d'abord on fait ça au score classique, puis en cas d'égalité goal average
                Puis, s'il y a aussi égalité du goal average, on fait ça à celui qui a le plus marqué et s'il y a encore égalité,
                on prend celui qui a le moins encaissé.
                */
                var j = 1;
                while (j<=this.listeEqupes.length){
                    if ((max[0] < this.tableau[j][7] && this.tableau[j][8]===0)||
                        (max[0] === this.tableau[j][7] && this.tableau[j][6]>this.tableau[max[1]][6] && this.tableau[j][8]===0) ||
                        ((max[0] === this.tableau[j][7]) && (this.tableau[j][6]===this.tableau[max[1]][6] && this.tableau[j][8]===0) && 
                        (this.tableau[j][4]>this.tableau[max[1]][4]) ) ||
                        ((max[0] === this.tableau[j][7]) && (this.tableau[j][6]===this.tableau[max[1]][6] && this.tableau[j][8]===0) && 
                        (this.tableau[j][4]===this.tableau[max[1]][4]) && this.tableau[j][5] < this.tableau[max[1]][5])||
                        ((max[0] === this.tableau[j][7]) && (this.tableau[j][6]===this.tableau[max[1]][6] && this.tableau[j][8]===0) && 
                        (this.tableau[j][4]===this.tableau[max[1]][4]) && this.tableau[j][5] === this.tableau[max[1]][5] && 
                        this.tableau[j][1] > this.tableau[max[1]][1] && this.tableau[j][8]===0)
                        )
                        {
                            max = [this.tableau[j][7],j];
                        }
                    j+=1;
                    }
                this.tableau[max[1]][8]=i+1;
                max = [-1,1]      
            }
            return this.tableau;
        },
}

    