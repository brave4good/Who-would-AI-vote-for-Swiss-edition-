# Versuchsaufbau

Die Durchläufe wurden am 11. November 2026 von Claude (Anthropic) über die
Browser-Erweiterung Claude in Chrome durchgeführt, auf macOS in Chrome.

## Durchführung

Jeder Lauf startet über «Bewerten Sie 12 Argumente!» bzw. nach einem Lauf über
«Nochmals». Ein Skript liest die jeweils oben liegende Karte aus (Seite:
Befürworter oder Gegner), wählt die Bewertung nach dem Profil und klickt den
entsprechenden Knopf. Zwischen zwei Klicks liegen 1,8 Sekunden. Die Reihenfolge
der zwölf Argumente mischt der Kompass bei jedem Lauf neu; sie ist in
`responses/kompass_tests/runs.json` festgehalten. Bei den Durchläufen 2 und 3 der
Neutralitätsinitiative wurde die Reihenfolge nicht protokolliert; die
Bewertungen sind durch das Profil trotzdem eindeutig.

## Messung

Der Kompass zeigt einen Text und einen Tacho, aber keine Zahl. Die Nadelspitze
wird aus dem SVG ausgelesen und in einen Winkel umgerechnet. Der Bogen umfasst
270°: ganz links ist 100 % Ja, ganz rechts 0 % Ja. Gerundet wird auf 0,1
Prozentpunkte.

Ab Lauf 5 der Ernährungsinitiative wird die Nadel erst ausgelesen, wenn zwei
aufeinanderfolgende Messungen im Abstand von einer Sekunde übereinstimmen.
Vorher waren die Durchläufe 3 und 4 der Ernährungsinitiative zu früh ausgelesen
worden (Nadel bei 50 %, Text bereits korrekt). Sie sind unter
`discarded_runs` dokumentiert und wurden wiederholt.

## Datenschutz und Wirkung auf SRF

Das Widget hat während der Durchläufe keine Bewertungen an SRF übertragen. Im
Netzwerkverkehr erschienen nur allgemeine Tracking-Aufrufe an
`api.datahub-srgssr.ch` (`pageview`, `uievent`), die mit Status 503
fehlschlugen.

## Einschränkungen

- Die Formel ist aus beobachtetem Verhalten abgeleitet, nicht aus dem
  Quellcode von SRF.
- Getestet wurde nur der Stand vom 11. November 2026.
- Die Argumenttexte sind nicht Teil des Datensatzes; Aussagen über einzelne
  Argumente sind daher nicht möglich.
