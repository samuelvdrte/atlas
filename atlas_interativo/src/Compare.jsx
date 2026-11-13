import React, { useMemo, useState } from "react";
import { LOC, tn } from "./i18n.js";
import { ArrowLeftRight, Users, Ruler, Gauge, Link2, Languages, Clock3, MapPin, Landmark, Coins, Globe2 } from "lucide-react";

const CMP_REG = { Africa: "África", Americas: "Américas", Asia: "Ásia", Europe: "Europa", Oceania: "Oceania", Antarctic: "Antártida" };
const cmpN = (v, d = 0) => v == null ? "—" : v.toLocaleString(LOC(), { maximumFractionDigits: d });
const cmpCur = (c) => { const e = Object.values(c.currencies || {})[0]; return e ? `${e.name}${e.symbol ? ` (${e.symbol})` : ""}` : "—"; };
const NUM = [
  { label: "População", icon: Users, get: (c) => c.population, fmt: (v) => cmpN(v) },
  { label: "Área", icon: Ruler, get: (c) => c.area, fmt: (v) => `${cmpN(v)} km²` },
  { label: "Densidade", icon: Gauge, get: (c) => (c.area > 0 ? c.population / c.area : null), fmt: (v) => `${cmpN(v, 1)} hab/km²` },
  { label: "Fronteiras", icon: Link2, get: (c) => (c.borders || []).length, fmt: (v) => `${v} países` },
  { label: "Idiomas", icon: Languages, get: (c) => Object.keys(c.languages || {}).length, fmt: (v) => String(v) },
  { label: "Fusos horários", icon: Clock3, get: (c) => (c.timezones || []).length, fmt: (v) => String(v) }
];
const TXT = [
  { label: "Capital", icon: Landmark, get: (c) => c.capital?.[0] || "—" },
  { label: "Continente", icon: Globe2, get: (c) => CMP_REG[c.region] || c.region || "—" },
  { label: "Sub-região", icon: MapPin, get: (c) => c.subregion || "—" },
  { label: "Moeda", icon: Coins, get: cmpCur },
  { label: "Idiomas falados", icon: Languages, get: (c) => Object.values(c.languages || {}).join(", ") || "—" }
];

function CmpHead({ c, side, wins }) {
  return (
    <div className={`cmp-head ${side}`}>
      <img src={c.flags?.svg || c.flags?.png} alt={`Bandeira de ${c.name.common}`} />
      <h2>{c.name.common}</h2>
      <p>{c.capital?.[0] || "—"} · {CMP_REG[c.region] || c.region}</p>
      <span className="cmp-wins">{wins} de {NUM.length} categorias</span>
    </div>
  );
}

export default function Compare({ countries }) {
  const list = useMemo(() => [...countries].sort((a, b) => tn(a.name.common).localeCompare(tn(b.name.common), LOC())), [countries]);
  const [ca, setCa] = useState("BRA");
  const [cb, setCb] = useState("JPN");
  const A = countries.find((c) => c.cca3 === ca) || list[0];
  const B = countries.find((c) => c.cca3 === cb) || list[1];
  const rows = NUM.map((r) => {
    const va = r.get(A), vb = r.get(B);
    const ok = va != null && vb != null;
    const mx = Math.max(va || 0, vb || 0) || 1;
    const win = !ok || va === vb ? 0 : va > vb ? 1 : 2;
    const ratio = ok && Math.min(va, vb) > 0 && va !== vb ? Math.max(va, vb) / Math.min(va, vb) : null;
    return { ...r, va, vb, pa: ((va || 0) / mx) * 100, pb: ((vb || 0) / mx) * 100, win, ratio };
  });
  const wa = rows.filter((r) => r.win === 1).length, wb = rows.filter((r) => r.win === 2).length;
  const Select = ({ value, onChange, label }) => (
    <label className="cmp-select"><span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>{list.map((c) => <option key={c.cca3} value={c.cca3}>{c.name.common}</option>)}</select>
    </label>
  );
  return (
    <main className="page-shell cmp-page">
      <div className="page-heading"><div><span className="eyebrow">COMPARADOR</span><h1>Frente a <em>frente.</em></h1><p>Escolha dois países e veja quem lidera em cada categoria.</p></div></div>
      <div className="cmp-pickers">
        <Select value={ca} onChange={setCa} label="País A" />
        <button className="icon-button cmp-swap" onClick={() => { setCa(cb); setCb(ca); }} aria-label="Trocar países"><ArrowLeftRight size={18} /></button>
        <Select value={cb} onChange={setCb} label="País B" />
      </div>
      <div className="cmp-heads">
        <CmpHead c={A} side="a" wins={wa} /><div className="cmp-vs">VS</div><CmpHead c={B} side="b" wins={wb} />
      </div>
      <section className="cmp-card">
        {rows.map((r) => (
          <div className="cmp-row" key={r.label}>
            <div className="cmp-label"><r.icon size={15} /> {r.label}{r.ratio && <em>{cmpN(r.ratio, 1)}× {r.win === 1 ? A.name.common : B.name.common}</em>}</div>
            <div className="cmp-bars">
              <div className={`cmp-side l ${r.win === 1 ? "win" : ""}`}><b>{r.va == null ? "—" : r.fmt(r.va)}</b><i style={{ width: `${r.pa}%` }} /></div>
              <div className={`cmp-side r ${r.win === 2 ? "win" : ""}`}><b>{r.vb == null ? "—" : r.fmt(r.vb)}</b><i style={{ width: `${r.pb}%` }} /></div>
            </div>
          </div>
        ))}
      </section>
      <section className="cmp-card cmp-text">
        {TXT.map((r) => (
          <div className="cmp-trow" key={r.label}>
            <div className="cmp-tv l">{r.get(A)}</div>
            <div className="cmp-label mid"><r.icon size={14} /> {r.label}</div>
            <div className="cmp-tv r">{r.get(B)}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
