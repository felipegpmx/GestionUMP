/* ====================================
   MÓDULO DE GRÁFICOS
   ==================================== */

const Charts = {
    instances: {},

    renderAll() {
        if (App.data.registros.length === 0) {
            console.log('No hay datos para gráficos');
            return;
        }

        Charts.renderRegiones();
        Charts.renderTemporal();
        Charts.renderInfracciones();
        Charts.renderTopPuntos();
    },

    destroyIfExists(chartId) {
        if (Charts.instances[chartId]) {
            Charts.instances[chartId].destroy();
        }
    },

    renderRegiones() {
        Charts.destroyIfExists('chartRegiones');

        const ctx = document.getElementById('chartRegiones');
        if (!ctx) return;

        const regionesData = {};
        App.data.registros.forEach(r => {
            regionesData[r.region] = (regionesData[r.region] || 0) + 1;
        });

        const labels = Object.keys(regionesData).sort();
        const data = labels.map(r => regionesData[r]);

        Charts.instances.chartRegiones = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Controles Realizados',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.6)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Controles: ${context.parsed.y}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    },

    renderTemporal() {
        Charts.destroyIfExists('chartTemporal');

        const ctx = document.getElementById('chartTemporal');
        if (!ctx) return;

        const mesesData = {};
        App.data.registros.forEach(r => {
            const fecha = new Date(r.fecha + 'T00:00:00');
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            
            if (!mesesData[mesKey]) {
                mesesData[mesKey] = {
                    controles: 0,
                    vehiculos: 0,
                    infracciones: 0
                };
            }
            
            mesesData[mesKey].controles++;
            mesesData[mesKey].vehiculos += r.vehiculosControlados;
            mesesData[mesKey].infracciones += r.vehiculosInfraccionados;
        });

        const labels = Object.keys(mesesData).sort();
        const controlesData = labels.map(m => mesesData[m].controles);
        const infraccionesData = labels.map(m => mesesData[m].infracciones);

        Charts.instances.chartTemporal = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.map(l => {
                    const [year, month] = l.split('-');
                    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                                       'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    return `${monthNames[parseInt(month) - 1]} ${year}`;
                }),
                datasets: [
                    {
                        label: 'Controles',
                        data: controlesData,
                        borderColor: 'rgba(0, 123, 255, 1)',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Infracciones',
                        data: infraccionesData,
                        borderColor: 'rgba(220, 53, 69, 1)',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    },

    renderInfracciones() {
        Charts.destroyIfExists('chartInfracciones');

        const ctx = document.getElementById('chartInfracciones');
        if (!ctx) return;

        const totalVehiculos = App.data.registros.reduce((sum, r) => sum + r.vehiculosControlados, 0);
        const totalSobrepeso = App.data.registros.reduce((sum, r) => sum + r.vehiculosSobrepeso, 0);
        const totalInfracciones = App.data.registros.reduce((sum, r) => sum + r.vehiculosInfraccionados, 0);
        const sinProblemas = totalVehiculos - totalSobrepeso - totalInfracciones;

        Charts.instances.chartInfracciones = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Sin Problemas', 'Sobrepeso', 'Infracciones'],
                datasets: [{
                    data: [sinProblemas, totalSobrepeso, totalInfracciones],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(220, 53, 69, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const percentage = ((value / totalVehiculos) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString('es-CL')} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderTopPuntos() {
        Charts.destroyIfExists('chartTopPuntos');

        const ctx = document.getElementById('chartTopPuntos');
        if (!ctx) return;

        const puntosData = {};
        App.data.registros.forEach(r => {
            puntosData[r.puntoControl] = (puntosData[r.puntoControl] || 0) + r.vehiculosControlados;
        });

        const sorted = Object.entries(puntosData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = sorted.map(p => p[0]);
        const data = sorted.map(p => p[1]);

        Charts.instances.chartTopPuntos = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vehículos Controlados',
                    data: data,
                    backgroundColor: 'rgba(23, 162, 184, 0.6)',
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
};