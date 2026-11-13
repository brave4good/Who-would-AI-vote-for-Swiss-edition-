# Who would AI vote for? Swiss edition

Wie würden Sprachmodelle über Schweizer Vorlagen abstimmen? Und wie viel
Unsicherheit steckt hinter einer scheinbar klaren KI-Antwort? Angeregt durch
Jan Koßmanns [Berlin WahLLM](https://wahl.ksmn.dev/en/), der acht Sprachmodelle
je 15-mal den Berliner Wahl-O-Mat beantworten liess, haben wir dieselben acht
Modelle die Argumente zur eidgenössischen Volksabstimmung vom 29. November 2026
bewerten lassen.

> **Keine Abstimmungsempfehlung:** Hier geht es darum, wie Modelle Argumente
> bewerten und daraus eine Stimme ableiten. Die Resultate sind weder politische
> Haltungen noch eine Empfehlung für Stimmberechtigte.

Die Ergebnisse als Website mit Grafiken:
[Deutsch](https://brave4good.com/llms-ueberraschende-wahl/) ·
[English](https://brave4good.com/llms-surprising-choice/)

## Worum es geht

Acht Sprachmodelle haben die Argumente aus dem Abstimmungsbüchlein des
Bundesrates zu allen vier Vorlagen bewertet, je 15-mal pro Vorlage und jedes Mal
in einer neuen Unterhaltung. Pro Argument gaben sie an, wie sehr es sie
überzeugt und wie wichtig es ihnen ist, am Ende ihre Stimme. Das sind 480
auswertbare Läufe, durchgeführt am 12. November 2026 mit denselben Modellen und
Einstellungen wie Berlin WahLLM. Alle Modellaufrufe zusammen kosteten rund 7.65
US-Dollar.

## Wie wir rechnen: Gewicht vor Anzahl

Aus den Bewertungen eines Laufs berechnen wir einen Ja-Anteil. Im
Abstimmungsbüchlein haben die Seiten nicht gleich viele Argumente, bei der
Ehepaarbesteuerung etwa 3 gegen 6. Eine Summe würde die Seite mit mehr
Argumenten bevorzugen. Deshalb bekommt jedes Argument zusätzlich ein Gewicht
von 1 («Nebensache») bis 3 («entscheidend»), und wir vergleichen den
gewichteten Durchschnitt beider Seiten:

```text
Seitenwert = Σ (Bewertung × Gewicht) / Σ Gewicht
Ja-Anteil  = 50 + 50 × (Seitenwert Pro − Seitenwert Contra) / 4
```

Über 50 % liegt ein Lauf im Ja-Bereich, unter 50 % im Nein-Bereich. So zählt,
wie stark und wie wichtig die Argumente sind, nicht wie viele es gibt. Details
und Beispiele stehen in
[`docs/gewichtete-auswertung.md`](docs/gewichtete-auswertung.md).

## Was haben die Modelle geantwortet?

Jedes Modell hat zu jeder Vorlage alle Argumente bewertet (−2 bis +2),
gewichtet (1 bis 3) und eine Stimme abgegeben. Die Tabelle zeigt den mittleren
Ja-Anteil aus 15 Läufen und in Klammern die abgegebenen Stimmen.

| Modell | AHV | Feuerwerk | Ehepaar | Kriegsmaterial |
| --- | --- | --- | --- | --- |
| Gemini 3.5 Flash Lite | 72 % (15 Ja, 0 Nein) | 81 % (13 Ja, 2 Nein) | 20 % (1 Ja, 14 Nein) | 82 % (13 Ja, 2 Nein) |
| Gemma 4 26B | 63 % (11 Ja, 4 Nein) | 78 % (14 Ja, 1 Nein) | 60 % (3 Ja, 12 Nein) | 69 % (5 Ja, 10 Nein) |
| GLM 5.3 Flash | 71 % (15 Ja, 0 Nein) | 85 % (15 Ja, 0 Nein) | 20 % (0 Ja, 15 Nein) | 30 % (2 Ja, 13 Nein) |
| GPT-5.6 Terra | 65 % (15 Ja, 0 Nein) | 86 % (15 Ja, 0 Nein) | 17 % (0 Ja, 15 Nein) | 40 % (0 Ja, 13 Nein, 2 leer) |
| Grok 4.5 | 60 % (8 Ja, 7 Nein) | 23 % (0 Ja, 15 Nein) | 21 % (2 Ja, 13 Nein) | 82 % (13 Ja, 2 Nein) |
| Kimi K3 | 68 % (14 Ja, 1 Nein) | 80 % (15 Ja, 0 Nein) | 30 % (0 Ja, 15 Nein) | 56 % (8 Ja, 7 Nein) |
| Mistral Medium 3.5 | 71 % (15 Ja, 0 Nein) | 76 % (15 Ja, 0 Nein) | 66 % (1 Ja, 14 Nein) | 22 % (0 Ja, 15 Nein) |
| Claude Sonnet 4.6 | 68 % (15 Ja, 0 Nein) | 32 % (0 Ja, 15 Nein) | 40 % (0 Ja, 15 Nein) | 28 % (1 Ja, 14 Nein) |

Bei der AHV-Zusatzfinanzierung liegen alle acht Modelle im Ja-Bereich. Bei den
drei anderen Vorlagen gehen sie auseinander: Bei der Feuerwerksinitiative
stehen sechs Modelle im Ja-Bereich und zwei im Nein-Bereich, bei der
Ehepaar-Initiative zwei im Ja- und sechs im Nein-Bereich, beim
Kriegsmaterialgesetz je vier. Bei der AHV-Vorlage enthält das Büchlein keine
Argumente der Gegenseite, der Ja-Anteil kann dort höchstens 75 % erreichen.

## Bewertung und Stimme sind nicht dasselbe

In jedem Lauf gibt ein Modell zwei Dinge ab: Bewertungen der Argumente, aus
denen wir den Ja-Anteil berechnen, und eine Stimme. Passen die beiden zusammen?

**Das erwartbare Bild:** In 27 von 32 Kombinationen aus Modell und Vorlage
passen Ja-Anteil und Stimme in mindestens drei von vier Läufen zusammen, bei 19
sogar in allen 15. Wer die Ja-Argumente überzeugender findet, stimmt Ja, wer die
Nein-Argumente überzeugender findet, stimmt Nein.

**Das Überraschende:** Bei fünf Kombinationen gehen Bewertung und Stimme
auffällig oft auseinander. Meist zeigt der Ja-Anteil dabei Ja, und das Modell
stimmt trotzdem Nein.

| Modell | Vorlage | Ja-Anteil im Mittel | Stimmen | Passt in |
| --- | --- | --- | --- | --- |
| Mistral Medium 3.5 | Ehepaar-Initiative | 66 % | 1 Ja, 14 Nein | 5 von 15 Läufen |
| Gemma 4 26B | Kriegsmaterialgesetz | 69 % | 5 Ja, 10 Nein | 8 von 15 Läufen |
| Gemma 4 26B | Ehepaar-Initiative | 60 % | 3 Ja, 12 Nein | 9 von 15 Läufen |
| Claude Sonnet 4.6 | Ehepaar-Initiative | 40 % | 0 Ja, 15 Nein | 10 von 15 Läufen |
| Gemma 4 26B | AHV-Zusatzfinanzierung | 63 % | 11 Ja, 4 Nein | 11 von 15 Läufen |

Warum das so ist, können wir aus den Daten nicht sicher sagen. Eine plausible
Erklärung: Ein Modell findet einzelne Argumente einleuchtend, gewichtet am Ende
aber etwas anderes, das im Büchlein gar nicht als Argument steht.

## Einmal fragen ist eine Anekdote

Jedes Modell hat jede Vorlage 15-mal bekommen, mit identischer Frage und neu
gemischter Reihenfolge der Argumente. Hohe Ja-Anteile heissen Ja, tiefe Nein,
50 % ist unentschieden.

**Das erwartbare Bild:** Ein Teil der Modelle antwortet sehr stabil. GLM 5.3
Flash liegt bei der AHV-Vorlage in allen Läufen zwischen 68 und 73 %, GPT-5.6
Terra bei der Feuerwerksinitiative zwischen 83 und 89 %.

**Das Überraschende:** Bei 10 von 32 Kombinationen liegen mehr als 60
Prozentpunkte zwischen dem tiefsten und dem höchsten Lauf. Dasselbe Modell
bewertet dieselben Argumente mal klar als Nein und mal klar als Ja.

| Modell | Vorlage | Spanne des Ja-Anteils | Stimmen |
| --- | --- | --- | --- |
| Gemini 3.5 Flash Lite | Kriegsmaterialgesetz | 4 bis 99 % | 13 Ja, 2 Nein |
| Kimi K3 | Kriegsmaterialgesetz | 10 bis 97 % | 8 Ja, 7 Nein |
| Grok 4.5 | Ehepaar-Initiative | 2 bis 91 % | 2 Ja, 13 Nein |
| Mistral Medium 3.5 | Ehepaar-Initiative | 19 bis 94 % | 1 Ja, 14 Nein |

## Das wichtigste Learning

**Eine klare Antwort ist noch keine klare Haltung.** Am Ende gibt jedes Modell
ein klares Ja oder Nein ab. Die Bewertungen dahinter sind oft deutlich
vielfältiger: Kimi K3 bewertete das Kriegsmaterialgesetz in 15 Läufen zwischen
10 und 97 % Ja und stimmte 8-mal Ja und 7-mal Nein.

Wenn wir mit KI arbeiten, sehen wir meist nur eine einzige Antwort. Sie ist ein
Punkt aus einem ganzen Ergebnisraum, nicht das ganze Bild. KI-Antworten klingen
oft eindeutiger, als sie sind. Darum lohnt es sich, Ergebnisse relativ zu lesen:
mehrmals fragen, die Begründung von der Schlussfolgerung trennen und vorsichtig
bleiben, wenn etwas sehr bestimmt klingt.

## Was dieses Experiment nicht zeigt

- **Keine Empfehlung.** Die Ergebnisse sagen nichts darüber, wie jemand
  abstimmen sollte. Sie zeigen, wie Modelle unter einer bestimmten Anweisung
  antworten.
- **Ein Prompt, eine Sprache.** Alle Fragen liefen auf Deutsch, ohne
  Systemprompt und ohne Persona. Eine andere Formulierung kann zu anderen
  Ergebnissen führen.
- **Ungleiche Vorlagen.** Bei der AHV-Vorlage fehlen im Büchlein die Argumente
  der Gegenseite, und die Zahl der Argumente pro Seite schwankt zwischen 3 und
  6. Die Rechnung gleicht das aus, ganz verschwindet es nicht.
- **Momentaufnahme.** Die Läufe stammen vom 12. November 2026. Modelle und
  Anbieter ändern sich laufend.
- **Zwei Abweichungen von Berlin WahLLM.** Kimi K3 lief über einen anderen
  Anbieter-Zugang, und Mistral Medium 3.5 bekam ein höheres Ausgabelimit.
  Beides ist in [`docs/api-experimente.md`](docs/api-experimente.md)
  dokumentiert.

Aufbau, Einstellungen und Abweichungen stehen in
[`docs/api-experimente.md`](docs/api-experimente.md), der Prompt in
[`PROMPT.md`](PROMPT.md).

## Was liegt im Repository?

- [`PROMPT.md`](PROMPT.md): der Prompt in Version v1.
- [`docs/api-experimente.md`](docs/api-experimente.md): Modelle, Einstellungen,
  Abweichungen von Berlin WahLLM, Status der Läufe, Duplikate und Kosten.
- [`docs/gewichtete-auswertung.md`](docs/gewichtete-auswertung.md): wie aus den
  Bewertungen ein Ja-Anteil wird, mit Beispielen.
- [`docs/argumenttexte.md`](docs/argumenttexte.md): wie die Argumenttexte aus
  dem Büchlein übernommen und wörtlich geprüft wurden.
- [`data/argumente.json`](data/argumente.json): die 34 Argumente mit Seite,
  Quelle, Überschrift und Seitenzahl, ohne Texte.
- [`responses/api_experiments/`](responses/api_experiments/): je Modell die
  Einstellungen und alle Versuche, inklusive Fehlversuche und Duplikate.
- [`reports/`](reports/): Kennzahlen je Modell und Vorlage
  (`swiss-wahllm-summary.json/.csv`) und je Argument
  (`swiss-wahllm-argumente.csv`).
- [`kompass.py`](kompass.py): die Rechenregel für den gewichteten Ja-Anteil.
- [`analyze_api_experiments.py`](analyze_api_experiments.py): rechnet jeden
  gezählten Lauf aus seinen Bewertungen nach und prüft die gespeicherten Werte.
- [`n8n/`](n8n/): die zentralen Code-Knoten der n8n-Workflows.

## Selbst nachrechnen

Du brauchst Python 3.11 oder neuer, sonst nichts.

```shell
python3 -m unittest
python3 analyze_api_experiments.py
```

Die Tests prüfen die Rechenregel: Extremwerte, dass die Anzahl der Argumente
keine Rolle spielt, dass Gewichte wirken und dass eine fehlende Seite neutral
zählt. `analyze_api_experiments.py` rechnet jeden gezählten Modelllauf aus
seinen Bewertungen nach und meldet jede Abweichung vom gespeicherten Ja-Anteil.

## Quelle und Abgrenzung

Grundlage sind die Erläuterungen des Bundesrates zur Abstimmung vom
29. November 2026. Die Argumenttexte sind nicht Teil dieses Repositorys.
Methode und Modellauswahl folgen [Berlin WahLLM](https://wahl.ksmn.dev/en/)
von Jan Koßmann. Das Projekt ist unabhängig und weder von ihm noch von der
Bundeskanzlei unterstützt.

## Lizenz

Der Code steht unter der [MIT-Lizenz](LICENSE).

## Mitdenken

Du hast eine Idee für ein Folgeexperiment, etwa einen anderen Prompt, weitere
Modelle oder die nächste Abstimmung? Oder dir fällt in den Daten etwas auf, das
wir übersehen haben? Eröffne ein Issue. Wir freuen uns auf den Austausch.
