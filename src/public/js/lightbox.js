// lightbox.js
(function() {
  // Dinamički kreiramo lightbox strukturu
  function createLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-image" alt="Uvećani prikaz">
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.lightbox-close');
    const imgEl = overlay.querySelector('.lightbox-image');
    const captionEl = overlay.querySelector('.lightbox-caption');

    // Zatvaranje klikom na pozadinu ili X
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn) {
        overlay.classList.remove('active');
        // Opciono: resetujemo src da ne bi zauzimao memoriju
        setTimeout(() => { imgEl.src = ''; captionEl.textContent = ''; }, 300);
      }
    });

    // Zatvaranje na Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        imgEl.src = '';
        captionEl.textContent = '';
      }
    });

    return { overlay, imgEl, captionEl };
  }

  const lightbox = createLightbox();

  // Funkcija koja dodaje klik na sve slike unutar .lection-content
  function bindImageClicks() {
    const container = document.querySelector('.lection-content');
    if (!container) return;

    // Biraj sve slike koje su unutar sekcija koje mogu da sadrže galeriju
    // Možeš proširiti selektor ako imaš i druge slike
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      // Izbegavamo duplo vezivanje
      if (img.hasAttribute('data-lightbox-bound')) return;
      img.setAttribute('data-lightbox-bound', 'true');
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        if (src) {
          lightbox.imgEl.src = src;
          lightbox.captionEl.textContent = alt;
          lightbox.overlay.classList.add('active');
        }
      });
    });
  }

  // Pokreni odmah i nakon eventualnih dinamičkih izmena (ako se JS učitava kasnije)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindImageClicks);
  } else {
    bindImageClicks();
  }

  // Ako postoje dinamički dodate slike (npr. nakon AJAX poziva), možete pozvati bindImageClicks() ponovo
  // Ovde nije potrebno, ali ako budeš koristio nešto poput HTMX, možeš eksportovati funkciju
})();