# Gewichtete Auswertung: Gewicht vor Anzahl

Der SRF-Kompass addiert alle Bewertungen. Das funktioniert, solange beide
Seiten gleich viele Argumente haben. Im Abstimmungsbüchlein des Bundesrates
zum 29. November 2026 ist das nicht so: Bei der Ehepaarbesteuerung stehen 3
Argumente des Initiativkomitees 6 Argumenten von Bundesrat und Parlament
gegenüber. Mit einer Summe gewinnt rechnerisch die Seite mit mehr Argumenten.
Deshalb rechnen wir für Schritt 2 anders.

## So rechnen wir

Jedes Argument bekommt zwei Werte:

| Wert | Skala |
| --- | --- |
| Bewertung | +2 «Sehr», +1 «eher», 0 «weiss nicht», −1 «eher nicht», −2 «Gar nicht» |
| Gewicht | 1 «Nebensache», 2 «wichtig», 3 «entscheidend» |

Pro Seite bilden wir den gewichteten Durchschnitt:

```text
Seitenwert = Σ (Bewertung × Gewicht) / Σ Gewicht        (Bereich −2 bis +2)
Ja-Anteil  = 50 + 50 × (Seitenwert Pro − Seitenwert Contra) / 4
```

Drei Eigenschaften:

- **Die Anzahl zählt nicht.** Drei Argumente mit «eher» wiegen gleich viel wie
  sechs Argumente mit «eher».
- **Das Gewicht zählt.** Ein entscheidendes Argument zählt dreimal so viel wie
  eine Nebensache derselben Seite.
- **Rückwärts verträglich.** Bei 6 gegen 6 Argumenten und Gewicht 1 ergibt die
  Formel exakt die SRF-Rechnung. Ein Test prüft das an allen 30 Durchläufen.

## Zwei Beispiele

**Ungleich viele Argumente.** Jemand findet alle 3 Pro- und alle 6
Contra-Argumente «eher» überzeugend. Eine auf das Maximum normierte Summe
ergibt 41,7 % und damit «NEIN». Die gewichtete Auswertung ergibt 50 % und damit
«unentschieden», was der Haltung entspricht.

**Ein Argument gibt den Ausschlag.** Jemand findet ein Pro-Argument «Sehr»
überzeugend und entscheidend (Gewicht 3), die anderen drei Pro-Argumente
«weiss nicht», alle fünf Contra-Argumente «eher». Ohne Gewicht ergibt das
43,8 % (NEIN). Mit Gewicht wiegt das entscheidende Argument die Gegenseite auf:
50 %.

## Sonderfall: eine Seite fehlt

Bei der AHV-Zusatzfinanzierung enthält das Büchlein nur Argumente von
Bundesrat und Parlament; die Gegenseite ist nur als kurzer Standpunkt der
Parlamentsminderheit vertreten. Eine fehlende Seite zählt neutral (0). Das
Ergebnis reicht dann von 25 % bis 75 % statt von 0 % bis 100 %. Wir weisen
solche Vorlagen in der Auswertung gesondert aus.

## Grenzen

- Die Gewichte sind eine eigene Erweiterung. Der SRF-Kompass kennt sie nicht.
- Ein hohes Gewicht auf «weiss nicht» zieht den Seitenwert Richtung 0. Das ist
  gewollt: Wer ein Argument für entscheidend, aber unklar hält, ist auf dieser
  Seite unsicher.
- Wie gut Sprachmodelle Gewichte vergeben, ist offen. Das untersuchen wir in
  Schritt 2.
