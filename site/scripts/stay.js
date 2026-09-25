(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const optimized = (path, size) => encodeURI('/img/optimized/' + decodeURI(path).split('/').pop().replace('.webp', '') + '-' + size + '.webp');
  const track = $('#review-track'), cards = [...track.children];
  let reviewIndex = 0;
  const reviewPosition = () => Math.round(track.scrollLeft / (cards[1].offsetLeft - cards[0].offsetLeft));
  function updateReviews() { reviewIndex = Math.min(cards.length - 1, Math.max(0, reviewPosition())); $('#review-status').textContent = (reviewIndex + 1) + ' / ' + cards.length; $('#review-prev').disabled = track.scrollLeft < 2; $('#review-next').disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2; }
  function moveReview(delta) { track.scrollTo({left: (reviewIndex + delta) * (cards[1].offsetLeft - cards[0].offsetLeft), behavior: reducedMotion ? 'instant' : 'smooth'}); }
  $('#review-prev').addEventListener('click', () => moveReview(-1));
  $('#review-next').addEventListener('click', () => moveReview(1));
  track.addEventListener('scroll', updateReviews, {passive:true});
  track.addEventListener('keydown', e => { if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); moveReview(e.key === 'ArrowLeft' ? -1 : 1); } });
  window.addEventListener('resize', updateReviews); updateReviews();
  const menu = $('.menu-button'), nav = $('#navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Открыть меню'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); });
  $('#year').textContent = new Date().getFullYear();
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); entry.target.classList.remove('waiting'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('waiting'); observer.observe(el); });
  }
  const dialog = $('#photo-dialog'), large = $('#large-photo');
  let active, index = 0, trigger;
  function renderPhoto() { const gallery = GALLERIES[active]; large.src = optimized(gallery.images[index], 1200); large.decoding = 'async'; large.alt = `${gallery.title} — фото ${index + 1}`; $('#photo-title').textContent = gallery.title; $('#photo-counter').textContent = `${index + 1} / ${gallery.images.length}`; }
  function stepPhoto(delta) { index = (index + delta + GALLERIES[active].images.length) % GALLERIES[active].images.length; renderPhoto(); }
  function openGallery(key, start, button) { active = key; index = start; trigger = button; renderPhoto(); dialog.showModal(); document.body.classList.add('modal-open'); }
  document.querySelectorAll('[data-gallery]').forEach(el => {
    const key = el.dataset.gallery, gallery = GALLERIES[key]; let current = 0;
    const render = () => { const img = el.querySelector('img'); img.srcset = optimized(gallery.images[current],640) + ' 640w, ' + optimized(gallery.images[current],1200) + ' 1200w'; img.src = optimized(gallery.images[current],640); img.alt = `${gallery.title} — фото ${current + 1}`; el.querySelector('.gallery-count').textContent = `${current + 1} / ${gallery.images.length}`; };
    el.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => { current = (current + Number(button.dataset.direction) + gallery.images.length) % gallery.images.length; render(); }));
    el.querySelectorAll('.photo-button, .expand').forEach(button => button.addEventListener('click', () => openGallery(key, current, button)));
    render();
  });
  document.querySelectorAll('[data-open-gallery]').forEach(button => button.addEventListener('click', () => openGallery(button.dataset.openGallery, 0, button)));
  $('#photo-close').addEventListener('click', () => dialog.close());
  $('#photo-prev').addEventListener('click', () => stepPhoto(-1));
  $('#photo-next').addEventListener('click', () => stepPhoto(1));
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); trigger?.focus({ preventScroll: true }); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); if (!dialog.open) return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); stepPhoto(e.key === 'ArrowLeft' ? -1 : 1); } });
  let touch;
  large.addEventListener('touchstart', e => { touch = e.changedTouches[0]; }, { passive: true });
  large.addEventListener('touchend', e => { if (!touch) return; const end = e.changedTouches[0], dx = end.clientX - touch.clientX, dy = end.clientY - touch.clientY; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) stepPhoto(dx < 0 ? 1 : -1); touch = null; }, { passive: true });
  const arrival = $('#arrival'), departure = $('#departure'), guests = $('#guests'), house = $('#house');
  function localISO(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function nextDay(value) { const date = new Date(value + 'T12:00:00'); date.setDate(date.getDate() + 1); return localISO(date); }
  function plural(n, forms) { return forms[n % 100 >= 11 && n % 100 <= 14 ? 2 : n % 10 === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 ? 1 : 2]; }
  function nights() { return Math.round((Date.parse(departure.value + 'T00:00:00Z') - Date.parse(arrival.value + 'T00:00:00Z')) / 86400000); }
  arrival.min = localISO(new Date()); departure.min = nextDay(arrival.min);
  function updateBooking() {
    departure.min = nextDay(arrival.value || arrival.min);
    departure.setCustomValidity(departure.value && arrival.value && departure.value <= arrival.value ? 'Выезд должен быть позже заезда' : '');
    const count = nights(), people = Number(guests.value);
    $('#booking-summary').textContent = count > 0 && people > 0 ? `${count} ${plural(count, ['ночь','ночи','ночей'])} · ${people} ${plural(people, ['гость','гостя','гостей'])}` : 'Выберите даты поездки';
  }
  [arrival, departure, guests, house].forEach(el => el.addEventListener('input', updateBooking));
  document.querySelectorAll('[data-house]').forEach(a => a.addEventListener('click', () => { house.value = a.dataset.house; updateBooking(); }));
  $('#booking-form').addEventListener('submit', e => {
    e.preventDefault(); arrival.min = localISO(new Date()); updateBooking(); if (!e.currentTarget.reportValidity()) return;
    const format = value => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value + 'T12:00:00'));
    const message = `Здравствуйте! Хотим отдохнуть в Любимой даче.\nЗаезд: ${format(arrival.value)}\nВыезд: ${format(departure.value)}\nГостей: ${guests.value}\nДомик: ${house.value}\nПодскажите, пожалуйста, свободны ли даты и какая будет стоимость?`;
    window.open('https://wa.me/79133918093?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
})();
