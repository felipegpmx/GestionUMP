/* ====================================
   MÓDULO DE MAPA INTERACTIVO
   ==================================== */

const MapModule = {
    map: null,
    markers: [],

    init() {
        if (MapModule.map) {
            return;
        }

        const container = document.getElementById('map');
        if (!container) return;

        MapModule.map = L.map('map').setView([-33.4489, -70.6693], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(MapModule.map);

        MapModule.loadPoints();

        App.toast('🗺️ Mapa cargado correctamente', 'info');
    },

    loadPoints() {
        MapModule.clearMarkers();

        const regionCoords = {
            'Arica y Parinacota': [-18.4783, -70.3126],
            'Tarapacá': [-20.2140, -70.1522],
            'Antofagasta': [-23.6509, -70.3975],
            'Atacama': [-27.3668, -70.3323],
            'Coquimbo': [-29.9533, -71.3395],
            'Valparaíso': [-33.0472, -71.6127],
            'Metropolitana': [-33.4489, -70.6693],
            'O\'higgins': [-34.5755, -71.0022],
            'Maule': [-35.4264, -71.6554],
            'BioBio': [-37.4689, -72.3527],
            'Araucanía': [-38.9489, -72.3311],
            'Los Rios': [-39.8196, -73.2452],
            'Los Lagos': [-41.4693, -72.9318],
            'Aysen': [-45.5752, -72.0662],
            'Magallanes': [-53.1638, -70.9171]
        };

        const puntoStats = {};
        App.data.registros.forEach(r => {
            if (!puntoStats[r.puntoControl]) {
                puntoStats[r.puntoControl] = {
                    region: r.region,
                    comuna: r.comuna,
                    controles: 0,
                    vehiculos: 0,
                    infracciones: 0
                };
            }
            puntoStats[r.puntoControl].controles++;
            puntoStats[r.puntoControl].vehiculos += r.vehiculosControlados;
            puntoStats[r.puntoControl].infracciones += r.vehiculosInfraccionados;
        });

        Object.entries(puntoStats).forEach(([punto, stats]) => {
            const coords = regionCoords[stats.region];
            if (!coords) return;

            const lat = coords[0] + (Math.random() - 0.5) * 0.5;
            const lng = coords[1] + (Math.random() - 0.5) * 0.5;

            const porcentajeInfraccion = stats.vehiculos > 0 
                ? ((stats.infracciones / stats.vehiculos) * 100).toFixed(1)
                : 0;

            let color = 'green';
            if (porcentajeInfraccion > 30) color = 'red';
            else if (porcentajeInfraccion > 15) color = 'orange';

            const marker = L.circleMarker([lat, lng], {
                radius: Math.min(8 + (stats.controles * 2), 20),
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(MapModule.map);

            const popupContent = `
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary-color);">${punto}</h4>
                    <p style="margin: 5px 0; font-size: 13px;">
                        <strong>Región:</strong> ${stats.region}<br>
                        <strong>Comuna:</strong> ${stats.comuna}<br>
                        <strong>Controles:</strong> ${stats.controles}<br>
                        <strong>Vehículos:</strong> ${stats.vehiculos.toLocaleString('es-CL')}<br>
                        <strong>Infracciones:</strong> ${stats.infracciones.toLocaleString('es-CL')}<br>
                        <strong>% Infracciones:</strong> <span style="color: ${color}; font-weight: bold;">${porcentajeInfraccion}%</span>
                    </p>
                </div>
            `;

            marker.bindPopup(popupContent);
            MapModule.markers.push(marker);
        });

        App.toast(`📍 ${MapModule.markers.length} puntos cargados en el mapa`, 'success');
    },

    clearMarkers() {
        MapModule.markers.forEach(marker => {
            MapModule.map.removeLayer(marker);
        });
        MapModule.markers = [];
    },

    showAll() {
        MapModule.loadPoints();
    },

    filterByInfractions() {
        MapModule.clearMarkers();
        App.toast(`⚠️ Filtrando puntos con alto % de infracciones`, 'warning');
    }
};