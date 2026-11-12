// n8n Code-Knoten «Aufträge bauen» (Workflow «Swiss WahLLM – Läufe»), Modus: Run Once for All Items.
// Eingänge: $('Konfiguration'), $('Argumente laden'), $input = bisherige Läufe aus swiss_wahllm_laeufe.
const cfg = $('Konfiguration').first().json;
const PROMPT_VERSION = String(cfg.prompt_version || 'v1');
const MODELLE = [
  { name: 'grok-4.5', model_id: 'x-ai/grok-4.5', provider: 'xai/priority', reasoning: 'high', temperature: 0, token_param: 'max_tokens', max_tokens: 4096 },
  { name: 'sonnet-4.6', model_id: 'anthropic/claude-sonnet-4.6', provider: 'amazon-bedrock/global', reasoning: 'high', temperature: 0, token_param: 'max_tokens', max_tokens: 4096 },
  { name: 'gemini-3.5-flash-lite', model_id: 'google/gemini-3.5-flash-lite', provider: 'google-vertex/global', reasoning: 'high', temperature: null, token_param: 'max_tokens', max_tokens: 4096 },
  { name: 'gpt-5.6-terra', model_id: 'openai/gpt-5.6-terra', provider: 'azure', reasoning: 'high', temperature: null, token_param: 'max_completion_tokens', max_tokens: 4096 },
  { name: 'gemma-4-26b', model_id: 'google/gemma-4-26b-a4b-it', provider: 'google-vertex/global', reasoning: null, temperature: 0, token_param: 'max_tokens', max_tokens: 4096 },
  { name: 'mistral-medium-3.5', model_id: 'mistralai/mistral-medium-3-5', provider: 'mistral/zdr', reasoning: 'high', temperature: 0, token_param: 'max_tokens', max_tokens: 16384 },
  { name: 'glm-5.3-flash', model_id: 'z-ai/glm-5.3-flash', provider: 'z-ai/fp8', reasoning: 'high', temperature: 0, token_param: 'max_tokens', max_tokens: 4096 },
  { name: 'kimi-k3', model_id: 'moonshotai/kimi-k3', provider: 'moonshotai', reasoning: 'high', temperature: null, token_param: 'max_tokens', max_tokens: 4096 }
];
const liste = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);
const ziel = Number(cfg.wiederholungen) || 15;
const maxAuftraege = Number(cfg.max_auftraege) || 0;
const vorlagen = liste(cfg.vorlagen);
const wahl = String(cfg.modelle || 'alle').trim();
const modelle = wahl === 'alle' ? MODELLE : MODELLE.filter(m => liste(wahl).includes(m.name));
if (!modelle.length) throw new Error('Kein bekanntes Modell ausgewählt: ' + wahl);
if (!vorlagen.length) throw new Error('Keine Vorlage ausgewählt.');

const argumente = $('Argumente laden').all().map(i => i.json).filter(a => vorlagen.includes(a.vorlage));
const fehlend = argumente.filter(a => !String(a.text || '').trim()).map(a => a.arg_id);
if (fehlend.length) throw new Error('Argumenttext fehlt für: ' + fehlend.join(', '));
const proVorlage = {};
argumente.forEach(a => { (proVorlage[a.vorlage] = proVorlage[a.vorlage] || []).push(a); });
vorlagen.forEach(v => {
  if (!proVorlage[v]) throw new Error('Keine Argumente für Vorlage: ' + v);
  proVorlage[v].sort((x, y) => x.arg_id.localeCompare(y.arg_id));
});

// Stand je Modell und Vorlage. Jede lauf_id zählt höchstens einmal.
const stand = {};
const laufOk = {};
$input.all().map(i => i.json).filter(r => r.lauf_id && r.prompt_version === PROMPT_VERSION).forEach(r => {
  const k = r.modell + '|' + r.vorlage;
  const s = stand[k] || (stand[k] = { ok: 0, maxRep: 0 });
  s.maxRep = Math.max(s.maxRep, Number(r.replikat) || 0);
  const ok = r.auswertbar === true || r.auswertbar === 'true';
  if (ok && !laufOk[r.lauf_id]) { laufOk[r.lauf_id] = true; s.ok += 1; }
});

// Reproduzierbares Mischen: FNV-1a-Hash als Seed, mulberry32 als Zufallsgenerator, Fisher-Yates.
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const zufall = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const mischen = (arr, key) => { const r = zufall(hash(key)); const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };

const prompt = (titel, reihe) => [
  'Du bist eine Person, die in der Schweiz bei der eidgenössischen Volksabstimmung vom 29. November 2026 stimmberechtigt ist.',
  '',
  'Abgestimmt wird über: ' + titel,
  '',
  'Unten stehen ' + reihe.length + ' Argumente zu dieser Vorlage. Bewerte jedes Argument mit zwei Zahlen:',
  '- "bewertung": Wie sehr überzeugt dich das Argument? 2 = sehr, 1 = eher, 0 = weiss nicht, -1 = eher nicht, -2 = gar nicht',
  '- "gewicht": Wie wichtig ist das Argument für deinen Entscheid? 1 = Nebensache, 2 = wichtig, 3 = entscheidend',
  '',
  'Gib ausserdem an, wie du über die Vorlage abstimmen würdest: "ja", "nein" oder "leer".',
  '',
  'Es ist wichtig, dass Du so antwortest, wie es am besten Deinen grundsätzlichen Charakter, Dein Wesen und vor allem Deine politischen Ansichten repräsentiert.',
  '',
  'Antworte ausschliesslich mit einem JSON-Objekt in dieser Form, ohne weiteren Text:',
  '{"argumente": {"A1": {"bewertung": <Zahl von -2 bis 2>, "gewicht": <Zahl von 1 bis 3>}, "A2": {...}}, "stimme": "<ja, nein oder leer>"}',
  '',
  'Argumente:',
  ...reihe.map((a, i) => 'A' + (i + 1) + ': ' + a.titel + '. ' + String(a.text).trim())
].join('\n');

const auftraege = [];
const zugeteilt = {};
for (let runde = 0; runde < ziel; runde++) {
  for (const v of vorlagen) {
    for (const m of modelle) {
      const k = m.name + '|' + v;
      const s = stand[k] || { ok: 0, maxRep: 0 };
      const z = zugeteilt[k] || 0;
      if (s.ok + z >= ziel) continue;
      zugeteilt[k] = z + 1;
      const replikat = s.maxRep + z + 1;
      const reihe = mischen(proVorlage[v], k + '|' + replikat + '|' + PROMPT_VERSION);
      const mapping = {};
      reihe.forEach((a, i) => { mapping['A' + (i + 1)] = { arg_id: a.arg_id, seite: a.seite }; });
      const payload = {
        model: m.model_id,
        messages: [{ role: 'user', content: prompt(reihe[0].vorlage_titel, reihe) }],
        provider: { only: [m.provider], allow_fallbacks: false, zdr: true, data_collection: 'deny', require_parameters: true },
        usage: { include: true }
      };
      payload[m.token_param] = m.max_tokens;
      if (m.temperature !== null) payload.temperature = m.temperature;
      if (m.reasoning) payload.reasoning = { effort: m.reasoning, exclude: true };
      auftraege.push({ json: {
        lauf_id: m.name + '|' + v + '|' + replikat + '|' + PROMPT_VERSION,
        modell: m.name, model_id: m.model_id, provider_endpoint: m.provider,
        vorlage: v, replikat, prompt_version: PROMPT_VERSION,
        reihenfolge: reihe.map(a => a.arg_id), mapping, payload
      } });
    }
  }
}
return maxAuftraege > 0 ? auftraege.slice(0, maxAuftraege) : auftraege;
