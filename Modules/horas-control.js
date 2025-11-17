/* ====================================
   MÓDULO DE GESTIÓN DE HORAS Y OBSERVACIONES
   ==================================== */

const HorasControl = {
    // Calcular total de horas automáticamente
    calcularTotal() {
        const horaInicio = document.getElementById('horaInicio').value;
        const horaFin = document.getElementById('horaFin').value;

        if (!horaInicio || !horaFin) {
            document.getElementById('horasTotalDisplay').value = '';
            return;
        }

        // Convertir a minutos desde medianoche
        const [horaI, minI] = horaInicio.split(':').map(Number);
        const [horaF, minF] = horaFin.split(':').map(Number);

        let minutosInicio = horaI * 60 + minI;
        let minutosFin = horaF * 60 + minF;

        // Si la hora fin es menor, asumimos que cruza medianoche
        if (minutosFin < minutosInicio) {
            minutosFin += 24 * 60;
        }

        const diferenciaMinutos = minutosFin - minutosInicio;

        // Convertir a horas, minutos, segundos
        const horas = Math.floor(diferenciaMinutos / 60);
        const minutos = diferenciaMinutos % 60;
        const segundos = 0;

        // Actualizar campos ocultos
        document.getElementById('horasH').value = horas;
        document.getElementById('horasM').value = minutos;
        document.getElementById('horasS').value = segundos;

        // Mostrar en formato legible
        const display = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        document.getElementById('horasTotalDisplay').value = display;

        // Calcular promedios si hay datos
        HorasControl.calcularPromedios();
    },

    // Mostrar ajuste manual
    ajustarManual() {
        const panel = document.getElementById('ajusteManualHoras');
        panel.classList.toggle('hidden');

        if (!panel.classList.contains('hidden')) {
            App.toast('💡 Ajuste las horas manualmente si es necesario', 'info');
        }
    },

    // Aplicar ajuste manual
    aplicarManual() {
        const horas = parseInt(document.getElementById('horasH').value) || 0;
        const minutos = parseInt(document.getElementById('horasM').value) || 0;
        const segundos = parseInt(document.getElementById('horasS').value) || 0;

        const display = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        document.getElementById('horasTotalDisplay').value = display;

        // Limpiar hora inicio/fin ya que es manual
        document.getElementById('horaInicio').value = '';
        document.getElementById('horaFin').value = '';

        document.getElementById('ajusteManualHoras').classList.add('hidden');
        App.toast('✅ Horas ajustadas manualmente', 'success');

        HorasControl.calcularPromedios();
    },

    // Calcular promedios en vivo
    calcularPromedios() {
        const horas = parseInt(document.getElementById('horasH').value) || 0;
        const minutos = parseInt(document.getElementById('horasM').value) || 0;
        const segundos = parseInt(document.getElementById('horasS').value) || 0;

        const vehiculosControlados = parseInt(document.getElementById('vehiculosControlados').value) || 0;
        const vehiculosSobrepeso = parseInt(document.getElementById('vehiculosSobrepeso').value) || 0;
        const vehiculosInfraccionados = parseInt(document.getElementById('vehiculosInfraccionados').value) || 0;

        if (vehiculosControlados === 0) {
            document.getElementById('indicadoresVivo').style.display = 'none';
            return;
        }

        // Mostrar indicadores
        document.getElementById('indicadoresVivo').style.display = 'grid';

        // Calcular horas en decimal
        const horasDecimal = horas + (minutos / 60) + (segundos / 3600);

        // Promedio veh/hora
        const promedioVehHora = horasDecimal > 0 ? (vehiculosControlados / horasDecimal).toFixed(2) : 0;
        document.getElementById('livePromedioVehHora').textContent = promedioVehHora;

        // % Sobrepeso
        const porcentajeSobrepeso = ((vehiculosSobrepeso / vehiculosControlados) * 100).toFixed(1);
        const elemSobre = document.getElementById('livePorcentajeSobrepeso');
        elemSobre.textContent = `${porcentajeSobrepeso}%`;
        elemSobre.style.color = porcentajeSobrepeso > 20 ? 'var(--warning-color)' : 'var(--text-primary)';

        // % Infracciones
        const porcentajeInfraccion = ((vehiculosInfraccionados / vehiculosControlados) * 100).toFixed(1);
        const elemInfrac = document.getElementById('livePorcentajeInfraccion');
        elemInfrac.textContent = `${porcentajeInfraccion}%`;
        elemInfrac.style.color = porcentajeInfraccion > 25 ? 'var(--danger-color)' : 'var(--text-primary)';
    },

    // Actualizar contador de caracteres
    actualizarContador(textarea) {
        const contador = document.getElementById('charCounter');
        const length = textarea.value.length;
        contador.textContent = `${length} / 1000`;
        
        if (length > 900) {
            contador.style.color = 'var(--danger-color)';
        } else if (length > 700) {
            contador.style.color = 'var(--warning-color)';
        } else {
            contador.style.color = 'var(--text-muted)';
        }
    },

    // Agregar plantilla de observación
    agregarPlantilla(texto) {
        const textarea = document.getElementById('observaciones');
        const valorActual = textarea.value.trim();
        
        if (valorActual) {
            textarea.value = valorActual + '\n' + texto;
        } else {
            textarea.value = texto;
        }
        
        HorasControl.actualizarContador(textarea);
        App.toast('✅ Plantilla agregada', 'success');
    },

    // Limpiar observaciones
    limpiarObservaciones() {
        if (confirm('¿Limpiar el campo de observaciones?')) {
            const textarea = document.getElementById('observaciones');
            textarea.value = '';
            HorasControl.actualizarContador(textarea);
        }
    },

    // Exportar datos de horas (para reportes)
    obtenerDatosHoras() {
        return {
            horaInicio: document.getElementById('horaInicio').value || 'N/A',
            horaFin: document.getElementById('horaFin').value || 'N/A',
            horasH: parseInt(document.getElementById('horasH').value) || 0,
            horasM: parseInt(document.getElementById('horasM').value) || 0,
            horasS: parseInt(document.getElementById('horasS').value) || 0
        };
    }
};