import React, { useEffect, useState } from "react";
import { LOC, LANG, tn } from "./i18n.js";

export function WikiBlock({ country }) {
  const [wiki, setWiki] = useState(null);
  useEffect(() => {
    let alive = true;
    setWiki(null);
    const get = (lang) => fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(lang === "pt" ? country.name.common : lang === "en" ? country.name.en || country.name.common : tn(country.name.common))}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); });
    get(LANG()).catch(() => get("en")).then((d) => alive && setWiki(d)).catch(() => {});
    return () => { alive = false; };
  }, [country.cca3]);
  if (!wiki?.extract) return null;
  return (
    <div className="extra-card wiki-card">
      {wiki.thumbnail?.source && <img src={wiki.thumbnail.source} alt="" />}
      <div><h3>Sobre {country.name.common}</h3><p>{wiki.extract}</p>
        <a href={wiki.content_urls?.desktop?.page} target="_blank" rel="noreferrer">Ler na Wikipédia</a></div>
    </div>
  );
}

export function CurrencyBlock({ country }) {
  const [rates, setRates] = useState(null);
  const code = Object.keys(country.currencies || {})[0];
  useEffect(() => {
    let alive = true;
    setRates(null);
    if (!code) return;
    fetch(`https://api.frankfurter.app/latest?from=${code}&to=BRL,USD,EUR`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => alive && setRates(d)).catch(() => {});
    return () => { alive = false; };
  }, [code]);
  if (!rates?.rates) return null;
  const fmt = (v, cur) => v.toLocaleString(LOC(), { style: "currency", currency: cur });
  return (
    <div className="extra-card">
      <h3>1 {code} hoje vale</h3>
      <div className="rate-row">{Object.entries(rates.rates).map(([cur, v]) => <span key={cur}><strong>{fmt(v, cur)}</strong></span>)}</div>
      <small>Câmbio: Frankfurter (Banco Central Europeu), em {rates.date}.</small>
    </div>
  );
}
