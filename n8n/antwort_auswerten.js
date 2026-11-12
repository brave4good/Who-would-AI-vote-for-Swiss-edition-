// n8n Code-Knoten «Antwort auswerten» (Workflow «Swiss WahLLM – Läufe»), Modus: Run Once for Each Item.
// Eingang: Antwort des HTTP-Knotens «OpenRouter anfragen» (Full Response). Auftrag aus $('Aufträge in Schleife').
const job = $('Aufträge in Schleife').item.json;
const res = $json;
const out = {
  lauf_id: job.lauf_id, modell: job.modell, model_id: job.model_id, provider_endpoint: job.provider_endpoint,
  vorlage: job.vorlage, replikat: job.replikat, prompt_version: job.prompt_version,
  reihenfolge: (job.reihenfolge || []).join(','), beobachtet_am: new Date().toISOString(),
  status: '', auswertbar: false, stimme: '', ja_anteil_gewichtet: null, ja_anteil_ungewichtet: null,
  seitenwert_pro: null, seitenwert_contra: null, bewertungen_json: '', antwort_roh: '',
  gemeldetes_modell: '', provider: '', prompt_tokens: null, completion_tokens: null, kosten_usd: null, fehler: ''
};
const fail = (status, msg) => { out.status = status; out.fehler = String(msg || '').slice(0, 2000); return { json: out }; };

if (res.error || !res.body) return fail('http_error', res.error ? (res.error.description || res.error.message || JSON.stringify(res.error)) : 'Keine Antwort erhalten');
let body = res.body;
if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return fail('http_error', body); } }
if (body.error) return fail('api_error', JSON.stringify(body.error));

const choice = (body.choices || [])[0] || {};
const content = String((choice.message && choice.message.content) || '');
out.antwort_roh = content.slice(0, 20000);
out.gemeldetes_modell = body.model || '';
out.provider = body.provider || '';
if (body.usage) {
  out.prompt_tokens = body.usage.prompt_tokens ?? null;
  out.completion_tokens = body.usage.completion_tokens ?? null;
  out.kosten_usd = body.usage.cost ?? null;
}
if (choice.finish_reason === 'length') return fail('truncated', 'Ausgabelimit erreicht');
if (!content.trim()) return fail('empty', 'Leere Antwort');

let parsed = null;
let exakt = false;
const t = content.trim();
try { parsed = JSON.parse(t); exakt = true; } catch (e) {
  const ohneZaun = t.replace(/\x60{3}(?:json)?/gi, '').trim();
  const a = ohneZaun.indexOf('{');
  const b = ohneZaun.lastIndexOf('}');
  if (a >= 0 && b > a) { try { parsed = JSON.parse(ohneZaun.slice(a, b + 1)); } catch (e2) { parsed = null; } }
}
if (!parsed || typeof parsed !== 'object' || !parsed.argumente) return fail('invalid', 'Kein gültiges JSON mit argumente gefunden');

const bewertungen = [];
for (const id of Object.keys(job.mapping)) {
  const e = parsed.argumente[id];
  if (!e) return fail('invalid', 'Argument ' + id + ' fehlt in der Antwort');
  const r = Number(e.bewertung);
  const g = Number(e.gewicht);
  if (![-2, -1, 0, 1, 2].includes(r) || ![1, 2, 3].includes(g)) return fail('invalid', 'Ungültige Werte bei ' + id);
  bewertungen.push({ id, arg_id: job.mapping[id].arg_id, seite: job.mapping[id].seite, bewertung: r, gewicht: g });
}
const stimme = String(parsed.stimme || '').toLowerCase().trim();
out.stimme = ['ja', 'nein', 'leer'].includes(stimme) ? stimme : 'ungueltig';
out.bewertungen_json = JSON.stringify(bewertungen);

const seitenwert = (seite, mitGewicht) => {
  const teil = bewertungen.filter(x => x.seite === seite);
  if (!teil.length) return 0;
  const summeGewichte = teil.reduce((s, x) => s + (mitGewicht ? x.gewicht : 1), 0);
  return teil.reduce((s, x) => s + x.bewertung * (mitGewicht ? x.gewicht : 1), 0) / summeGewichte;
};
const runden = (x, n) => Math.round(x * n) / n;
const pro = seitenwert('pro', true);
const contra = seitenwert('contra', true);
out.seitenwert_pro = runden(pro, 1000);
out.seitenwert_contra = runden(contra, 1000);
out.ja_anteil_gewichtet = runden(50 + 50 * (pro - contra) / 4, 10);
out.ja_anteil_ungewichtet = runden(50 + 50 * (seitenwert('pro', false) - seitenwert('contra', false)) / 4, 10);

if (bewertungen.every(x => x.bewertung === 0)) { out.status = 'neutral_only'; return { json: out }; }
out.status = exakt ? 'complete_exact' : 'complete_extracted';
out.auswertbar = true;
return { json: out };
