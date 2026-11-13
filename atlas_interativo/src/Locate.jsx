import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { LOC } from "./i18n.js";
import { Crosshair, Timer, Trophy, RotateCcw, ArrowRight, Heart, MapPin } from "lucide-react";

const L_ROUNDS = 10, L_TIME = 30, L_LIVES = 3, L_ERR = 150;
const locPts = (ms, wrong) => Math.max(0, Math.max(100, Math.round(1000 - 900 * Math.min(1, ms / (L_TIME * 1000)))) - wrong * L_ERR);

function LocFly({ target, active }) {
  const map = useMap();
  useEffect(() => {
    if (active && target?.latlng?.length === 2) map.flyTo(target.latlng, (target.area || 0) > 1.5e6 ? 3 : 4.5, { duration: 1 });
    else if (!active) map.flyTo([20, 0], 2, { duration: 0.6 });
  }, [active, target?.cca3]);
  return null;
}

export default function Locate({ countries, geoData, match }) {
  const cache = useRef(new WeakMap());
  const codeOf = useCallback((f) => {
    if (!cache.current.has(f)) cache.current.set(f, countries.find((c) => match(f, c))?.cca3 || null);
    return cache.current.get(f);
  }, [countries, match]);
  const pool = useMemo(() => {
    if (!geoData) return [];
    const set = new Set(geoData.features.map(codeOf).filter(Boolean));
    return countries.filter((c) => set.has(c.cca3) && c.area > 3000);
  }, [geoData, countries, codeOf]);

  const [phase, setPhase] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [target, setTarget] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [ms, setMs] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [gain, setGain] = useState(0);
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem("atlas-locate-best") || 0); } catch { return 0; } });
  const used = useRef(new Set());
  const t0 = useRef(0);
  const geoRef = useRef(null);
  const S = useRef({});
  S.current = { phase, target, wrong };

  const beginRound = (i) => {
    const free = pool.filter((c) => !used.current.has(c.cca3));
    const c = free[Math.floor(Math.random() * free.length)];
    used.current.add(c.cca3);
    setTarget(c); setIdx(i); setWrong([]); setMs(0); t0.current = performance.now(); setPhase("play");
  };
  const start = () => { used.current = new Set(); setScore(0); setHits(0); beginRound(0); };
  const finish = (ok, g) => { setPhase("result"); setGain(g); if (ok) { setHits((h) => h + 1); setScore((s) => s + g); } };
  const guess = (code) => {
    const { phase: ph, target: tg, wrong: w } = S.current;
    if (ph !== "play" || !code || w.includes(code)) return;
    if (code === tg.cca3) return finish(true, locPts(performance.now() - t0.current, w.length));
    const nw = [...w, code];
    setWrong(nw);
    if (nw.length >= L_LIVES) finish(false, 0);
  };
  const guessRef = useRef(guess);
  guessRef.current = guess;

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => { const t = performance.now() - t0.current; setMs(t); if (t >= L_TIME * 1000) finish(false, 0); }, 100);
    return () => clearInterval(id);
  }, [phase, idx]);

  const next = () => {
    if (idx + 1 >= L_ROUNDS) {
      if (score > best) { setBest(score); try { localStorage.setItem("atlas-locate-best", String(score)); } catch {} }
      setPhase("end");
    } else beginRound(idx + 1);
  };
  useEffect(() => {
    const k = (e) => { if (e.key === "Enter" && S.current.phase === "result") next(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const styleFn = useCallback((f) => {
    const { phase: ph, target: tg, wrong: w } = S.current;
    const code = codeOf(f);
    if (ph === "result" && code === tg?.cca3) return { color: "#d7ffad", weight: 2, fillColor: "#b8f36b", fillOpacity: 0.85 };
    if (w.includes(code)) return { color: "#ff8a8a", weight: 1.4, fillColor: "#ff6b6b", fillOpacity: 0.6 };
    return { color: "#40534a", weight: 0.6, fillColor: "#263a31", fillOpacity: 0.5 };
  }, [codeOf]);
  useEffect(() => { geoRef.current?.setStyle(styleFn); }, [phase, wrong, target, styleFn]);
  const onEach = useCallback((feature, layer) => {
    layer.on({
      mouseover: (e) => { if (S.current.phase === "play" && !S.current.wrong.includes(codeOf(feature))) e.target.setStyle({ fillColor: "#9edc60", fillOpacity: 0.75, color: "#d7ffad", weight: 1.2 }); },
      mouseout: (e) => e.target.setStyle(styleFn(feature)),
      click: () => guessRef.current(codeOf(feature))
    });
  }, [codeOf, styleFn]);

  const playing = phase === "play" || phase === "result";
  const live = locPts(ms, wrong.length);
  const frac = Math.max(0, 1 - ms / (L_TIME * 1000));
  const fmt = (n) => n.toLocaleString(LOC());

  return (
    <main className="page-shell locate-page">
      <div className="page-heading"><div><span className="eyebrow">DESAFIO / LOCALIZAÇÃO</span><h1>Onde fica <em>esse país?</em></h1><p>Encontre o país no mapa. Quanto mais rápido, mais pontos; cada clique errado custa {L_ERR} pontos.</p></div></div>
      {playing && target && (
        <div className="locate-hud">
          <div className="hud-cell"><span>RODADA</span><strong>{idx + 1}/{L_ROUNDS}</strong></div>
          <div className="hud-target"><span>ENCONTRE NO MAPA</span><h2>{target.name.common}</h2></div>
          <div className="hud-cell"><span>PONTOS</span><strong>{fmt(score)}</strong></div>
          <div className="hud-bar"><i style={{ width: `${frac * 100}%`, background: frac < 0.25 ? "#ff8a8a" : "var(--lime)" }} /></div>
          <div className="hud-meta">
            <span><Timer size={14} /> {Math.max(0, Math.ceil(L_TIME - ms / 1000))}s</span>
            <span>{phase === "play" ? `Vale agora ${fmt(live)} pts` : ""}</span>
            <span className="hud-lives">{Array.from({ length: L_LIVES }, (_, i) => <Heart key={i} size={15} fill={i < L_LIVES - wrong.length ? "currentColor" : "none"} />)}</span>
          </div>
        </div>
      )}
      <div className="locate-stage">
        {geoData ? (
          <MapContainer center={[20, 0]} zoom={2} minZoom={1.3} maxZoom={7} worldCopyJump className="world-map">
            <LocFly target={target} active={phase === "result"} />
            <TileLayer attribution='&copy; OpenStreetMap, CARTO' url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
            <GeoJSON ref={geoRef} key="loc" data={geoData} style={styleFn} onEachFeature={onEach} />
          </MapContainer>
        ) : <div className="map-loading"><span className="spinner" /> Carregando mapa...</div>}
        {phase === "intro" && (
          <div className="locate-overlay"><div className="locate-card">
            <Crosshair size={38} /><h2>Desafio de localização</h2>
            <p>{L_ROUNDS} rodadas. O nome de um país aparece e você clica nele no mapa, sem nomes de ajuda.</p>
            <ul><li>Até 1000 pontos por acerto, caindo com o tempo ({L_TIME}s por rodada)</li><li>Cada erro custa {L_ERR} pontos; {L_LIVES} erros e a rodada termina</li></ul>
            <p className="quiz-best"><Trophy size={14} /> Recorde: {fmt(best)} pts</p>
            <button className="button-primary" onClick={start} disabled={!pool.length}>Começar <ArrowRight size={15} /></button>
          </div></div>
        )}
        {phase === "end" && (
          <div className="locate-overlay"><div className="locate-card">
            <Trophy size={38} /><h2>{fmt(score)} pontos</h2>
            <p>{hits} de {L_ROUNDS} países encontrados. {score >= best && score > 0 ? "Novo recorde!" : `Recorde: ${fmt(best)}`}</p>
            <p>{score >= 7000 ? "Navegador de elite!" : score >= 4000 ? "Ótimo senso de direção." : "Continue explorando o mapa e tente de novo."}</p>
            <button className="button-primary" onClick={start}><RotateCcw size={15} /> Jogar de novo</button>
          </div></div>
        )}
      </div>
      {phase === "result" && target && (
        <div className="locate-result">
          <img src={target.flags?.svg || target.flags?.png} alt="" />
          <div><strong>{gain > 0 ? `Acertou! +${fmt(gain)} pontos` : `Era ${target.name.common}`}</strong><p><MapPin size={13} /> {target.name.common}, capital {target.capital?.[0] || "—"} · {target.population?.toLocaleString(LOC())} habitantes</p></div>
          <button className="button-primary" onClick={next} autoFocus>{idx + 1 >= L_ROUNDS ? "Ver resultado" : "Próxima"} <ArrowRight size={15} /></button>
        </div>
      )}
    </main>
  );
}
