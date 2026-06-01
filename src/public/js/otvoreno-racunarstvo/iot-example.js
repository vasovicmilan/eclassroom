// public/js/otvoreno-racunarstvo/iot-example.js
(function() {
    let intervalId = null;

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function formatValue(val, unit = '') {
        if (val === undefined || val === null || isNaN(val)) return '—';
        return `${val}${unit}`;
    }

    function fetchReadings() {
        fetch('/api/v1/otvoreno-racunarstvo/iot/latest-readings')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('iotTableBody');
                if (!tbody) return;

                if (!Array.isArray(data) || data.length === 0) {
                    if (tbody.innerHTML.includes('Još nema podataka')) return;
                    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Još nema podataka. Pošaljite prvi POST zahtev sa ESP32.</td></tr>`;
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                    return;
                }

                tbody.innerHTML = data.map(r => `
                    <tr>
                        <td>${escapeHtml(new Date(r.timestamp).toLocaleString())}</td>
                        <td>${escapeHtml(r.device)}</td>
                        <td>${formatValue(r.temperature, '°C')}</td>
                        <td>${formatValue(r.humidity, '%')}</td>
                        <td>${formatValue(r.pressure, ' hPa')}</td>
                        <td>${formatValue(r.soil, '%')}</td>
                        <td>${formatValue(r.rain, '%')}</td>
                        <td>${formatValue(r.light, '%')}</td>
                    </tr>
                `).join('');
            })
            .catch(err => console.error('Greška pri dohvatanju IoT podataka:', err));
    }

    fetchReadings();
    intervalId = setInterval(fetchReadings, 10000);
})();