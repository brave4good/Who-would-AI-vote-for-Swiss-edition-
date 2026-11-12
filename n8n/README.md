# n8n-Workflows

Das Experiment läuft in fünf n8n-Workflows. Die zentralen Code-Knoten liegen
hier als JavaScript, damit Prompt, Auswertung und Umgang mit Fehlversuchen
nachvollziehbar sind.

| Workflow | Aufgabe | Code |
| --- | --- | --- |
| Swiss WahLLM – Argumenttexte übernehmen | Übernimmt die Argumenttexte aus dem hochgeladenen PDF und prüft sie wörtlich | – |
| Swiss WahLLM – Läufe | Baut die Aufträge, fragt die acht Modelle an, prüft die Antworten und speichert jeden Lauf | [`auftraege_bauen.js`](auftraege_bauen.js), [`antwort_auswerten.js`](antwort_auswerten.js) |
| Swiss WahLLM – Auswertung | Kennzahlen je Modell und Vorlage | – |
| Swiss WahLLM – Export für GitHub | Erzeugt `responses/`, `reports/` und `data/` für dieses Repository | – |

Der Workflow «Läufe» ist wiederaufnehmbar: Jeder Start ergänzt nur, was bis zu
15 auswertbaren Läufen je Modell und Vorlage fehlt. Wichtig: Eine Etappe erst
starten, wenn die vorherige beendet ist (siehe Duplikate in
[`docs/api-experimente.md`](../docs/api-experimente.md)).
