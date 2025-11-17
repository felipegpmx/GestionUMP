/* ====================================
   SISTEMA DE GESTIÓN DE CONTROL UMP
   Versión 2.0 - Con GPS y Observaciones
   ==================================== */

// ====================================
// BASE DE DATOS CON COORDENADAS GPS
// (puedes ampliarla; el import CSV actualizará lat/lng)
// ====================================
const baseDatosPuntosOriginal = {
  "CALIBRACION": { region: "", comuna: "", provincia: "", tipoControl: "", foso: "", ruta: "", kilometro: "", sentido: "", lat: null, lng: null },

  // Arica y Parinacota
  "Acha": { region: "Arica y Parinacota", comuna: "Arica", provincia: "Arica", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "5 Norte", kilometro: "2064", sentido: "Norte-Sur", lat: -18.537829, lng: -70.255303 },
  "Zapahuira": { region: "Arica y Parinacota", comuna: "Arica", provincia: "Arica", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "11-CH", kilometro: "98.5", sentido: "Sur-Norte", lat: -18.339152, lng: -69.590591 },

  // Tarapacá
  "Pozo Almonte NS": { region: "Tarapacá", comuna: "Pozo Almonte", provincia: "Tamarugal", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "5", kilometro: "1811", sentido: "Quillagua", lat: -20.236203, lng: -69.787294 },
  "Loa N/S": { region: "Tarapacá", comuna: "Iquique", provincia: "Iquique", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "1", kilometro: "268", sentido: "Tocopilla", lat: -21.415025, lng: -70.059022 },
  "Loa S/N": { region: "Tarapacá", comuna: "Iquique", provincia: "Iquique", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "1", kilometro: "268", sentido: "Iquique", lat: -21.415076, lng: -70.059194 },

  // Antofagasta
  "Mejillones 1": { region: "Antofagasta", comuna: "Mejillones", provincia: "Antofagasta", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "1", kilometro: "63", sentido: "Sur a norte", lat: -23.087380, lng: -70.332448 },
  "Mejillones 2": { region: "Antofagasta", comuna: "Mejillones", provincia: "Antofagasta", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "1", kilometro: "63", sentido: "Norte a sur", lat: -23.087401, lng: -70.332650 },
  "Tocopilla": { region: "Antofagasta", comuna: "Tocopilla", provincia: "Tocopilla", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "1", kilometro: "180", sentido: "Sur a norte", lat: -22.115802, lng: -70.213745 },
  "S.P de Atacama": { region: "Antofagasta", comuna: "S.P de Atacama", provincia: "El Loa", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "23-CH", kilometro: "95", sentido: "Sur a norte", lat: -22.927693, lng: -68.224515 },
  "Pedro de Valdivia": { region: "Antofagasta", comuna: "María Elena", provincia: "Tocopilla", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "5", kilometro: "1482", sentido: "Sur a norte", lat: -22.115802, lng: -70.213745 },

  // Atacama
  "M. Isabel": { region: "Atacama", comuna: "T. Amarilla", provincia: "Copiapo", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "C-35", kilometro: "2", sentido: "Paipote", lat: -27.436160, lng: -70.267468 },
  "P. Padrones": { region: "Atacama", comuna: "Caldera", provincia: "Copiapo", tipoControl: "Calzada", foso: "No", ruta: "C-314", kilometro: "1", sentido: "Caldera", lat: -27.081232, lng: -70.810328 },
  "Nantoco": { region: "Atacama", comuna: "T. Amarilla", provincia: "Copiapo", tipoControl: "Calzada", foso: "No", ruta: "C-411", kilometro: "1", sentido: "T. Amarilla", lat: -27.606291, lng: -70.445629 },
  "Teresita": { region: "Atacama", comuna: "Copiapo", provincia: "Copiapo", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "31-CH", kilometro: "16", sentido: "Paipote", lat: -27.359355, lng: -70.227546 },
  "Portezuelo": { region: "Atacama", comuna: "Chañaral", provincia: "Chañaral", tipoControl: "Pista de Pesaje", foso: "No", ruta: "5 Norte", kilometro: "992", sentido: "Chañaral", lat: -26.339625, lng: -70.447644 },
  "Bodeguilla": { region: "Atacama", comuna: "Vallenar", provincia: "Huasco", tipoControl: "Calzada", foso: "No", ruta: "C-46", kilometro: "20", sentido: "Freirina", lat: -28.524797, lng: -70.981734 },

  // Coquimbo
  "San Julian 1": { region: "Coquimbo", comuna: "Ovalle", provincia: "Limari", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "45", kilometro: "20", sentido: "Ruta 5", lat: -30.661561, lng: -71.304297 },
  "San Julian 2": { region: "Coquimbo", comuna: "Ovalle", provincia: "Limari", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "45", kilometro: "20", sentido: "Ovalle", lat: -30.661432, lng: -71.304279 },
  "El Peñon 1": { region: "Coquimbo", comuna: "La Serena", provincia: "Elqui", tipoControl: "Calzada", foso: "No", ruta: "D-51", kilometro: "1", sentido: "Ruta 43", lat: -30.133391, lng: -71.223042 },
  "El Peñon 2": { region: "Coquimbo", comuna: "La Serena", provincia: "Elqui", tipoControl: "Calzada", foso: "No", ruta: "D-51", kilometro: "1", sentido: "Andacollo", lat: -30.133391, lng: -71.223042 },

  // Valparaíso
  "Peñablanca": { region: "Valparaíso", comuna: "Cabildo", provincia: "Petorca", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "E-35", kilometro: "24", sentido: "La Ligua", lat: -32.448949, lng: -71.095036 },
  "Quintero": { region: "Valparaíso", comuna: "Quintero", provincia: "Valparaíso", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "F-30-E", kilometro: "61", sentido: "Con Con", lat: -32.792905, lng: -71.478674 },
  "Aeródromo": { region: "Valparaíso", comuna: "Santo Domingo", provincia: "San Antonio", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "66", kilometro: "130", sentido: "San Antonio", lat: -33.662425, lng: -71.596575 },
  "Fuerte Aguayo 1": { region: "Valparaíso", comuna: "Con Con", provincia: "Valparaíso", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "64", kilometro: "39", sentido: "Con Con", lat: -32.932353, lng: -71.462508 },
  "Fuerte Aguayo 2": { region: "Valparaíso", comuna: "Con Con", provincia: "Valparaíso", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "64", kilometro: "39", sentido: "Limache", lat: -32.932458, lng: -71.461889 },
  "Lo Orozco 1": { region: "Valparaíso", comuna: "Casablanca", provincia: "Valparaíso", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "F-50", kilometro: "7", sentido: "Quilpué", lat: -33.218689, lng: -71.390701 },
  "Lo Orozco 2": { region: "Valparaíso", comuna: "Casablanca", provincia: "Valparaíso", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "F-50", kilometro: "7", sentido: "Casablanca", lat: -33.218810, lng: -71.390971 },

  // Metropolitana
  "Lo Echevers": { region: "Metropolitana", comuna: "Quilicura", provincia: "Santiago", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "G-16", kilometro: "52.7", sentido: "NORTE", lat: -33.370143, lng: -70.771886 },
  "Rinconada": { region: "Metropolitana", comuna: "Maipú", provincia: "Santiago", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "G-260", kilometro: "1", sentido: "OESTE", lat: -33.507342, lng: -70.805888 },
  "Puente San Francisco": { region: "Metropolitana", comuna: "Talagante", provincia: "Talagante", tipoControl: "Calzada", foso: "No", ruta: "G-78", kilometro: "17.0", sentido: "Talagante", lat: -33.687141, lng: -70.974495 },
  "El Trebal": { region: "Metropolitana", comuna: "Padre Hurtado", provincia: "Talagante", tipoControl: "Calzada", foso: "No", ruta: "G-256", kilometro: "3", sentido: "Maipu", lat: -33.542868, lng: -70.843092 },
  "Calera de Tango": { region: "Metropolitana", comuna: "Calera de Tango", provincia: "Talagante", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "G-34", kilometro: "4", sentido: "Lonquen", lat: -33.631249, lng: -70.754536 },
  "Pomaire": { region: "Metropolitana", comuna: "Melipilla", provincia: "Melipilla", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "G-78", kilometro: "34", sentido: "Malloco", lat: -33.677451, lng: -71.152372 },
  "Polpaico": { region: "Metropolitana", comuna: "Til Til", provincia: "Chacabuco", tipoControl: "Calzada", foso: "No", ruta: "G-132", kilometro: "9.0", sentido: "Santiago", lat: -33.164460, lng: -70.892218 },
  "Quilapilun": { region: "Metropolitana", comuna: "Colina", provincia: "Chacabuco", tipoControl: "Calzada", foso: "No", ruta: "G-131", kilometro: "7.4", sentido: "5 Norte", lat: -33.096786, lng: -70.751927 },
  "Chicauma": { region: "Metropolitana", comuna: "Til Til", provincia: "Chacabuco", tipoControl: "Calzada", foso: "No", ruta: "G-16", kilometro: "33.3", sentido: "Til Til", lat: -33.161986, lng: -70.894454 },
  "La Puntilla": { region: "Metropolitana", comuna: "Buin", provincia: "Maipo", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "G-46", kilometro: "9.3", sentido: "Lonquen", lat: -33.757318, lng: -70.815541 },
  "La Obra": { region: "Metropolitana", comuna: "San José de Maipo", provincia: "Cordillera", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "G-25", kilometro: "16", sentido: "Oeste", lat: -33.592262, lng: -70.487612 },

  // O'higgins
  "Pichilemu": { region: "O'higgins", comuna: "Pichilemu", provincia: "Cardenal Caro", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "90", kilometro: "125", sentido: "Pichilemu", lat: -34.380610, lng: -71.973629 },
  "Placilla": { region: "O'higgins", comuna: "Placilla", provincia: "Cardenal Caro", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "90", kilometro: "6", sentido: "San Fernando", lat: -34.610319, lng: -71.040677 },
  "Pumanque": { region: "O'higgins", comuna: "Pumanque", provincia: "Colchagua", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "I-60", kilometro: "19", sentido: "San Fernando", lat: -34.586253, lng: -71.645596 },

  // Maule
  "Paso Nevado": { region: "Maule", comuna: "San Clemente", provincia: "Talca", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "CH-115", kilometro: "54.6", sentido: "Poniente-Oriente", lat: -35.708927, lng: -71.214082 },
  "Culenar": { region: "Maule", comuna: "Sagrada Familia", provincia: "Curico", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "K-40", kilometro: "17.3", sentido: "Poniente-Oriente", lat: -35.178936, lng: -71.554766 },
  "Parronal": { region: "Maule", comuna: "Hualañe", provincia: "Curico", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "J-70I", kilometro: "39", sentido: "Poniente-Oriente", lat: -35.037628, lng: -71.707862 },
  "San Baldomero": { region: "Maule", comuna: "San Javier", provincia: "Linares", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "126", kilometro: "5.3", sentido: "Sur - Norte", lat: -35.652029, lng: -71.813590 },
  "La Escuela": { region: "Maule", comuna: "Cauquenes", provincia: "Cauquenes", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "128", kilometro: "42", sentido: "Poniente-Oriente", lat: -35.975692, lng: -72.199638 },
  "El Valle": { region: "Maule", comuna: "Pelluhue", provincia: "Cauquenes", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "M-50", kilometro: "22.3", sentido: "Poniente-Oriente", lat: -35.876679, lng: -72.473035 },

  // Biobío
  "Planta Laja": { region: "BioBio", comuna: "Laja", provincia: "BioBio", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "Q-34", kilometro: "34", sentido: "1", lat: -37.298299, lng: -72.709483 },
  "Chillico": { region: "BioBio", comuna: "Laja", provincia: "BioBio", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "Q-90-O", kilometro: "27", sentido: "1", lat: -37.241897, lng: -72.630420 },
  "Antuco": { region: "BioBio", comuna: "Los Angeles", provincia: "BioBio", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "Q-45", kilometro: "23", sentido: "1", lat: -37.426346, lng: -72.072951 },
  "Las Hortensias": { region: "BioBio", comuna: "Los Angeles", provincia: "BioBio", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "Q-61-R", kilometro: "5", sentido: "1", lat: -37.512620, lng: -72.270314 },

  // Araucanía
  "Huequén": { region: "Araucanía", comuna: "Angol", provincia: "Malleco", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "R-86", kilometro: "89", sentido: "Huequén", lat: -37.850064, lng: -72.689536 },
  "San Luis": { region: "Araucanía", comuna: "Nueva Imperial", provincia: "Cautín", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "S-16", kilometro: "15.3", sentido: "Chol Chol", lat: -38.723431, lng: -72.913808 },
  "Puralaco": { region: "Araucanía", comuna: "Toltén", provincia: "Cautín", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "S-790", kilometro: "16", sentido: "Queule", lat: -39.304462, lng: -73.181026 },
  "Champulli": { region: "Araucanía", comuna: "Carahue", provincia: "Cautín", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "S-40", kilometro: "17", sentido: "Imperial", lat: -38.695318, lng: -73.113203 },

  // Los Ríos
  "Llancahue": { region: "Los Rios", comuna: "Valdivia", provincia: "Valdivia", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "206", kilometro: "41.000", sentido: "Valdivia", lat: -39.861085, lng: -73.180421 },
  "Quinchilca": { region: "Los Rios", comuna: "Los Lagos", provincia: "Valdivia", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "T-39", kilometro: "11.200", sentido: "Los Lagos", lat: -39.816958, lng: -72.725913 },
  "Puringue": { region: "Los Rios", comuna: "San Jose", provincia: "Valdivia", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "T-20", kilometro: "5.100", sentido: "San Jose", lat: -39.508119, lng: -73.001621 },
  "Rapaco": { region: "Los Rios", comuna: "La Union", provincia: "Ranco", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "T-712", kilometro: "5.200", sentido: "La Union", lat: -40.255782, lng: -73.008211 },
  "Vista Hermosa": { region: "Los Rios", comuna: "La Union", provincia: "Ranco", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "T-80", kilometro: "2.000", sentido: "La Union", lat: -40.306526, lng: -73.101829 },

  // Los Lagos
  "Los Volcanes": { region: "Los Lagos", comuna: "Osorno", provincia: "Osorno", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "CH-215", kilometro: "8", sentido: "Osorno", lat: -40.606933, lng: -73.014531 },
  "San Rafael": { region: "Los Lagos", comuna: "Calbuco", provincia: "Llanquihue", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "V-843", kilometro: "2.3", sentido: "Calbuco", lat: -41.769227, lng: -73.161948 },
  "Contao": { region: "Los Lagos", comuna: "Hualaihue", provincia: "Palena", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "R-7", kilometro: "52.7", sentido: "Hornopiren", lat: -41.784110, lng: -72.696940 },
  "Chacao": { region: "Los Lagos", comuna: "Ancud", provincia: "Chiloe", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "R-5", kilometro: "1087", sentido: "Ancud", lat: -41.834509, lng: -73.526475 },
  "Degañ": { region: "Los Lagos", comuna: "Ancud", provincia: "Chiloe", tipoControl: "Pista de Pesaje", foso: "Si", ruta: "R-5", kilometro: "1144", sentido: "Ancud", lat: -42.141020, lng: -73.721948 }
};

/* ====================================
   APLICACIÓN PRINCIPAL
   ==================================== */

const App = {
  data: {
    registros: [],
    registrosFiltrados: [],
    puntos: {},
    editandoId: null,
    editandoPunto: null,
    papelera: [],
    currentPage: 1,
    itemsPerPage: 10,
    currentUser: null,
    darkMode: false
  },

  utils: {
    sanitize(str) {
      if (typeof str !== 'string') return str;
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },

    horasADecimal(h, m, s) {
      return parseInt(h || 0) + (parseInt(m || 0) / 60) + (parseInt(s || 0) / 3600);
    },

    decimalAHoras(decimal) {
      const totalSeg = Math.round(decimal * 3600);
      const hh = Math.floor(totalSeg / 3600);
      const mm = Math.floor((totalSeg % 3600) / 60);
      const ss = totalSeg % 60;
      return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    },

    obtenerRegionesUnicas() {
      return [...new Set(Object.values(App.data.puntos).map(p => p.region).filter(Boolean))].sort();
    },

    normalizarBaseDatos(datos) {
      const normalizado = {};
      Object.entries(datos).forEach(([key, value]) => {
        const k = key.trim();
        let lat = value.lat;
        let lng = value.lng;
        // Si son strings, convertir a número
        if (typeof lat === 'string' && lat.trim() !== '') lat = parseFloat(lat);
        if (typeof lng === 'string' && lng.trim() !== '') lng = parseFloat(lng);
        normalizado[k] = {
          region: value.region || '',
          comuna: value.comuna || '',
          provincia: value.provincia || '',
          tipoControl: value.tipoControl === "Pista de pesaje" ? "Pista de Pesaje" : (value.tipoControl || ''),
          foso: value.foso && value.foso.toLowerCase() === "si" ? "Si" : (value.foso || ''),
          ruta: value.ruta || '',
          kilometro: value.kilometro || '',
          sentido: value.sentido || '',
          lat: (lat === null || isNaN(lat)) ? null : lat,
          lng: (lng === null || isNaN(lng)) ? null : lng
        };
      });
      return normalizado;
    }
  },

  storage: {
    guardarRegistros() {
      try { localStorage.setItem('datosControles', JSON.stringify(App.data.registros)); }
      catch (e) { console.error('Error al guardar registros:', e); App.toast('Error al guardar datos', 'error'); }
    },
    guardarPuntos() {
      try { localStorage.setItem('puntos', JSON.stringify(App.data.puntos)); }
      catch (e) { console.error('Error al guardar puntos:', e); }
    },
    guardarPapelera() {
      try { localStorage.setItem('papelera', JSON.stringify(App.data.papelera)); }
      catch (e) { console.error('Error al guardar papelera:', e); }
    },
    cargarRegistros() {
      try {
        const datos = localStorage.getItem('datosControles');
        if (datos) {
          App.data.registros = JSON.parse(datos);
          App.data.registrosFiltrados = [...App.data.registros];
        }
      } catch (e) { console.error('Error al cargar registros:', e); }
    },
    cargarPuntos() {
      try {
        const puntos = localStorage.getItem('puntos');
        if (puntos) {
          const parsed = JSON.parse(puntos);
          App.data.puntos = App.utils.normalizarBaseDatos(parsed);
        } else {
          App.data.puntos = App.utils.normalizarBaseDatos(baseDatosPuntosOriginal);
          App.storage.guardarPuntos();
        }
      } catch (e) {
        console.error('Error al cargar puntos:', e);
        App.data.puntos = App.utils.normalizarBaseDatos(baseDatosPuntosOriginal);
      }
    },
    cargarPapelera() {
      try {
        const papelera = localStorage.getItem('papelera');
        if (papelera) App.data.papelera = JSON.parse(papelera);
      } catch (e) { console.error('Error al cargar papelera:', e); }
    }
  },

  ui: {
    showTab(tabId, event) {
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      document.getElementById(tabId).classList.add('active');
      if (event && event.target) { event.target.classList.add('active'); event.target.setAttribute('aria-selected', 'true'); }

      switch (tabId) {
        case 'puntos-tab': App.puntos.renderTabla(); break;
        case 'estadisticas-tab': if (typeof Charts !== 'undefined') Charts.renderAll(); break;
        case 'analytics-tab': if (typeof Analytics !== 'undefined') Analytics.render(); break;
        case 'calendario-tab': if (typeof Calendar !== 'undefined') Calendar.render(); break;
        case 'mapa-tab': if (typeof MapModule !== 'undefined') MapModule.init(); break;
      }
    },

    inicializarRegiones() {
      const regionSelect = document.getElementById('regionSelect');
      regionSelect.innerHTML = '<option value="">Todas las Regiones</option>';
      App.utils.obtenerRegionesUnicas().forEach(region => {
        const opt = document.createElement('option');
        opt.value = region; opt.textContent = region;
        regionSelect.appendChild(opt);
      });
    },

    actualizarSelectPuntos(filtroRegion = '') {
      const puntoControlSelect = document.getElementById('puntoControl');
      const valorActual = puntoControlSelect.value;
      puntoControlSelect.innerHTML = '<option value="">Seleccione un punto...</option>';
      puntoControlSelect.innerHTML += '<option value="CALIBRACION">Calibración</option>';

      Object.keys(App.data.puntos)
        .filter(p => p !== 'CALIBRACION')
        .sort()
        .forEach(p => {
          const datos = App.data.puntos[p];
          if (!filtroRegion || datos.region === filtroRegion) {
            const opt = document.createElement('option');
            opt.value = p; opt.textContent = p;
            puntoControlSelect.appendChild(opt);
          }
        });

      if (valorActual && puntoControlSelect.querySelector(`option[value="${valorActual}"]`)) {
        puntoControlSelect.value = valorActual;
      }
    },

    abrirModalNuevoPunto(puntoNombre = null) {
      const modal = document.getElementById('modalNuevoPunto');
      const titulo = document.getElementById('modalTitulo');
      const btnGuardar = document.getElementById('btnGuardarPunto');

      App.data.editandoPunto = puntoNombre;

      if (puntoNombre && puntoNombre !== 'CALIBRACION') {
        titulo.textContent = 'Editar Punto de Control';
        btnGuardar.textContent = 'Actualizar Punto';
        const datos = App.data.puntos[puntoNombre];
        document.getElementById('editandoPuntoNombre').value = puntoNombre;
        document.getElementById('nuevoPuntoNombre').value = puntoNombre;
        document.getElementById('nuevoPuntoRegion').value = datos.region || '';
        document.getElementById('nuevoPuntoComuna').value = datos.comuna || '';
        document.getElementById('nuevoPuntoProvincia').value = datos.provincia || '';
        document.getElementById('nuevoPuntoTipo').value = datos.tipoControl || 'Pista de Pesaje';
        document.getElementById('nuevoPuntoFoso').value = datos.foso || 'Si';
        document.getElementById('nuevoPuntoRuta').value = datos.ruta || '';
        document.getElementById('nuevoPuntoKm').value = datos.kilometro || '';
        document.getElementById('nuevoPuntoSentido').value = datos.sentido || '';
        document.getElementById('nuevoPuntoLat').value = (datos.lat ?? '') === '' ? '' : datos.lat;
        document.getElementById('nuevoPuntoLng').value = (datos.lng ?? '') === '' ? '' : datos.lng;
      } else {
        titulo.textContent = 'Agregar Punto de Control';
        btnGuardar.textContent = 'Guardar Punto';
        document.getElementById('formNuevoPunto').reset();
        document.getElementById('editandoPuntoNombre').value = '';
      }

      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
    },

    cerrarModalNuevoPunto() {
      const modal = document.getElementById('modalNuevoPunto');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.getElementById('formNuevoPunto').reset();
      const prev = document.getElementById('previewMap');
      if (prev) prev.style.display = 'none';
      if (typeof CoordenadasHelper !== 'undefined' && CoordenadasHelper.previewMapInstance) {
        CoordenadasHelper.previewMapInstance.remove();
        CoordenadasHelper.previewMapInstance = null;
      }
      App.data.editandoPunto = null;
    }
  },

  form: {
    limpiar() {
      const form = document.getElementById('controlForm');
      form.reset();
      App.data.editandoId = null;
      document.getElementById('guardarBtn').textContent = '💾 Guardar Control';
      document.getElementById('regionSelect').value = '';
      App.ui.actualizarSelectPuntos();
      App.ui.limpiarCamposRelacionados?.();
      document.getElementById('fecha').valueAsDate = new Date();
      document.getElementById('horaInicio').value = '';
      document.getElementById('horaFin').value = '';
      document.getElementById('horasTotalDisplay').value = '';
      document.getElementById('horasH').value = 0;
      document.getElementById('horasM').value = 0;
      document.getElementById('horasS').value = 0;
      document.getElementById('observaciones').value = '';
      document.getElementById('charCounter').textContent = '0 / 1000';
      document.getElementById('indicadoresVivo').style.display = 'none';
      document.getElementById('ajusteManualHoras').classList.add('hidden');
    },

    validar(f) {
      if (f.vehiculosSobrepeso > f.vehiculosControlados) { App.toast('⚠️ Sobrepeso no puede superar controlados', 'warning'); return false; }
      if (f.vehiculosInfraccionados > f.vehiculosControlados) { App.toast('⚠️ Infracciones no puede superar controlados', 'warning'); return false; }
      if (f.horasControl <= 0) { App.toast('⚠️ Las horas de control deben ser > 0', 'warning'); return false; }
      return true;
    },

    guardar(e) {
      e.preventDefault();
      const h = parseInt(document.getElementById('horasH').value) || 0;
      const m = parseInt(document.getElementById('horasM').value) || 0;
      const s = parseInt(document.getElementById('horasS').value) || 0;
      const horasDecimal = App.utils.horasADecimal(h, m, s);
      const horasFormato = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      const f = {
        id: App.data.editandoId || Date.now(),
        fecha: document.getElementById('fecha').value,
        region: document.getElementById('region').value,
        comuna: document.getElementById('comuna').value,
        puntoControl: document.getElementById('puntoControl').value,
        ruta: document.getElementById('ruta').value,
        kilometro: document.getElementById('kilometro').value,
        sentido: document.getElementById('sentido').value,

        horaInicio: document.getElementById('horaInicio').value || '',
        horaFin: document.getElementById('horaFin').value || '',
        horasControl: horasDecimal,
        horasFormato: horasFormato,

        vehiculosControlados: parseInt(document.getElementById('vehiculosControlados').value) || 0,
        vehiculosSobrepeso: parseInt(document.getElementById('vehiculosSobrepeso').value) || 0,
        vehiculosInfraccionados: parseInt(document.getElementById('vehiculosInfraccionados').value) || 0,

        observaciones: document.getElementById('observaciones').value.trim(),

        creadoPor: App.data.currentUser ? App.data.currentUser.username : 'Invitado',
        creadoEn: new Date().toISOString()
      };

      if (!App.form.validar(f)) return;

      f.promedioVehiculosHora = horasDecimal > 0 ? (f.vehiculosControlados / horasDecimal).toFixed(2) : 0;
      f.porcentajeSobrepeso = f.vehiculosControlados > 0 ? ((f.vehiculosSobrepeso / f.vehiculosControlados) * 100).toFixed(2) : 0;
      f.porcentajeInfraccion = f.vehiculosControlados > 0 ? ((f.vehiculosInfraccionados / f.vehiculosControlados) * 100).toFixed(2) : 0;

      if (App.data.editandoId) {
        const idx = App.data.registros.findIndex(d => d.id === App.data.editandoId);
        if (idx !== -1) {
          f.modificadoPor = App.data.currentUser ? App.data.currentUser.username : 'Invitado';
          f.modificadoEn = new Date().toISOString();
          App.data.registros[idx] = f;
        }
        App.data.editandoId = null;
        document.getElementById('guardarBtn').textContent = '💾 Guardar Control';
        App.toast('✅ Registro actualizado', 'success');
      } else {
        App.data.registros.push(f);
        App.toast('✅ Registro guardado', 'success');
      }

      App.storage.guardarRegistros();
      App.data.registrosFiltrados = [...App.data.registros];
      App.registros.renderTabla();
      App.estadisticas.actualizar();
      App.form.limpiar();

      if (parseFloat(f.porcentajeInfraccion) > 30) {
        if (typeof Notifications !== 'undefined') {
          Notifications.add(`⚠️ Alto % infracciones (${f.porcentajeInfraccion}%) en ${f.puntoControl}`, 'warning');
        }
      }

      const btnGestion = document.querySelectorAll('.tab-button')[1];
      if (btnGestion) btnGestion.click();
    }
  },

  registros: {
    renderTabla() {
      const tbody = document.getElementById('tablaCuerpo');
      const mensaje = document.getElementById('mensajeVacio');
      tbody.innerHTML = '';

      if (App.data.registrosFiltrados.length === 0) {
        mensaje.style.display = 'block';
        return;
      }
      mensaje.style.display = 'none';

      const start = (App.data.currentPage - 1) * App.data.itemsPerPage;
      const end = start + App.data.itemsPerPage;
      const paginated = App.data.registrosFiltrados.slice(start, end);

      paginated.forEach(dato => {
        const tr = document.createElement('tr');
        const horario = (dato.horaInicio && dato.horaFin) ? `${dato.horaInicio} - ${dato.horaFin}` : 'N/A';
        const obs = dato.observaciones || '';

        tr.innerHTML = `
          <td>${App.utils.sanitize(dato.fecha)}</td>
          <td>${App.utils.sanitize(dato.region)}</td>
          <td>${App.utils.sanitize(dato.puntoControl)}</td>
          <td style="font-size:12px;white-space:nowrap;">${horario}</td>
          <td><strong>${dato.horasFormato}</strong></td>
          <td>${dato.vehiculosControlados.toLocaleString('es-CL')}</td>
          <td>${dato.vehiculosSobrepeso.toLocaleString('es-CL')}</td>
          <td>${dato.vehiculosInfraccionados.toLocaleString('es-CL')}</td>
          <td>${dato.promedioVehiculosHora}</td>
          <td>${dato.porcentajeSobrepeso}%</td>
          <td>${dato.porcentajeInfraccion}%</td>
          <td>
            ${obs ? `<button class="btn-secondary" style="font-size:11px;padding:4px 8px;" onclick="App.registros.verObservaciones(${dato.id})" title="${App.utils.sanitize(obs).substring(0,100)}...">📝 Ver</button>` : '—'}
          </td>
          <td class="actions-cell">
            <button class="btn-warning" data-action="edit" data-id="${dato.id}">✏️</button>
            <button class="btn-danger" data-action="delete" data-id="${dato.id}">🗑️</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tbody.removeEventListener('click', App.registros._handler);
      App.registros._handler = (e) => {
        const btn = e.target.closest('button'); if (!btn) return;
        const action = btn.dataset.action; const id = parseInt(btn.dataset.id);
        if (action === 'edit') App.registros.editar(id);
        if (action === 'delete') App.registros.eliminar(id);
      };
      tbody.addEventListener('click', App.registros._handler);

      App.registros.renderPagination();
    },

    renderPagination() {
      const el = document.getElementById('pagination'); if (!el) return;
      const totalPages = Math.ceil(App.data.registrosFiltrados.length / App.data.itemsPerPage);
      if (totalPages <= 1) { el.innerHTML = ''; return; }

      let html = '';
      const cp = App.data.currentPage;

      html += `<button ${cp === 1 ? 'disabled' : ''} onclick="App.registros.changePage(${cp - 1})">❮ Anterior</button>`;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= cp - 2 && i <= cp + 2)) {
          html += `<button class="${i === cp ? 'active' : ''}" onclick="App.registros.changePage(${i})">${i}</button>`;
        } else if (i === cp - 3 || i === cp + 3) {
          html += '<span>...</span>';
        }
      }
      html += `<button ${cp === totalPages ? 'disabled' : ''} onclick="App.registros.changePage(${cp + 1})">Siguiente ❯</button>`;
      el.innerHTML = html;
    },

    changePage(p) {
      const totalPages = Math.ceil(App.data.registrosFiltrados.length / App.data.itemsPerPage);
      if (p < 1 || p > totalPages) return;
      App.data.currentPage = p;
      App.registros.renderTabla();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    verObservaciones(id) {
      const r = App.data.registros.find(x => x.id === id);
      if (!r || !r.observaciones) return;
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.display = 'block';
      modal.innerHTML = `
        <div class="modal-content modal-small">
          <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
          <h2>📝 Observaciones del Control</h2>
          <div style="margin:20px 0;">
            <p style="background: var(--bg-secondary); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-color); white-space: pre-wrap; line-height: 1.6;">
              ${App.utils.sanitize(r.observaciones)}
            </p>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);border-top:1px solid var(--border-color);padding-top:15px;">
            <strong>Fecha:</strong> ${r.fecha}<br>
            <strong>Punto:</strong> ${r.puntoControl}<br>
            <strong>Horario:</strong> ${r.horaInicio && r.horaFin ? `${r.horaInicio} - ${r.horaFin}` : 'N/A'}<br>
            <strong>Registrado por:</strong> ${r.creadoPor || 'N/A'}
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    },

    editar(id) {
      const d = App.data.registros.find(x => x.id === id);
      if (!d) return;
      const btnFormulario = document.querySelectorAll('.tab-button')[0]; if (btnFormulario) btnFormulario.click();
      document.getElementById('fecha').value = d.fecha;

      if (d.region) {
        const reg = App.utils.obtenerRegionesUnicas().find(r => r === d.region);
        if (reg) { document.getElementById('regionSelect').value = reg; App.ui.actualizarSelectPuntos(reg); }
      }

      document.getElementById('puntoControl').value = d.puntoControl;
      document.getElementById('puntoControl').dispatchEvent(new Event('change'));

      document.getElementById('horaInicio').value = d.horaInicio || '';
      document.getElementById('horaFin').value = d.horaFin || '';

      const totalSeg = Math.round(d.horasControl * 3600);
      document.getElementById('horasH').value = Math.floor(totalSeg / 3600);
      document.getElementById('horasM').value = Math.floor((totalSeg % 3600) / 60);
      document.getElementById('horasS').value = totalSeg % 60;
      document.getElementById('horasTotalDisplay').value = d.horasFormato;

      document.getElementById('vehiculosControlados').value = d.vehiculosControlados;
      document.getElementById('vehiculosSobrepeso').value = d.vehiculosSobrepeso;
      document.getElementById('vehiculosInfraccionados').value = d.vehiculosInfraccionados;

      document.getElementById('observaciones').value = d.observaciones || '';
      if (typeof HorasControl !== 'undefined') {
        HorasControl.actualizarContador(document.getElementById('observaciones'));
        HorasControl.calcularPromedios();
      }

      App.data.editandoId = id;
      document.getElementById('guardarBtn').textContent = '🔄 Actualizar Cambios';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    eliminar(id) {
      if (!confirm('¿Está seguro de que desea eliminar este registro?')) return;
      const r = App.data.registros.find(x => x.id === id);
      if (r) {
        App.data.papelera.push({ ...r, eliminadoEn: new Date().toISOString(), eliminadoPor: App.data.currentUser ? App.data.currentUser.username : 'Invitado' });
        App.storage.guardarPapelera();
      }
      App.data.registros = App.data.registros.filter(x => x.id !== id);
      App.data.registrosFiltrados = App.data.registrosFiltrados.filter(x => x.id !== id);
      App.storage.guardarRegistros();
      App.registros.renderTabla();
      App.estadisticas.actualizar();
      App.toast('🗑️ Registro eliminado (guardado en papelera)', 'info');
    }
  },

  puntos: {
    renderTabla() {
      const tbody = document.getElementById('tablaPuntosCuerpo');
      tbody.innerHTML = '';
      Object.keys(App.data.puntos).sort().forEach(p => {
        if (p === 'CALIBRACION') return;
        const d = App.data.puntos[p];
        const lat = (typeof d.lat === 'number') ? d.lat : (d.lat ? parseFloat(d.lat) : null);
        const lng = (typeof d.lng === 'number') ? d.lng : (d.lng ? parseFloat(d.lng) : null);
        const hasGPS = (lat !== null && !isNaN(lat) && lng !== null && !isNaN(lng));

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${App.utils.sanitize(p)}</strong></td>
          <td>${App.utils.sanitize(d.region) || '-'}</td>
          <td>${App.utils.sanitize(d.comuna) || '-'}</td>
          <td>${App.utils.sanitize(d.tipoControl) || '-'}</td>
          <td>${(d.ruta || '-')}/${(d.kilometro || '-')}</td>
          <td style="text-align:center;">${hasGPS ? '<span style="color: var(--success-color); font-size: 20px;" title="GPS disponible">📍</span>' : '<span style="color: var(--text-muted); font-size: 20px;" title="Sin GPS">📌</span>'}</td>
          <td style="font-size:11px;font-family:monospace;">${hasGPS ? `<div style="display:flex;flex-direction:column;gap:2px;"><span>Lat: ${lat.toFixed(6)}</span><span>Lng: ${lng.toFixed(6)}</span></div>` : '<span style="color:var(--text-muted);">No disponible</span>'}</td>
          <td class="actions-cell">
            ${hasGPS ? `<button class="btn-primary" style="font-size:11px;padding:4px 8px;margin-right:5px;" data-action="ver-mapa" data-nombre="${App.utils.sanitize(p)}">🗺️ Ver</button>` : ''}
            <button class="btn-warning" data-action="edit-punto" data-nombre="${App.utils.sanitize(p)}">✏️</button>
            <button class="btn-danger" data-action="delete-punto" data-nombre="${App.utils.sanitize(p)}">🗑️</button>
          </td>`;
        tbody.appendChild(tr);
      });

      tbody.removeEventListener('click', App.puntos._handler);
      App.puntos._handler = (e) => {
        const btn = e.target.closest('button'); if (!btn) return;
        const action = btn.dataset.action; const nombre = btn.dataset.nombre;
        if (action === 'edit-punto') App.ui.abrirModalNuevoPunto(nombre);
        if (action === 'delete-punto') App.puntos.eliminar(nombre);
        if (action === 'ver-mapa') { if (typeof MapModule !== 'undefined') { MapModule.centrarEnPunto(nombre); document.querySelectorAll('.tab-button')[5].click(); } }
      };
      tbody.addEventListener('click', App.puntos._handler);
    },

    eliminar(puntoNombre) {
      if (puntoNombre === 'CALIBRACION') { App.toast('❌ No se puede eliminar el punto de calibración', 'error'); return; }
      if (!confirm(`¿Está seguro de eliminar "${puntoNombre}"?`)) return;
      delete App.data.puntos[puntoNombre];
      App.storage.guardarPuntos();
      const regionSelect = document.getElementById('regionSelect');
      App.ui.actualizarSelectPuntos(regionSelect.value);
      App.ui.inicializarRegiones();
      if (document.getElementById('puntos-tab').classList.contains('active')) App.puntos.renderTabla();
      App.toast(`✅ Punto "${puntoNombre}" eliminado`, 'success');
    },

    guardar(e) {
      e.preventDefault();
      const original = document.getElementById('editandoPuntoNombre').value;
      const nombre = document.getElementById('nuevoPuntoNombre').value.trim();
      if (!nombre) { App.toast('⚠️ El nombre del punto es obligatorio', 'warning'); return; }

      const latVal = document.getElementById('nuevoPuntoLat').value;
      const lngVal = document.getElementById('nuevoPuntoLng').value;

      const datos = {
        region: document.getElementById('nuevoPuntoRegion').value.trim(),
        comuna: document.getElementById('nuevoPuntoComuna').value.trim(),
        provincia: document.getElementById('nuevoPuntoProvincia').value.trim(),
        tipoControl: document.getElementById('nuevoPuntoTipo').value,
        foso: document.getElementById('nuevoPuntoFoso').value,
        ruta: document.getElementById('nuevoPuntoRuta').value.trim(),
        kilometro: document.getElementById('nuevoPuntoKm').value.trim(),
        sentido: document.getElementById('nuevoPuntoSentido').value.trim(),
        lat: latVal !== '' ? parseFloat(latVal) : null,
        lng: lngVal !== '' ? parseFloat(lngVal) : null
      };

      if (App.data.editandoPunto) {
        if (original !== nombre) delete App.data.puntos[original];
        App.data.puntos[nombre] = datos;
        App.toast(`✅ Punto "${nombre}" actualizado`, 'success');
      } else {
        if (App.data.puntos[nombre]) { App.toast('⚠️ Ya existe un punto con ese nombre', 'warning'); return; }
        App.data.puntos[nombre] = datos;
        App.toast(`✅ Punto "${nombre}" agregado`, 'success');
      }

      App.storage.guardarPuntos();
      const regionSelect = document.getElementById('regionSelect');
      App.ui.actualizarSelectPuntos(regionSelect.value);
      App.ui.inicializarRegiones();
      App.ui.cerrarModalNuevoPunto();
      if (document.getElementById('puntos-tab').classList.contains('active')) App.puntos.renderTabla();
    }
  },

  estadisticas: {
    actualizar() {
      const totalControles = App.data.registros.length;
      const totalVehiculos = App.data.registros.reduce((s, d) => s + d.vehiculosControlados, 0);
      const totalSobrepeso = App.data.registros.reduce((s, d) => s + d.vehiculosSobrepeso, 0);
      const totalInfracciones = App.data.registros.reduce((s, d) => s + d.vehiculosInfraccionados, 0);
      const totalHoras = App.data.registros.reduce((s, d) => s + d.horasControl, 0);

      const prom = totalHoras > 0 ? (totalVehiculos / totalHoras).toFixed(2) : 0;
      const pSobre = totalVehiculos > 0 ? ((totalSobrepeso / totalVehiculos) * 100).toFixed(2) : 0;
      const pInfrac = totalVehiculos > 0 ? ((totalInfracciones / totalVehiculos) * 100).toFixed(2) : 0;

      document.getElementById('statTotalControles').textContent = totalControles;
      document.getElementById('statTotalHoras').textContent = App.utils.decimalAHoras(totalHoras);
      document.getElementById('statTotalVehiculos').textContent = totalVehiculos.toLocaleString('es-CL');
      document.getElementById('statTotalSobrepeso').textContent = totalSobrepeso.toLocaleString('es-CL');
      document.getElementById('statTotalInfracciones').textContent = totalInfracciones.toLocaleString('es-CL');
      document.getElementById('statPromedioGeneralVehiculosHora').textContent = prom;
      document.getElementById('statPorcentajeGeneralSobrepeso').textContent = `${pSobre}%`;
      document.getElementById('statPorcentajeGeneralInfracciones').textContent = `${pInfrac}%`;
    }
  },

  exportar: {
    csv() {
      if (App.data.registros.length === 0) { App.toast('⚠️ No hay datos para exportar', 'warning'); return; }
      const headers = ['Fecha','Región','Comuna','Punto','Hora Inicio','Hora Fin','Horas Total','Controlados','Sobrepeso','Infracciones','Prom/H','% Sobre','% Infrac','Observaciones'];
      const rows = App.data.registros.map(d => [
        d.fecha, d.region, d.comuna, d.puntoControl, d.horaInicio || 'N/A', d.horaFin || 'N/A', d.horasFormato,
        d.vehiculosControlados, d.vehiculosSobrepeso, d.vehiculosInfraccionados,
        d.promedioVehiculosHora, d.porcentajeSobrepeso, d.porcentajeInfraccion,
        d.observaciones || ''
      ]);
      const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `controles_${new Date().toISOString().split('T')[0]}.csv`; a.click();
      URL.revokeObjectURL(url);
      App.toast('✅ Datos exportados a CSV', 'success');
    }
  },

  toggleDarkMode() {
    App.data.darkMode = !App.data.darkMode;
    document.documentElement.setAttribute('data-theme', App.data.darkMode ? 'dark' : 'light');
    document.getElementById('themeIcon').textContent = App.data.darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', App.data.darkMode);
  },

  toast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  },

  init() {
    App.storage.cargarPuntos();
    App.storage.cargarRegistros();
    App.storage.cargarPapelera();

    const savedDark = localStorage.getItem('darkMode') === 'true';
    if (savedDark) { App.data.darkMode = true; document.documentElement.setAttribute('data-theme', 'dark'); document.getElementById('themeIcon').textContent = '☀️'; }

    App.ui.inicializarRegiones();
    App.ui.actualizarSelectPuntos();
    document.getElementById('fecha').valueAsDate = new Date();

    App.registros.renderTabla();
    App.estadisticas.actualizar();

    document.getElementById('controlForm').addEventListener('submit', App.form.guardar);
    document.getElementById('formNuevoPunto').addEventListener('submit', App.puntos.guardar);

    document.getElementById('regionSelect').addEventListener('change', function() {
      App.ui.actualizarSelectPuntos(this.value);
      document.getElementById('puntoControl').value = '';
      ['region','comuna','provincia','foso','ruta','kilometro','sentido'].forEach(id => document.getElementById(id).value = '');
    });

    document.getElementById('puntoControl').addEventListener('change', function() {
      const d = App.data.puntos[this.value];
      if (d) {
        document.getElementById('region').value = d.region || '';
        document.getElementById('comuna').value = d.comuna || '';
        document.getElementById('provincia').value = d.provincia || '';
        document.getElementById('foso').value = d.foso || '';
        document.getElementById('ruta').value = d.ruta || '';
        document.getElementById('kilometro').value = d.kilometro || '';
        document.getElementById('sentido').value = d.sentido || '';
      } else {
        ['region','comuna','provincia','foso','ruta','kilometro','sentido'].forEach(id => document.getElementById(id).value = '');
      }
    });

    window.addEventListener('click', function(ev) {
      const modalPunto = document.getElementById('modalNuevoPunto');
      const modalLogin = document.getElementById('modalLogin');
      if (ev.target === modalPunto) App.ui.cerrarModalNuevoPunto();
      if (ev.target === modalLogin && typeof Users !== 'undefined') Users.closeLoginModal();
    });

    App.toast('✅ Sistema cargado correctamente', 'success');
    console.log('✅ Aplicación iniciada');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());