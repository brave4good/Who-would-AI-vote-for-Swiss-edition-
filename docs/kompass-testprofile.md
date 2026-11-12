# Antwortprofile

Jedes Profil legt fest, wie Argumente der Befürworter (Pro) und der Gegner
(Contra) bewertet werden. Dasselbe Profil wurde auf beide Vorlagen angewendet.
Skala: Sehr (+2), eher (+1), weiss nicht (0), eher nicht (−1), Gar nicht (−2).

| Nr. | Profil | Pro-Argumente | Contra-Argumente | Zweck |
| --- | --- | --- | --- | --- |
| 1 | Klares Ja | Sehr | Gar nicht | oberes Extrem |
| 2 | Klares Nein | Gar nicht | Sehr | unteres Extrem |
| 3 | Moderates Ja | eher | eher nicht | Linearität |
| 4 | Moderates Nein | eher nicht | eher | Linearität, gespiegelt |
| 5 | Unentschieden | weiss nicht | weiss nicht | Nullpunkt |
| 6 | Alles überzeugt | Sehr | Sehr | Saldo statt Stärke? |
| 7 | Nichts überzeugt | Gar nicht | Gar nicht | Saldo statt Stärke? |
| 8 | Alles «eher» | eher | eher | Saldo statt Stärke? |
| 9 | Ja mit Verständnis für Gegner | Sehr | eher | Abzug der Gegenseite |
| 10 | Nein mit Verständnis für Befürworter | eher | Sehr | Abzug, gespiegelt |
| 11 | Nur Pro-Seite überzeugt | Sehr | weiss nicht | einseitige Wertung |
| 12 | Nur Contra-Seite überzeugt | weiss nicht | Sehr | einseitige Wertung, gespiegelt |
| 13 | Knappster Ja-Ausschlag | erstes angezeigtes Pro-Argument «eher», sonst weiss nicht | weiss nicht | Schwelle der Textanzeige |
| 14 | Knappster Nein-Ausschlag | weiss nicht | erstes angezeigtes Contra-Argument «eher», sonst weiss nicht | Schwelle, gespiegelt |
| 15 | Zufall | zufällig | zufällig | Gegenprobe |

Profil 15 nutzt einen linearen Kongruenzgenerator
(`seed = (seed × 1103515245 + 12345) mod 2³¹`, Startwert 42) und
`floor(seed / 2³¹ × 5)` als Index auf die Skala von «Sehr» bis «Gar nicht».
Die Ernährungsinitiative nutzt die Fortsetzung derselben Zahlenfolge.
