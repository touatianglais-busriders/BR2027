# Busriders · maquette de réservation (démo visuelle)

Site statique (HTML/CSS/JS, aucune installation) qui montre le parcours de réservation repensé :
Sorties → Mes choix → Paiement → Mon billet, sur téléphone et sur ordinateur, avec 3 chartes
au choix (bandeau noir en haut de page) : **Bleu nuit**, **Quai 4H**, **Plein cadre**.

**C'est une maquette.** Aucun paiement réel, aucun produit, aucune donnée enregistrée ou envoyée
(tout reste dans le navigateur de la personne). Le QR du billet est un dessin d'exemple, non scannable.
Les valeurs `[X]`, `[À compléter…]`, `[Écrire à l'association]` sont des emplacements à renseigner.

## Voir la maquette en local
Ouvrir `index.html` dans un navigateur (double-clic). Les polices viennent de Google Fonts :
il faut une connexion internet pour qu'elles s'affichent.

## Mettre en ligne avec GitHub Pages (gratuit)
1. Sur github.com : **New repository**, nom `busriders-demo`, visibilité **Public**
   (GitHub Pages gratuit n'est disponible que pour les dépôts publics ; le contenu ne contient
   aucune donnée sensible).
2. Dans le dépôt : **Add file → Upload files**, glisser le contenu du dossier
   (`index.html`, `css/`, `js/`, `README.md`) puis **Commit changes**.
3. **Settings → Pages**. Sous *Build and deployment* : *Source* = **Deploy from a branch**,
   *Branch* = **main**, dossier **/ (root)**, puis **Save**.
4. Attendre 1 à 2 minutes. L'adresse apparaît en haut de la page Pages :
   `https://VOTRE-IDENTIFIANT.github.io/busriders-demo/`
5. Pour ouvrir directement une charte : ajouter `?charte=quai` (ou `nuit`, `cadre`) à l'adresse.

Pour mettre à jour : modifier un fichier sur GitHub (icône crayon) et **Commit changes** ; le site
se met à jour en 1 à 2 minutes.

## Ce qui est à confirmer avant de s'en servir comme référence
- Prix : 73 € (avec forfait) vient du visuel d'annonce ; 45 € (sans forfait) et +4 € (assurance)
  viennent de la boutique actuelle ; 265 € (week-ends) vient de la boutique actuelle.
- Dans la démo, la sortie du 28 novembre est affichée comme ouverte, les week-ends comme « bientôt ».
- Seuil de départ `[X]`, lieux de RDV des week-ends, déroulé, contacts : non renseignés.
