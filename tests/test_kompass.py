import json
import unittest
from pathlib import Path

from kompass import anzeige, bewertungen_eines_laufs, ja_anteil, saldo

ROOT = Path(__file__).parent.parent


class TestFormel(unittest.TestCase):
    def test_extreme(self):
        self.assertEqual(ja_anteil(24), 100)
        self.assertEqual(ja_anteil(-24), 0)
        self.assertEqual(ja_anteil(0), 50)

    def test_anzeige(self):
        self.assertEqual(anzeige(ja_anteil(1)), "JA")
        self.assertEqual(anzeige(ja_anteil(-1)), "NEIN")
        self.assertEqual(anzeige(ja_anteil(0)), "UNENTSCHIEDEN")


class TestDaten(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "responses/kompass_tests/runs.json").read_text(encoding="utf-8"))

    def test_fuenfzehn_laeufe_je_vorlage(self):
        for vorlage in ("neutralitaet", "ernaehrung"):
            laeufe = [r for r in self.data["runs"] if r["vorlage"] == vorlage]
            self.assertEqual(sorted(r["profil"] for r in laeufe), list(range(1, 16)))

    def test_zwoelf_argumente_sechs_je_seite(self):
        for lauf in self.data["runs"]:
            b = bewertungen_eines_laufs(lauf)
            self.assertEqual(len(b), 12)
            self.assertEqual(sum(1 for x in b if x["seite"] == "pro"), 6)

    def test_formel_erklaert_jede_beobachtung(self):
        for lauf in self.data["runs"]:
            berechnet = ja_anteil(saldo(bewertungen_eines_laufs(lauf)))
            with self.subTest(vorlage=lauf["vorlage"], profil=lauf["profil"]):
                self.assertAlmostEqual(berechnet, lauf["ja_anteil_nadel"], delta=0.05)
                self.assertEqual(anzeige(berechnet), lauf["anzeige"])


if __name__ == "__main__":
    unittest.main()
