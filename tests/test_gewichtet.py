import json
import unittest
from pathlib import Path

from kompass import bewertungen_eines_laufs, ja_anteil, ja_anteil_gewichtet, saldo

ROOT = Path(__file__).parent.parent


def arg(seite, bewertung, gewicht=1):
    return {"seite": seite, "bewertung": bewertung, "gewicht": gewicht}


class TestGewichtet(unittest.TestCase):
    def test_identisch_mit_srf_bei_sechs_gegen_sechs(self):
        data = json.loads((ROOT / "responses/kompass_tests/runs.json").read_text(encoding="utf-8"))
        for lauf in data["runs"]:
            b = bewertungen_eines_laufs(lauf)
            self.assertAlmostEqual(ja_anteil_gewichtet(b), ja_anteil(saldo(b)))

    def test_anzahl_aendert_nichts(self):
        drei_gegen_sechs = [arg("pro", 1)] * 3 + [arg("contra", 1)] * 6
        self.assertEqual(ja_anteil_gewichtet(drei_gegen_sechs), 50)

    def test_gewicht_zaehlt(self):
        b = [arg("pro", 2, 3), arg("pro", 0, 1), arg("contra", 1, 1), arg("contra", 1, 1)]
        self.assertGreater(ja_anteil_gewichtet(b), 50)

    def test_fehlende_seite_zaehlt_neutral(self):
        self.assertEqual(ja_anteil_gewichtet([arg("pro", 2)] * 6), 75)

    def test_ungueltiges_gewicht(self):
        with self.assertRaises(ValueError):
            ja_anteil_gewichtet([arg("pro", 1, 5)])


if __name__ == "__main__":
    unittest.main()
