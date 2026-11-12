# Versuchsaufbau Schritt 2: Modelle bewerten die Argumente

Durchgeführt am 12. November 2026 mit n8n und OpenRouter, nach dem Vorbild von
[Berlin WahLLM](https://wahl.ksmn.dev/en/).

## Vorlagen und Argumente

Grundlage sind die Erläuterungen des Bundesrates zur Volksabstimmung vom
29. November 2026. Pro Vorlage zählen die Argumente mit eigener
Zwischenüberschrift; einleitende und abschliessende Absätze gehören zu keinem
Argument.

| Vorlage | Ja-Seite | Nein-Seite |
| --- | --- | --- |
| AHV-Zusatzfinanzierung | 6 (Bundesrat und Parlament) | keine (obligatorische Abstimmung ohne Komitee) |
| Feuerwerksinitiative | 5 (Initiativkomitee) | 5 (Bundesrat und Parlament) |
| Ehepaarbesteuerung | 3 (Initiativkomitee) | 6 (Bundesrat und Parlament) |
| Kriegsmaterialgesetz | 4 (Bundesrat und Parlament) | 5 (Referendumskomitee) |

Die Liste mit Seitenzahlen steht in [`data/argumente.json`](../data/argumente.json).

## Modelle und Einstellungen

Alle Anfragen laufen über OpenRouter mit fest vorgegebenem Provider-Endpunkt,
ohne Fallback (`allow_fallbacks: false`), mit Zero Data Retention (`zdr: true`),
ohne Datensammlung (`data_collection: deny`) und mit
`require_parameters: true`. Jede Anfrage ist eine neue Unterhaltung ohne
Systemprompt. Reasoning wird mit `exclude: true` angefordert, gespeichert wird
nur die finale Antwort.

| Modell | OpenRouter-ID | Provider-Endpunkt | Temperatur | Reasoning | Ausgabelimit |
| --- | --- | --- | --- | --- | --- |
| Grok 4.5 | `x-ai/grok-4.5` | `xai/priority` | 0 | high | 4096 |
| Claude Sonnet 4.6 | `anthropic/claude-sonnet-4.6` | `amazon-bedrock/global` | 0 | high | 4096 |
| Gemini 3.5 Flash Lite | `google/gemini-3.5-flash-lite` | `google-vertex/global` | Provider-Default | high | 4096 |
| GPT-5.6 Terra | `openai/gpt-5.6-terra` | `azure` | Provider-Default | high | 4096 (`max_completion_tokens`) |
| Gemma 4 26B | `google/gemma-4-26b-a4b-it` | `google-vertex/global` | 0 | – | 4096 |
| Mistral Medium 3.5 | `mistralai/mistral-medium-3-5` | `mistral/zdr` | 0 | high | 16384 (siehe Abweichungen) |
| GLM 5.3 Flash | `z-ai/glm-5.3-flash` | `z-ai/fp8` | 0 | high | 4096 |
| Kimi K3 | `moonshotai/kimi-k3` | `moonshotai` (siehe Abweichungen) | Provider-Default | high | 4096 |

## Abweichungen von Berlin WahLLM

- **Kimi K3:** Der Endpunkt `moonshotai/mxfp4` war am 12.11.2026 bei OpenRouter
  nicht mehr verfügbar. Der erste Versuch ist als `http_error` dokumentiert,
  alle weiteren Läufe nutzen den Hersteller-Endpunkt `moonshotai`.
- **Mistral Medium 3.5:** Bei der Ehepaar-Vorlage schöpfte das Reasoning das
  Limit von 8192 Ausgabetokens aus (Status `truncated`). Ab 09:30 Uhr (UTC) lag
  das Limit bei 16384. Das Feld `max_tokens` je Lauf zeigt den verwendeten
  Wert. Läufe, die 8192 nicht erreichten, wären mit 16384 identisch verlaufen.
- **Gewichte und Stimme:** Zusätzlich zur Bewertung vergibt jedes Modell pro
  Argument ein Gewicht und gibt eine Stimme ab (ja, nein, leer).
- **Reihenfolge:** Die Argumente werden pro Lauf reproduzierbar gemischt. Jan
  nannte das als offene Idee für Folgeexperimente.

## Auswertung

Pro Seite wird der gewichtete Durchschnitt der Bewertungen gebildet:

```text
Seitenwert = Σ (Bewertung × Gewicht) / Σ Gewicht
Ja-Anteil  = 50 + 50 × (Seitenwert Pro − Seitenwert Contra) / 4
```

Fehlt eine Seite (AHV-Vorlage), zählt sie neutral; der Ja-Anteil liegt dann
zwischen 25 % und 75 %. Bei je 6 Argumenten ohne Gewicht ergibt die Formel
genau die Rechnung des SRF-Kompasses aus Schritt 1. Details:
[`gewichtete-auswertung.md`](gewichtete-auswertung.md).

## Auswertbarkeit

Wie bei Jan zählen nur vollständige Antworten. Pro Modell und Vorlage wurde so
lange nachgefragt, bis 15 auswertbare Läufe vorlagen.

| Status | Bedeutung | Auswertbar |
| --- | --- | --- |
| `complete_exact` | Antwort ist direkt gültiges JSON | ja |
| `complete_extracted` | JSON in Code-Block oder Begleittext, vollständig und gültig | ja |
| `neutral_only` | alle Bewertungen 0 | nein |
| `invalid` | JSON fehlt, unvollständig oder mit ungültigen Werten | nein |
| `truncated` | Ausgabelimit erreicht | nein |
| `http_error`, `api_error`, `empty` | technischer Fehler oder leere Antwort | nein |

## Duplikate durch parallele Starts

Am Vormittag liefen zwei Etappen gleichzeitig (Start 08:56 und 09:00 Uhr
Ortszeit). Beide bauten aus demselben Stand dieselben Aufträge, daher stehen
rund 100 `lauf_id`s doppelt in den Rohdaten. Die Duplikate sind echte Antworten
unter identischen Bedingungen und bleiben als Protokoll erhalten
(`duplikat: true`). Für die Auswertung zählt je `lauf_id` der erste
auswertbare Eintrag (`zaehlt_fuer_auswertung: true`).

## Kosten

Insgesamt rund 7.65 US-Dollar inklusive Fehlversuchen und Duplikaten. Den
grössten Anteil hatte Mistral Medium 3.5 mit rund 3 Dollar.
