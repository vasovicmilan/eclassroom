// public/js/otvoreno-racunarstvo/api-example.js
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const select = document.getElementById('exampleSelect');
        const loadBtn = document.getElementById('loadLocalButton');
        const iframe = document.getElementById('localIframe');

        if (!select || !loadBtn || !iframe) {
            console.warn('Elementi za iframe primere nisu pronađeni.');
            return;
        }

        function loadUrl(url) {
            if (!url) return;
            if (url.toLowerCase().startsWith('javascript:')) {
                alert('Nije dozvoljeno učitavanje javascript: protokola.');
                return;
            }
            iframe.removeAttribute('sandbox');
            iframe.src = url;
        }

        loadBtn.addEventListener('click', function() {
            const selectedUrl = select.value;
            if (selectedUrl) loadUrl(selectedUrl);
            else alert('Molimo izaberite tip odgovora.');
        });

        loadUrl('/api/v1/otvoreno-racunarstvo/examples/json');
    });
})();