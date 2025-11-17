/* ====================================
   MÓDULO DE BACKUP Y RESTAURACIÓN
   ==================================== */

const Backup = {
    export() {
        const backupData = {
            version: '2.0',
            fecha: new Date().toISOString(),
            registros: App.data.registros,
            puntos: App.data.puntos,
            papelera: App.data.papelera,
            usuario: App.data.currentUser ? App.data.currentUser.username : 'Invitado'
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_ump_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        App.toast('✅ Backup creado correctamente', 'success');
        
        if (typeof Notifications !== 'undefined') {
            Notifications.add('💾 Backup exportado exitosamente', 'success');
        }
    },

    import() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    
                    if (!backupData.version || !backupData.registros) {
                        throw new Error('Formato de backup inválido');
                    }

                    if (confirm(`¿Restaurar backup del ${new Date(backupData.fecha).toLocaleString('es-CL')}?\n\nEsto reemplazará todos los datos actuales.`)) {
                        Backup.restore(backupData);
                    }
                } catch (error) {
                    console.error('Error al importar backup:', error);
                    App.toast('❌ Error al leer el archivo de backup', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },

    restore(backupData) {
        try {
            const backupActual = {
                registros: App.data.registros,
                puntos: App.data.puntos,
                papelera: App.data.papelera
            };
            localStorage.setItem('backup_pre_restore', JSON.stringify(backupActual));

            App.data.registros = backupData.registros || [];
            App.data.puntos = backupData.puntos || {};
            App.data.papelera = backupData.papelera || [];
            App.data.registrosFiltrados = [...App.data.registros];

            App.storage.guardarRegistros();
            App.storage.guardarPuntos();
            App.storage.guardarPapelera();

            App.ui.inicializarRegiones();
            App.ui.actualizarSelectPuntos();
            App.registros.renderTabla();
            App.estadisticas.actualizar();

            App.toast('✅ Datos restaurados correctamente', 'success');
            
            if (typeof Notifications !== 'undefined') {
                Notifications.add(`📂 Backup restaurado: ${App.data.registros.length} registros`, 'success');
            }
        } catch (error) {
            console.error('Error al restaurar backup:', error);
            App.toast('❌ Error al restaurar datos', 'error');
        }
    },

    autoBackup() {
        const lastBackup = localStorage.getItem('lastAutoBackup');
        const now = new Date().getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (!lastBackup || (now - parseInt(lastBackup)) > sevenDays) {
            const backupData = {
                version: '2.0',
                fecha: new Date().toISOString(),
                registros: App.data.registros,
                puntos: App.data.puntos,
                tipo: 'automatico'
            };

            localStorage.setItem('autoBackup', JSON.stringify(backupData));
            localStorage.setItem('lastAutoBackup', now.toString());
            
            console.log('✅ Backup automático realizado');
            
            if (typeof Notifications !== 'undefined') {
                Notifications.add('💾 Backup automático completado', 'info');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        Backup.autoBackup();
    }, 5000);
});