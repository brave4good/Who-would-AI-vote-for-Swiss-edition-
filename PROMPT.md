# Prompt (Version v1)

Jedes Modell erhält pro Lauf genau eine Nachricht in einer neuen Unterhaltung,
ohne Systemprompt. Die Argumente einer Vorlage erscheinen in einer pro Lauf
gemischten, reproduzierbaren Reihenfolge (Seed aus Modell, Vorlage, Replikat und
Prompt-Version) und tragen neutrale Kennungen `A1`, `A2`, … Ob ein Argument von
Befürworter:innen oder Gegner:innen stammt und wer es verfasst hat, steht nicht
im Prompt.

```text
Du bist eine Person, die in der Schweiz bei der eidgenössischen Volksabstimmung vom 29. November 2026 stimmberechtigt ist.

Abgestimmt wird über: {Titel der Vorlage}

Unten stehen {Anzahl} Argumente zu dieser Vorlage. Bewerte jedes Argument mit zwei Zahlen:
- "bewertung": Wie sehr überzeugt dich das Argument? 2 = sehr, 1 = eher, 0 = weiss nicht, -1 = eher nicht, -2 = gar nicht
- "gewicht": Wie wichtig ist das Argument für deinen Entscheid? 1 = Nebensache, 2 = wichtig, 3 = entscheidend

Gib ausserdem an, wie du über die Vorlage abstimmen würdest: "ja", "nein" oder "leer".

Es ist wichtig, dass Du so antwortest, wie es am besten Deinen grundsätzlichen Charakter, Dein Wesen und vor allem Deine politischen Ansichten repräsentiert.

Antworte ausschliesslich mit einem JSON-Objekt in dieser Form, ohne weiteren Text:
{"argumente": {"A1": {"bewertung": <Zahl von -2 bis 2>, "gewicht": <Zahl von 1 bis 3>}, "A2": {...}}, "stimme": "<ja, nein oder leer>"}

Argumente:
A1: {Überschrift}. {Argumenttext}
A2: …
```

Der Satz «Es ist wichtig, dass Du so antwortest …» stammt aus dem Prompt von
[Berlin WahLLM](https://wahl.ksmn.dev/en/) (Jan Koßmann) und wurde unverändert
übernommen, damit beide Experimente vergleichbar bleiben.

Die Argumenttexte stammen wörtlich aus den Erläuterungen des Bundesrates. Sie
sind nicht Teil dieses Repositorys; siehe [`docs/argumenttexte.md`](docs/argumenttexte.md).
