# Atlas Interativo 🌎

Projeto frontend em React + Vite para explorar países, geografia e clima.

## Funcionalidades
- Catálogo de países com busca, filtro por continente e ordenação.
- Detalhes de país com silhueta geográfica em SVG, bandeira, população, área, idiomas, moedas e fronteiras.
- Mapa-múndi interativo com Leaflet, seleção de países e contornos GeoJSON.
- Aba de clima global com dados atuais e previsão da capital selecionada.
- Aba de clima dentro dos detalhes de cada país.
- Favoritos salvos no `localStorage`.
- Comparador de dois países.
- Layout responsivo para desktop e celular.

- **Quiz** com 4 modos: bandeira, silhueta, população e capitais (recordes salvos no navegador).
- Resumo da Wikipédia e câmbio em tempo real na página de cada país.

## Tecnologias
- React e Vite
- Leaflet + React Leaflet
- REST Countries v3.1 (dados de países)
- Open-Meteo (clima)
- GeoJSON do repositório `datasets/geo-countries`
- OpenStreetMap/CARTO para as camadas do mapa
- Wikipedia REST API (resumo e foto do país)
- Frankfurter (câmbio)
- Lucide React para ícones

## Como executar
1. Instale o Node.js (versão LTS recomendada).
2. Extraia a pasta do projeto.
3. Abra um terminal dentro da pasta `atlas_interativo`.
4. Execute:

```bash
npm install
npm run dev
```

5. Abra o endereço local indicado pelo Vite no navegador.

Para gerar a versão de produção:

```bash
npm run build
```

## Observações
- É um projeto somente frontend, sem backend ou banco de dados.
- Os favoritos são armazenados no navegador atual e não são sincronizados entre dispositivos.
- A REST Countries v3.1 é usada neste exemplo por meio do endpoint público com campos selecionados. A disponibilidade de serviços públicos pode mudar; consulte a documentação oficial se houver falhas.
- O clima mostrado corresponde à capital ou às coordenadas disponíveis para o país, não a todo o território nacional.
- O mapa precisa de conexão com a internet para carregar os tiles e o arquivo GeoJSON.
- O GeoJSON é carregado de `https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson`.
- Respeite as políticas de uso e atribuição das fontes de mapas e dados utilizadas.
