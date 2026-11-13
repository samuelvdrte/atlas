export const LANGS = [
  { id: "pt", label: "PT", loc: "pt-BR", name: "Português" },
  { id: "en", label: "EN", loc: "en-US", name: "English" },
  { id: "es", label: "ES", loc: "es-ES", name: "Español" }
];
export const LOC = () => window.__atlasLoc || "pt-BR";
export const LANG = () => window.__atlasLang || "pt";

// [português, inglês, espanhol]
const T = [
["Explorar","Explore","Explorar"],["Mapa-múndi","World map","Mapamundi"],["Clima","Weather","Clima"],["Quiz","Quiz","Quiz"],["Desafio","Challenge","Desafío"],["Comparar","Compare","Comparar"],["Curiosidades","Fun facts","Curiosidades"],
["Abrir menu","Open menu","Abrir menú"],["Ir para início","Go to home","Ir al inicio"],["EXPLORE O MUNDO","EXPLORE THE WORLD","EXPLORA EL MUNDO"],
["UM PLANETA. MILHARES DE HISTÓRIAS.","ONE PLANET. THOUSANDS OF STORIES.","UN PLANETA. MILES DE HISTORIAS."],["Conheça o mundo","See the world","Conoce el mundo"],["em","from","desde"],["outra perspectiva.","a new perspective.","otra perspectiva."],
["Explore países, descubra culturas e entenda os lugares que fazem o nosso planeta extraordinário.","Explore countries, discover cultures and understand the places that make our planet extraordinary.","Explora países, descubre culturas y comprende los lugares que hacen extraordinario a nuestro planeta."],
["Jogar quiz","Play quiz","Jugar al quiz"],["PAÍSES & TERRITÓRIOS","COUNTRIES & TERRITORIES","PAÍSES Y TERRITORIOS"],["CONTINENTES","CONTINENTS","CONTINENTES"],["COISAS PARA DESCOBRIR","THINGS TO DISCOVER","COSAS POR DESCUBRIR"],["EXPLORAÇÃO GLOBAL","GLOBAL EXPLORATION","EXPLORACIÓN GLOBAL"],["CATÁLOGO GEOGRÁFICO","GEOGRAPHIC CATALOG","CATÁLOGO GEOGRÁFICO"],
["Explorar países","Explore countries","Explorar países"],["Explore os países","Explore the countries","Explora los países"],["Seus países salvos","Your saved countries","Tus países guardados"],
["Busque país, capital ou região...","Search country, capital or region...","Busca país, capital o región..."],["Buscar país, capital ou cidade...","Search country, capital or city...","Buscar país, capital o ciudad..."],
["Todos os continentes","All continents","Todos los continentes"],["Nome: A–Z","Name: A–Z","Nombre: A–Z"],["Nome: Z–A","Name: Z–A","Nombre: Z–A"],["Maior população","Largest population","Mayor población"],["Maior área","Largest area","Mayor superficie"],
["Limpar filtros","Clear filters","Limpiar filtros"],["Nenhum país encontrado","No country found","Ningún país encontrado"],["Tente outro nome ou altere os filtros selecionados.","Try another name or change the selected filters.","Prueba con otro nombre o cambia los filtros."],
["Seus favoritos começam aqui","Your favorites start here","Tus favoritos empiezan aquí"],["Use o coração em qualquer país para montar sua coleção pessoal.","Use the heart on any country to build your personal collection.","Usa el corazón en cualquier país para crear tu colección personal."],
["Preparando seu atlas...","Preparing your atlas...","Preparando tu atlas..."],["O atlas está temporariamente indisponível","The atlas is temporarily unavailable","El atlas no está disponible temporalmente"],["Recarregar","Reload","Recargar"],
["Falha ao carregar os países.","Failed to load countries.","Error al cargar los países."],["Não foi possível carregar os países. Verifique sua conexão e tente novamente.","Could not load the countries. Check your connection and try again.","No se pudieron cargar los países. Revisa tu conexión e inténtalo de nuevo."],["Falha ao carregar os contornos geográficos.","Failed to load country outlines.","Error al cargar los contornos geográficos."],
["ATLAS","ATLAS","ATLAS"],["EXPLORADOR DO MUNDO","WORLD EXPLORER","EXPLORADOR DEL MUNDO"],["Dados geográficos via REST Countries · Mapas © OpenStreetMap","Geographic data via REST Countries · Maps © OpenStreetMap","Datos geográficos vía REST Countries · Mapas © OpenStreetMap"],["Contornos geográficos para exploração educativa.","Geographic outlines for educational exploration.","Contornos geográficos para exploración educativa."],["DADOS ABERTOS","OPEN DATA","DATOS ABIERTOS"],["FEITO PARA DESCOBRIR","MADE TO DISCOVER","HECHO PARA DESCUBRIR"],
["CARTOGRAFIA INTERATIVA","INTERACTIVE CARTOGRAPHY","CARTOGRAFÍA INTERACTIVA"],["O mundo ao","The world at","El mundo a"],["seu alcance.","your fingertips.","tu alcance."],["Clique em qualquer território para descobrir seus dados e explorar suas fronteiras.","Click any territory to discover its data and explore its borders.","Haz clic en cualquier territorio para descubrir sus datos y explorar sus fronteras."],
["MUNDO / 001","WORLD / 001","MUNDO / 001"],["MAPA / 01","MAP / 01","MAPA / 01"],["Planeta Terra","Planet Earth","Planeta Tierra"],["Visão global dos países e territórios","Global view of countries and territories","Visión global de países y territorios"],["Ver detalhes","View details","Ver detalles"],["Carregando mapa geográfico...","Loading geographic map...","Cargando mapa geográfico..."],["MAPA INTERATIVO","INTERACTIVE MAP","MAPA INTERACTIVO"],["ARRASTE · ZOOM · CLIQUE","DRAG · ZOOM · CLICK","ARRASTRA · ZOOM · CLIC"],["Fonte cartográfica: OpenStreetMap · Contornos: GeoJSON","Map source: OpenStreetMap · Outlines: GeoJSON","Fuente cartográfica: OpenStreetMap · Contornos: GeoJSON"],
["Página completa","Full page","Página completa"],["Fechar","Close","Cerrar"],["Limpar seleção","Clear selection","Borrar selección"],["País selecionado","Selected country","País seleccionado"],["PAÍS SELECIONADO","SELECTED COUNTRY","PAÍS SELECCIONADO"],["Explorar país","Explore country","Explorar país"],
["Voltar ao atlas","Back to atlas","Volver al atlas"],["Adicionar aos favoritos","Add to favorites","Añadir a favoritos"],["Remover dos favoritos","Remove from favorites","Quitar de favoritos"],["Salvar país","Save country","Guardar país"],["Salvo nos favoritos","Saved to favorites","Guardado en favoritos"],
["Visão geral","Overview","Resumen"],["Geografia","Geography","Geografía"],["Cultura","Culture","Cultura"],["Clima da capital","Capital weather","Clima de la capital"],["Geografia & localização","Geography & location","Geografía y ubicación"],["Cultura & sociedade","Culture & society","Cultura y sociedad"],
["População","Population","Población"],["Área","Area","Superficie"],["Área territorial","Land area","Superficie territorial"],["Capital","Capital","Capital"],["Continente","Continent","Continente"],["Sub-região","Subregion","Subregión"],["Região","Region","Región"],["Coordenadas","Coordinates","Coordenadas"],["Moeda","Currency","Moneda"],["Idiomas","Languages","Idiomas"],["Fuso horário","Time zone","Huso horario"],["Densidade","Density","Densidad"],
["Capital não informada","Capital not provided","Capital no informada"],["Não informada","Not provided","No informada"],["Não informado","Not provided","No informado"],["Outros","Others","Otros"],
["BANDEIRA NACIONAL","NATIONAL FLAG","BANDERA NACIONAL"],["FORMA DO TERRITÓRIO","TERRITORY SHAPE","FORMA DEL TERRITORIO"],["CONTORNO GEOGRÁFICO","GEOGRAPHIC OUTLINE","CONTORNO GEOGRÁFICO"],["TERRITÓRIO","TERRITORY","TERRITORIO"],["Silhueta geográfica","Geographic silhouette","Silueta geográfica"],["Carregando contorno do país...","Loading country outline...","Cargando contorno del país..."],
["Informações geográficas e países que compartilham fronteiras terrestres.","Geographic information and countries that share land borders.","Información geográfica y países que comparten fronteras terrestres."],["Países vizinhos","Neighboring countries","Países vecinos"],["Este país não possui fronteiras terrestres com outros países.","This country has no land borders with other countries.","Este país no tiene fronteras terrestres con otros países."],
["IDENTIDADE","IDENTITY","IDENTIDAD"],["Uma visão geral das informações culturais disponíveis para este país.","An overview of the cultural information available for this country.","Un resumen de la información cultural disponible sobre este país."],["IDIOMAS","LANGUAGES","IDIOMAS"],["Idiomas registrados na base de dados consultada.","Languages recorded in the consulted database.","Idiomas registrados en la base de datos consultada."],["MOEDA(S)","CURRENCY(IES)","MONEDA(S)"],["Moeda(s) listada(s) nos dados nacionais.","Currency(ies) listed in national data.","Moneda(s) indicada(s) en los datos nacionales."],["FUSOS HORÁRIOS","TIME ZONES","HUSOS HORARIOS"],["Um país pode abranger mais de um fuso horário.","A country may span more than one time zone.","Un país puede abarcar más de un huso horario."],
["OPEN-METEO / AO VIVO","OPEN-METEO / LIVE","OPEN-METEO / EN VIVO"],["OPEN-METEO / CLIMA GLOBAL","OPEN-METEO / GLOBAL WEATHER","OPEN-METEO / CLIMA GLOBAL"],["Clima em","Weather in","Clima en"],["Condições atuais e previsão para a capital, quando há coordenadas disponíveis.","Current conditions and forecast for the capital, when coordinates are available.","Condiciones actuales y pronóstico para la capital, cuando hay coordenadas disponibles."],["Consultando previsão meteorológica...","Checking weather forecast...","Consultando el pronóstico del tiempo..."],["Consultando a previsão meteorológica...","Checking the weather forecast...","Consultando el pronóstico del tiempo..."],
["Não foi possível carregar o clima agora.","Could not load the weather right now.","No se pudo cargar el clima ahora."],["Não foi possível consultar o clima.","Could not check the weather.","No se pudo consultar el clima."],["Não foi possível consultar o clima. Verifique sua conexão e tente novamente.","Could not check the weather. Check your connection and try again.","No se pudo consultar el clima. Revisa tu conexión e inténtalo de nuevo."],["A API meteorológica não respondeu como esperado.","The weather API did not respond as expected.","La API meteorológica no respondió como se esperaba."],["Não há coordenadas disponíveis para esta capital.","No coordinates available for this capital.","No hay coordenadas disponibles para esta capital."],
["Tentar novamente","Try again","Reintentar"],["Sensação","Feels like","Sensación"],["Sensação térmica","Feels like","Sensación térmica"],["Sensação térmica de","Feels like","Sensación térmica de"],["Umidade","Humidity","Humedad"],["Umidade relativa","Relative humidity","Humedad relativa"],["Umidade do ar","Air humidity","Humedad del aire"],["Vento","Wind","Viento"],["Velocidade do vento","Wind speed","Velocidad del viento"],["Vento na região","Wind in the area","Viento en la zona"],["Precipitação","Precipitation","Precipitación"],["Volume atual","Current volume","Volumen actual"],["Temperatura percebida","Perceived temperature","Temperatura percibida"],["Próximos dias","Next days","Próximos días"],["PREVISÃO ESTENDIDA","EXTENDED FORECAST","PRONÓSTICO EXTENDIDO"],["CONDIÇÕES ATUAIS","CURRENT CONDITIONS","CONDICIONES ACTUALES"],["● AO VIVO","● LIVE","● EN VIVO"],["Hoje","Today","Hoy"],["hoje vale","is worth today","vale hoy"],["Sobre","About","Sobre"],["Ler na Wikipédia","Read on Wikipedia","Leer en Wikipedia"],
["Dados meteorológicos: Open-Meteo · Atualização conforme disponibilidade da API.","Weather data: Open-Meteo · Updated according to API availability.","Datos meteorológicos: Open-Meteo · Actualización según disponibilidad de la API."],["Fonte: Open-Meteo. Os dados correspondem à capital (ou cidade) selecionada, não ao território inteiro do país.","Source: Open-Meteo. Data refers to the selected capital (or city), not the entire country.","Fuente: Open-Meteo. Los datos corresponden a la capital (o ciudad) seleccionada, no a todo el país."],
["Explore as condições meteorológicas das capitais ao redor do planeta.","Explore weather conditions in capitals around the planet.","Explora las condiciones meteorológicas de las capitales del planeta."],["O mundo,","The world,","El mundo,"],["em tempo real.","in real time.","en tiempo real."],["OBSERVATÓRIO","WEATHER","OBSERVATORIO"],["DO CLIMA","OBSERVATORY","DEL CLIMA"],["LOCALIZAÇÃO","LOCATION","UBICACIÓN"],["Escolha um país","Choose a country","Elige un país"],["Cidades encontradas","Cities found","Ciudades encontradas"],["Nenhum resultado. Tente outro nome.","No results. Try another name.","Sin resultados. Prueba con otro nombre."],["Selecione um país para consultar o clima de sua capital.","Select a country to check its capital's weather.","Selecciona un país para consultar el clima de su capital."],["Ver país","View country","Ver país"],["Buscando as condições do tempo","Fetching weather conditions","Buscando las condiciones del tiempo"],["Clima indisponível","Weather unavailable","Clima no disponible"],
["Céu limpo","Clear sky","Cielo despejado"],["Predominantemente limpo","Mostly clear","Mayormente despejado"],["Parcialmente nublado","Partly cloudy","Parcialmente nublado"],["Nublado","Overcast","Nublado"],["Nevoeiro","Fog","Niebla"],["Nevoeiro com geada","Freezing fog","Niebla con escarcha"],["Garoa leve","Light drizzle","Llovizna ligera"],["Garoa moderada","Moderate drizzle","Llovizna moderada"],["Garoa intensa","Heavy drizzle","Llovizna intensa"],["Chuva leve","Light rain","Lluvia ligera"],["Chuva moderada","Moderate rain","Lluvia moderada"],["Chuva forte","Heavy rain","Lluvia fuerte"],["Neve leve","Light snow","Nieve ligera"],["Neve moderada","Moderate snow","Nieve moderada"],["Neve forte","Heavy snow","Nieve fuerte"],["Pancadas leves","Light showers","Chubascos ligeros"],["Pancadas moderadas","Moderate showers","Chubascos moderados"],["Pancadas fortes","Heavy showers","Chubascos fuertes"],["Trovoadas","Thunderstorms","Tormentas"],["Condição variável","Variable conditions","Condiciones variables"],
["África","Africa","África"],["América","America","América"],["Américas","Americas","Américas"],["Ásia","Asia","Asia"],["Europa","Europe","Europa"],["Oceania","Oceania","Oceanía"],["Antártida","Antarctica","Antártida"],["Polar","Polar","Polar"],
["África Setentrional","Northern Africa","África septentrional"],["África Ocidental","Western Africa","África occidental"],["África Central","Middle Africa","África central"],["África Oriental","Eastern Africa","África oriental"],["África Austral","Southern Africa","África austral"],["América do Norte","Northern America","América del Norte"],["América Central","Central America","América Central"],["América do Sul","South America","América del Sur"],["Caribe","Caribbean","Caribe"],["Ásia Oriental","Eastern Asia","Asia oriental"],["Sudeste Asiático","South-eastern Asia","Sudeste asiático"],["Sul da Ásia","Southern Asia","Sur de Asia"],["Ásia Central","Central Asia","Asia central"],["Ásia Ocidental","Western Asia","Asia occidental"],["Europa do Norte","Northern Europe","Europa del Norte"],["Europa Ocidental","Western Europe","Europa occidental"],["Europa Oriental","Eastern Europe","Europa oriental"],["Europa do Sul","Southern Europe","Europa del Sur"],["Austrália e Nova Zelândia","Australia and New Zealand","Australia y Nueva Zelanda"],["Melanésia","Melanesia","Melanesia"],["Micronésia","Micronesia","Micronesia"],["Polinésia","Polynesia","Polinesia"],
["Bandeira","Flag","Bandera"],["Silhueta","Silhouette","Silueta"],["Capitais","Capitals","Capitales"],["Continentes","Continents","Continentes"],["Moedas","Currencies","Monedas"],["Veja a bandeira e descubra o país.","See the flag and guess the country.","Mira la bandera y adivina el país."],["Reconheça o país só pelo contorno.","Recognize the country by its outline alone.","Reconoce el país solo por su contorno."],["Qual é o número de habitantes?","What is the number of inhabitants?","¿Cuántos habitantes tiene?"],["Encontre a capital certa.","Find the right capital.","Encuentra la capital correcta."],["Em que continente fica o país?","Which continent is the country on?","¿En qué continente está el país?"],["Qual moeda circula no país?","Which currency is used in the country?","¿Qué moneda circula en el país?"],
["Teste o quanto você conhece o mundo.","Test how much you know about the world.","Pon a prueba cuánto conoces el mundo."],["Escolha o tamanho da rodada e o tipo de pergunta. Use as teclas 1 a 4 para responder e Enter para avançar.","Choose the round size and the question type. Use keys 1 to 4 to answer and Enter to continue.","Elige el tamaño de la ronda y el tipo de pregunta. Usa las teclas 1 a 4 para responder y Enter para avanzar."],["perguntas","questions","preguntas"],["Recorde:","Record:","Récord:"],["de","of","de"],["acertos","correct","aciertos"],["pts","pts","pts"],["Jogar de novo","Play again","Jugar de nuevo"],["Trocar de modo","Change mode","Cambiar de modo"],["Voltar","Back","Volver"],["Próxima","Next","Siguiente"],["Ver resultado","See result","Ver resultado"],["Acertou!","Correct!","¡Correcto!"],["Não foi dessa vez.","Not this time.","Esta vez no."],[", com",", with",", con"],["habitantes.","inhabitants.","habitantes."],["habitantes","inhabitants","habitantes"],
["De qual país é esta bandeira?","Which country is this flag from?","¿De qué país es esta bandera?"],["Que país tem este contorno?","Which country has this outline?","¿Qué país tiene este contorno?"],["Bandeira de um país misterioso","Flag of a mystery country","Bandera de un país misterioso"],["Silhueta de um país misterioso","Silhouette of a mystery country","Silueta de un país misterioso"],["Silhueta geográfica de um país misterioso","Geographic silhouette of a mystery country","Silueta geográfica de un país misterioso"],
["Você é um verdadeiro cartógrafo!","You are a true cartographer!","¡Eres un verdadero cartógrafo!"],["Bom resultado. Dá para melhorar!","Good result. You can do better!","Buen resultado. ¡Puedes mejorar!"],["Continue explorando o atlas e tente de novo.","Keep exploring the atlas and try again.","Sigue explorando el atlas e inténtalo de nuevo."],["Não foi possível montar a pergunta. O contorno dos países ainda está carregando.","Could not build the question. The country outlines are still loading.","No se pudo crear la pregunta. Los contornos aún se están cargando."],
["DESAFIO / LOCALIZAÇÃO","CHALLENGE / LOCATION","DESAFÍO / UBICACIÓN"],["Onde fica","Where is","¿Dónde está"],["esse país?","this country?","este país?"],["Encontre o país no mapa. Quanto mais rápido, mais pontos; cada clique errado custa","Find the country on the map. The faster you are, the more points; each wrong click costs","Encuentra el país en el mapa. Cuanto más rápido, más puntos; cada clic erróneo cuesta"],["pontos.","points.","puntos."],["pontos","points","puntos"],["pontos;","points;","puntos;"],["RODADA","ROUND","RONDA"],["ENCONTRE NO MAPA","FIND ON THE MAP","ENCUENTRA EN EL MAPA"],["PONTOS","POINTS","PUNTOS"],["Carregando mapa...","Loading map...","Cargando mapa..."],["Desafio de localização","Location challenge","Desafío de ubicación"],["rodadas. O nome de um país aparece e você clica nele no mapa, sem nomes de ajuda.","rounds. A country name appears and you click it on the map, with no name hints.","rondas. Aparece el nombre de un país y haces clic en él en el mapa, sin nombres de ayuda."],["Até 1000 pontos por acerto, caindo com o tempo (","Up to 1000 points per hit, decreasing over time (","Hasta 1000 puntos por acierto, bajando con el tiempo ("],["s por rodada)","s per round)","s por ronda)"],["Cada erro custa","Each mistake costs","Cada error cuesta"],["erros e a rodada termina","mistakes and the round ends","errores y la ronda termina"],["Começar","Start","Empezar"],["países encontrados.","countries found.","países encontrados."],["Novo recorde!","New record!","¡Nuevo récord!"],["Navegador de elite!","Elite navigator!","¡Navegante de élite!"],["Ótimo senso de direção.","Great sense of direction.","Excelente sentido de orientación."],["Continue explorando o mapa e tente de novo.","Keep exploring the map and try again.","Sigue explorando el mapa e inténtalo de nuevo."],
["CURIOSIDADES","FUN FACTS","CURIOSIDADES"],["O mundo em","The world in","El mundo en"],["recordes.","records.","récords."],["Extremos de tamanho, população e densidade, calculados em tempo real com os dados do atlas.","Extremes of size, population and density, calculated in real time from the atlas data.","Extremos de tamaño, población y densidad, calculados en tiempo real con los datos del atlas."],["habitantes somados nos países do atlas","inhabitants added up across the atlas countries","habitantes sumados en los países del atlas"],["países e territórios com menos de 1 milhão de pessoas","countries and territories with under 1 million people","países y territorios con menos de 1 millón de personas"],["Maior país","Largest country","País más grande"],["Menor país","Smallest country","País más pequeño"],["Mais populoso","Most populous","Más poblado"],["Menos populoso","Least populous","Menos poblado"],["Mais densamente povoado","Most densely populated","Más densamente poblado"],["Menos densamente povoado","Least densely populated","Menos densamente poblado"],["Mais fronteiras","Most borders","Más fronteras"],["Mais idiomas","Most languages","Más idiomas"],["Mais fusos horários","Most time zones","Más husos horarios"],["Ranking Top 10","Top 10 ranking","Ranking Top 10"],["Maiores","Largest","Mayores"],["Menores","Smallest","Menores"],["Seus favoritos","Your favorites","Tus favoritos"],["Use o coração em qualquer país da aba Explorar para salvá-lo aqui.","Use the heart on any country in the Explore tab to save it here.","Usa el corazón en cualquier país de la pestaña Explorar para guardarlo aquí."],
["COMPARADOR","COMPARATOR","COMPARADOR"],["Frente a","Head to","Cara a"],["frente.","head.","cara."],["Escolha dois países e veja quem lidera em cada categoria.","Pick two countries and see who leads in each category.","Elige dos países y mira quién lidera en cada categoría."],["País A","Country A","País A"],["País B","Country B","País B"],["Trocar países","Swap countries","Intercambiar países"],["categorias","categories","categorías"],["Fronteiras","Borders","Fronteras"],["Fusos horários","Time zones","Husos horarios"],["Idiomas falados","Spoken languages","Idiomas hablados"],["VS","VS","VS"]
];
const ES_CAP = { London:"Londres", Moscow:"Moscú", Beijing:"Pekín", Tokyo:"Tokio", Rome:"Roma", Athens:"Atenas", Lisbon:"Lisboa", Cairo:"El Cairo", "New Delhi":"Nueva Delhi", "Mexico City":"Ciudad de México", Brussels:"Bruselas", Copenhagen:"Copenhague", Stockholm:"Estocolmo", Vienna:"Viena", Prague:"Praga", Warsaw:"Varsovia", Bucharest:"Bucarest", Berlin:"Berlín", Havana:"La Habana", "Panama City":"Ciudad de Panamá", Seoul:"Seúl", Hanoi:"Hanói", Jakarta:"Yakarta", Bern:"Berna", Kiev:"Kiev", Kyiv:"Kiev", Belgrade:"Belgrado", Sofia:"Sofía", Damascus:"Damasco", Baghdad:"Bagdad", Tehran:"Teherán", Jerusalem:"Jerusalén", Riyadh:"Riad", "Abu Dhabi":"Abu Dabi", Tunis:"Túnez", Algiers:"Argel", Tripoli:"Trípoli", "Addis Ababa":"Adís Abeba", "Cape Town":"Ciudad del Cabo", Edinburgh:"Edimburgo", Reykjavik:"Reikiavik", Luxembourg:"Luxemburgo", "Vatican City":"Ciudad del Vaticano", Monaco:"Mónaco", Ljubljana:"Liubliana", Skopje:"Skopie", Valletta:"La Valeta", Yerevan:"Ereván", Baku:"Bakú", Tashkent:"Taskent", Kathmandu:"Katmandú", Dhaka:"Daca", Singapore:"Singapur", Taipei:"Taipéi", Pyongyang:"Pionyang", "Ulan Bator":"Ulán Bator", Ulaanbaatar:"Ulán Bator", Amsterdam:"Ámsterdam", Paris:"París", Brasilia:"Brasilia", Bogota:"Bogotá", Asuncion:"Asunción", Mogadishu:"Mogadiscio", Nairobi:"Nairobi", Ottawa:"Ottawa", "Kuwait City":"Ciudad de Kuwait", Nicosia:"Nicosia", Ankara:"Ankara", Tbilisi:"Tiflis", Vilnius:"Vilna", Riga:"Riga", Tallinn:"Tallin", Helsinki:"Helsinki", Zagreb:"Zagreb", Budapest:"Budapest", Madrid:"Madrid", Pretoria:"Pretoria", Colombo:"Colombo" };
const RULES = [
  [/^Quantos habitantes tem (.+)\?$/, "How many people live in $1?", "¿Cuántos habitantes tiene $1?"],
  [/^Qual é a capital de (.+)\?$/, "What is the capital of $1?", "¿Cuál es la capital de $1?"],
  [/^Qual é a moeda de (.+)\?$/, "What is the currency of $1?", "¿Cuál es la moneda de $1?"],
  [/^Em que continente fica (.+)\?$/, "Which continent is $1 on?", "¿En qué continente está $1?"],
  [/^, capital (.+)$/, ", capital $1", ", capital $1"],
  [/^Vale agora (.+) pts$/, "Worth now $1 pts", "Vale ahora $1 pts"],
  [/^Acertou! \+(.+) pontos$/, "Correct! +$1 points", "¡Correcto! +$1 puntos"],
  [/^Era (.+)$/, "It was $1", "Era $1"],
  [/^Recorde: (.+)$/, "Record: $1", "Récord: $1"],
  [/^Informações de (.+)$/, "Information about $1", "Información de $1"],
  [/^Bandeira de (.+)$/, "Flag of $1", "Bandera de $1"],
  [/^Silhueta geográfica de (.+)$/, "Geographic silhouette of $1", "Silueta geográfica de $1"],
  [/^(\S+) da população vive em (.+) e (.+)$/, "$1 of the population lives in $2 and $3", "$1 de la población vive en $2 y $3"],
  [/^(\S+) vizinhos$/, "$1 neighbors", "$1 vecinos"], [/^(\S+) idiomas$/, "$1 languages", "$1 idiomas"], [/^(\S+) fusos$/, "$1 time zones", "$1 husos"], [/^(\S+) países$/, "$1 countries", "$1 países"],
  [/^(.+) hab\.$/, "$1 inhab.", "$1 hab."]
];
let DICT = new Map(), IDX = 0;
const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function trCore(c) {
  if (DICT.has(c)) return DICT.get(c);
  for (const [re, en, es] of RULES) {
    const r = re.exec(c);
    if (r) {
      return (IDX === 1 ? en : es).replace(/\$(\d)/g, (_, i) => trCore(r[i]));
    }
  }
  if (c.includes(", ")) {
    const parts = c.split(", "), o = parts.map((p) => DICT.get(p) ?? p);
    if (o.some((x, i) => x !== parts[i])) return o.join(", ");
  }
  const pm = /^(.+?) \((.+)\)$/.exec(c);
  if (pm && DICT.has(pm[1])) return `${DICT.get(pm[1])} (${pm[2]})`;
  return c;
}
export function tn(text) {
  if (!IDX || typeof text !== "string") return text;
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
  if (!m[2]) return text;
  const out = trCore(m[2]);
  return out === m[2] ? text : m[1] + out + m[3];
}

function buildDict(lang, countries) {
  IDX = lang === "en" ? 1 : lang === "es" ? 2 : 0;
  DICT = new Map();
  if (!IDX) return;
  T.forEach((r) => DICT.set(r[0], r[IDX]));
  const mk = (type) => { try { return new Intl.DisplayNames([lang], { type }); } catch { return null; } };
  const dr = mk("region"), dl = mk("language"), dc = mk("currency");
  const put = (k, v) => { if (k && v && v !== k) DICT.set(k, v); };
  (countries || []).forEach((c) => {
    try { const n = dr?.of(c.cca2); if (n && n !== c.cca2) put(c.name.common, n); } catch {}
    if (c.capital?.[0] && c.capitalEn) put(c.capital[0], IDX === 1 ? c.capitalEn : ES_CAP[c.capitalEn] || c.capitalEn);
    Object.entries(c.languages || {}).forEach(([iso, pt]) => { try { const x = dl?.of(iso); if (x && x !== iso) put(pt, cap1(x)); } catch {} });
    Object.entries(c.currencies || {}).forEach(([code, cu]) => { try { const x = dc?.of(code); if (x && x !== code) put(cu.name, cap1(x)); } catch {} });
  });
}

const ATTRS = ["placeholder", "aria-label", "title", "alt"];
const textRec = new WeakMap(), attrRec = new WeakMap();
let obs = null;
function doText(n) {
  const rec = textRec.get(n);
  const src = rec && rec.out === n.nodeValue ? rec.src : n.nodeValue;
  const out = tn(src);
  if (out !== n.nodeValue) n.nodeValue = out;
  textRec.set(n, { src, out });
}
function doAttr(el, a) {
  const v = el.getAttribute(a);
  if (v == null) return;
  const m = attrRec.get(el) || {}, rec = m[a];
  const src = rec && rec.out === v ? rec.src : v;
  const out = tn(src);
  if (out !== v) el.setAttribute(a, out);
  m[a] = { src, out }; attrRec.set(el, m);
}
function walk(root) {
  if (!root) return;
  if (root.nodeType === 3) { doText(root); return; }
  if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName)) return;
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n; while ((n = tw.nextNode())) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode?.tagName)) doText(n); }
  const els = [root, ...root.querySelectorAll("[placeholder],[aria-label],[title],[alt]")];
  els.forEach((el) => ATTRS.forEach((a) => el.hasAttribute?.(a) && doAttr(el, a)));
}
export function configureLanguage(lang, countries) {
  const l = LANGS.find((x) => x.id === lang) || LANGS[0];
  window.__atlasLoc = l.loc; window.__atlasLang = l.id;
  buildDict(l.id, countries);
  queueMicrotask(() => {
    document.documentElement.lang = l.loc;
    if (!obs) {
      obs = new MutationObserver((recs) => {
        recs.forEach((r) => {
          if (r.type === "characterData") doText(r.target);
          else if (r.type === "attributes") doAttr(r.target, r.attributeName);
          else r.addedNodes.forEach(walk);
        });
        obs.takeRecords();
      });
      obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    }
    walk(document.body);
    obs.takeRecords();
  });
}
