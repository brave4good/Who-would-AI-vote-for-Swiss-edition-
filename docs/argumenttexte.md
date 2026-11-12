# Argumenttexte

Die Argumenttexte stammen wörtlich aus den Erläuterungen des Bundesrates zur
Volksabstimmung vom 29. November 2026 (Bundeskanzlei). Sie stehen nicht in
diesem Repository: Die Texte der Komitees sind als deren Texte gekennzeichnet,
und das Büchlein ist frei verfügbar. [`data/argumente.json`](../data/argumente.json)
nennt zu jedem Argument Kennung, Vorlage, Seite, Quelle, Überschrift und
Seitenzahl.

## So wurden die Texte übernommen

Ein n8n-Workflow nimmt das Büchlein als PDF entgegen, liest den Text Seite für
Seite und lässt Claude Sonnet 4.6 über OpenRouter den Absatz zur jeweiligen
Überschrift heraussuchen (Endpunkt `amazon-bedrock/global`, Temperatur 0,
Zero Data Retention, ohne Datensammlung, ohne Fallback).

Eingetragen wurde nur, was Buchstabe für Buchstabe im PDF steht; Leerzeichen
und Trennstriche dürfen abweichen. Ein Absatz über einen Seitenwechsel gilt als
wörtlich, wenn sein Anfang auf der ersten Seite und sein Rest am Anfang der
Folgeseite steht. Alle 34 Texte bestanden die Prüfung (`text_pruefung` in
`data/argumente.json`). Ein Argument (KMG-C3) musste wegen eines Ratenlimits
ein zweites Mal angefragt werden.

Das extrahierende Modell beeinflusst den Inhalt nicht: Die wörtliche Prüfung
stellt sicher, dass genau der Text aus dem PDF verwendet wird.
