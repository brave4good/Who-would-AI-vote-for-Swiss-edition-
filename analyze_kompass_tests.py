"""Erzeugt reports/kompass-tests-summary.json und reports/kompass-tests-summary.csv aus responses/kompass_tests/runs.json."""
import csv
import json
from pathlib import Path

from kompass import anzeige, bewertungen_eines_laufs, ja_anteil, saldo

ROOT = Path(__file__).parent


def main():
    data = json.loads((ROOT / "responses/kompass_tests/runs.json").read_text(encoding="utf-8"))
    zeilen = []
    for lauf in data["runs"]:
        d = saldo(bewertungen_eines_laufs(lauf))
        berechnet = round(ja_anteil(d), 1)
        zeilen.append({
            "vorlage": lauf["vorlage"],
            "profil": lauf["profil"],
            "profilname": lauf["profilname"],
            "saldo": d,
            "ja_anteil_berechnet": berechnet,
            "ja_anteil_nadel": lauf["ja_anteil_nadel"],
            "abweichung": round(lauf["ja_anteil_nadel"] - berechnet, 1),
            "anzeige_beobachtet": lauf["anzeige"],
            "anzeige_berechnet": anzeige(ja_anteil(d)),
        })
    passt = all(z["abweichung"] == 0 and z["anzeige_beobachtet"] == z["anzeige_berechnet"] for z in zeilen)
    summary = {
        "experiment_id": data["experiment_id"],
        "auswertbare_laeufe": len(zeilen),
        "verworfene_laeufe": len(data.get("discarded_runs", [])),
        "formel": "ja_anteil = 50 + 50 * (summe_pro - summe_contra) / 24",
        "formel_passt_auf_alle_laeufe": passt,
        "laeufe": zeilen,
    }
    (ROOT / "reports").mkdir(exist_ok=True)
    (ROOT / "reports/kompass-tests-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with open(ROOT / "reports/kompass-tests-summary.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(zeilen[0].keys()))
        w.writeheader()
        w.writerows(zeilen)
    print(f"{len(zeilen)} Läufe ausgewertet, Formel passt auf alle: {passt}")


if __name__ == "__main__":
    main()
