import L from 'leaflet';
import * as turf from "@turf/turf";
import solicitudesServices from "@/services/solicitudes.services";
import nivelesServices from "@/services/niveles.services";
import 'leaflet/dist/leaflet.css';

export default class LeaftLetMap {
  _contenedor = null;

  _poligonoExtra = null;

  _capaLocales = null;

  _identificador = null;

  _geoJSON = null;

  _zoomInicial = null;

  _longitud = null;

  _latitud = null;

  constructor(identificador, contenedor) {
    this._identificador = identificador;
    this._contenedor = contenedor;
  }

  generarGeoMapa(plantaService, localesService, localMapper) {
    if (!(this._identificador && this._contenedor)) return;

    this.restablecerMapa();
    this.cargarGeoJSON(plantaService).then(() => this.cargarLocales(localesService, localMapper)).then(() => {
      this._contenedor.value.on("zoomend", () => {
        const z = this._contenedor.value.getZoom();

        if (z >= this._zoomInicial) {
          if (!this._contenedor.value.hasLayer(this._poligonoExtra)) this._contenedor.value.addLayer(this._poligonoExtra);
          if (!this._contenedor.value.hasLayer(this._geoJSON)) this._contenedor.value.addLayer(this._geoJSON);
          if (!this._contenedor.value.hasLayer(this._capaLocales)) this._contenedor.value.addLayer(this._capaLocales);
        } else {
          if (this._contenedor.value.hasLayer(this._poligonoExtra))
            this._contenedor.value.removeLayer(this._poligonoExtra);
          if (this._contenedor.value.hasLayer(this._geoJSON)) this._contenedor.value.removeLayer(this._geoJSON);
          if (this._contenedor.value.hasLayer(this._capaLocales)) this._contenedor.value.removeLayer(this._capaLocales);
        }
      });
      setTimeout(() => {
        this._contenedor.value.flyTo([this._latitud, this._longitud], this._zoomInicial, {
          animate: true,
          duration: 1, // segundos
        });
      }, 100);
    })
  }

  restablecerMapa() {
    if (!this._contenedor.value) return;

    this._contenedor.value.eachLayer((layer) => {
      this._contenedor.value.removeLayer(layer);
    });

    this._contenedor.value.off();
    this._contenedor.value.remove();
    this._contenedor.value = null;
    this._geoJSON = null;
    this._poligonoExtra = null;
    this._capaLocales = null;
  }

  async cargarGeoJSON(service) {
    if (typeof service !== 'function') return;

    const { data } = await service();

    const geoJson = JSON.parse(data.geoNiveles.geojson_string);

    const latitud = parseFloat(data.geoNiveles.latitud);
    this._latitud = latitud;
    const longitud = parseFloat(data.geoNiveles.longitud);
    this._longitud = longitud
    const coordenadas = [latitud, longitud];

    const zoomPais = 17;
    this._zoomInicial = data.geoNiveles.zoomInicial ?? 20;

    // const capa = "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}@2x.png";
    const capa = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";


    this._contenedor.value = L.map(this._identificador, {
      center: coordenadas,
      attributionControl: false,
      zoom: zoomPais,
      minZoom: data.geoNiveles.minZoom ?? 17,
      maxZoom: data.geoNiveles.maxZoom ?? 22,
    });

    L.tileLayer(capa, {
      maxZoom: 22,
      maxNativeZoom: 19,
      noWrap: true,
    }).addTo(this._contenedor.value);

    const points = turf.explode(geoJson); // convierte a puntos

    // Obtener el contorno convexo (como un polígono que encierra todos los puntos)
    const convexHull = turf.convex(points);

    // Agrega al mapa
    this._poligonoExtra = L.geoJSON(convexHull, {
      style: { color: "#e2d8c7", fillOpacity: 20, minZoom: this._zoomInicial },
    });


    this._geoJSON = L.geoJSON(geoJson, {
      style: function () {
        return ({ fillOpacity: 0.5, color: "black", weight: 1, });
      },
    });

    this.moverGeoJSONalFrente();
  }

  async cargarLocales(service, localMapper) {
    if (typeof service !== 'function') return;

    const { data: locales } = await service();

    if (!Array.isArray(locales?.features) || locales.features.length === 0 || !this._contenedor.value) return;

    this._capaLocales = L.geoJSON(locales, {
      style: function (feature) {
        return {
          fillColor: feature?.properties?.tipo?.color ?? feature?.properties?.local?.color,
          fillOpacity: 0.3,
          color: "black",
          weight: 1,
        };
      },
      onEachFeature: function (feature, layer) {
        localMapper?.(feature, layer);

        layer.bindTooltip(`Local: ${feature.properties.codigo}`);
      }
    });

    this.moverGeoJSONalFrente();
  }

  moverGeoJSONalFrente() {
    if (!this._geoJSON) return;

    this._geoJSON.bringToFront();
  }
}
