import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Globe2, Map as MapIcon, CloudSun, Compass, Heart, ArrowUpRight,
  ChevronRight, MapPin, Users, Ruler, Languages, Coins, Clock3, Sun,
  Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, X, Menu,
  ArrowLeftRight, Crosshair, Gamepad2, Sparkles, RefreshCw, ExternalLink, LocateFixed
} from "lucide-react";
import { LANGS, LOC, LANG, tn, configureLanguage } from "./i18n.js";
import Quiz from "./Quiz.jsx";
import Locate from "./Locate.jsx";
import Curiosities from "./Curiosities.jsx";
import Compare from "./Compare.jsx";
import { WikiBlock, CurrencyBlock } from "./Extras.jsx";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";

const COUNTRIES_URL = "https://countries.dev/countries?full=true";
const GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const CONTINENTS = ["Todos os continentes", "África", "América", "Ásia", "Europa", "Oceania", "Antártida"];
const REGION_MAP = {
  Africa: "África", Americas: "América", Asia: "Ásia", Europe: "Europa",
  Oceania: "Oceania", Antarctic: "Antártida"
};


const dn = (type) => { try { return new Intl.DisplayNames(["pt-BR"], { type }); } catch { return null; } };
const REGION_PT = dn("region"), LANG_PT = dn("language"), CUR_PT = dn("currency");
const safe = (d, code, fb) => { try { const r = code && d?.of(code); return r && r !== code ? r : fb; } catch { return fb; } };
const CAPITALS_PT = { London:"Londres", Moscow:"Moscou", Beijing:"Pequim", Tokyo:"Tóquio", Rome:"Roma", Athens:"Atenas", Lisbon:"Lisboa", Cairo:"Cairo", "New Delhi":"Nova Délhi", "Mexico City":"Cidade do México", Brussels:"Bruxelas", Copenhagen:"Copenhague", Stockholm:"Estocolmo", Vienna:"Viena", Prague:"Praga", Warsaw:"Varsóvia", Bucharest:"Bucareste", Budapest:"Budapeste", Berlin:"Berlim", Madrid:"Madri", Havana:"Havana", "Panama City":"Cidade do Panamá", Seoul:"Seul", Hanoi:"Hanói", Jakarta:"Jacarta", Canberra:"Camberra", Bern:"Berna", Geneva:"Genebra", Kiev:"Kiev", Kyiv:"Kiev", Belgrade:"Belgrado", Sofia:"Sófia", Damascus:"Damasco", Baghdad:"Bagdá", Tehran:"Teerã", Jerusalem:"Jerusalém", Riyadh:"Riade", "Abu Dhabi":"Abu Dabi", Kuwait:"Kuwait", "Kuwait City":"Cidade do Kuwait", Tunis:"Túnis", Algiers:"Argel", Rabat:"Rabat", Tripoli:"Trípoli", Nairobi:"Nairóbi", Mogadishu:"Mogadíscio", "Addis Ababa":"Adis Abeba", Kinshasa:"Kinshasa", "Cape Town":"Cidade do Cabo", Pretoria:"Pretória", Dublin:"Dublin", Edinburgh:"Edimburgo", Reykjavik:"Reiquejavique", Oslo:"Oslo", Helsinki:"Helsinque", Tallinn:"Tallinn", Riga:"Riga", Vilnius:"Vilnius", Luxembourg:"Luxemburgo", "Vatican City":"Cidade do Vaticano", "San Marino":"San Marino", Monaco:"Mônaco", Bratislava:"Bratislava", Ljubljana:"Liubliana", Zagreb:"Zagreb", Sarajevo:"Sarajevo", Skopje:"Escópia", Tirana:"Tirana", Valletta:"Valeta", Nicosia:"Nicósia", Ankara:"Ancara", Tbilisi:"Tbilisi", Yerevan:"Erevan", Baku:"Baku", Astana:"Astana", Tashkent:"Tashkent", Kabul:"Cabul", Islamabad:"Islamabad", Kathmandu:"Katmandu", Dhaka:"Daca", Colombo:"Colombo", Bangkok:"Bangkok", "Kuala Lumpur":"Kuala Lumpur", Singapore:"Singapura", Manila:"Manila", Taipei:"Taipé", Pyongyang:"Pyongyang", Ulaanbaatar:"Ulan Bator", Brasilia:"Brasília", "Buenos Aires":"Buenos Aires", Santiago:"Santiago", Lima:"Lima", Bogota:"Bogotá", Quito:"Quito", Caracas:"Caracas", Montevideo:"Montevidéu", Asuncion:"Assunção", "La Paz":"La Paz", "Washington, D.C.":"Washington, D.C.", Ottawa:"Ottawa", Wellington:"Wellington", Amsterdam:"Amsterdã", Paris:"Paris" };
const SUB_PT = { northernafrica:"África Setentrional", westernafrica:"África Ocidental", middleafrica:"África Central", easternafrica:"África Oriental", southernafrica:"África Austral", northernamerica:"América do Norte", centralamerica:"América Central", southamerica:"América do Sul", caribbean:"Caribe", easternasia:"Ásia Oriental", southeasternasia:"Sudeste Asiático", southernasia:"Sul da Ásia", centralasia:"Ásia Central", westernasia:"Ásia Ocidental", northerneurope:"Europa do Norte", westerneurope:"Europa Ocidental", easterneurope:"Europa Oriental", southerneurope:"Europa do Sul", australiaandnewzealand:"Austrália e Nova Zelândia", melanesia:"Melanésia", micronesia:"Micronésia", polynesia:"Polinésia" };
const FEAT_CACHE = new Map();
function findCountry(feature, countries) {
  const key = getCountryName(feature);
  if (!FEAT_CACHE.has(key)) FEAT_CACHE.set(key, countries.find((c) => countryMatch(feature, c)) || null);
  return FEAT_CACHE.get(key);
}

function formatNumber(value) {
  return typeof value === "number" ? value.toLocaleString(LOC()) : "—";
}
function getCapital(country) {
  return country?.capital?.[0] || "Capital não informada";
}
function getCurrency(country) {
  const entries = Object.entries(country?.currencies || {});
  if (!entries.length) return "Não informada";
  const [code, currency] = entries[0];
  return `${currency.name || code}${currency.symbol ? ` (${currency.symbol})` : ""}`;
}
function getLanguages(country) {
  return Object.values(country?.languages || {}).join(", ") || "Não informado";
}
function getContinent(country) {
  return REGION_MAP[country?.region] || country?.region || "Outros";
}
function getCountryName(feature) {
  return feature?.properties?.ADMIN || feature?.properties?.name || feature?.properties?.NAME || "";
}
function countryMatch(feature, country) {
  const featureName = getCountryName(feature).toLowerCase();
  const names = [
    country?.name?.common, country?.name?.official, country?.name?.en,
    ...(country?.altSpellings || [])
  ].filter(Boolean).map((name) => name.toLowerCase());
  if (names.includes(featureName)) return true;
  const aliases = {
    "united states of america": ["united states", "united states of america"],
    "russian federation": ["russia", "russian federation"],
    "republic of korea": ["south korea", "republic of korea"],
    "democratic people's republic of korea": ["north korea", "democratic people's republic of korea"],
    "iran (islamic republic of)": ["iran", "islamic republic of iran"],
    "viet nam": ["vietnam", "viet nam"],
    "czechia": ["czechia", "czech republic"],
    "türkiye": ["turkey", "türkiye"],
    "bolivia (plurinational state of)": ["bolivia", "plurinational state of bolivia"],
    "venezuela (bolivarian republic of)": ["venezuela", "bolivarian republic of venezuela"],
    "tanzania, united republic of": ["tanzania", "united republic of tanzania"],
    "moldova, republic of": ["moldova", "republic of moldova"],
    "syrian arab republic": ["syria", "syrian arab republic"],
    "lao people's democratic republic": ["laos", "lao people's democratic republic"],
    "brunei darussalam": ["brunei", "brunei darussalam"],
    "côte d'ivoire": ["côte d'ivoire", "ivory coast"],
    "swaziland": ["eswatini", "swaziland"],
    "micronesia": ["micronesia", "federated states of micronesia"],
    "bahamas": ["bahamas", "the bahamas"],
    "gambia": ["gambia", "the gambia"],
    "palestine": ["palestine", "state of palestine"],
    "kosovo": ["kosovo", "republic of kosovo"]
  };
  const aliasesForFeature = aliases[featureName] || [];
  if (aliasesForFeature.some((name) => names.includes(name))) return true;
  return names.some((name) => name === featureName.replace(/^the /, ""));
}

function MapResizer({ active }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 180);
    return () => clearTimeout(timer);
  }, [active, map]);
  return null;
}

function FlyToSelected({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.latlng?.length === 2) map.flyTo(selected.latlng, (selected.area || 0) > 1.5e6 ? 3 : 4.5, { duration: 0.8 });
  }, [selected?.cca3, map]);
  return null;
}

function WorldMap({ countries, geoData, selected, onSelect, compact = false }) {
  const selRef = useRef(selected);
  selRef.current = selected;
  const geoRef = useRef(null);
  const featureStyle = useCallback((feature) => {
    const s = selRef.current;
    const active = s && countryMatch(feature, s);
    return {
      color: active ? "#b8f36b" : "#40534a",
      weight: active ? 1.8 : 0.6,
      fillColor: active ? "#b8f36b" : "#263a31",
      fillOpacity: active ? 0.78 : 0.5
    };
  }, []);
  useEffect(() => { geoRef.current?.setStyle(featureStyle); }, [selected, featureStyle]);

  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      mouseover: (event) => {
        event.target.setStyle({ fillColor: "#9edc60", fillOpacity: 0.8, color: "#d7ffad", weight: 1.4 });
      },
      mouseout: (event) => { event.target.setStyle(featureStyle(feature)); },
      click: () => {
        const found = findCountry(feature, countries);
        if (found) onSelect(found);
      }
    });
    layer.bindTooltip(findCountry(feature, countries)?.name.common || getCountryName(feature), { sticky: true, className: "map-tooltip" });
  }, [countries, onSelect, featureStyle]);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={compact ? 1.35 : 2}
      minZoom={1.3}
      maxZoom={7}
      scrollWheelZoom={!compact}
      zoomControl={!compact}
      worldCopyJump
      className={`world-map ${compact ? "world-map-compact" : ""}`}
    >
      <MapResizer active={compact} />
      {!compact && <FlyToSelected selected={selected} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {geoData && <GeoJSON ref={geoRef} key="all-countries" data={geoData} style={featureStyle} onEachFeature={onEachFeature} />}
      {selected?.latlng?.length === 2 && (
        <CircleMarker center={selected.latlng} radius={compact ? 5 : 7} pathOptions={{ color: "#101714", fillColor: "#b8f36b", fillOpacity: 1, weight: 2 }} />
      )}
    </MapContainer>
  );
}

function MapPopup({ country, onClose, onOpen }) {
  const Item = ({ icon: Icon, label, value }) => (
    <div className="mp-item"><Icon size={15} /><span>{label}</span><strong>{value}</strong></div>
  );
  return (
    <aside className="map-popup" key={country.cca3} aria-label={`Informações de ${country.name.common}`}>
      <div className="map-popup-head">
        <img src={country.flags?.svg || country.flags?.png} alt="" />
        <div><span className="eyebrow">{getContinent(country)} / {country.cca3}</span><h3>{country.name.common}</h3><p><MapPin size={13} /> {getCapital(country)}</p></div>
        <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={17} /></button>
      </div>
      <div className="map-popup-body">
        <div className="mp-grid">
          <Item icon={Users} label="População" value={formatNumber(country.population)} />
          <Item icon={Ruler} label="Área" value={`${formatNumber(country.area)} km²`} />
          <Item icon={Coins} label="Moeda" value={getCurrency(country)} />
          <Item icon={Languages} label="Idiomas" value={getLanguages(country)} />
          <Item icon={Clock3} label="Fuso horário" value={(country.timezones || []).slice(0, 2).join(", ") || "—"} />
          <Item icon={Compass} label="Sub-região" value={country.subregion || "—"} />
        </div>
        <WikiBlock country={country} />
        <CurrencyBlock country={country} />
      </div>
      <div className="map-popup-foot"><button className="button-primary" onClick={() => onOpen(country)}>Página completa <ArrowUpRight size={15} /></button></div>
    </aside>
  );
}

function WeatherIcon({ code, size = 28 }) {
  if (code === 0 || code === 1) return <Sun size={size} />;
  if ([2, 3, 45, 48].includes(code)) return <Cloud size={size} />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={size} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow size={size} />;
  return <CloudSun size={size} />;
}
function weatherDescription(code) {
  const descriptions = {
    0: "Céu limpo", 1: "Predominantemente limpo", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Nevoeiro", 48: "Nevoeiro com geada", 51: "Garoa leve", 53: "Garoa moderada",
    55: "Garoa intensa", 61: "Chuva leve", 63: "Chuva moderada", 65: "Chuva forte",
    71: "Neve leve", 73: "Neve moderada", 75: "Neve forte", 80: "Pancadas leves",
    81: "Pancadas moderadas", 82: "Pancadas fortes", 95: "Trovoadas"
  };
  return descriptions[code] || "Condição variável";
}

function Header({ activeTab, setActiveTab, favoritesCount, lang, onLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { id: "explorar", label: "Explorar", icon: Compass },
    { id: "mapa", label: "Mapa-múndi", icon: MapIcon },
    { id: "clima", label: "Clima", icon: CloudSun },
    { id: "quiz", label: "Quiz", icon: Gamepad2 },
    { id: "desafio", label: "Desafio", icon: Crosshair },
    { id: "comparar", label: "Comparar", icon: ArrowLeftRight },
    { id: "curiosidades", label: "Curiosidades", icon: Sparkles }
  ];
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setActiveTab("explorar")} aria-label="Ir para início">
        <span className="brand-mark"><Globe2 size={21} /></span>
        <span>atlas<span className="brand-dot">.</span></span>
      </button>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Menu size={21} /></button>
      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-link ${activeTab === id ? "active" : ""}`} onClick={() => { setActiveTab(id); setMenuOpen(false); }}>
            <Icon size={16} /> {label}
            {id === "curiosidades" && favoritesCount > 0 && <span className="nav-count">{favoritesCount}</span>}
          </button>
        ))}
      </nav>
      <div className="topbar-right"><span className="live-dot" /> <span>EXPLORE O MUNDO</span>
        <div className="lang-switch" role="group" aria-label="Idioma / Language">{LANGS.map((l) => <button key={l.id} className={l.id === lang ? "on" : ""} onClick={() => onLang(l.id)} title={l.name} aria-label={l.name}>{l.label}</button>)}</div></div>
    </header>
  );
}

function CountryCard({ country, onClick, isFavorite, toggleFavorite }) {
  return (
    <article className="country-card">
      <button className="card-main" onClick={() => onClick(country)}>
        <div className="flag-wrap"><img loading="lazy" src={country.flags?.svg || country.flags?.png} alt={`Bandeira de ${country.name.common}`} loading="lazy" /></div>
        <div className="card-copy">
          <div className="card-continent">{getContinent(country)}</div>
          <h3>{country.name.common}</h3>
          <p className="card-capital"><MapPin size={13} /> {getCapital(country)}</p>
        </div>
        <ArrowUpRight className="card-arrow" size={17} />
      </button>
      <div className="card-meta">
        <span><Users size={13} /> {formatNumber(country.population)}</span>
        <span><Ruler size={13} /> {formatNumber(country.area)} km²</span>
        <button className={`favorite-button ${isFavorite ? "saved" : ""}`} onClick={() => toggleFavorite(country.cca3)} aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

function CountrySilhouette({ country, geoData }) {
  const feature = useMemo(() => geoData?.features?.find((item) => countryMatch(item, country)), [geoData, country]);
  if (!feature) {
    return (
      <div className="silhouette-placeholder">
        <Globe2 size={76} strokeWidth={0.8} />
        <span>Silhueta geográfica</span>
        <small>Carregando contorno do país...</small>
      </div>
    );
  }
  const geom = feature.geometry;
  const polygons = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
  const all = polygons.flat(2);
  const xs = all.map((point) => point[0]), ys = all.map((point) => point[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 0.1), height = Math.max(maxY - minY, 0.1);
  const scale = Math.min(230 / width, 190 / height);
  const project = ([x, y]) => [18 + (x - minX) * scale, 18 + (maxY - y) * scale];
  const pathForRing = (ring) => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ") + " Z";
  const paths = polygons.flatMap((polygon) => polygon.map(pathForRing));
  return (
    <svg className="country-silhouette" viewBox="0 0 266 226" role="img" aria-label={`Silhueta geográfica de ${country.name.common}`}>
      <defs>
        <linearGradient id="silhouetteGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d5ff9d" />
          <stop offset="100%" stopColor="#8dc84e" />
        </linearGradient>
        <filter id="silhouetteGlow"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      {paths.map((path, index) => <path key={`glow-${index}`} d={path} fill="#b8f36b" opacity=".28" filter="url(#silhouetteGlow)" />)}
      {paths.map((path, index) => <path key={index} d={path} fill="url(#silhouetteGradient)" stroke="#e7ffc7" strokeWidth=".55" strokeLinejoin="round" />)}
    </svg>
  );
}

function DetailPanel({ country, countries, geoData, onClose, onSelect, isFavorite, toggleFavorite }) {
  const [section, setSection] = useState("visao-geral");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const capitalCoords = country?.capitalInfo?.latlng || country?.latlng;

  useEffect(() => {
    setSection("visao-geral");
    setWeather(null);
  }, [country?.cca3]);

  const loadWeather = useCallback(async () => {
    if (!capitalCoords || capitalCoords.length < 2) return;
    setWeatherLoading(true);
    try {
      const params = new URLSearchParams({
        latitude: capitalCoords[0], longitude: capitalCoords[1],
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        daily: "temperature_2m_max,temperature_2m_min,weather_code",
        forecast_days: "4", timezone: "auto"
      });
      const response = await fetch(`${WEATHER_URL}?${params}`);
      if (!response.ok) throw new Error("Não foi possível consultar o clima.");
      setWeather(await response.json());
    } catch {
      setWeather({ error: true });
    } finally {
      setWeatherLoading(false);
    }
  }, [capitalCoords]);

  useEffect(() => { loadWeather(); }, [loadWeather]);

  const borderCountries = (country.borders || []).map((code) => countries.find((item) => item.cca3 === code)).filter(Boolean);
  const tabs = [
    { id: "visao-geral", label: "Visão geral" },
    { id: "geografia", label: "Geografia" },
    { id: "cultura", label: "Cultura" },
    { id: "clima", label: "Clima da capital" }
  ];

  return (
    <div className="detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="detail-panel">
        <div className="detail-top">
          <button className="back-button" onClick={onClose}><ChevronRight size={17} className="back-chevron" /> Voltar ao atlas</button>
          <button className="icon-button close-button" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        </div>
        <div className="detail-hero">
          <div className="detail-heading">
            <span className="eyebrow">{getContinent(country)} / {country.subregion || "Região"}</span>
            <h1>{country.name.common}</h1>
            
            <div className="detail-actions">
              <button className={`button-primary ${isFavorite ? "button-saved" : ""}`} onClick={() => toggleFavorite(country.cca3)}>
                <Heart size={16} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "Salvo nos favoritos" : "Salvar país"}
              </button>
              <a className="button-secondary" href={country.maps?.googleMaps || `https://www.google.com/maps/search/${encodeURIComponent(country.name.common)}`} target="_blank" rel="noreferrer">
                Ver no mapa <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <div className="silhouette-card">
            <div className="silhouette-label"><span>FORMA DO TERRITÓRIO</span><span>MAPA / 01</span></div>
            <CountrySilhouette country={country} geoData={geoData} />
            <div className="silhouette-foot"><span className="live-dot" /> CONTORNO GEOGRÁFICO</div>
          </div>
        </div>
        <div className="detail-tabbar">
          {tabs.map((tab) => <button key={tab.id} className={section === tab.id ? "selected" : ""} onClick={() => setSection(tab.id)}>{tab.label}</button>)}
        </div>
        {section === "visao-geral" && (
          <div className="detail-content">
            <div className="flag-detail-card"><img src={country.flags?.svg || country.flags?.png} alt={`Bandeira de ${country.name.common}`} /><div><span>BANDEIRA NACIONAL</span><p>{country.flags?.alt || `Bandeira de ${country.name.common}`}</p></div></div>
            <div className="stat-grid">
              <Stat icon={Users} label="População" value={formatNumber(country.population)} />
              <Stat icon={Ruler} label="Área territorial" value={`${formatNumber(country.area)} km²`} />
              <Stat icon={MapPin} label="Capital" value={getCapital(country)} />
              <Stat icon={Globe2} label="Continente" value={getContinent(country)} />
            </div>
            <div className="info-grid">
              <InfoRow icon={Coins} label="Moeda" value={getCurrency(country)} />
              <InfoRow icon={Languages} label="Idiomas" value={getLanguages(country)} />
              <InfoRow icon={Clock3} label="Fuso horário" value={(country.timezones || []).slice(0, 3).join(", ") || "Não informado"} />
              <InfoRow icon={Compass} label="Sub-região" value={country.subregion || "Não informada"} />
            </div>
            <WikiBlock country={country} />
            <CurrencyBlock country={country} />
          </div>
        )}
        {section === "geografia" && (
          <div className="detail-content">
            <div className="section-intro"><span className="eyebrow">TERRITÓRIO</span><h2>Geografia & localização</h2><p>Informações geográficas e países que compartilham fronteiras terrestres.</p></div>
            <div className="stat-grid">
              <Stat icon={Ruler} label="Área" value={`${formatNumber(country.area)} km²`} />
              <Stat icon={Compass} label="Coordenadas" value={country.latlng?.map((n) => n.toFixed(2)).join(", ") || "—"} />
              <Stat icon={Globe2} label="Continente" value={getContinent(country)} />
              <Stat icon={MapPin} label="Região" value={country.subregion || "—"} />
            </div>
            <div className="border-section"><h3>Países vizinhos <span>{borderCountries.length}</span></h3>{borderCountries.length ? <div className="border-list">{borderCountries.map((border) => <button key={border.cca3} onClick={() => onSelect(border)}><img src={border.flags?.svg || border.flags?.png} alt="" /><span>{border.name.common}</span><ChevronRight size={15} /></button>)}</div> : <p className="muted">Este país não possui fronteiras terrestres com outros países.</p>}</div>
          </div>
        )}
        {section === "cultura" && (
          <div className="detail-content">
            <div className="section-intro"><span className="eyebrow">IDENTIDADE</span><h2>Cultura & sociedade</h2><p>Uma visão geral das informações culturais disponíveis para este país.</p></div>
            <div className="culture-card"><Languages size={22} /><div><span>IDIOMAS</span><h3>{getLanguages(country)}</h3><p>Idiomas registrados na base de dados consultada.</p></div></div>
            <div className="culture-card"><Coins size={22} /><div><span>MOEDA(S)</span><h3>{getCurrency(country)}</h3><p>Moeda(s) listada(s) nos dados nacionais.</p></div></div>
            <div className="culture-card"><Clock3 size={22} /><div><span>FUSOS HORÁRIOS</span><h3>{(country.timezones || []).join(", ") || "Não informado"}</h3><p>Um país pode abranger mais de um fuso horário.</p></div></div>
          </div>
        )}
        {section === "clima" && (
          <div className="detail-content">
            <div className="section-intro"><span className="eyebrow">OPEN-METEO / AO VIVO</span><h2>Clima em {getCapital(country)}</h2><p>Condições atuais e previsão para a capital, quando há coordenadas disponíveis.</p></div>
            {weatherLoading && <div className="loading-inline"><span className="spinner" /> Consultando previsão meteorológica...</div>}
            {weather?.error && <div className="empty-state small-empty"><CloudSun size={28} /><p>Não foi possível carregar o clima agora.</p><button className="button-secondary" onClick={loadWeather}><RefreshCw size={14} /> Tentar novamente</button></div>}
            {weather?.current && !weather.error && <WeatherPanel weather={weather} capital={getCapital(country)} />}
            {!weatherLoading && !weather && !capitalCoords && <p className="muted">Não há coordenadas disponíveis para esta capital.</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return <div className="stat-card"><span className="stat-icon"><Icon size={17} /></span><span className="stat-label">{label}</span><strong>{value}</strong></div>;
}
function InfoRow({ icon: Icon, label, value }) {
  return <div className="info-row"><span className="info-icon"><Icon size={17} /></span><div><span>{label}</span><p>{value}</p></div></div>;
}
function WeatherPanel({ weather, capital }) {
  const current = weather.current;
  return (
    <div className="weather-detail">
      <div className="weather-current">
        <div><span className="weather-city"><MapPin size={14} /> {capital}</span><div className="weather-temperature">{Math.round(current.temperature_2m)}°<span>C</span></div><p>{weatherDescription(current.weather_code)}</p></div>
        <div className="weather-big-icon"><WeatherIcon code={current.weather_code} size={58} /></div>
      </div>
      <div className="weather-metrics">
        <div><Thermometer size={17} /><span>Sensação</span><strong>{Math.round(current.apparent_temperature)}°C</strong></div>
        <div><Droplets size={17} /><span>Umidade</span><strong>{current.relative_humidity_2m}%</strong></div>
        <div><Wind size={17} /><span>Vento</span><strong>{Math.round(current.wind_speed_10m)} km/h</strong></div>
      </div>
      <h3 className="forecast-title">Próximos dias</h3>
      <div className="forecast-list">
        {weather.daily?.time?.map((date, index) => (
          <div className="forecast-day" key={date}>
            <span>{index === 0 ? "Hoje" : new Date(`${date}T12:00:00`).toLocaleDateString(LOC(), { weekday: "short" }).replace(".", "")}</span>
            <WeatherIcon code={weather.daily.weather_code[index]} size={20} />
            <strong>{Math.round(weather.daily.temperature_2m_max[index])}°</strong>
            <span className="forecast-low">{Math.round(weather.daily.temperature_2m_min[index])}°</span>
          </div>
        ))}
      </div>
      <p className="data-note">Dados meteorológicos: Open-Meteo · Atualização conforme disponibilidade da API.</p>
    </div>
  );
}

function WeatherTab({ countries, onSelectCountry }) {
  const [query, setQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState("BRA");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = countries.find((country) => country.cca3 === selectedCode) || countries.find((country) => country.cca3 === "BRA");
  const capitals = useMemo(() => countries.filter((country) => country.capital?.[0] && country.latlng?.length === 2).sort((a, b) => tn(a.name.common).localeCompare(tn(b.name.common), LOC())), [countries]);
  const norm = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtered = capitals.filter((country) => norm(`${country.name.common} ${country.name.en || ""} ${getCapital(country)} ${country.capitalEn || ""} ${tn(country.name.common)} ${tn(getCapital(country))}`).includes(norm(query.trim())));
  const [cities, setCities] = useState([]);
  const [place, setPlace] = useState(null);
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) { setCities([]); return; }
    const t = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=${LANG()}&format=json`)
        .then((r) => r.json()).then((d) => setCities(d.results || [])).catch(() => setCities([]));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const fetchWeather = useCallback(async (c) => {
    if (!c) return;
    setLoading(true); setError(""); setWeather(null);
    try {
      const [latitude, longitude] = c;
      const params = new URLSearchParams({
        latitude, longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        daily: "temperature_2m_max,temperature_2m_min,weather_code",
        forecast_days: "5", timezone: "auto"
      });
      const response = await fetch(`${WEATHER_URL}?${params}`);
      if (!response.ok) throw new Error("A API meteorológica não respondeu como esperado.");
      setWeather(await response.json());
    } catch (e) {
      setError("Não foi possível consultar o clima. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      let c = place ? [place.lat, place.lon] : null;
      if (!c && selected) {
        c = selected.latlng;
        try {
          const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(selected.capitalEn || selected.capital[0])}&count=1&language=${LANG()}&countryCode=${selected.cca2}`);
          const g = (await r.json()).results?.[0];
          if (g) c = [g.latitude, g.longitude];
        } catch {}
      }
      if (alive && c) { setCoords(c); fetchWeather(c); }
    })();
    return () => { alive = false; };
  }, [selectedCode, place, fetchWeather]);

  return (
    <main className="page-shell weather-page">
      <div className="page-heading">
        <div><span className="eyebrow"><span className="live-dot" /> OPEN-METEO / CLIMA GLOBAL</span><h1>O mundo, <em>em tempo real.</em></h1><p>Explore as condições meteorológicas das capitais ao redor do planeta.</p></div>
        <div className="heading-stamp"><CloudSun size={25} /><span>OBSERVATÓRIO<br />DO CLIMA</span></div>
      </div>
      <div className="weather-layout">
        <aside className="weather-selector">
          <div className="selector-title"><div><span className="eyebrow">LOCALIZAÇÃO</span><h2>Escolha um país</h2></div><span className="selector-count">{capitals.length}</span></div>
          <label className="search-box weather-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar país, capital ou cidade..." /><kbd>⌘ K</kbd></label>
          <div className="country-picker">
            {filtered.map((country) => (
              <button key={country.cca3} className={`picker-item ${!place && country.cca3 === selectedCode ? "active" : ""}`} onClick={() => { setSelectedCode(country.cca3); setPlace(null); }}>
                <img src={country.flags?.svg || country.flags?.png} alt="" /><span><strong>{country.name.common}</strong><small>{getCapital(country)}</small></span><ChevronRight size={15} />
              </button>
            ))}
            {cities.length > 0 && <p className="picker-group">Cidades encontradas</p>}
            {cities.map((ci) => (
              <button key={ci.id} className={`picker-item ${place?.id === ci.id ? "active" : ""}`} onClick={() => setPlace({ id: ci.id, name: ci.name, lat: ci.latitude, lon: ci.longitude, admin: ci.admin1, country: ci.country })}>
                <MapPin size={18} /><span><strong>{ci.name}</strong><small>{[ci.admin1, ci.country].filter(Boolean).join(", ")}</small></span><ChevronRight size={15} />
              </button>
            ))}
            {!filtered.length && !cities.length && <p className="muted picker-empty">Nenhum resultado. Tente outro nome.</p>}
          </div>
          <p className="selector-foot">Selecione um país para consultar o clima de sua capital.</p>
        </aside>
        <section className="weather-main">
          {selected && (
            <div className="weather-country-banner">
              <div className="weather-banner-flag"><img src={selected.flags?.svg || selected.flags?.png} alt="" /></div>
              <div><span className="eyebrow">{getContinent(selected)} / {selected.cca3}</span><h2>{place ? place.name : selected.name.common}</h2><p><MapPin size={14} /> {place ? [place.admin, place.country].filter(Boolean).join(", ") : getCapital(selected)}</p></div>
              <button className="button-secondary" onClick={() => onSelectCountry(selected)}>Ver país <ArrowUpRight size={14} /></button>
            </div>
          )}
          {loading && <div className="weather-loading"><span className="spinner" /><h3>Buscando as condições do tempo</h3><p>Consultando a previsão meteorológica...</p></div>}
          {error && !loading && <div className="empty-state"><CloudSun size={34} /><h3>Clima indisponível</h3><p>{error}</p><button className="button-primary" onClick={() => fetchWeather(coords)}><RefreshCw size={15} /> Tentar novamente</button></div>}
          {weather?.current && !loading && (
            <>
              <div className="weather-hero-card">
                <div className="weather-hero-copy"><span className="eyebrow">CONDIÇÕES ATUAIS <span className="weather-live">● AO VIVO</span></span><h3>{Math.round(weather.current.temperature_2m)}<span>°C</span></h3><p>{weatherDescription(weather.current.weather_code)}</p><span className="feels-like">Sensação térmica de {Math.round(weather.current.apparent_temperature)}°C</span></div>
                <div className="weather-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="sun-disc"><WeatherIcon code={weather.current.weather_code} size={62} /></div><span className="orbit-point point-one" /><span className="orbit-point point-two" /></div>
                <div className="weather-hero-bottom"><span><Clock3 size={14} /> {weather.current.time?.replace("T", " · ")}</span><span><LocateFixed size={14} /> {coords?.map((n) => n.toFixed(2)).join(", ")}</span></div>
              </div>
              <div className="weather-metric-grid">
                <div className="weather-metric-card"><span className="metric-icon"><Thermometer size={18} /></span><span>Sensação térmica</span><strong>{Math.round(weather.current.apparent_temperature)}°<small>C</small></strong><p>Temperatura percebida</p></div>
                <div className="weather-metric-card"><span className="metric-icon"><Droplets size={18} /></span><span>Umidade relativa</span><strong>{weather.current.relative_humidity_2m}<small>%</small></strong><p>Umidade do ar</p></div>
                <div className="weather-metric-card"><span className="metric-icon"><Wind size={18} /></span><span>Velocidade do vento</span><strong>{Math.round(weather.current.wind_speed_10m)}<small> km/h</small></strong><p>Vento na região</p></div>
                <div className="weather-metric-card"><span className="metric-icon"><CloudRain size={18} /></span><span>Precipitação</span><strong>{weather.current.precipitation}<small> mm</small></strong><p>Volume atual</p></div>
              </div>
              <div className="forecast-card"><div className="forecast-head"><div><span className="eyebrow">PREVISÃO ESTENDIDA</span><h3>Próximos dias</h3></div><span className="forecast-unit">°C</span></div><div className="forecast-wide">
                {weather.daily?.time?.map((date, index) => (
                  <div className={`forecast-wide-day ${index === 0 ? "today" : ""}`} key={date}>
                    <span>{index === 0 ? "Hoje" : new Date(`${date}T12:00:00`).toLocaleDateString(LOC(), { weekday: "short" }).replace(".", "")}</span>
                    <WeatherIcon code={weather.daily.weather_code[index]} size={27} />
                    <strong>{Math.round(weather.daily.temperature_2m_max[index])}°</strong>
                    <span className="forecast-low">{Math.round(weather.daily.temperature_2m_min[index])}°</span>
                    <small>{weatherDescription(weather.daily.weather_code[index])}</small>
                  </div>
                ))}
              </div></div>
              <p className="data-note">Fonte: Open-Meteo. Os dados correspondem à capital (ou cidade) selecionada, não ao território inteiro do país.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("atlas-lang") || "pt"; } catch { return "pt"; } });
  const [detail, setDetail] = useState(null);
  const [countries, setCountries] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState("explorar");
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("Todos os continentes");
  const [sortBy, setSortBy] = useState("az");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-favoritos") || "[]"); } catch { return []; }
  });
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareA, setCompareA] = useState("BRA");
  const [compareB, setCompareB] = useState("JPN");

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(COUNTRIES_URL).then((response) => { if (!response.ok) throw new Error("Falha ao carregar os países."); return response.json(); }),
      fetch(GEOJSON_URL).then((response) => { if (!response.ok) throw new Error("Falha ao carregar os contornos geográficos."); return response.json(); }).catch(() => null)
    ]).then(([countryData, geo]) => {
      if (!alive) return;
      const normalizedCountries = countryData.map((country) => ({
        ...country,
        name: { common: safe(REGION_PT, country.alpha2Code, country.name), official: safe(REGION_PT, country.alpha2Code, country.name), en: country.name },
        cca2: country.alpha2Code,
        cca3: country.alpha3Code,
        capital: country.capital ? [CAPITALS_PT[country.capital] || country.capital] : [],
        region: country.region === "Polar" || country.region === "Antarctic" ? "Antarctic" : country.region,
        continents: [country.region],
        flags: { svg: country.flags?.svg || country.flag, png: country.flags?.png || country.flag },
        currencies: Array.isArray(country.currencies)
          ? Object.fromEntries(country.currencies.map((currency) => [currency.code, { ...currency, name: safe(CUR_PT, currency.code, currency.name) }]))
          : country.currencies || {},
        languages: Array.isArray(country.languages)
          ? Object.fromEntries(country.languages.map((language, index) => [language.iso639_1 || String(index), safe(LANG_PT, language.iso639_1, language.name)]))
          : country.languages || {},
        latlng: country.latlng || [],
        capitalEn: country.capital,
        timezones: country.timezones || [],
        borders: country.borders || [],
        maps: country.maps || {},
        subregion: SUB_PT[(country.subregion || "").toLowerCase().replace(/[\s-]/g, "")] || country.subregion,
      })).filter((country) => country.name?.common).sort((a, b) => a.name.common.localeCompare(b.name.common));
      setCountries(normalizedCountries);
      setGeoData(geo);
    }).catch(() => { if (alive) setApiError("Não foi possível carregar os países. Verifique sua conexão e tente novamente."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem("atlas-favoritos", JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const toggleFavorite = (code) => setFavorites((old) => old.includes(code) ? old.filter((item) => item !== code) : [...old, code]);
  useMemo(() => configureLanguage(lang, countries), [lang, countries]);
  const changeLang = (l) => { setLang(l); try { localStorage.setItem("atlas-lang", l); } catch {} };
  const openCountry = (country) => setDetail(country);
  const filteredCountries = useMemo(() => {
    let result = countries.filter((country) => {
      const query = search.toLowerCase().trim();
      const matchesSearch = !query || [
        country.name.common, country.name.official, getCapital(country), getContinent(country),
        tn(country.name.common), tn(getCapital(country)), tn(getContinent(country))
      ].some((value) => value?.toLowerCase().includes(query));
      const matchesContinent = continent === "Todos os continentes" || getContinent(country) === continent;
      const matchesFavorites = activeTab !== "favoritos" || favorites.includes(country.cca3);
      return matchesSearch && matchesContinent && matchesFavorites;
    });
    if (sortBy === "az") result = [...result].sort((a, b) => tn(a.name.common).localeCompare(tn(b.name.common), LOC()));
    if (sortBy === "za") result = [...result].sort((a, b) => tn(b.name.common).localeCompare(tn(a.name.common), LOC()));
    if (sortBy === "population") result = [...result].sort((a, b) => (b.population || 0) - (a.population || 0));
    if (sortBy === "area") result = [...result].sort((a, b) => (b.area || 0) - (a.area || 0));
    return result;
  }, [countries, search, continent, sortBy, activeTab, favorites, lang]);

  const countryA = countries.find((country) => country.cca3 === compareA);
  const countryB = countries.find((country) => country.cca3 === compareB);

  return (
    <div className="app" key={lang}>
      <Header activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSelectedCountry(null); setDetail(null); }} favoritesCount={favorites.length} lang={lang} onLang={changeLang} />
      {loading && <div className="app-loading"><span className="spinner" /><p>Preparando seu atlas...</p></div>}
      {!loading && apiError && <div className="page-shell"><div className="empty-state"><Globe2 size={40} /><h2>O atlas está temporariamente indisponível</h2><p>{apiError}</p><button className="button-primary" onClick={() => window.location.reload()}><RefreshCw size={15} /> Recarregar</button></div></div>}
      {!loading && !apiError && (activeTab === "explorar" || activeTab === "favoritos") && !selectedCountry && (
        <main className="page-shell">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><span className="live-dot" /> UM PLANETA. MILHARES DE HISTÓRIAS.</span>
              <h1>Conheça o mundo<br />em <em>outra perspectiva.</em></h1>
              <p>Explore países, descubra culturas e entenda os lugares que fazem o nosso planeta extraordinário.</p>
              <button className="button-primary hero-cta" onClick={() => setActiveTab("quiz")}><Gamepad2 size={16} /> Jogar quiz</button>
              <div className="hero-stats"><div><strong>{countries.length || "250"}<sup>+</sup></strong><span>PAÍSES & TERRITÓRIOS</span></div><div><strong>06</strong><span>CONTINENTES</span></div><div><strong>∞</strong><span>COISAS PARA DESCOBRIR</span></div></div>
            </div>
            <div className="hero-globe">
              <div className="globe-ring ring-a" /><div className="globe-ring ring-b" /><div className="globe-core"><Globe2 size={146} strokeWidth={0.7} /></div>
              <span className="globe-tag tag-one"><span className="live-dot" /> EXPLORAÇÃO GLOBAL</span>
              <span className="globe-tag tag-two">LAT 20° N · LONG 0°</span>
              <span className="globe-cross cross-one">+</span><span className="globe-cross cross-two">+</span>
            </div>
          </section>
          <section className="explore-section">
            <div className="section-heading"><div><span className="eyebrow">CATÁLOGO GEOGRÁFICO</span><h2>{activeTab === "favoritos" ? "Seus países salvos" : "Explore os países"}<span className="result-count">{filteredCountries.length}</span></h2></div><button className="text-button" onClick={() => { setSearch(""); setContinent("Todos os continentes"); setSortBy("az"); }}>Limpar filtros <RefreshCw size={14} /></button></div>
            <div className="filter-bar">
              <label className="search-box"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Busque país, capital ou região..." /><kbd>⌘ K</kbd></label>
              <label className="select-wrap"><Globe2 size={16} /><select value={continent} onChange={(e) => setContinent(e.target.value)}>{CONTINENTS.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronRight size={15} /></label>
              <label className="select-wrap sort-select"><span className="sort-glyph">↕</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="az">Nome: A–Z</option><option value="za">Nome: Z–A</option><option value="population">Maior população</option><option value="area">Maior área</option></select><ChevronRight size={15} /></label>
            </div>
            {activeTab === "favoritos" && favorites.length === 0 && <div className="empty-state"><Heart size={32} /><h3>Seus favoritos começam aqui</h3><p>Use o coração em qualquer país para montar sua coleção pessoal.</p><button className="button-primary" onClick={() => setActiveTab("explorar")}>Explorar países <ArrowUpRight size={15} /></button></div>}
            {filteredCountries.length > 0 ? <div className="country-grid">{filteredCountries.map((country) => <CountryCard key={country.cca3} country={country} onClick={openCountry} isFavorite={favorites.includes(country.cca3)} toggleFavorite={toggleFavorite} />)}</div> : activeTab !== "favoritos" || favorites.length > 0 ? <div className="empty-state"><Search size={30} /><h3>Nenhum país encontrado</h3><p>Tente outro nome ou altere os filtros selecionados.</p></div> : null}
          </section>
          <footer className="footer"><span>ATLAS <span className="brand-dot">.</span> EXPLORADOR DO MUNDO</span><span>Dados geográficos via REST Countries · Mapas © OpenStreetMap</span><span>FEITO PARA DESCOBRIR <Sparkles size={13} /></span></footer>
        </main>
      )}
      {!loading && !apiError && activeTab === "mapa" && (
        <main className="page-shell map-page">
          <div className="page-heading"><div><span className="eyebrow">CARTOGRAFIA INTERATIVA</span><h1>O mundo ao <em>seu alcance.</em></h1><p>Clique em qualquer território para descobrir seus dados e explorar suas fronteiras.</p></div><div className="map-legend"><span><i className="legend-dot selected-dot" /> País selecionado</span><span><i className="legend-dot" /> Explore no mapa</span></div></div>
          <div className="map-dashboard">
            <div className="map-topline"><div><span className="eyebrow">MUNDO / 001</span><h2>{selectedCountry?.name.common || "Planeta Terra"}</h2><p>{selectedCountry ? `${getContinent(selectedCountry)} · ${getCapital(selectedCountry)}` : "Visão global dos países e territórios"}</p></div>{selectedCountry && <button className="button-primary" onClick={() => openCountry(selectedCountry)}>Ver detalhes <ArrowUpRight size={15} /></button>}</div>
            <div className="large-map">{selectedCountry && <MapPopup country={selectedCountry} onClose={() => setSelectedCountry(null)} onOpen={openCountry} />}{geoData ? <WorldMap countries={countries} geoData={geoData} selected={selectedCountry} onSelect={setSelectedCountry} /> : <div className="map-loading"><span className="spinner" /> Carregando mapa geográfico...</div>}</div>
            <div className="map-bottomline"><span><span className="live-dot" /> MAPA INTERATIVO</span><span>Fonte cartográfica: OpenStreetMap · Contornos: GeoJSON</span><span>ARRASTE · ZOOM · CLIQUE</span></div>
          </div>
          <footer className="footer"><span>ATLAS <span className="brand-dot">.</span></span><span>Contornos geográficos para exploração educativa.</span><span>DADOS ABERTOS</span></footer>
        </main>
      )}
      {!loading && !apiError && activeTab === "quiz" && <Quiz countries={countries} geoData={geoData} match={countryMatch} />}
      {!loading && !apiError && activeTab === "clima" && <WeatherTab countries={countries} onSelectCountry={openCountry} />}
      {detail && !loading && !apiError && <DetailPanel country={detail} countries={countries} geoData={geoData} onClose={() => setDetail(null)} onSelect={setDetail} isFavorite={favorites.includes(detail.cca3)} toggleFavorite={toggleFavorite} />}
      {!loading && !apiError && activeTab === "desafio" && <Locate countries={countries} geoData={geoData} match={countryMatch} />}
      {!loading && !apiError && activeTab === "comparar" && <Compare countries={countries} />}
      {!loading && !apiError && activeTab === "curiosidades" && <Curiosities countries={countries} favorites={favorites} onOpen={openCountry} />}
    </div>
  );
}

export default App;
