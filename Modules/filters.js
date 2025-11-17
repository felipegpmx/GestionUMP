/* ====================================
   MÓDULO DE FILTROS AVANZADOS
   ==================================== */

const Filters = {
    currentFilters: {},
    sortField: null,
    sortDirection: 'asc',

    togglePanel() {
        const panel = document.getElementById('advancedFilters');
        panel.classList.toggle('hidden');
        
        if (!panel.classList.contains('hidden')) {
            Filters.initializeFilterSelects();
        }
    },

    initializeFilterSelects() {
        const filterRegion = document.getElementById('filterRegion');
        if (filterRegion && filterRegion.options.length <= 1) {
            filterRegion.innerHTML = '<option value="">Todas</option>';
            App.utils.obtenerRegionesUnicas().forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                filterRegion.appendChild(option);
            });
        }

        const filterPunto = document.getElementById('filterPunto');
        if (filterPunto && filterPunto.options.length <= 1) {
            filterPunto.innerHTML = '<option value="">Todos</option>';
            Object.keys(App.data.puntos)
                .filter(p => p !== 'CALIBRACION')
                .sort()
                .forEach(punto => {
                    const option = document.createElement('option');
                    option.value = punto;
                    option.textContent = punto;
                    filterPunto.appendChild(option);
                });
        }
    },

    apply() {
        const fechaDesde = document.getElementById('filterFechaDesde').value;
        const fechaHasta = document.getElementById('filterFechaHasta').value;
        const region = document.getElementById('filterRegion').value;
        const punto = document.getElementById('filterPunto').value;
        const minVehiculos = parseInt(document.getElementById('filterMinVehiculos').value) || 0;
        const maxInfraccion = parseFloat(document.getElementById('filterMaxInfraccion').value) || 0;

        Filters.currentFilters = {
            fechaDesde,
            fechaHasta,
            region,
            punto,
            minVehiculos,
            maxInfraccion
        };

        let filtrados = [...App.data.registros];

        if (fechaDesde) {
            filtrados = filtrados.filter(r => r.fecha >= fechaDesde);
        }

        if (fechaHasta) {
            filtrados = filtrados.filter(r => r.fecha <= fechaHasta);
        }

        if (region) {
            filtrados = filtrados.filter(r => r.region === region);
        }

        if (punto) {
            filtrados = filtrados.filter(r => r.puntoControl === punto);
        }

        if (minVehiculos > 0) {
            filtrados = filtrados.filter(r => r.vehiculosControlados >= minVehiculos);
        }

        if (maxInfraccion > 0) {
            filtrados = filtrados.filter(r => parseFloat(r.porcentajeInfraccion) >= maxInfraccion);
        }

        App.data.registrosFiltrados = filtrados;
        App.data.currentPage = 1;
        App.registros.renderTabla();

        App.toast(`✅ ${filtrados.length} registros encontrados`, 'info');
    },

    clear() {
        document.getElementById('filterFechaDesde').value = '';
        document.getElementById('filterFechaHasta').value = '';
        document.getElementById('filterRegion').value = '';
        document.getElementById('filterPunto').value = '';
        document.getElementById('filterMinVehiculos').value = '';
        document.getElementById('filterMaxInfraccion').value = '';

        Filters.currentFilters = {};
        App.data.registrosFiltrados = [...App.data.registros];
        App.data.currentPage = 1;
        App.registros.renderTabla();

        App.toast('🔄 Filtros limpiados', 'info');
    },

    search(query) {
        if (!query || query.trim() === '') {
            App.data.registrosFiltrados = [...App.data.registros];
            App.data.currentPage = 1;
            App.registros.renderTabla();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        
        const filtrados = App.data.registros.filter(r => {
            return (
                r.fecha.toLowerCase().includes(searchTerm) ||
                r.region.toLowerCase().includes(searchTerm) ||
                r.comuna.toLowerCase().includes(searchTerm) ||
                r.puntoControl.toLowerCase().includes(searchTerm) ||
                r.ruta.toLowerCase().includes(searchTerm) ||
                r.sentido.toLowerCase().includes(searchTerm) ||
                (r.observaciones && r.observaciones.toLowerCase().includes(searchTerm))
            );
        });

        App.data.registrosFiltrados = filtrados;
        App.data.currentPage = 1;
        App.registros.renderTabla();
    },

    sortBy(field) {
        if (Filters.sortField === field) {
            Filters.sortDirection = Filters.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            Filters.sortField = field;
            Filters.sortDirection = 'asc';
        }

        App.data.registrosFiltrados.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];

            if (!isNaN(valA) && !isNaN(valB)) {
                valA = parseFloat(valA);
                valB = parseFloat(valB);
            }

            if (valA < valB) return Filters.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return Filters.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        App.registros.renderTabla();
        App.toast(`📊 Ordenado por ${field} (${Filters.sortDirection === 'asc' ? '↑' : '↓'})`, 'info');
    }
};