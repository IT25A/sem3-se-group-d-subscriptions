# Subscription Manager
A subscription manager application

Anforderungen: 
1. Das System muss verschiedene Abo-Modelle tracken können
2. Das System muss die Preise verschiedene Abo-Modelle vergleichen können
3. Das System soll dem Benutzter günstigere Abo Anbieter anzeigen
4. Der Nutzer soll zu trackende Abo-Modelle auswählen können
5. Der Benutzter soll die Möglichkeit haben, alle seine Ausgaben in S einzutragen
6. Die Ausgaben sollen über Grafiken visualisiert werden und nach Kategorieren sortieren
7. Der Benutzter soll Ausgaben aus dem S löschen können 
8. Der Benutzter soll Ausgaben bearbeiten können 
9. Der Nutzer kann eigenen Kategorien erstellen um seine Ausgaben zu gruppieren 
10. Der Nutzer soll sich über Benutzername und Passwort authentifizieren können
11. Die Authentifizierung soll nicht länger als 5 Sekunden brauchen 
12. Die Daten des Nutzers sollen in einer Datenbank gespeichert werden 
13. Die App hat vorausgewählte Kategorien für Ausgaben und Abos 
14. Die App passt sich automatisch verschiedenen Bildschirmgrößen an 
15. Es gibt verschiedene Farb-Modi die ausgewählt werden können 
16. Die App soll in Gecko, Chromium und WebKit Broswern laufen 
17. Der Nutzer soll Benachrichtigungen erhalten, wenn ein Budget-Limit überschritten wird oder eine Abo-Zahlung bevorsteht.
18. Der Nutzer kann wiederkehrende Ausgaben (z. B. monatliche Miete) als Dauerposten anlegen, sodass sie automatisch eingetragen werden.
19. Die App zeigt beim Start ein Dashboard mit den wichtigsten Kennzahlen: Monatsausgaben, aktive Abos, Budget-Status und offene Sparziele.
20. Der Nutzer soll die Möglichkeit haben sein Passwort zurückzusetzten
21. Ausgaben sollen nach Datum, Betrag und Kategorie filterbar sein.
22. Der Code soll modular aufgebaut sein, sodass einzelne Komponenten unabhängig geändert werden können.
23. Die App soll automatisierte Tests für alle kritischen Funktionen enthalten.

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
