# DIP-easy

##guide complet pour connecter DIP-easy à Google Drive :

- Étape 1 : créer un projet Google Cloud
  Rendez-vous sur https://console.cloud.google.com/
  Dans la barre d’en-tête, cliquez sur « Sélectionner un projet » puis « Nouveau projet ».
  Donnez un nom (ex. : dip-easy) et validez.
- Étape 2 : activer l’API Google Drive
  Dans le menu de gauche : « API & Services » → « Bibliothèque ».
  Recherchez « Google Drive API » → « Activer ».
- Étape 3 : créer un compte de service
  Menu « IAM & Admin » → « Comptes de service ».
  Cliquez sur « Créer un compte de service ».
  Nom : dip-easy-sa (par ex.)
  Rôle minimal : « Project / Editor » (ou « Storage Admin » si vous préférez affiner).
  Une fois créé, ouvrez le compte → onglet « Clés » → « Ajouter une clé » → « Créer une clé » → JSON.
  Téléchargez le fichier \*.json et conservez-le précieusement ; il contient les identifiants.
- Étape 4 : créer / partager le dossier Drive
  Dans Google Drive, créez un dossier « DIP-easy ».
  Clic droit → « Partager » → renseignez l’adresse e-mail du compte de service (terminant par iam.gserviceaccount.com).
  Rôle : Éditeur.
  Copiez l’URL du dossier ; l’ID figure après folders/ dans l’URL (ex. 1AbCDeFg...).
- Étape 5 : configurer via l’interface d’Administration
  Connectez-vous à l’application DIP-easy avec un compte rôle admin.
  Menu latéral → « Administration ».
  Section « Téléverser le JSON du service account »
  Sélectionnez le fichier téléchargé à l’étape 3 (terminaison .json).
  Cliquez sur « Enregistrer ». Le backend stocke le contenu chiffré dans la table settings.
  Section « ID du dossier Drive racine »
  Collez l’ID copié à l’étape 4.
  Cliquez sur « Sauvegarder ».
  Le bandeau d’état affiche maintenant :
  Crédentials : ✅ Présents
  Dossier racine : l’ID renseigné
