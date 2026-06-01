// public/js/otvoreno-racunarstvo/http-explorer.js
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('httpForm');
        if (!form) {
            console.warn('HTTP Explorer forma nije pronađena');
            return;
        }

        const responseContainer = document.getElementById('responseContainer');
        const requestStatus = document.getElementById('requestStatus');
        const handshakeInfo = document.getElementById('handshakeInfo');
        const handshakeTitle = document.getElementById('handshakeTitle');
        const handshakeDetails = document.getElementById('handshakeDetails');
        const customUrlInput = document.getElementById('customUrl');

        if (!responseContainer || !requestStatus) {
            console.warn('Neki elementi nisu pronađeni');
            return;
        }

        const API_URL = '/api/v1/otvoreno-racunarstvo/http-explorer';
        const HANDSHAKE_API_URL = '/api/v1/otvoreno-racunarstvo/http-explorer/handshake';

        const statusClasses = {
            info: 'alert alert-info',
            success: 'alert alert-success',
            warning: 'alert alert-warning',
            error: 'alert alert-danger'
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const selectedEndpoint = document.querySelector('input[name="endpoint"]:checked').value;
            let url = customUrlInput.value.trim();

            if (handshakeInfo) handshakeInfo.classList.add('d-none');
            requestStatus.className = statusClasses.info;
            requestStatus.innerHTML = `⏳ Šaljem zahtev na: ${escapeHtml(url)}...`;
            responseContainer.textContent = '⏳ Sačekaj, šaljem zahtev na backend...';

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, protocol: selectedEndpoint })
                });

                if (!response.ok) throw new Error(`HTTP greška! status: ${response.status}`);

                const data = await response.json();

                // Prikaz handshake podataka
                if (data.handshake && handshakeInfo) {
                    handshakeInfo.classList.remove('d-none');
                    handshakeInfo.className = `mt-3 alert ${data.handshake.className || 'alert-secondary'}`;
                    if (handshakeTitle) handshakeTitle.textContent = data.handshake.title;
                    if (handshakeDetails) handshakeDetails.textContent = data.handshake.details;
                } else if (handshakeInfo) {
                    try {
                        const hsRes = await fetch(`${HANDSHAKE_API_URL}?protocol=${selectedEndpoint}`);
                        const hsData = await hsRes.json();
                        handshakeInfo.classList.remove('d-none');
                        handshakeInfo.className = `mt-3 alert ${hsData.className || 'alert-secondary'}`;
                        if (handshakeTitle) handshakeTitle.textContent = hsData.title;
                        if (handshakeDetails) handshakeDetails.textContent = hsData.details;
                    } catch (err) { console.warn('Ne mogu dobiti handshake:', err); }
                }

                if (!data.success) {
                    requestStatus.className = statusClasses.error;
                    requestStatus.innerHTML = `❌ Greška: ${escapeHtml(data.error?.message || 'Nepoznata greška')}`;
                    responseContainer.textContent = data.data ? (typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2)) : 'Došlo je do greške.';
                    return;
                }

                // ISPRAVLJEN DIO: koristi data.status, a ne data.data.status
                const protocol = data.protocol === 'https' ? '🔒 HTTPS' : '⚠️ HTTP';
                const statusClass = data.status >= 200 && data.status < 300 ? statusClasses.success : statusClasses.error;
                requestStatus.className = statusClass;
                let statusHtml = `${protocol} | Status: ${data.status} ${data.statusText || ''} | Vreme: ${data.responseTime || '?'}ms`;
                if (data.protocol === 'http' && !data.simulated) statusHtml += `<br>⚠️ Upozorenje: HTTP saobraćaj nije šifrovan!`;
                requestStatus.innerHTML = statusHtml;

                // Prikaz podataka
                if (data.data) {
                    responseContainer.textContent = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
                } else {
                    responseContainer.textContent = 'Nema podataka u odgovoru.';
                }

            } catch (error) {
                console.error('Fetch error:', error);
                requestStatus.className = statusClasses.error;
                requestStatus.innerHTML = `❌ Greška: ${escapeHtml(error.message)}`;
                responseContainer.textContent = `Došlo je do greške prilikom slanja zahteva.\n\nDetalji: ${error.message}\n\nMogući uzroci:\n• Backend server ne radi\n• API ruta nije dostupna\n• Mrežni problemi`;
            }
        });

        const radios = document.querySelectorAll('input[name="endpoint"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'http') customUrlInput.value = 'jsonplaceholder.typicode.com/posts/1';
                else if (e.target.value === 'https') customUrlInput.value = 'jsonplaceholder.typicode.com/posts/1';
                else customUrlInput.value = 'jsonplaceholder.typicode.com/posts';
                responseContainer.textContent = 'Čekam tvoj zahtev...';
                requestStatus.className = 'alert alert-secondary';
                requestStatus.innerHTML = '';
                if (handshakeInfo) handshakeInfo.classList.add('d-none');
            });
        });

        function escapeHtml(str) {
            if (!str) return '';
            return str.replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }
    });
})();