"""Prüft die Läufe in responses/api_experiments/ gegen kompass.py und erzeugt eine Kontroll-Zusammenfassung.

Für jeden Lauf mit zaehlt_fuer_auswertung = true wird der Ja-Anteil aus den
gespeicherten Bewertungen neu berechnet und mit dem gespeicherten Wert
verglichen. Abweichungen führen zu Exit-Code 1.
"""
import csv
import json
import statistics
import sys
from pathlib import Path

from kompass import ja_anteil_gewichtet

ROOT = Path(__file__).parent


def laeufe(verzeichnis):
    for datei in sorted(verzeichnis.glob("*_v1.json")):
        daten = json.loads(datei.read_text(encoding="utf-8"))
        modell = datei.stem.removesuffix("_v1")
        for lauf in daten["runs"]:
            yield modell, lauf


def main(verzeichnis=ROOT / "responses/api_experiments", ziel=ROOT / "reports/swiss-wahllm-kontrolle.csv"):
    gruppen = {}
    abweichungen = []
    for modell, lauf in laeufe(verzeichnis):
        if not lauf.get("zaehlt_fuer_auswertung"):
            continue
        neu = round(ja_anteil_gewichtet(lauf["bewertungen"]), 1)
        if abs(neu - lauf["ja_anteil_gewichtet"]) > 0.05:
            abweichungen.append((lauf["lauf_id"], lauf["ja_anteil_gewichtet"], neu))
        gruppen.setdefault((modell, lauf["vorlage"]), []).append(lauf)

    zeilen = []
    for (modell, vorlage), liste in sorted(gruppen.items()):
        werte = [l["ja_anteil_gewichtet"] for l in liste]
        stimmen = [l["stimme"] for l in liste]
        zeilen.append({
            "modell": modell,
            "vorlage": vorlage,
            "auswertbar": len(liste),
            "ja_anteil_mittel": round(statistics.mean(werte), 1),
            "ja_anteil_median": round(statistics.median(werte), 1),
            "ja_anteil_sd": round(statistics.pstdev(werte), 1),
            "stimmen_ja": stimmen.count("ja"),
            "stimmen_nein": stimmen.count("nein"),
            "stimmen_leer": stimmen.count("leer"),
        })
    if zeilen:
        ziel.parent.mkdir(exist_ok=True)
        with open(ziel, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(zeilen[0].keys()))
            w.writeheader()
            w.writerows(zeilen)
    print(f"{sum(z['auswertbar'] for z in zeilen)} Läufe in {len(zeilen)} Gruppen geprüft, {len(abweichungen)} Abweichungen")
    for a in abweichungen[:20]:
        print("Abweichung:", a)
    return 1 if abweichungen else 0


if __name__ == "__main__":
    sys.exit(main())
