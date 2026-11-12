"""Rechenlogik des SRF-Abstimmungskompasses, wie sie aus den Testläufen abgeleitet wurde."""

MAX_DIFFERENZ = 24  # 6 Pro-Argumente × (+2) minus 6 Contra-Argumente × (−2)


def saldo(bewertungen):
    """Summe der Pro-Bewertungen minus Summe der Contra-Bewertungen."""
    pro = sum(b["bewertung"] for b in bewertungen if b["seite"] == "pro")
    contra = sum(b["bewertung"] for b in bewertungen if b["seite"] == "contra")
    return pro - contra


def ja_anteil(differenz):
    """Ja-Anteil in Prozent: 50 + 50 × Differenz / 24."""
    return 50 + 50 * differenz / MAX_DIFFERENZ


def anzeige(anteil):
    if anteil > 50:
        return "JA"
    if anteil < 50:
        return "NEIN"
    return "UNENTSCHIEDEN"


def bewertungen_eines_laufs(lauf):
    if lauf.get("reihenfolge"):
        return lauf["reihenfolge"]
    werte = lauf["bewertungen_ohne_reihenfolge"]
    return [{"seite": s, "bewertung": v} for s in ("pro", "contra") for v in werte[s]]


# --- Gewichtete Auswertung für Schritt 2 -------------------------------------
# Jede Seite wird über den gewichteten Durchschnitt ihrer Bewertungen erfasst.
# Damit hängt das Ergebnis vom Gewicht der Argumente ab, nicht von ihrer Anzahl.

GEWICHTE = {1: "Nebensache", 2: "wichtig", 3: "entscheidend"}


def seitenwert(bewertungen, seite):
    """Gewichteter Durchschnitt der Bewertungen einer Seite, Bereich −2 bis +2.

    Fehlt eine Seite ganz (z. B. AHV-Vorlage ohne Gegenkomitee), zählt sie neutral (0).
    """
    teile = [b for b in bewertungen if b["seite"] == seite]
    if not teile:
        return 0.0
    for b in teile:
        if b.get("gewicht", 1) not in GEWICHTE:
            raise ValueError(f"Gewicht muss 1, 2 oder 3 sein, nicht {b.get('gewicht')!r}")
    summe_gewichte = sum(b.get("gewicht", 1) for b in teile)
    return sum(b["bewertung"] * b.get("gewicht", 1) for b in teile) / summe_gewichte


def ja_anteil_gewichtet(bewertungen):
    """Ja-Anteil = 50 + 50 × (Seitenwert Pro − Seitenwert Contra) / 4.

    Bei je 6 Argumenten und Gewicht 1 identisch mit der SRF-Formel.
    """
    differenz = seitenwert(bewertungen, "pro") - seitenwert(bewertungen, "contra")
    return 50 + 50 * differenz / 4
