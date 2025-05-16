# Configuration de la base de données
$env:PGPASSWORD = "postgres"
$dbName = "dip_easy"
$dbUser = "postgres"
$dbHost = "localhost"

# Commande pour afficher les utilisateurs
$query = "SELECT * FROM users;"

# Exécution de la requête
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h $dbHost -U $dbUser -d $dbName -c $query 