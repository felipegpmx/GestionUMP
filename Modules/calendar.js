/* ====================================
   MÓDULO DE CALENDARIO
   ==================================== */

const Calendar = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),

    render() {
        const container = document.getElementById('calendar');
        if (!container) return;

        container.innerHTML = `
            <div class="calendar-header">
                <button class="btn-secondary" onclick="Calendar.previousMonth()">❮ Anterior</button>
                <h3>${Calendar.getMonthName()} ${Calendar.currentYear}</h3>
                <button class="btn-secondary" onclick="Calendar.nextMonth()">Siguiente ❯</button>
            </div>
            <div class="calendar-grid">
                ${Calendar.renderWeekDays()}
                ${Calendar.renderDays()}
            </div>
            <div class="calendar-legend" style="margin-top: 20px; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                <h4 style="margin-bottom: 10px;">Leyenda:</h4>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 20px; height: 20px; background: rgba(0,123,255,0.3); border: 2px solid var(--primary-color); border-radius: 4px;"></div>
                        <span>Día con controles</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderWeekDays() {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return days.map(day => 
            `<div style="text-align: center; font-weight: bold; padding: 10px; color: var(--text-secondary);">${day}</div>`
        ).join('');
    },

    renderDays() {
        const firstDay = new Date(Calendar.currentYear, Calendar.currentMonth, 1);
        const lastDay = new Date(Calendar.currentYear, Calendar.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = '';

        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const fecha = `${Calendar.currentYear}-${String(Calendar.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const controles = App.data.registros.filter(r => r.fecha === fecha);
            const hasControl = controles.length > 0;
            
            const totalVehiculos = controles.reduce((sum, r) => sum + r.vehiculosControlados, 0);

            html += `
                <div class="calendar-day ${hasControl ? 'has-control' : ''}" 
                     onclick="Calendar.showDayDetails('${fecha}')"
                     title="${hasControl ? `${controles.length} control(es) - ${totalVehiculos} vehículos` : 'Sin controles'}">
                    <div class="calendar-day-number">${day}</div>
                    ${hasControl ? `<div class="calendar-day-label">${controles.length}</div>` : ''}
                </div>
            `;
        }

        return html;
    },

    showDayDetails(fecha) {
        const controles = App.data.registros.filter(r => r.fecha === fecha);
        
        if (controles.length === 0) {
            App.toast('No hay controles en esta fecha', 'info');
            return;
        }

        let html = `
            <h3>Controles del ${new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL')}</h3>
            <div style="max-height: 400px; overflow-y: auto; margin-top: 15px;">
        `;

        controles.forEach(c => {
            html += `
                <div style="padding: 15px; background: var(--bg-secondary); margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                    <strong>${c.puntoControl}</strong> - ${c.region}, ${c.comuna}<br>
                    <small style="color: var(--text-secondary);">
                        Horario: ${c.horaInicio && c.horaFin ? `${c.horaInicio} - ${c.horaFin}` : 'N/A'}<br>
                        Vehículos: ${c.vehiculosControlados} | 
                        Sobrepeso: ${c.vehiculosSobrepeso} | 
                        Infracciones: ${c.vehiculosInfraccionados}
                        ${c.observaciones ? `<br><em>"${c.observaciones.substring(0, 100)}${c.observaciones.length > 100 ? '...' : ''}"</em>` : ''}
                    </small>
                </div>
            `;
        });

        html += '</div>';

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content modal-small">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                ${html}
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    previousMonth() {
        Calendar.currentMonth--;
        if (Calendar.currentMonth < 0) {
            Calendar.currentMonth = 11;
            Calendar.currentYear--;
        }
        Calendar.render();
    },

    nextMonth() {
        Calendar.currentMonth++;
        if (Calendar.currentMonth > 11) {
            Calendar.currentMonth = 0;
            Calendar.currentYear++;
        }
        Calendar.render();
    },

    getMonthName() {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[Calendar.currentMonth];
    }
};