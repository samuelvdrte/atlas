import React, { useCallback, useEffect, useRef, useState } from "react";
import { LOC } from "./i18n.js";
import { Flag, Hexagon, Users, Landmark, Trophy, RotateCcw, Flame, ArrowRight, Check, X, Globe2, Coins } from "lucide-react";

const MODES = [
  { id: "flag", icon: Flag, title: "Bandeira", desc: "Veja a bandeira e descubra o país." },
  { id: "shape", icon: Hexagon, title: "Silhueta", desc: "Reconheça o país só pelo contorno." },
  { id: "pop", icon: Users, title: "População", desc: "Qual é o número de habitantes?" },
  { id: "capital", icon: Landmark, title: "Capitais", desc: "Encontre a capital certa." },
  { id: "continent", icon: Globe2, title: "Continentes", desc: "Em que continente fica o país?" },
  { id: "currency", icon: Coins, title: "Moedas", desc: "Qual moeda circula no país?" }
];
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const compact = { format: (v) => new Intl.NumberFormat(LOC(), { notation: "compact", maximumFractionDigits: 1 }).format(v) };

const REG = { Africa: "África", Americas: "América", Asia: "Ásia", Europe: "Europa", Oceania: "Oceania" };
const curName = (c) => Object.values(c.currencies || {})[0]?.name;
function build(mode, pool, geo, match, used) {
  for (let t = 0; t < 40; t++) {
    const c = rnd(pool);
    if (used.has(c.cca3) && t < 35) continue;
    if (mode === "continent") {
      const reg = REG[c.region]; if (!reg) continue;
      used.add(c.cca3);
      return { mode, c, correct: reg, options: shuffle([reg, ...shuffle(Object.values(REG).filter((x) => x !== reg)).slice(0, 3)]).map((x) => ({ id: x, label: x })) };
    }
    if (mode === "currency") {
      const cur = curName(c); if (!cur) continue;
      const others = shuffle([...new Set(pool.map(curName).filter((x) => x && x !== cur))]).slice(0, 3);
      used.add(c.cca3);
      return { mode, c, correct: cur, options: shuffle([cur, ...others]).map((x) => ({ id: x, label: x })) };
    }
    if (mode === "pop") {
      if (!(c.population > 500000)) continue;
      used.add(c.cca3);
      const vals = [1, 0.35, 2.6, 6].map((k) => Math.round(c.population * k));
      return { mode, c, correct: String(vals[0]), options: shuffle(vals).map((v) => ({ id: String(v), label: compact.format(v) })) };
    }
    if (mode === "capital" && !c.capital?.[0]) continue;
    let feature;
    if (mode === "shape") { feature = geo?.features?.find((f) => match(f, c)); if (!feature) continue; }
    used.add(c.cca3);
    const wrong = shuffle(pool.filter((x) => x.cca3 !== c.cca3 && (mode !== "capital" || x.capital?.[0]))).slice(0, 3);
    const options = shuffle([c, ...wrong]).map((x) => ({ id: x.cca3, label: mode === "capital" ? x.capital[0] : x.name.common }));
    return { mode, c, feature, options, correct: c.cca3 };
  }
  return null;
}

function Shape({ feature }) {
  const g = feature.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const pts = polys.flat(2);
  const ys = pts.map((p) => p[1]);
  const k = Math.cos(((Math.min(...ys) + Math.max(...ys)) / 2) * Math.PI / 180);
  const xs = pts.map((p) => p[0] * k);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const w = Math.max(Math.max(...xs) - minX, 0.1), h = Math.max(Math.max(...ys) - minY, 0.1);
  const s = Math.min(280 / w, 220 / h);
  const d = polys.flatMap((p) => p.map((ring) => ring.map(([x, y], i) =>
    `${i ? "L" : "M"}${(10 + (x * k - minX) * s).toFixed(1)} ${(10 + (Math.max(...ys) - y) * s).toFixed(1)}`).join("") + "Z")).join("");
  return <svg className="quiz-shape" viewBox="0 0 300 240" role="img" aria-label="Silhueta de um país misterioso"><path d={d} /></svg>;
}

export default function Quiz({ countries, geoData, match }) {
  const [mode, setMode] = useState(null);
  const [rounds, setRounds] = useState(20);
  const used = useRef(new Set());
  const [q, setQ] = useState(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState(() => { try { return JSON.parse(localStorage.getItem("atlas-quiz-best") || "{}"); } catch { return {}; } });

  const start = (m) => { used.current = new Set(); setMode(m); setIdx(0); setScore(0); setStreak(0); setPicked(null); setDone(false); setQ(build(m, countries, geoData, match, used.current)); };
  const answer = useCallback((id) => {
    if (picked || !q) return;
    setPicked(id);
    if (id === q.correct) { setScore((s) => s + 1); setStreak((s) => s + 1); } else setStreak(0);
  }, [picked, q]);
  const next = useCallback(() => {
    if (idx + 1 >= rounds) {
      const nb = { ...best, [mode + rounds]: Math.max(best[mode + rounds] || 0, score) };
      setBest(nb); try { localStorage.setItem("atlas-quiz-best", JSON.stringify(nb)); } catch {}
      setDone(true); return;
    }
    setIdx(idx + 1); setPicked(null); setQ(build(mode, countries, geoData, match, used.current));
  }, [idx, mode, score, best, countries, geoData, match, rounds]);

  useEffect(() => {
    const onKey = (e) => {
      if (!q || done) return;
      if (!picked && /^[1-4]$/.test(e.key)) { const o = q.options[Number(e.key) - 1]; if (o) answer(o.id); }
      else if (picked && e.key === "Enter") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, picked, done, answer, next]);

  if (!mode) return (
    <main className="page-shell quiz-page">
      <div className="page-heading"><div><h1>Teste o quanto você conhece o mundo.</h1><p>Escolha o tamanho da rodada e o tipo de pergunta. Use as teclas 1 a 4 para responder e Enter para avançar.</p></div></div>
      <div className="quiz-rounds">{[10, 20, 30, 50].map((n) => <button key={n} className={n === rounds ? "on" : ""} onClick={() => setRounds(n)}>{n} perguntas</button>)}</div>
      <div className="quiz-modes">
        {MODES.map(({ id, icon: Icon, title, desc }) => (
          <button key={id} className="quiz-mode" onClick={() => start(id)}>
            <Icon size={26} /><h3>{title}</h3><p>{desc}</p>
            <span className="quiz-best"><Trophy size={14} /> Recorde: {best[id + rounds] ?? 0}/{rounds}</span>
          </button>
        ))}
      </div>
    </main>
  );

  const info = MODES.find((m) => m.id === mode);
  if (done) return (
    <main className="page-shell quiz-page"><div className="quiz-card quiz-end">
      <Trophy size={44} /><h2>{score} de {rounds} acertos</h2>
      <p>{score / rounds >= 0.8 ? "Você é um verdadeiro cartógrafo!" : score / rounds >= 0.5 ? "Bom resultado. Dá para melhorar!" : "Continue explorando o atlas e tente de novo."}</p>
      <div className="quiz-actions"><button className="button-primary" onClick={() => start(mode)}><RotateCcw size={15} /> Jogar de novo</button><button className="button-secondary" onClick={() => setMode(null)}>Trocar de modo</button></div>
    </div></main>
  );
  if (!q) return <main className="page-shell quiz-page"><div className="empty-state"><p>Não foi possível montar a pergunta. O contorno dos países ainda está carregando.</p><button className="button-secondary" onClick={() => setMode(null)}>Voltar</button></div></main>;

  const { c } = q;
  const title = { flag: "De qual país é esta bandeira?", shape: "Que país tem este contorno?", pop: `Quantos habitantes tem ${c.name.common}?`, continent: `Em que continente fica ${c.name.common}?`, currency: `Qual é a moeda de ${c.name.common}?`, capital: `Qual é a capital de ${c.name.common}?` }[mode];
  const right = picked === q.correct;
  return (
    <main className="page-shell quiz-page">
      <div className="quiz-bar">
        <button className="text-button" onClick={() => setMode(null)}>← {info.title}</button>
        <div className="quiz-progress" role="progressbar" aria-valuenow={idx + 1} aria-valuemax={rounds}><i style={{ width: `${((idx + (picked ? 1 : 0)) / rounds) * 100}%` }} /></div>
        <span className="quiz-score">{idx + 1}/{rounds} · {score} pts</span>
        {streak > 1 && <span className="quiz-streak"><Flame size={14} /> {streak}</span>}
      </div>
      <div className="quiz-card" key={idx}>
        <div className="quiz-visual">
          {mode === "flag" && <img src={c.flags?.svg || c.flags?.png} alt="Bandeira de um país misterioso" />}
          {mode === "shape" && <Shape feature={q.feature} />}
          {(mode === "pop" || mode === "capital" || mode === "continent" || mode === "currency") && <img src={c.flags?.svg || c.flags?.png} alt={`Bandeira de ${c.name.common}`} />}
        </div>
        <h2>{title}</h2>
        <div className="quiz-options">
          {q.options.map((o, i) => (
            <button key={o.id} disabled={!!picked} onClick={() => answer(o.id)}
              className={`quiz-option ${picked && o.id === q.correct ? "right" : ""} ${picked === o.id && !right ? "wrong" : ""}`}>
              <kbd>{i + 1}</kbd><span>{o.label}</span>
              {picked && o.id === q.correct && <Check size={18} />}{picked === o.id && !right && <X size={18} />}
            </button>
          ))}
        </div>
        {picked && (
          <div className="quiz-feedback">
            <p><strong>{right ? "Acertou!" : "Não foi dessa vez."}</strong> {c.name.common}{c.capital?.[0] ? `, capital ${c.capital[0]}` : ""}, com {c.population?.toLocaleString(LOC())} habitantes.</p>
            <button className="button-primary" onClick={next} autoFocus>{idx + 1 >= rounds ? "Ver resultado" : "Próxima"} <ArrowRight size={15} /></button>
          </div>
        )}
      </div>
    </main>
  );
}
