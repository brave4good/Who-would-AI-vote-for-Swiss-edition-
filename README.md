# Who would AI vote for? Swiss edition

Abstimmungskompasse helfen beim Sortieren von Argumenten. Doch was misst so ein
Kompass eigentlich? Und was käme heraus, wenn Sprachmodelle ihn ausfüllen? Das
wollen wir für die Schweiz herausfinden, angeregt durch Jan Koßmanns
[Berlin WahLLM](https://wahl.ksmn.dev/en/), der acht Sprachmodelle je 15-mal
den Berliner Wahl-O-Mat beantworten liess.

> **Keine Abstimmungsempfehlung:** Hier geht es darum, wie Werkzeuge und
> Modelle Bewertungen in Ergebnisse übersetzen. Die Resultate sind weder
> politische Haltungen noch eine Empfehlung für Stimmberechtigte.

## Wo stehen wir?

**Schritt 1, erledigt:** Wir haben die Rechenlogik des interaktiven
[Abstimmungskompasses von SRF](https://www.srf.ch/news/schweiz/pro-kontra-zu-den-vorlagen-interaktiver-abstimmungskompass-welche-argumente-ueberzeugen-sie-1)
zur Abstimmung vom 27. September 2026 entschlüsselt. Dafür haben wir 15
Testprofile auf beide Vorlagen angewendet, die Neutralitätsinitiative und die
Ernährungsinitiative. Macht 30 Durchläufe und 360 Klicks. Geklickt hat ein
Skript, nicht wir.

**Schritt 2, erledigt:** Acht Sprachmodelle haben die Argumente aus dem
Abstimmungsbüchlein des Bundesrates zur Abstimmung vom 29. November 2026
bewertet, je 15-mal pro Vorlage. Das sind 480 auswertbare Läufe, durchgeführt
am 12. November 2026 mit denselben Modellen und Einstellungen wie Berlin
WahLLM. Die Ergebnisse stehen unten unter «Was haben die Modelle geantwortet?».

## Wie rechnet der Kompass?

Der Kompass zeigt 12 Argumente je Vorlage, 6 von den Befürworter:innen und 6
von den Gegner:innen. Jede Bewertung zählt +2 («Sehr»), +1 («eher»), 0
(«weiss nicht»), −1 («eher nicht») oder −2 («Gar nicht»). Daraus wird:

```text
Ja-Anteil = 50 + 50 × (Σ Pro − Σ Contra) / 24
```

Über 50 % heisst es «Sie tendieren zu JA», unter 50 % «zu NEIN», bei genau
50 % «Sie sind unentschieden». Die Formel erklärt alle 30 Durchläufe ohne
Abweichung. Beide Vorlagen rechnet der Kompass identisch.

| Nr. | Profil | Pro | Contra | Neutralität | Ernährung |
| --- | --- | --- | --- | --- | --- |
| 1 | Klares Ja | ++ | −− | JA 100 % | JA 100 % |
| 2 | Klares Nein | −− | ++ | NEIN 0 % | NEIN 0 % |
| 3 | Moderates Ja | + | − | JA 75 % | JA 75 % |
| 4 | Moderates Nein | − | + | NEIN 25 % | NEIN 25 % |
| 5 | Unentschieden | ? | ? | unentschieden 50 % | unentschieden 50 % |
| 6 | Alles überzeugt | ++ | ++ | unentschieden 50 % | unentschieden 50 % |
| 7 | Nichts überzeugt | −− | −− | unentschieden 50 % | unentschieden 50 % |
| 8 | Alles «eher» | + | + | unentschieden 50 % | unentschieden 50 % |
| 9 | Ja mit Verständnis für die Gegenseite | ++ | + | JA 62,5 % | JA 62,5 % |
| 10 | Nein mit Verständnis für die Gegenseite | + | ++ | NEIN 37,5 % | NEIN 37,5 % |
| 11 | Nur Pro-Seite überzeugt | ++ | ? | JA 75 % | JA 75 % |
| 12 | Nur Contra-Seite überzeugt | ? | ++ | NEIN 25 % | NEIN 25 % |
| 13 | Knappster Ja-Ausschlag | ein +, sonst ? | ? | JA 52,1 % | JA 52,1 % |
| 14 | Knappster Nein-Ausschlag | ? | ein +, sonst ? | NEIN 47,9 % | NEIN 47,9 % |
| 15 | Zufall (Seed 42) | zufällig | zufällig | JA 64,6 % | NEIN 27,1 % |

++ Sehr · + eher · ? weiss nicht · − eher nicht · −− Gar nicht

## Was fällt beim SRF-Kompass auf?

- **Der Kompass misst den Saldo, nicht die Überzeugung.** «Alles überzeugt»,
  «nichts überzeugt», «alles eher» und «weiss nicht» landen alle bei
  «unentschieden».
- **Ein einziges «eher» kippt die Anzeige.** Bei sonst neutralen Antworten
  zeigt der Kompass dann eine Tendenz, obwohl die Nadel nur 2,1
  Prozentpunkte ausschlägt.
- **Der Text kennt drei Stufen.** 52 % und 100 % lauten beide
  «Sie tendieren zu JA». Den Unterschied zeigt nur die Nadel.
- **Jedes Argument zählt gleich viel.** Die Reihenfolge mischt der Kompass
  bei jedem Durchlauf neu; sie ändert das Ergebnis nicht.

Für Schritt 2 heisst das: Ein Modell, das allen Argumenten höflich zustimmt,
erscheint als «unentschieden». Diese Antworten werten wir deshalb getrennt aus,
statt sie im Mittelwert verschwinden zu lassen.

## Gewicht vor Anzahl

Für Schritt 2 nutzen wir die Argumente aus dem Abstimmungsbüchlein des
Bundesrates. Dort haben die Seiten nicht gleich viele Argumente: Bei der
Ehepaarbesteuerung etwa 3 gegen 6. Eine Summe würde die Seite mit mehr
Argumenten bevorzugen. Deshalb bekommt jedes Argument zusätzlich ein Gewicht
von 1 («Nebensache») bis 3 («entscheidend»), und wir vergleichen den
gewichteten Durchschnitt beider Seiten:

```text
Seitenwert = Σ (Bewertung × Gewicht) / Σ Gewicht
Ja-Anteil  = 50 + 50 × (Seitenwert Pro − Seitenwert Contra) / 4
```

So zählt, wie stark und wie wichtig die Argumente sind, nicht wie viele es
gibt. Bei 6 gegen 6 Argumenten ohne Gewicht ergibt sich genau die SRF-Formel.
Details und Beispiele stehen in
[`docs/gewichtete-auswertung.md`](docs/gewichtete-auswertung.md).

## Was haben die Modelle geantwortet?

Jedes Modell hat zu jeder Vorlage alle Argumente bewertet (−2 bis +2),
gewichtet (1 bis 3) und eine Stimme abgegeben. Die Tabelle zeigt den mittleren
gewichteten Ja-Anteil aus 15 Läufen und in Klammern, wie oft das Modell «ja»
gestimmt hat.

| Modell | AHV | Feuerwerk | Ehepaar | Kriegsmaterial |
| --- | --- | --- | --- | --- |
| Gemini 3.5 Flash Lite | 72 % (15) | 81 % (13) | 20 % (1) | 82 % (13) |
| Gemma 4 26B | 63 % (11) | 78 % (14) | 60 % (3) | 69 % (5) |
| GLM 5.3 Flash | 71 % (15) | 85 % (15) | 20 % (0) | 30 % (2) |
| GPT-5.6 Terra | 65 % (15) | 86 % (15) | 17 % (0) | 40 % (0) |
| Grok 4.5 | 60 % (8) | 23 % (0) | 21 % (2) | 82 % (13) |
| Kimi K3 | 68 % (14) | 80 % (15) | 30 % (0) | 56 % (8) |
| Mistral Medium 3.5 | 71 % (15) | 76 % (15) | 66 % (1) | 22 % (0) |
| Claude Sonnet 4.6 | 68 % (15) | 32 % (0) | 40 % (0) | 28 % (1) |

Bei der AHV-Vorlage enthält das Büchlein keine Argumente der Gegenseite. Der
Ja-Anteil kann dort höchstens 75 % erreichen.

Was uns auffällt:

- **Kompass und Stimme passen nicht immer zusammen.** Mistral kommt bei der
  Ehepaar-Vorlage im Kompass auf 66 % Ja, stimmt aber 14-mal «nein». Ähnlich,
  schwächer, bei Gemma (Kriegsmaterial, Ehepaar) und Sonnet (Ehepaar). Bei
  allen anderen Kombinationen passen Kompass und Stimme in 73 bis 100 % der
  Läufe.
- **Manche Modelle schwanken stark.** Gemini, Kimi und Grok beim
  Kriegsmaterialgesetz und Grok bei der Ehepaar-Vorlage landen mal klar bei
  Ja, mal klar bei Nein (Standardabweichung 27 bis 33 Prozentpunkte). Ein
  Mittelwert allein beschreibt das schlecht; die Rohdaten zeigen die Verteilung.
- **Die Modelle sind sich nicht einig.** Bei der AHV-Vorlage liegen alle im
  Ja-Bereich, bei den anderen drei Vorlagen gehen sie auseinander.

Die Zahlen beschreiben das Antwortverhalten unter genau diesem Prompt. Eine
andere Formulierung, ein Systemprompt oder eine Persona können zu anderen
Ergebnissen führen. Aufbau, Einstellungen und Abweichungen von Berlin WahLLM
stehen in [`docs/api-experimente.md`](docs/api-experimente.md), der Prompt in
[`PROMPT.md`](PROMPT.md).

## Was liegt im Repository?

Schritt 2, Modelle bewerten Argumente:

- [`PROMPT.md`](PROMPT.md): der Prompt in Version v1.
- [`docs/api-experimente.md`](docs/api-experimente.md): Modelle, Einstellungen,
  Abweichungen von Berlin WahLLM, Status der Läufe, Duplikate und Kosten.
- [`docs/argumenttexte.md`](docs/argumenttexte.md): wie die Argumenttexte aus
  dem Büchlein übernommen und wörtlich geprüft wurden.
- [`data/argumente.json`](data/argumente.json): die 34 Argumente mit Seite,
  Quelle, Überschrift und Seitenzahl, ohne Texte.
- [`responses/api_experiments/`](responses/api_experiments/): je Modell die
  Einstellungen und alle Versuche, inklusive Fehlversuche und Duplikate.
- [`reports/`](reports/): Kennzahlen je Modell und Vorlage
  (`swiss-wahllm-summary.json/.csv`) und je Argument
  (`swiss-wahllm-argumente.csv`).
- [`n8n/`](n8n/): die zentralen Code-Knoten der n8n-Workflows.
- [`analyze_api_experiments.py`](analyze_api_experiments.py): rechnet jeden
  gezählten Lauf aus seinen Bewertungen nach und prüft die gespeicherten Werte.

Schritt 1, SRF-Kompass:

- [`responses/kompass_tests/runs.json`](responses/kompass_tests/runs.json):
  Manifest und alle 30 Durchläufe, dazu zwei verworfene mit Begründung.
- [`docs/kompass-testprofile.md`](docs/kompass-testprofile.md) und
  [`docs/kompass-versuchsaufbau.md`](docs/kompass-versuchsaufbau.md): Profile,
  Durchführung und Grenzen des Tests.
- [`docs/gewichtete-auswertung.md`](docs/gewichtete-auswertung.md): die
  gewichtete Auswertung, die Schritt 2 verwendet.
- [`kompass.py`](kompass.py) und
  [`analyze_kompass_tests.py`](analyze_kompass_tests.py): Rechenlogik und
  Auswertung.

## Selbst nachrechnen

Du brauchst Python 3.11 oder neuer, sonst nichts.

```shell
python3 -m unittest
python3 analyze_kompass_tests.py
python3 analyze_api_experiments.py
```

Die Tests prüfen, dass je Vorlage 15 Durchläufe mit je 6 Pro- und 6
Contra-Argumenten vorliegen, dass die Formel jede beobachtete Anzeige
erklärt und dass die gewichtete Auswertung bei 6 gegen 6 Argumenten dasselbe
ergibt wie die SRF-Formel. `analyze_api_experiments.py` rechnet jeden
gezählten Modelllauf aus seinen Bewertungen nach und meldet jede Abweichung
vom gespeicherten Ja-Anteil.

## Quelle und Abgrenzung

Schritt 2 stützt sich auf die Erläuterungen des Bundesrates zur Abstimmung vom
29. November 2026. Die Argumenttexte sind nicht Teil dieses Repositorys.
Methode und Modellauswahl folgen [Berlin WahLLM](https://wahl.ksmn.dev/en/)
von Jan Koßmann. Das Projekt ist unabhängig und weder von ihm noch von der
Bundeskanzlei unterstützt.

### Schritt 1

Grundlage ist der Abstimmungskompass von SRF, veröffentlicht am 12.09.2026.
Die Argumenttexte gehören SRF und stehen nicht in diesem Repository; wir
erfassen nur Seite (Befürworter:innen oder Gegner:innen) und Bewertung. Die
Durchläufe fanden am 11.11.2026 statt, nach der Abstimmung.

Dieses Projekt ist unabhängig. SRF hat es weder erstellt, beauftragt noch
unterstützt. Während der Tests hat das Widget keine Bewertungen an SRF
übertragen; die Durchläufe verzerren also keine Statistik.

## Lizenz

Der Code steht unter der [MIT-Lizenz](LICENSE).

## Mitdenken

Du hast eine Idee für ein Folgeexperiment, etwa einen anderen Prompt, weitere
Modelle oder die nächste Abstimmung? Oder dir fällt in den Daten etwas auf, das
wir übersehen haben? Eröffne ein Issue. Wir freuen uns auf den Austausch.
