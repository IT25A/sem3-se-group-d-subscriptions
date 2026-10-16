# Subscription Manager
A subscription manager application

# Anforderungen: 
Alle Technologische RB
MUSS:
1. Das System muss verschiedene Abo-Modelle tracken können: FN; Systemanforderung
2. Das System muss die Preise verschiedene Abo-Modelle vergleichen können: FN; Systemanforderung
3. Der Benutzter muss Ausgaben aus dem System löschen, eintragen und bearbeiten können: FN; Benutzeranforderung 
4. Der Benutzer muss sich über Benutzername und Passwort authentifizieren können: FN; Benutzeranforderung
5. Die Daten des Nutzers müssen sicher in einer Datenbank gespeichert werden: NFN; Qualitätsanforderung; Moralische RB
6. Die App muss in Gecko, Chromium und WebKit Broswern laufen: NFN; Domänenanforderung
7. Die App muss beim Start ein Dashboard mit den wichtigsten Kennzahlen: Monatsausgaben, aktive Abos, Budget-Status und offene Sparziele zeigen: FN; Systemanforderung 
8. Der Code muss modular aufgebaut sein, sodass einzelne Komponenten unabhängig geändert werden können: NFN; Systemanforderung
9. Die App muss automatisierte Tests für alle kritischen Funktionen enthalten: NFN; Systemanforderung

SOLL:
10. Das System soll dem Benutzter günstigere Abo Anbieter anzeigen: FN; Benutzeranforderung; Moralische RB
11. Die Ausgaben sollen über Grafiken visualisiert werden und nach Kategorieren sortieren: FN; Systemanforderung
12. Der Nutzer soll eigenen Kategorien erstellen können um seine Ausgaben zu gruppieren: FN; Benutzeranforderung
13. Die Authentifizierung soll nicht länger als 5 Sekunden brauchen: NFN; Qualitätsanforderung
14. Die App soll vorausgewählte Kategorien für Ausgaben und Abos haben: FN; Systemanforderung
15. Die App soll sich automatisch verschiedenen Bildschirmgrößen anpassen: NFN; Qualitätsanforderung
16. Der Benutzer soll Benachrichtigungen erhalten, wenn ein Budget-Limit überschritten wird oder eine Abo-Zahlung bevorsteht: FN; Benutzeranforderung
17. Der Benutzer soll  wiederkehrende Ausgaben (z. B. monatliche Miete) als Dauerposten anlegen können, sodass sie automatisch eingetragen werden: FN; Benutzeranforderung
18. Ausgaben sollen nach Datum, Betrag und Kategorie filterbar sein: FN; Benutzeranforderung

WIRD:
19. Es wird verschiedene Farb-Modi die ausgewählt werden können geben: FN; Benutzeranforderung
20. Der Nutzer wird die Möglichkeit haben sein Passwort zurückzusetzten: FN; Benutzeranforderung 

# Qualitätskontrolle - Tests 
1. Anmeldung:
    - Test User anlegen
    - eine Anmeldung durchführen 
    - Dafür: Daten Speicherung 
2. Abo-Angabe:
    - Anlegbar sein 
    - CRUD
    - Daten Speicherung 
3. Abo-Vergleich: 
    - Abos zugreifen 
    - Daten aus Web ziehen 
    - Mathematik validieren
4. Webscraper: 
    - Daten aus Web ziehen 
    - Response überprüfen
    --> Inhalt egal, nur Funktion testbar
5. Filterbare Ausgabe -> nach Kategorien 
    - Test Ausagben ertsellen 
    - Prüfung richtiger Zuordnung 
