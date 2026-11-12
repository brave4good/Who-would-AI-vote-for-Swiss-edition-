import json
import tempfile
import unittest
from pathlib import Path

import analyze_api_experiments as a


def lauf(lauf_id, bewertungen, ja, zaehlt=True, stimme="ja"):
    return {"lauf_id": lauf_id, "vorlage": "test", "zaehlt_fuer_auswertung": zaehlt,
            "bewertungen": bewertungen, "ja_anteil_gewichtet": ja, "stimme": stimme}


class TestApiExperimente(unittest.TestCase):
    def schreiben(self, d, runs):
        (Path(d) / "testmodell_v1.json").write_text(json.dumps({"runs": runs}), encoding="utf-8")

    def test_passende_werte(self):
        b = [{"seite": "pro", "bewertung": 2, "gewicht": 3}, {"seite": "contra", "bewertung": -1, "gewicht": 1}]
        with tempfile.TemporaryDirectory() as d:
            self.schreiben(d, [lauf("x|1", b, 87.5), lauf("x|1", b, 87.5, zaehlt=False)])
            self.assertEqual(a.main(Path(d), Path(d) / "k.csv"), 0)
            self.assertIn("testmodell,test,1,87.5", (Path(d) / "k.csv").read_text(encoding="utf-8"))

    def test_abweichung_wird_erkannt(self):
        b = [{"seite": "pro", "bewertung": 1, "gewicht": 1}]
        with tempfile.TemporaryDirectory() as d:
            self.schreiben(d, [lauf("x|1", b, 99.0)])
            self.assertEqual(a.main(Path(d), Path(d) / "k.csv"), 1)


if __name__ == "__main__":
    unittest.main()
