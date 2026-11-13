import React, { useMemo, useState } from "react";
import { LOC } from "./i18n.js";
import { Ruler, Users, Gauge, Clock3, Languages, Link2, ArrowUp, ArrowDown, Heart, Sparkles, Globe2 } from "lucide-react";

const cn = (v, d = 0) => v == null ? "—" : v.toLocaleString(LOC(), { maximumFractionDigits: d });
const curDens = (c) => (c.area > 0 && c.population > 0 ? c.population / c.area : null);
const METRICS = {
  pop: { label: "População", get: (c) => (c.population > 0 ? c.population : null), fmt: (v) => cn(v) + " hab." },
  area: { label: "Área", get: (c) => (c.area > 0 ? c.area : null), fmt: (v) => cn(v, v < 10 ? 1 : 0) + " km²" },
  dens: { label: "Densidade", get: curDens, fmt: (v) => cn(v, 1) + " hab/km²" }
};
const RECORDS = [
  { title: "Maior país", icon: ArrowUp, m: METRICS.area, dir: 1 },
  { title: "Menor país", icon: ArrowDown, m: METRICS.area, dir: -1 },
  { title: "Mais populoso", icon: Users, m: METRICS.pop, dir: 1 },
  { title: "Menos populoso", icon: Users, m: METRICS.pop, dir: -1 },
  { title: "Mais densamente povoado", icon: Gauge, m: METRICS.dens, dir: 1 },
  { title: "Menos densamente povoado", icon: Gauge, m: METRICS.dens, dir: -1 },
  { title: "Mais fronteiras", icon: Link2, m: { get: (c) => (c.borders || []).length || null, fmt: (v) => `${v} vizinhos` }, dir: 1 },
  { title: "Mais idiomas", icon: Languages, m: { get: (c) => Object.keys(c.languages || {}).length || null, fmt: (v) => `${v} idiomas` }, dir: 1 },
  { title: "Mais fusos horários", icon: Clock3, m: { get: (c) => (c.timezones || []).length || null, fmt: (v) => `${v} fusos` }, dir: 1 }
];
const sorted = (list, m, dir) => list.map((c) => ({ c, v: m.get(c) })).filter((x) => x.v != null).sort((a, b) => (b.v - a.v) * dir);

export default function Curiosities({ countries, favorites, onOpen }) {
  const [metric, setMetric] = useState("pop");
  const [dir, setDir] = useState(1);
  const records = useMemo(() => RECORDS.map((r) => ({ ...r, top: sorted(countries, r.m, r.dir)[0] })), [countries]);
  const rank = useMemo(() => sorted(countries, METRICS[metric], dir).slice(0, 10), [countries, metric, dir]);
  const facts = useMemo(() => {
    const total = countries.reduce((s, c) => s + (c.population || 0), 0);
    const top = sorted(countries, METRICS.pop, 1).slice(0, 2);
    const small = countries.filter((c) => c.population > 0 && c.population < 1e6).length;
    return [
      { v: cn(total), l: "habitantes somados nos países do atlas" },
      { v: `${cn(((top[0].v + top[1].v) / total) * 100, 0)}%`, l: `da população vive em ${top[0].c.name.common} e ${top[1].c.name.common}` },
      { v: String(small), l: "países e territórios com menos de 1 milhão de pessoas" }
    ];
  }, [countries]);
  const favs = countries.filter((c) => favorites.includes(c.cca3));
  const max = rank[0]?.v || 1;

  return (
    <main className="page-shell cur-page">
      <div className="page-heading"><div><span className="eyebrow"><Sparkles size={12} /> CURIOSIDADES</span><h1>O mundo em <em>recordes.</em></h1><p>Extremos de tamanho, população e densidade, calculados em tempo real com os dados do atlas.</p></div></div>
      <div className="cur-facts">{facts.map((f) => <div key={f.l}><strong>{f.v}</strong><span>{f.l}</span></div>)}</div>
      <div className="cur-grid">
        {records.map(({ title, icon: Icon, m, top }) => top && (
          <button key={title} className="cur-card" onClick={() => onOpen(top.c)}>
            <span className="cur-title"><Icon size={15} /> {title}</span>
            <img src={top.c.flags?.svg || top.c.flags?.png} alt="" loading="lazy" />
            <h3>{top.c.name.common}</h3>
            <strong>{m.fmt(top.v)}</strong>
          </button>
        ))}
      </div>
      <section className="cur-rank">
        <div className="cur-rank-head">
          <h2>Ranking Top 10</h2>
          <div className="quiz-rounds">
            {Object.entries(METRICS).map(([k, v]) => <button key={k} className={k === metric ? "on" : ""} onClick={() => setMetric(k)}>{v.label}</button>)}
            <button onClick={() => setDir(-dir)}>{dir === 1 ? "Maiores" : "Menores"} ⇅</button>
          </div>
        </div>
        {rank.map(({ c, v }, i) => (
          <button key={c.cca3} className="rank-row" onClick={() => onOpen(c)}>
            <b>{i + 1}</b><img src={c.flags?.svg || c.flags?.png} alt="" /><span>{c.name.common}</span>
            <div className="rank-bar"><i style={{ width: `${Math.max(2, (v / max) * 100)}%` }} /></div>
            <em>{METRICS[metric].fmt(v)}</em>
          </button>
        ))}
      </section>
      <section className="cur-favs">
        <h2><Heart size={18} /> Seus favoritos</h2>
        {favs.length ? <div className="fav-chips">{favs.map((c) => <button key={c.cca3} onClick={() => onOpen(c)}><img src={c.flags?.svg || c.flags?.png} alt="" />{c.name.common}</button>)}</div>
          : <p className="muted">Use o coração em qualquer país da aba Explorar para salvá-lo aqui.</p>}
      </section>
    </main>
  );
}
