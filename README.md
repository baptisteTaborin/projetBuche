# projetBuche
Code used in the Buche Project in CentraleSupélec to manage the Groups for the school tournament for the event website


L’objectif de l’algorithme métier est de dialoguer avec l’API du site internet de la Bûche pour pouvoir créer les tournois, les poules et les matches dans la BDD. En rentrant petit à petit les scores des matches, l’algorithme calcul les matches suivants et les classements. A terme, l’objectif est de construire automatiquement les plannings pour faciliter le travail des organisateurs.
Il a donc été décidé de coder cet algorithme en javascript, afin de faciliter le dialogue avec cette API qui utilisera node.js. 
Ci dessous, la description du fonctionnement général de l'algorithme:



g.	Création tournoi


On crée un tournoi avec la fonction init() (les arguments de la fonction sont décrit dans le code).
 
  a)	 Cette fonction va créer un objet Poule et l’initialiser (grâce à la liste des Equipes et le nombre de Poules)
  b)	L’initialisation de l’objet Poule va générer aléatoirement les répartitions dans les poules. 
  c)	La fonction crée ensuite une liste d’objets match (listeMatchesPoules) dans laquelle elle insère les matches de poules sans les noms d’équipes. A terme, elle devrait rajouter les horaires et les lieux (objectif optimisation planning). Ces objets sont envoyés à la BDD.
  d)	La fonction crée ensuite un objet tableauxPhasesFinales qui va stocker les phases finales ; puis l’initialise avec le premier tour des phases finales, le nombre de poules, le nombre d’équipes et en précisant que ce n’est pas pour la petite finale (voir plus loin). Ainsi cet objet crée un tableau vide ou sera inscrit l’avancement des matches
  e)	La fonction crée ensuite une liste d’objets match (listeMatchesPhasesFinales) dans laquelle elle insère les matches des phases finales sans les noms d’équipes. A terme, elle devrait rajouter les horaires et les lieux (objectif optimisation planning). Ces objets sont envoyés à la BDD.
  
  
  h.	Modification Poules
On modifie à ce moment-là les poules afin de répartir au mieux les niveaux grâce à la fonction reaffecterEquipeDansPoule(String nom équipe 1, String nom équipe 2)
On utilise la fonction validerPoules() qui « fixe » les équipes en remplissant les noms des équipes dans les objets matches de l’objet listeMatchesPoules et elle crée les objets Resultats qui prennent en compte le match et une équipe de ce match (en adéquation avec les tables de la BDD). De plus, la fonction lance une deuxième initialisation de l’objet Poule en lui faisant créer des objets tableauxResultats où seront stockés les résultats de chaque poule plus un objet classement ou seront classées toutes les équipes à la fin de la phase de poule.


i.	Rentrer les résultats poules


A chaque résultat de match de poule, on utilise la fonction resultat(Int idMatch, String equipeA, Int scoreEquipe1, String equipeB, Int scoreEquipeB) qui cherche le match dans les deux listes de matches vues précédemment. Cela met ensuite à jour les poules (miseAJourPoules()) ou les phases finales (miseAJourPhasesFinales()).

  a)	miseAJourPoules() : Cette fonction lit listeMatchesPoules afin de voir quels sont les matchs « fini ». Lorsqu’un match est fini, la méthode met à jour le tableauxRésultats associé à la poule à l’aide de la méthode resultats() dans ce dernier objet. Il répercute les résultats dans le tableau et calcule les scores et les classements internes aux poules.
      i)	tableauxRésultats indique les résultats dans une poule en s’appuyant sur les points marqués, les points encaissés,  les victoires, les défaites, le goal average et le total de point calculé en fonction des victoires/défaites. 
      
L’objet utilise la méthode classer() pour calculer le classement interne.


j.	Lancement Phases Finales


Une fois les phases de poules finies, il faut lancer les phases finales. Pour cela il faut lancer avec l’objet tournoi la méthode lancementPhasesFinales() ; cela lance la méthode classement() dans l’objet poule qui permet de classer toutes les équipes à la sortie des poules. Cela lance la création d’un objet Classement et lance la méthode, dans ce même objet, init(« classement general poules »,tableauResultats). Cela permet de lancer la méthode classementGeneralApresPoules() automatiquement et d’obtenir un classement.
Cela lance aussi la méthode init2(classementALaFinDesPoules, typeRemplissagePhasesFi) dans l’objet tableauxPhasesFinales qui permet donc une première répartition des équipes pour la première phase finale.
On lance ensuite la méthode validerPhasesFinales() dans l’objet tournoi qui permet d’envoyer à la BDD les noms des équipes qualifiées à l’aide de la création d’objet Resultat. 


k.	Rentrer les résultats phases finales


On rentre les résultats comme pour les poules. Elle met à jours les tableaux avec miseAJourPhasesFinales().

  a)	miseAJourPhasesFinales() : Cette méthode lit listeMatchesPhasesFinales afin de voir les matches finis. Les objets résultats sont créés pour le match suivant. On ajoute à l’objet match dans la liste le nom de l’équipe qualifiée. De plus l’objet tableauxPhasesFinales est mis à jour. Si le match fini était la dernière demi-finale, le programme crée le match petite finale avec initialisationPetiteFinale().
      i)	tableauxPhasesFinales est composé d’un tableau des phases finales:
Dans la première colonne, le premier affronte l’équipe en dessous et ainsi de suite. Celle des deux équipes inscrite dans la colonne suivante est la gagnante du match. On avance entre toutes les colonnes avant de retrouver le gagnant

Cette objet a la méthode resultat qui permet d’inscrire au bon endroit le gagnant. Le tableau se met donc à jour au fur et à mesure que l’on rentre les résultats.
Pour initialiser cette objet, on la méthode init1(premierTourPhasesFi, nbPoules,nbEquipes,type) qui permet de construire le tableau précédent mais vide (méthode constructionVide())
Puis init2(…) qui permet de lancer le remplissage de la première colonne. Pour cela elle trie d’abord les équipes avec selectionPhaseFinale() puis elle vérifie comment l’on souhaite s’y prendre (typeRemplissage) entre faire affronter le premier de la poule A contre le deuxième de la poule B dans la première moitié du tableau et le deuxième de la poule A contre le deuxième de la poule B dans l’autre moitié etc… (remplissageTableauPhaseFinaleParNumeroPoule())ou faire affronter le premier à la sortie des poules contre le dernier de la sortie des poules en évitant que deux équipes issues de la même poule s’affronte (on décale d’un cran)(remplissageTableauPhaseFinaleParClassementGeneral()).
Au passage cette objet est utilisé de façon indépendante pour gérer la petite finale. Elle va pour cela chercher directement les équipes qualifiées dans le premier tableau de phases finales (figure au-dessus).
l.	Calculer le classement
Une fois les phases finales finies, on peut lancer la méthode classementFinal() qui crée un objet Classement et initialise ce dernier avec la méthode init(). Le type « classement final » permet alors de calculer le classement des équipes qualifiées dans les phases finales et de fusionner ce classement à celui juste après les poules. (Appel à la fonction classementFinal()).

