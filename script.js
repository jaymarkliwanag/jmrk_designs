const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

document.querySelectorAll('.skill-logo, .social-logo').forEach((logo) => {
  logo.addEventListener('error', () => logo.remove());
});

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', opening);
});

navigation.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  menuButton.focus();
});

const navLinks = [...navigation.querySelectorAll('a')];
const navSections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    navLinks.forEach((link) => {
      const active = link.hash === `#${current.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -66% 0px', threshold: [0, 0.12, 0.3] });
  navSections.forEach((section) => navObserver.observe(section));
}

const workIndexLinks = [...document.querySelectorAll('.work-index a')];
const workCategories = workIndexLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
if ('IntersectionObserver' in window && workIndexLinks.length) {
  const workObserver = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    workIndexLinks.forEach((link) => {
      const active = link.hash === `#${current.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-24% 0px -62% 0px', threshold: [0, 0.1, 0.25] });
  workCategories.forEach((category) => workObserver.observe(category));
}

const dialog = document.querySelector('.lightbox');
const previewImage = dialog.querySelector('.lightbox-image');
const previewCaption = dialog.querySelector('.lightbox-caption');
const previewCount = dialog.querySelector('.lightbox-count');
const artworkLinks = [...document.querySelectorAll('.image-open')];
let currentArtwork = 0;
let lastFocusedArtwork = null;
let touchStart = null;

function showArtwork(index) {
  currentArtwork = (index + artworkLinks.length) % artworkLinks.length;
  const link = artworkLinks[currentArtwork];
  const thumbnail = link.querySelector('img');
  previewImage.src = link.href;
  previewImage.alt = thumbnail?.alt || '';
  previewCaption.textContent = link.dataset.caption || thumbnail?.alt || '';
  previewCount.textContent = `${String(currentArtwork + 1).padStart(2, '0')} / ${String(artworkLinks.length).padStart(2, '0')}`;
}

artworkLinks.forEach((link, index) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    lastFocusedArtwork = link;
    showArtwork(index);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

dialog.querySelector('.lightbox-prev').addEventListener('click', () => showArtwork(currentArtwork - 1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => showArtwork(currentArtwork + 1));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastFocusedArtwork?.focus();
});
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') { event.preventDefault(); showArtwork(currentArtwork + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showArtwork(currentArtwork - 1); }
});
dialog.addEventListener('touchstart', (event) => {
  if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: true });
dialog.addEventListener('touchend', (event) => {
  if (!touchStart || event.changedTouches.length !== 1) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) showArtwork(currentArtwork + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
dialog.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

const year = new Date().getFullYear();
document.querySelector('#year').textContent = year;
document.querySelector('#current-year').textContent = year;
