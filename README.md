# VerticalFarm
Deze readme geeft een korte beschrijving van de opzet van de AWS cloud server.

## Database
De database is een Microsoft SQL server. De AWS klasse is db.t3.micro met 20 GiB geheugen.
Het is belangrijk dat het wachtwoord en gebruikersnaam in AWS SecretManager staan zodat deze later gebruikt kunnen worden.

## Functies
Het .yaml bestand in de package kan gebruikt worden om de structuur van de functies voor de API gateway te laden.
De Python functie voor de MQTT client en de NodeJs functie voor de database moeten handmatig ingesteld worden.
Het is belangrijk bij de functies om de connectie met de database te definiëren op de config pagina.
