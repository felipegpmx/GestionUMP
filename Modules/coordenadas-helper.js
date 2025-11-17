/* ====================================
   HELPER DE COORDENADAS GPS (LISTO)
   - Importa CSV en formatos:
     a) NombrePunto,Latitud,Longitud
     b) REGION,SECTOR,RUTA,KM,COORDENADAS (tu formato)
   - Soporta delimitadores: coma, punto y coma y tab
   - Convierte comas decimales (98,5 -> 98.5)
   - Botones: Usar Mi Ubicación / Abrir Google Maps / Previsualizar Mapa
   ==================================== */

const CoordenadasHelper = {
  previewMapInstance: null,

  // ================== UTILIDADES DE MENSAJERÍA ==================
  _toast(msg, type = 'info') {
    if (window.App && typeof App.toast === 'function') {
      App.toast(msg, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${msg}`);
    }
  },
  _notify(msg, type = 'info') {
    if (window.Notifications && typeof Notifications.add === 'function') {
      Notifications.add(msg, type, false);
    }
  },

  // ================== UTILIDADES CSV ==================
  _detectDelimiter(line) {
    const candidates = [',', ';', '\t'];
    let best = ',', max = 0;
    for (const d of candidates) {
      const count = (line.match(new RegExp(`\\${d}`, 'g')) || []).length;
      if (count > max) { max = count; best = d; }
    }
    return best;
  },

  _splitCSVLine(line, delimiter) {
    // Split por delimiter respetando comillas
    const regex = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`);
    return line.split(regex).map(s => s.replace(/^"|"$/g, '').trim());
  },

  _parseCSV(text) {
    // BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    // Normalizar saltos
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return { headers: [], rows: [] };
    const delimiter = this._detectDelimiter(lines[0]);
    const rawHeaders = this._splitCSVLine(lines[0], delimiter);

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = this._splitCSVLine(lines[i], delimiter);
      while (cols.length < rawHeaders.length) cols.push('');
      rows.push(cols);
    }
    return { headers: rawHeaders, rows };
  },

  _toFloat(val) {
    if (val == null) return null;
    let s = String(val).trim();
    if (s === '') return null;
    // 98,5 -> 98.5
    if (/^-?\d+,\d+$/.test(s)) s = s.replace(',', '.');
    const n = Number(s);
    return isNaN(n) ? null : n;
  },

  _parseLatLngFromPair(pair) {
    if (!pair) return { lat: null, lng: null };
    const cleaned = pair.replace(/[()]/g, '').trim();
    const parts = cleaned.split(/[,;]\s*/);
    if (parts.length < 2) return { lat: null, lng: null };
    const lat = this._toFloat(parts[0]);
    const lng = this._toFloat(parts[1]);
    return { lat, lng };
  },

  _normalizeName(name) {
    if (!name) return '';
    return name.replace(/\s+/g, ' ').trim();
  },

  // ================== MAPEO DE ALIAS SECTOR -> NOMBRE ==================
  _aliasMap: {
    'ACHA PROVINCIA DE ARICA': 'Acha',
    'ZAPAHUIRA PROVINCIA DE PARINACOTA': 'Zapahuira',
    'POZO ALMONTE PROVINCIA DEL TAMARUGAL': 'Pozo Almonte NS',
    'RIO LOA 1 PROVINCIA DE IQUIQUE': 'Loa N/S',
    'RIO LOA 2 PROVINCIA DE IQUIQUE': 'Loa S/N',
    'MEJILLONES 1 PROVINCIA DE ANTOFAGASTA': 'Mejillones 1',
    'MEJILLONES 2 PROVINCIA DE ANTOFAGASTA': 'Mejillones 2',
    'VALLE DE LA LUNA PROVINCIA DEL LOA': 'S.P de Atacama',
    'MARIA ISABEL PROVINCIA DE COPIAPO': 'M. Isabel',
    'PUERTO PADRONES PROVINCIA DE COPIAPO': 'P. Padrones',
    'NANTOCO PROVINCIA DE COPIAPO': 'Nantoco',
    'TERESITA PROVINCIA DE COPIAPO': 'Teresita',
    'PORTEZUELO PROVINCIA DE CHAÑARAL': 'Portezuelo',
    'BODEGUILLA PROVINCIA DE HUASCO': 'Bodeguilla',
    'EL PEÑON 1 PROVINCIA DEL ELQUI': 'El Peñon 1',
    'EL PEÑON 2 PROVINCIA DEL ELQUI': 'El Peñon 2',
    'PEÑABLANCA PROVINCIA PETORCA': 'Peñablanca',
    'QUINTERO PROVINCIA VALPARAISO': 'Quintero',
    'AERÓDROMO PROVINCIA DE SAN ANTONIO': 'Aeródromo',
    'FUERTE AGUAYO 1 PROVINCIA DE VALPARAISO': 'Fuerte Aguayo 1',
    'FUERTE AGUAYO 2 PROVINCIA DE VALPARAISO': 'Fuerte Aguayo 2',
    'LO OROZCO 1 PROVINCIA DE VALPARAISO': 'Lo Orozco 1',
    'LO OROZCO 2 PROVINCIA DE VALPARAISO': 'Lo Orozco 2',
    'LO ECHEVERS PROVINCIA DE SANTIAGO': 'Lo Echevers',
    'RINCONADA MAIPÚ SANTIAGO': 'Rinconada',
    'SAN FRANCISCO PROVINCIA DE TALAGANTE': 'Puente San Francisco',
    'EL TREBAL PROVINCIA TALAGANTE': 'El Trebal',
    'CALERA DE TANGO PROVINCIA DE TALAGANTE': 'Calera de Tango',
    'POMAIRE PROVINCIA DE MELIPILLA': 'Pomaire',
    'POLPAICO PROVINCIA DE CHACABUCO': 'Polpaico',
    'QUILAPILUN PROVINCIA DE CHACABUCO': 'Quilapilun',
    'CHICAUMA PROVINCIA DE CHACABUCO': 'Chicauma',
    'LA PUNTILLA PROVINCIA DE MAIPO': 'La Puntilla',
    'LA OBRA PROVINCIA CORDILLERA': 'La Obra',
    'SAN RAFAEL 1 PROVINCIA DE LLANQUIHUE': 'San Rafael',
    'SAN RAFAEL 2 PROVINCIA DE LLANQUIHUE': 'San Rafael',
    'HUEQUEN PROVINCIA DE MALLECO': 'Huequén',
    'SAN LUIS PROVINCIA DE CAUTIN': 'San Luis',
    'PURALACO PROVINCIA DE CAUTIN': 'Puralaco',
    'CHAMPULLI PROVINCIA DE CAUTIN': 'Champulli',
    'LLANCAHUE PROVINCIA DE VALDIVIA': 'Llancahue',
    'QUINCHILCA PROVINCIA DE VALDIVIA': 'Quinchilca',
    'PURINGUE PROVINCIA DE VALDIVIA': 'Puringue',
    'RAPACO PROVINCIA DE RANCO': 'Rapaco',
    'VISTA HERMOSA PROVINCIA DE RANCO': 'Vista Hermosa',
    'LOS VOLCANES PROVINCIA DE OSORNO': 'Los Volcanes',
    'CONTAO PROVINCIA DE PALENA': 'Contao',
    'CHACAO PROVINCIA DE CHILOE': 'Chacao',
    'DEGAÑ PROVINCIA DE CHILOE': 'Degañ',
    'TOCOPILLA PROVINCIA DE TOCOPILLA': 'Tocopilla'
  },

  _mapSectorToNombrePunto(sector) {
    const key = this._normalizeName(sector).toUpperCase();
    return this._aliasMap[key] || null;
  },

  // ================== IMPORTACIÓN COORDENADAS (SOLO LAT/LNG) ==================
  importarCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const { headers, rows } = this._parseCSV(event.target.result);
          if (headers.length === 0) throw new Error('CSV vacío o sin encabezados');

          // Mapeo de headers
          const H = {};
          headers.forEach((h, i) => H[h.trim().toUpperCase()] = i);

          const hasSimple =
            ('NOMBREPUNTO' in H) && (('LATITUD' in H) || ('LAT' in H)) && (('LONGITUD' in H) || ('LNG' in H));
          const hasSector =
            ('SECTOR' in H) && (('COORDENADAS' in H) || ('LATITUD' in H && 'LONGITUD' in H));

          let updated = 0, notFound = 0, invalid = 0;

          rows.forEach((cols) => {
            let nombre = '';
            let lat = null, lng = null;

            if (hasSimple) {
              nombre = this._normalizeName(cols[H['NOMBREPUNTO']]);
              lat = this._toFloat(cols[H['LATITUD']] ?? cols[H['LAT']]);
              lng = this._toFloat(cols[H['LONGITUD']] ?? cols[H['LNG']]);
            } else if (hasSector) {
              const rawSector = cols[H['SECTOR']] || '';
              nombre = this._mapSectorToNombrePunto(rawSector) || this._normalizeName(rawSector);

              if ('COORDENADAS' in H) {
                const pair = cols[H['COORDENADAS']];
                const p = this._parseLatLngFromPair(pair);
                lat = p.lat; lng = p.lng;
              } else {
                lat = this._toFloat(cols[H['LATITUD']]);
                lng = this._toFloat(cols[H['LONGITUD']]);
              }
            } else {
              throw new Error('Encabezados no compatibles. Usa (NombrePunto,Latitud,Longitud) o (REGION,SECTOR,RUTA,KM,COORDENADAS)');
            }

            // Validación simple de rangos
            const latOk = lat != null && lat >= -90 && lat <= 90;
            const lngOk = lng != null && lng >= -180 && lng <= 180;
            if (!nombre || !latOk || !lngOk) { invalid++; return; }

            const punto = window.App?.data?.puntos?.[nombre];
            if (punto) {
              punto.lat = lat;
              punto.lng = lng;
              updated++;
            } else {
              notFound++;
            }
          });

          // Persistir y refrescar UI
          if (window.App) {
            App.storage.guardarPuntos();
            if (document.getElementById('puntos-tab')?.classList.contains('active')) {
              App.puntos.renderTabla();
            }
          }

          const msg = `Coordenadas importadas: ✅ ${updated} actualizados • ❓ ${notFound} no encontrados • ⚠️ ${invalid} inválidos`;
          this._toast(msg, updated > 0 ? 'success' : 'warning');
          this._notify(`📍 ${msg}`, updated > 0 ? 'success' : 'warning');

        } catch (err) {
          console.error(err);
          this._toast('❌ Error al importar CSV: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  },

  // ================== PLANTILLA CSV SIMPLE ==================
  descargarPlantillaCSV() {
    const csv = [
      'NombrePunto,Latitud,Longitud',
      'Acha,-18.537829,-70.255303',
      'Mejillones 1,-23.087380,-70.332448'
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_coordenadas.csv';
    a.click();
    URL.revokeObjectURL(url);

    this._toast('✅ Plantilla simple descargada', 'success');
  },

  // ================== VALIDACIONES Y UI ==================
  validar(inputId) {
    const input = document.getElementById(inputId);
    const value = this._toFloat(input.value);
    const errorEl = document.getElementById(inputId === 'nuevoPuntoLat' ? 'latError' : 'lngError');
    const [min, max] = (inputId === 'nuevoPuntoLat') ? [-90, 90] : [-180, 180];

    if (value == null || value < min || value > max) {
      if (errorEl) errorEl.style.display = 'block';
      input.style.borderColor = 'var(--danger-color)';
      return false;
    }
    if (errorEl) errorEl.style.display = 'none';
    input.style.borderColor = 'var(--success-color)';
    return true;
  },

  obtenerUbicacion() {
    if (!navigator.geolocation) {
      this._toast('⚠️ Tu navegador no soporta geolocalización', 'warning');
      return;
    }
    // Geolocalización requiere HTTPS o localhost
    this._toast('📍 Obteniendo ubicación...', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const latEl = document.getElementById('nuevoPuntoLat');
        const lngEl = document.getElementById('nuevoPuntoLng');
        if (latEl) latEl.value = lat;
        if (lngEl) lngEl.value = lng;
        this.validar('nuevoPuntoLat');
        this.validar('nuevoPuntoLng');
        this._toast('✅ Ubicación obtenida', 'success');
      },
      (err) => this._toast('❌ Error geolocalización: ' + err.message, 'error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  abrirMaps() {
    const nombre = document.getElementById('nuevoPuntoNombre')?.value || '';
    const comuna = document.getElementById('nuevoPuntoComuna')?.value || '';
    const region = document.getElementById('nuevoPuntoRegion')?.value || '';
    const query = [nombre, comuna, region].filter(Boolean).join(' ');
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query || 'Chile')}`, '_blank');
  },

  previsualizarMapa() {
    let lat = this._toFloat(document.getElementById('nuevoPuntoLat')?.value);
    let lng = this._toFloat(document.getElementById('nuevoPuntoLng')?.value);

    // Fallback: si no hay lat/lng en inputs, usar el punto cargado (si existe)
    if ((lat == null || isNaN(lat) || lng == null || isNaN(lng)) && window.App) {
      const nombre = document.getElementById('nuevoPuntoNombre')?.value || '';
      const p = App?.data?.puntos?.[nombre];
      if (p && p.lat != null && p.lng != null) {
        lat = (typeof p.lat === 'string') ? parseFloat(p.lat) : p.lat;
        lng = (typeof p.lng === 'string') ? parseFloat(p.lng) : p.lng;
      }
    }

    if (lat == null || isNaN(lat) || lng == null || isNaN(lng)) {
      this._toast('⚠️ Ingresa coordenadas válidas o selecciona un punto con GPS', 'warning');
      return;
    }

    const container = document.getElementById('previewMap');
    if (!container) { this._toast('⚠️ Contenedor de mapa no encontrado', 'warning'); return; }
    container.style.display = 'block';
    container.innerHTML = '';

    if (this.previewMapInstance) this.previewMapInstance.remove();

    // Requiere Leaflet (ya está incluido por CDN en tu HTML)
    this.previewMapInstance = L.map('previewMap').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.previewMapInstance);

    const nombre = document.getElementById('nuevoPuntoNombre')?.value || 'Punto';
    L.marker([lat, lng]).addTo(this.previewMapInstance)
      .bindPopup(`<b>${nombre}</b><br>Lat: ${lat}<br>Lng: ${lng}`)
      .openPopup();

    this._toast('✅ Vista previa lista', 'success');
  }
};

// Exponer globalmente para handlers onclick en HTML
window.CoordenadasHelper = CoordenadasHelper;