/* ====================================
   MÓDULO DE ANALYTICS AVANZADO
   ==================================== */

const Analytics = {
    render() {
        if (App.data.registros.length === 0) {
            document.getElementById('analytics-tab').innerHTML = `
                <h2>Análisis Avanzado</h2>
                <p style="text-align: center; padding: 50px; color: var(--text-muted);">
                    📊 No hay suficientes datos para generar análisis
                </p>
            `;
            return;
        }

        Analytics.renderComparisons();
        Analytics.renderRankings();
        Analytics.renderPredictions();
    },

    renderComparisons() {
        const container = document.getElementById('comparisonMes');
        if (!container) return;

        const thisMonth = Analytics.getThisMonth();
        const lastMonth = Analytics.getLastMonth();

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="text-align: center; padding: 20px; background: var(--bg-primary); border-radius: 8px;">
                    <h4 style="margin: 0; color: var(--text-secondary); font-size: 12px;">MES ACTUAL</h4>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: var(--primary-color);">
                        ${thisMonth.controles}
                    </p>
                    <small>controles</small>
                </div>
                <div style="text-align: center; padding: 20px; background: var(--bg-primary); border-radius: 8px;">
                    <h4 style="margin: 0; color: var(--text-secondary); font-size: 12px;">MES ANTERIOR</h4>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: var(--secondary-color);">
                        ${lastMonth.controles}
                    </p>
                    <small>controles</small>
                </div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: ${Analytics.getComparisonColor(thisMonth.controles, lastMonth.controles)}; border-radius: 8px; text-align: center;">
                ${Analytics.getComparisonText(thisMonth.controles, lastMonth.controles)}
            </div>
        `;

        const containerAnio = document.getElementById('comparisonAnio');
        if (containerAnio) {
            const thisYear = Analytics.getThisYear();
            const lastYear = Analytics.getLastYear();

            containerAnio.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="text-align: center; padding: 20px; background: var(--bg-primary); border-radius: 8px;">
                        <h4 style="margin: 0; color: var(--text-secondary); font-size: 12px;">AÑO ACTUAL</h4>
                        <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: var(--primary-color);">
                            ${thisYear.vehiculos.toLocaleString('es-CL')}
                        </p>
                        <small>vehículos controlados</small>
                    </div>
                    <div style="text-align: center; padding: 20px; background: var(--bg-primary); border-radius: 8px;">
                        <h4 style="margin: 0; color: var(--text-secondary); font-size: 12px;">AÑO ANTERIOR</h4>
                        <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: var(--secondary-color);">
                            ${lastYear.vehiculos.toLocaleString('es-CL')}
                        </p>
                        <small>vehículos controlados</small>
                    </div>
                </div>
            `;
        }
    },

    renderRankings() {
        const regionesContainer = document.getElementById('rankingRegiones');
        if (regionesContainer) {
            const regionStats = {};
            App.data.registros.forEach(r => {
                if (!regionStats[r.region]) {
                    regionStats[r.region] = 0;
                }
                regionStats[r.region]++;
            });

            const topRegiones = Object.entries(regionStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            regionesContainer.innerHTML = `
                <ul class="ranking-list">
                    ${topRegiones.map((item, index) => `
                        <li class="ranking-item">
                            <span><strong>#${index + 1}</strong> ${item[0]}</span>
                            <span><strong>${item[1]}</strong> controles</span>
                        </li>
                    `).join('')}
                </ul>
            `;
        }

        const infraccionesContainer = document.getElementById('rankingInfracciones');
        if (infraccionesContainer) {
            const puntoStats = {};
            App.data.registros.forEach(r => {
                if (!puntoStats[r.puntoControl]) {
                    puntoStats[r.puntoControl] = {
                        vehiculos: 0,
                        infracciones: 0
                    };
                }
                puntoStats[r.puntoControl].vehiculos += r.vehiculosControlados;
                puntoStats[r.puntoControl].infracciones += r.vehiculosInfraccionados;
            });

            const topInfracciones = Object.entries(puntoStats)
                .map(([punto, stats]) => ({
                    punto,
                    porcentaje: stats.vehiculos > 0 ? (stats.infracciones / stats.vehiculos) * 100 : 0
                }))
                .filter(item => item.porcentaje > 0)
                .sort((a, b) => b.porcentaje - a.porcentaje)
                .slice(0, 5);

            infraccionesContainer.innerHTML = `
                <ul class="ranking-list">
                    ${topInfracciones.map((item, index) => `
                        <li class="ranking-item">
                            <span><strong>#${index + 1}</strong> ${item.punto}</span>
                            <span style="color: ${item.porcentaje > 30 ? 'var(--danger-color)' : 'var(--warning-color)'};">
                                <strong>${item.porcentaje.toFixed(1)}%</strong>
                            </span>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    },

    renderPredictions() {
        const container = document.getElementById('predictions');
        if (!container) return;

        const trend = Analytics.calculateTrend();
        const nextMonthPrediction = Analytics.predictNextMonth();

        container.innerHTML = `
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 8px; border-left: 4px solid var(--info-color);">
                <h4 style="margin: 0 0 15px 0;">📊 Tendencia Actual</h4>
                <p style="font-size: 18px; margin: 10px 0;">
                    ${trend > 0 ? '📈' : '📉'} 
                    La cantidad de controles tiene una tendencia 
                    <strong style="color: ${trend > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${trend > 0 ? 'al alza' : 'a la baja'}
                    </strong>
                </p>
                <p style="color: var(--text-secondary); margin: 10px 0;">
                    Variación promedio mensual: <strong>${Math.abs(trend).toFixed(1)}%</strong>
                </p>
            </div>

            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 8px; border-left: 4px solid var(--primary-color); margin-top: 15px;">
                <h4 style="margin: 0 0 15px 0;">🔮 Proyección Próximo Mes</h4>
                <p style="font-size: 18px; margin: 10px 0;">
                    Se estiman aproximadamente 
                    <strong style="color: var(--primary-color);">${nextMonthPrediction}</strong> 
                    controles
                </p>
                <small style="color: var(--text-muted);">
                    *Basado en el promedio de los últimos 3 meses
                </small>
            </div>

            ${Analytics.getRecommendations()}
        `;
    },

    getThisMonth() {
        const now = new Date();
        const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const registros = App.data.registros.filter(r => r.fecha.startsWith(mesActual));
        
        return {
            controles: registros.length,
            vehiculos: registros.reduce((sum, r) => sum + r.vehiculosControlados, 0)
        };
    },

    getLastMonth() {
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        const mesAnterior = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const registros = App.data.registros.filter(r => r.fecha.startsWith(mesAnterior));
        
        return {
            controles: registros.length,
            vehiculos: registros.reduce((sum, r) => sum + r.vehiculosControlados, 0)
        };
    },

    getThisYear() {
        const year = new Date().getFullYear();
        const registros = App.data.registros.filter(r => r.fecha.startsWith(year.toString()));
        
        return {
            controles: registros.length,
            vehiculos: registros.reduce((sum, r) => sum + r.vehiculosControlados, 0),
            infracciones: registros.reduce((sum, r) => sum + r.vehiculosInfraccionados, 0)
        };
    },

    getLastYear() {
        const year = new Date().getFullYear() - 1;
        const registros = App.data.registros.filter(r => r.fecha.startsWith(year.toString()));
        
        return {
            controles: registros.length,
            vehiculos: registros.reduce((sum, r) => sum + r.vehiculosControlados, 0),
            infracciones: registros.reduce((sum, r) => sum + r.vehiculosInfraccionados, 0)
        };
    },

    getComparisonColor(current, previous) {
        if (current > previous) return 'rgba(40, 167, 69, 0.1)';
        if (current < previous) return 'rgba(220, 53, 69, 0.1)';
        return 'rgba(108, 117, 125, 0.1)';
    },

    getComparisonText(current, previous) {
        const diff = current - previous;
        const percentage = previous > 0 ? ((diff / previous) * 100).toFixed(1) : 0;
        
        if (diff > 0) {
            return `📈 <strong>+${diff} controles</strong> más que el mes anterior (+${percentage}%)`;
        } else if (diff < 0) {
            return `📉 <strong>${diff} controles</strong> menos que el mes anterior (${percentage}%)`;
        } else {
            return `➡️ <strong>Igual</strong> cantidad que el mes anterior`;
        }
    },

    calculateTrend() {
        const monthlyData = {};
        
        App.data.registros.forEach(r => {
            const month = r.fecha.substring(0, 7);
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        const months = Object.keys(monthlyData).sort().slice(-6);
        if (months.length < 2) return 0;

        const firstHalf = months.slice(0, Math.floor(months.length / 2));
        const secondHalf = months.slice(Math.floor(months.length / 2));

        const avgFirst = firstHalf.reduce((sum, m) => sum + monthlyData[m], 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((sum, m) => sum + monthlyData[m], 0) / secondHalf.length;

        return avgFirst > 0 ? ((avgSecond - avgFirst) / avgFirst) * 100 : 0;
    },

    predictNextMonth() {
        const monthlyData = {};
        
        App.data.registros.forEach(r => {
            const month = r.fecha.substring(0, 7);
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        const lastMonths = Object.keys(monthlyData).sort().slice(-3);
        if (lastMonths.length === 0) return 0;

        const avg = lastMonths.reduce((sum, m) => sum + monthlyData[m], 0) / lastMonths.length;
        return Math.round(avg);
    },

    getRecommendations() {
        const recommendations = [];

        const puntoStats = {};
        App.data.registros.forEach(r => {
            if (!puntoStats[r.puntoControl]) {
                puntoStats[r.puntoControl] = { vehiculos: 0, infracciones: 0 };
            }
            puntoStats[r.puntoControl].vehiculos += r.vehiculosControlados;
            puntoStats[r.puntoControl].infracciones += r.vehiculosInfraccionados;
        });

        const puntosAltos = Object.entries(puntoStats).filter(([punto, stats]) => {
            const porcentaje = stats.vehiculos > 0 ? (stats.infracciones / stats.vehiculos) * 100 : 0;
            return porcentaje > 25;
        });

        if (puntosAltos.length > 0) {
            recommendations.push(`⚠️ ${puntosAltos.length} punto(s) requieren atención especial por alto % de infracciones`);
        }

        const thisMonth = Analytics.getThisMonth();
        if (thisMonth.controles < 5) {
            recommendations.push('📅 Considerar aumentar la frecuencia de controles este mes');
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ Todo está funcionando correctamente');
        }

        return `
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 8px; border-left: 4px solid var(--warning-color); margin-top: 15px;">
                <h4 style="margin: 0 0 15px 0;">💡 Recomendaciones</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${recommendations.map(r => `<li style="margin: 8px 0;">${r}</li>`).join('')}
                </ul>
            </div>
        `;
    }
};