/* SDS — интерактив сайта. Без зависимостей. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const VK = 'https://vk.me/sdsdancestudio';
  const DATA = (window.SDS && window.SDS.schedule) || { days: [], slots: [], items: [] };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* приватный режим */ } }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (!reduced.matches) document.documentElement.classList.add('motion');

  /* ---------- Ближайшие события. Блок скрывается сам после until ---------- */
  const EVENTS = [
    {
      id: 'kpop-2026-11-15',
      title: 'К-ПОП тусовка в Добром',
      start: '2026-11-15T16:00:00+03:00',
      until: '2026-11-15T16:00:00+03:00',
      when: 'Воскресенье, 15 ноября, 16:00',
      stub: { day: '15', month: 'ноября', week: 'вс', time: '16:00' },
      place: 'Студия SDS, ТЦ «Восток», 2 этаж',
      price: '800 ₽',
      priceNote: 'запись обязательна',
      host: 'Приглашает Дима Ким',
      program: [
        'Живые выступления кавер-групп',
        'Соревнования по скоростному поеданию рамёна',
        'Развлечения в духе любимых к-поп шоу и ценные призы',
        'Эксклюзивный мерч',
        'Актуальные K-POP треки',
        'Фотозона',
        'Random dance'
      ],
      gift: 'Каждому гостю подарок',
      gifts: 'Карточка с любимым айдолом, наклейка в «дневник дракона», пакет рамёна за конкурс, оригинальный мерч из Кореи самому активному участнику.',
      cta: { label: 'Написать «К-ПОП»', href: VK, note: 'Чтобы записаться, напиши «К-ПОП» в сообщения сообщества.' },
      bot: { label: 'Записаться в Telegram', href: 'https://t.me/sds_dance_bot?start=event' }
    }
  ];

  /* ---------- Шапка, меню, прогресс ---------- */
  function initHeader() {
    const burger = $('.burger');
    const nav = $('#nav');
    const close = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Открыть меню'); };
    burger.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { close(); burger.focus(); } });

    const bar = $('.progress__bar');
    let ticking = false;
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- Hero: прожекторы следят за указателем, на таче гуляют сами ---------- */
  function initHeroLights() {
    const hero = $('.hero');
    const word = $('.hero__word');
    const beams = $$('.beam-light', hero);
    if (!hero || !word) return;
    const lights = [
      { x: 0, y: 0, k: 0.12, ox: 0, oy: 0 },
      { x: 0, y: 0, k: 0.07, ox: -0.16, oy: 0.12 },
      { x: 0, y: 0, k: 0.045, ox: 0.18, oy: -0.08 }
    ];
    let W = 0, H = 0, wl = 0, wt = 0, ww = 1, wh = 1;
    let tx = 0.3, ty = 0.4, manualUntil = 0, visible = true, raf = 0, t0 = performance.now();

    const measure = () => {
      const hr = hero.getBoundingClientRect();
      const r = word.getBoundingClientRect();
      W = hr.width; H = hr.height;
      wl = r.left - hr.left; wt = r.top - hr.top; ww = r.width || 1; wh = r.height || 1;
    };
    const apply = () => {
      lights.forEach((l, i) => {
        const px = l.x * W, py = l.y * H;
        if (beams[i]) { beams[i].style.setProperty('--x', px.toFixed(1) + 'px'); beams[i].style.setProperty('--y', py.toFixed(1) + 'px'); }
        word.style.setProperty(`--w${i + 1}x`, (((px - wl) / ww) * 100).toFixed(1) + '%');
        word.style.setProperty(`--w${i + 1}y`, (((py - wt) / wh) * 100).toFixed(1) + '%');
      });
    };
    const frame = (now) => {
      raf = 0;
      if (!visible) return;
      if (now > manualUntil) { // автопрогулка по фигуре Лиссажу
        const t = (now - t0) / 1000;
        tx = 0.45 + 0.32 * Math.sin(t * 0.5);
        ty = (W < 900 ? 0.24 : 0.42) + 0.16 * Math.sin(t * 0.8 + 1.2);
      }
      lights.forEach((l) => {
        l.x += (tx + l.ox - l.x) * l.k;
        l.y += (ty + l.oy - l.y) * l.k;
      });
      apply();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !reduced.matches) raf = requestAnimationFrame(frame); };

    measure();
    lights.forEach((l, i) => { l.x = [0.3, 0.6, 0.82][i]; l.y = (W < 900 ? [0.22, 0.3, 0.18] : [0.35, 0.55, 0.3])[i]; });
    apply();
    addEventListener('resize', () => { measure(); apply(); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); apply(); });
    if (reduced.matches) return;

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
      manualUntil = performance.now() + (e.pointerType === 'mouse' ? 4000 : 1800);
    }, { passive: true });
    hero.addEventListener('pointerdown', (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
      manualUntil = performance.now() + 1800;
    }, { passive: true });
    // свет «оживает» после загрузки страницы, чтобы не мешать первой отрисовке
    let loaded = document.readyState === 'complete';
    const begin = () => { loaded = true; measure(); start(); };
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && loaded) { measure(); start(); } }).observe(hero);
    if (loaded) start(); else addEventListener('load', begin, { once: true });
  }

  /* ---------- Мягкий курсор-свет в тёмных секциях (только мышь) ---------- */
  function initGlow() {
    if (!fine.matches || reduced.matches) return;
    $$('[data-glow]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
      }, { passive: true });
    });
  }

  /* ---------- Событие-билет ---------- */
  function initEvent() {
    const sec = $('#event');
    const mount = $('.event__mount', sec);
    const now = Date.now();
    const ev = EVENTS.filter((e) => new Date(e.until).getTime() > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))[0];
    if (!ev) return;
    mount.innerHTML = `
      <article class="ticket" aria-labelledby="ev-${ev.id}">
        <div class="ticket__main">
          <p class="ticket__kicker marker-note">${esc(ev.host)}</p>
          <h3 class="ticket__title" id="ev-${ev.id}">${esc(ev.title)}</h3>
          <dl class="ticket__facts">
            <div><dt>Когда</dt><dd>${esc(ev.when)}</dd></div>
            <div><dt>Где</dt><dd>${esc(ev.place)}</dd></div>
            <div><dt>Вход</dt><dd>${esc(ev.price)}, ${esc(ev.priceNote)}</dd></div>
          </dl>
          <ul class="ticket__prog">${ev.program.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <div class="ticket__gift">
            <p class="ticket__gift-title">${esc(ev.gift)}</p>
            <p>${esc(ev.gifts)}</p>
          </div>
          <div class="ticket__cta">
            <a class="btn btn--lime btn--lg" href="${ev.cta.href}" target="_blank" rel="noopener">${esc(ev.cta.label)}</a>
            ${ev.bot ? `<a class="btn btn--ink btn--lg" href="${ev.bot.href}" target="_blank" rel="noopener">${esc(ev.bot.label)}</a>` : ''}
            <p class="ticket__cta-note">${esc(ev.cta.note)}</p>
          </div>
        </div>
        <div class="ticket__stub" aria-hidden="true">
          <span class="ticket__stub-week">${esc(ev.stub.week)}</span>
          <span class="ticket__stub-day">${esc(ev.stub.day)}</span>
          <span class="ticket__stub-month">${esc(ev.stub.month)}</span>
          <span class="ticket__stub-time">${esc(ev.stub.time)}</span>
          <span class="ticket__stub-price">${esc(ev.price)}</span>
        </div>
        <div class="countdown" role="timer" aria-live="off">
          <p class="countdown__label">До начала</p>
          <p class="countdown__val" data-cd></p>
        </div>
      </article>`;
    sec.hidden = false;
    const cd = $('[data-cd]', sec);
    const start = new Date(ev.start).getTime();
    const end = new Date(ev.until).getTime();
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const left = start - Date.now();
      if (Date.now() >= end) { sec.hidden = true; clearInterval(timer); return; }
      const s = Math.max(0, Math.floor(left / 1000));
      const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec2 = s % 60;
      cd.innerHTML = `${d ? `<span><b>${d}</b>д</span>` : ''}<span><b>${pad(h)}</b>ч</span><span><b>${pad(m)}</b>мин</span><span><b>${pad(sec2)}</b>с</span>`;
      cd.setAttribute('aria-label', `${d ? d + ' д ' : ''}${h} ч ${m} мин`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    reveal($('.ticket', sec));
  }

  /* ---------- Появление отдельных элементов (не всех секций подряд) ---------- */
  const revealIO = 'IntersectionObserver' in window
    ? new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } }), { threshold: 0.25 })
    : null;
  function reveal(el) { if (!el) return; if (revealIO) revealIO.observe(el); else el.classList.add('is-in'); }

  /* ---------- Данные расписания ---------- */
  const STYLE_ORDER = ['К-поп', 'Хип-хоп', 'Уличные', 'Современный', 'Контемп', 'Baby style', 'Джаз-фанк', 'High heels', 'Дивы', 'Леди', 'Пилатес', 'SDS Crew'];
  const TEACHER_ORDER = ['Снежана', 'Дима Ким', 'Кристина', 'Соня', 'Яна', 'Дима П.', 'Рубчинская'];
  const parseAge = (a) => {
    if (!a) return null;
    let m = a.match(/^(\d+)\s*[–-]\s*(\d+)$/); if (m) return [+m[1], +m[2]];
    m = a.match(/^(\d+)\+$/); if (m) return [+m[1], 99];
    return null;
  };
  const dayIdx = Object.fromEntries(DATA.days.map((d, i) => [d.id, i]));
  const slotIdx = Object.fromEntries(DATA.slots.map((s, i) => [s.id, i]));
  const dayById = Object.fromEntries(DATA.days.map((d) => [d.id, d]));
  const slotById = Object.fromEntries(DATA.slots.map((s) => [s.id, s]));
  const ITEMS = DATA.items.map((it, i) => {
    const range = parseAge(it.age);
    const tone = it.closed ? 'closed' : !range ? 'teen' : range[1] <= 12 ? 'kids' : range[0] >= 18 ? 'adult' : 'teen';
    return Object.assign({}, it, {
      id: i, range, tone,
      key: [it.day, it.slot, it.title, it.age || 'closed', it.teacher || '-'].join('|'),
      group: [it.title, it.age || 'closed', it.teacher || '-'].join('|')
    });
  }).sort((a, b) => dayIdx[a.day] - dayIdx[b.day] || slotIdx[a.slot] - slotIdx[b.slot]);
  const overlaps = (r, q) => r && q && r[0] <= q[1] && q[0] <= r[1];
  const ageSort = (a, b) => parseAge(a)[0] - parseAge(b)[0] || parseAge(a)[1] - parseAge(b)[1];

  // Сегодняшний день по Москве; в выходные — понедельник
  function todayId() {
    let wd = 'Mon';
    try { wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Moscow', weekday: 'short' }).format(new Date()); } catch (e) { /* старый браузер */ }
    const map = { Mon: 'mon', Tue: 'tue', Wed: 'wed', Thu: 'thu', Fri: 'fri' };
    return { id: map[wd] || 'mon', weekend: !map[wd] };
  }

  /* ---------- Расписание: сетка, фильтры, мой план ---------- */
  const Schedule = (() => {
    const grid = $('[data-grid]');
    const filtersBox = $('[data-filters]');
    const daysBox = $('[data-days]');
    const state = { age: new Set(), style: new Set(), teacher: new Set(), day: 'mon' };
    const planKeys = new Set(store.get('sds-plan', []));
    const byId = new Map(ITEMS.map((it) => [it.id, it]));
    const byKey = new Map(ITEMS.map((it) => [it.key, it]));
    [...planKeys].forEach((k) => { if (!byKey.has(k) || byKey.get(k).closed) planKeys.delete(k); });
    let btns = [];

    function render() {
      if (!grid) return;
      const today = todayId();
      state.day = today.id;
      // фильтры
      const opts = {
        age: [...new Set(ITEMS.map((i) => i.age).filter(Boolean))].sort(ageSort),
        style: STYLE_ORDER.filter((s) => ITEMS.some((i) => i.style === s)),
        teacher: TEACHER_ORDER.filter((t) => ITEMS.some((i) => i.teacher === t))
      };
      Object.entries(opts).forEach(([k, list]) => {
        $(`[data-filter="${k}"]`, filtersBox).innerHTML = list.map((v) => `<button type="button" class="chip" aria-pressed="false" data-k="${k}" data-v="${esc(v)}">${esc(v)}</button>`).join('');
      });
      filtersBox.hidden = false;
      filtersBox.addEventListener('click', (e) => {
        const b = e.target.closest('.chip');
        if (b) { toggleFilter(b.dataset.k, b.dataset.v); return; }
        if (e.target.closest('[data-filter-reset]')) setFilters({});
      });

      // дни (мобильный переключатель)
      daysBox.innerHTML = DATA.days.map((d) => `
        <button type="button" role="tab" class="day" id="day-${d.id}" data-day-tab="${d.id}" aria-controls="sched-grid" aria-selected="false" tabindex="-1">
          <span class="day__short">${d.short}</span><span class="vh">${d.name}</span>${d.id === today.id && !today.weekend ? '<span class="day__today">сегодня</span>' : ''}<span class="day__hits" aria-hidden="true"></span>
        </button>`).join('');
      daysBox.hidden = false;
      const note = $('[data-days-note]');
      if (today.weekend) { note.textContent = 'Сегодня выходной, показываем понедельник'; note.hidden = false; }
      daysBox.addEventListener('click', (e) => { const b = e.target.closest('[data-day-tab]'); if (b) setDay(b.dataset.dayTab, true); });
      daysBox.addEventListener('keydown', (e) => {
        const ids = DATA.days.map((d) => d.id);
        let i = ids.indexOf(state.day);
        if (e.key === 'ArrowRight') i = (i + 1) % ids.length;
        else if (e.key === 'ArrowLeft') i = (i - 1 + ids.length) % ids.length;
        else if (e.key === 'Home') i = 0; else if (e.key === 'End') i = ids.length - 1; else return;
        e.preventDefault(); setDay(ids[i], true);
      });

      // сетка
      grid.id = 'sched-grid';
      let html = '<div class="grid__corner" aria-hidden="true"></div>';
      html += DATA.days.map((d) => `<div class="gday" data-day="${d.id}"><span class="gday__short">${d.short}</span><span class="gday__name">${d.name}</span>${d.id === today.id && !today.weekend ? '<span class="gday__today">сегодня</span>' : ''}</div>`).join('');
      DATA.slots.forEach((s) => {
        html += `<div class="gslot"><span class="gslot__t">${s.start}</span><span class="gslot__r">${s.label}</span></div>`;
        DATA.days.forEach((d) => {
          const list = ITEMS.filter((i) => i.day === d.id && i.slot === s.id);
          html += `<div class="cell" data-day="${d.id}"><span class="cell__time" aria-hidden="true">${s.label}</span>`;
          html += list.length ? list.map(groupHTML).join('') : '<p class="cell__empty">занятий нет</p>';
          html += '</div>';
        });
      });
      grid.innerHTML = html;
      grid.classList.add('is-ready');
      btns = $$('.gs', grid);
      grid.addEventListener('click', (e) => {
        const b = e.target.closest('button.gs');
        if (b) togglePlan(byId.get(+b.dataset.id));
      });
      $('[data-legend]').hidden = false;
      $('[data-plan]').hidden = false;
      setDay(state.day, false);
      applyFilters();
      renderPlan();
      initPlanUI();
    }

    function groupHTML(it) {
      const tilt = (((it.id * 37) % 5) - 2) * 0.6;
      const when = `${dayById[it.day].short} ${slotById[it.slot].start}`;
      if (it.closed) {
        return `<div class="gs gs--closed" data-id="${it.id}" style="--tilt:${tilt}deg">
          <span class="gs__title">${esc(it.title)}</span>
          <span class="gs__meta"><span class="gs__age"><svg class="ico" aria-hidden="true"><use href="#i-lock"/></svg>закрытая</span>${it.teacher ? `<span class="gs__teacher">${esc(it.teacher)}</span>` : ''}</span>
          <span class="vh">${when}, закрытая группа</span>
        </div>`;
      }
      return `<button type="button" class="gs gs--${it.tone}" data-id="${it.id}" aria-pressed="false" style="--tilt:${tilt}deg"
        aria-label="${esc(`${when}: ${it.title}, ${it.age}, педагог ${it.teacher}. В план недели`)}">
        <span class="gs__title">${esc(it.title)}</span>
        <span class="gs__meta"><span class="gs__age">${esc(it.age)}</span><span class="gs__teacher">${esc(it.teacher)}</span></span>
        <span class="gs__plus" aria-hidden="true">+1</span>
      </button>`;
    }

    function setDay(id, focus) {
      state.day = id;
      $$('[data-day-tab]', daysBox).forEach((b) => {
        const on = b.dataset.dayTab === id;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      grid.setAttribute('aria-labelledby', 'day-' + id);
      $$('[data-day]', grid).forEach((el) => el.classList.toggle('is-day', el.dataset.day === id));
    }

    const matches = (it) =>
      (!state.age.size || (it.age && state.age.has(it.age))) &&
      (!state.style.size || state.style.has(it.style)) &&
      (!state.teacher.size || (it.teacher && state.teacher.has(it.teacher)));

    function applyFilters() {
      const active = state.age.size || state.style.size || state.teacher.size;
      let hits = 0;
      const perDay = {};
      btns.forEach((b) => {
        const it = byId.get(+b.dataset.id);
        const ok = matches(it);
        if (ok && active) { hits++; perDay[it.day] = (perDay[it.day] || 0) + 1; }
        b.classList.toggle('is-dim', !!active && !ok);
        b.classList.toggle('is-hit', !!active && ok);
        if (b.tagName === 'BUTTON') b.tabIndex = active && !ok ? -1 : 0;
      });
      $$('.chip', filtersBox).forEach((c) => c.setAttribute('aria-pressed', String(state[c.dataset.k].has(c.dataset.v))));
      $$('[data-day-tab]', daysBox).forEach((b) => {
        const n = perDay[b.dataset.dayTab] || 0;
        $('.day__hits', b).textContent = active && n ? n : '';
        b.classList.toggle('is-empty', !!active && !n);
      });
      const cnt = $('[data-filter-count]');
      cnt.textContent = active ? (hits ? `Подходит занятий в неделю: ${hits}` : 'Под такие фильтры занятий нет. Попробуй убрать один.') : `Всего занятий в неделю: ${ITEMS.length}`;
      $('[data-filter-reset]').hidden = !active;
      // если в выбранном дне пусто — перейти на ближайший день с совпадениями
      if (active && hits && !perDay[state.day]) {
        const first = DATA.days.find((d) => perDay[d.id]);
        if (first) setDay(first.id, false);
      }
    }

    function toggleFilter(k, v) {
      const s = state[k];
      if (s.has(v)) s.delete(v); else s.add(v);
      applyFilters();
    }
    function setFilters({ age = [], style = [], teacher = [] }) {
      state.age = new Set(age); state.style = new Set(style); state.teacher = new Set(teacher);
      applyFilters();
    }

    /* мой план */
    const REC = [
      { min: 1, name: 'Лёгкий старт', price: '2 300 ₽', text: '4 занятия в месяц', cls: 'paper' },
      { min: 2, name: 'База', price: '3 800 ₽', text: '8 занятий в месяц, 2 раза в неделю', cls: 'lime' },
      { min: 3, name: 'Сцена', price: '5 000 ₽', text: '12 занятий в месяц, 3 раза в неделю', cls: 'pink' },
      { min: 4, name: 'Конкурс', price: '6 500 ₽', text: 'безлимит, от 4 занятий в неделю', cls: 'magenta' }
    ];
    const recFor = (n) => n ? REC[Math.min(n, 4) - 1] : null;
    const planItems = () => [...planKeys].map((k) => byKey.get(k)).filter(Boolean)
      .sort((a, b) => dayIdx[a.day] - dayIdx[b.day] || slotIdx[a.slot] - slotIdx[b.slot]);
    const lineFor = (it) => `${dayById[it.day].short} ${slotById[it.slot].start} — ${it.title}, ${it.age}, ${it.teacher}`;

    function togglePlan(it) {
      if (!it || it.closed) return;
      const btn = btns.find((b) => +b.dataset.id === it.id);
      if (planKeys.has(it.key)) planKeys.delete(it.key);
      else { planKeys.add(it.key); if (btn) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); } }
      store.set('sds-plan', [...planKeys]);
      renderPlan();
    }

    function renderPlan() {
      const list = planItems();
      const n = list.length;
      btns.forEach((b) => {
        if (b.tagName !== 'BUTTON') return;
        const on = planKeys.has(byId.get(+b.dataset.id).key);
        b.setAttribute('aria-pressed', String(on));
      });
      $('[data-plan-count]').textContent = n;
      $('[data-plan-empty]').hidden = n > 0;
      $('[data-plan-list]').innerHTML = list.map((it) => `
        <li class="plan__item plan__item--${it.tone}">
          <span class="plan__when">${dayById[it.day].short} ${slotById[it.slot].start}</span>
          <span class="plan__what">${esc(it.title)} <small>${esc(it.age)} · ${esc(it.teacher)}</small></span>
          <button type="button" class="plan__rm" data-rm="${esc(it.key)}" aria-label="Убрать из плана: ${esc(lineFor(it))}">×</button>
        </li>`).join('');
      const rec = recFor(n);
      const recBox = $('[data-plan-rec]');
      recBox.hidden = !rec;
      if (rec) {
        recBox.className = 'plan__rec plan__rec--' + rec.cls;
        recBox.innerHTML = `<p class="plan__rec-k">Подойдёт абонемент</p><p class="plan__rec-name">«${rec.name}» <span>${rec.price}</span></p><p class="plan__rec-t">${rec.text}</p>`;
      }
      // одно время — два занятия
      const seen = {}; const clash = [];
      list.forEach((it) => { const k = it.day + it.slot; if (seen[k]) clash.push(`${dayById[it.day].short} ${slotById[it.slot].start}`); seen[k] = 1; });
      const warn = $('[data-plan-warn]');
      warn.hidden = !clash.length;
      warn.textContent = clash.length ? `В одно время два занятия: ${[...new Set(clash)].join(', ')}. Оставь одно.` : '';
      $('[data-plan-send]').disabled = !n;
      $('[data-plan-clear]').disabled = !n;
      $('[data-plan-fab-n]').textContent = n;
      fab.update();
    }

    const fab = {
      el: $('[data-plan-fab]'), inSched: false, inPlan: false,
      update() { if (this.el) this.el.hidden = !(planKeys.size && this.inSched && !this.inPlan); }
    };

    function initPlanUI() {
      $('[data-plan-list]').addEventListener('click', (e) => {
        const b = e.target.closest('[data-rm]');
        if (b) togglePlan(byKey.get(b.dataset.rm));
      });
      $('[data-plan-clear]').addEventListener('click', () => { planKeys.clear(); store.set('sds-plan', []); renderPlan(); });
      $('[data-plan-send]').addEventListener('click', () => {
        const list = planItems();
        if (!list.length) return;
        const rec = recFor(list.length);
        const text = ['Здравствуйте! Хочу записаться на занятия в SDS:', ...list.map((it) => '• ' + lineFor(it)),
          `Занятий в неделю: ${list.length}. Подходит абонемент «${rec.name}» (${rec.price}).`, 'Подскажите, пожалуйста, есть ли места?'].join('\n');
        copyText(text).then((ok) => {
          toast(ok ? 'Сообщение скопировано. Вставь его в чат студии и отправь.' : 'Не получилось скопировать. Текст ниже — выдели и скопируй.', ok ? null : text);
        });
        window.open(VK, '_blank', 'noopener');
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => { fab.inSched = en.isIntersecting; fab.update(); }).observe($('#schedule'));
        new IntersectionObserver(([en]) => { fab.inPlan = en.isIntersecting; fab.update(); }, { threshold: 0.2 }).observe($('[data-plan]'));
      }
    }

    return { render, setFilters, setDay, items: ITEMS };
  })();

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
    }
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  let toastEl;
  function toast(msg, fallbackText) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast'; toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `<p>${esc(msg)}</p>${fallbackText ? `<textarea readonly rows="6">${esc(fallbackText)}</textarea>` : ''}<button type="button" class="toast__x" aria-label="Закрыть">×</button>`;
    toastEl.classList.add('is-on');
    $('.toast__x', toastEl).onclick = () => toastEl.classList.remove('is-on');
    clearTimeout(toastEl._t);
    if (!fallbackText) toastEl._t = setTimeout(() => toastEl.classList.remove('is-on'), 6000);
  }

  /* ---------- Подборщик ---------- */
  function initPicker() {
    const root = $('[data-picker]');
    if (!root) return;
    const styleStep = $('[data-step="style"]', root);
    const styleBox = $('[data-style-opts]', root);
    const result = $('[data-result]', root);
    let range = null, ageLabel = '';
    const open = ITEMS.filter((i) => !i.closed);

    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-age]');
      if (a) {
        $$('[data-age]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === a)));
        range = a.dataset.age.split('-').map(Number); ageLabel = a.textContent.trim();
        const styles = STYLE_ORDER.filter((s) => open.some((i) => i.style === s && overlaps(i.range, range)));
        styleStep.disabled = false;
        styleBox.innerHTML = styles.map((s) => `<button type="button" class="opt" data-style="${esc(s)}" aria-pressed="false">${esc(s)}</button>`).join('') +
          '<button type="button" class="opt opt--unsure" data-style="" aria-pressed="false">Не знаю</button>';
        result.innerHTML = '<p class="pstep__hint">Выбери направление или «Не знаю».</p>';
        styleStep.classList.add('is-active');
        if (matchMedia('(max-width: 899px)').matches) styleStep.scrollIntoView({ block: 'nearest', behavior: reduced.matches ? 'auto' : 'smooth' });
        return;
      }
      const s = e.target.closest('[data-style]');
      if (s && range) {
        $$('[data-style]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === s)));
        showResult(s.dataset.style);
        return;
      }
      const show = e.target.closest('[data-show]');
      if (show) {
        const d = JSON.parse(show.dataset.show);
        Schedule.setFilters(d);
        document.getElementById('schedule').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
      }
      const sign = e.target.closest('[data-sign]');
      if (sign) { const sel = $('#f-dir'); if (sel && sign.dataset.sign) sel.value = sign.dataset.sign; }
    });

    function showResult(style) {
      const list = open.filter((i) => overlaps(i.range, range) && (!style || i.style === style));
      if (!list.length) {
        result.innerHTML = `<p class="pres__none">Для этого возраста подходящей группы в расписании нет. Напишите нам, подскажем.</p>
          <a class="btn btn--ink" href="${VK}" target="_blank" rel="noopener">Написать студии</a>`;
        return;
      }
      const groups = new Map();
      list.forEach((i) => { if (!groups.has(i.group)) groups.set(i.group, { it: i, times: [] }); groups.get(i.group).times.push(i); });
      const whenText = (times) => {
        const bySlot = {};
        times.forEach((t) => { (bySlot[t.slot] = bySlot[t.slot] || []).push(dayById[t.day].short); });
        return Object.entries(bySlot).sort((a, b) => slotIdx[a[0]] - slotIdx[b[0]]).map(([sl, ds]) => `${ds.join(' и ')} в ${slotById[sl].start}`).join('; ');
      };
      const ages = [...new Set(list.map((i) => i.age))];
      result.innerHTML = `
        <ul class="pres">${[...groups.values()].map(({ it, times }) => `
          <li class="pres__item pres__item--${it.tone}">
            <p class="pres__title">${esc(it.title)} <span>${esc(it.age)}</span></p>
            <p class="pres__meta">${esc(it.teacher)} · ${esc(whenText(times))}</p>
          </li>`).join('')}</ul>
        ${style ? '' : '<p class="pres__unsure marker-note">Не знаешь, что выбрать? Напиши студии — помогут определиться.</p>'}
        <div class="pres__actions">
          <button type="button" class="btn btn--ink" data-show='${esc(JSON.stringify({ age: ages, style: style ? [style] : [] }))}'>Показать в расписании</button>
          <a class="btn btn--paper" href="#signup" data-sign="${esc(style || '')}">Записаться на пробное</a>
        </div>`;
    }
  }

  /* ---------- Залы: свет меняет секцию ---------- */
  const HALLS = {
    pink: {
      name: 'Розовый зал', area: '45 м²', cap: 'до 15 человек', price: '900 ₽/час',
      on: 'Розовое свечение', off: 'Дневной свет',
      features: ['Тёплые цвета, покрытие — ламинат', 'Дневной свет или розовое свечение', 'Идеален для групп с детьми, индивидуальных занятий и фитнеса', 'Хорошо смотрится в кадре']
    },
    black: {
      name: 'Чёрный зал', area: '55 м²', cap: 'до 20 человек', price: '900 ₽/час',
      on: 'RGB-прожекторы', off: 'Дневной свет',
      quote: '«Единственный зал во Владимире с чёрным покрытием стен и пола»',
      features: ['Зеркала, bluetooth-колонка, вентиляция', 'Дневной свет или RGB-прожекторы на потолке', 'Для съёмок, репетиций и индивидуальных занятий'],
      warn: 'Каблуки в чёрном зале нельзя: чувствительный пол. Кроссовки и носочки можно.'
    },
    grey: {
      name: 'Серый зал', area: '90 м²', cap: 'до 30 человек', price: '1 000 ₽/час',
      on: 'Неон в такт музыке', off: 'Неон выключен',
      features: ['Просторный и универсальный: для больших групп, тренингов, батлов', 'Зеркала, мощная LG-колонка, кондиционер', 'Дополнительный неоновый свет: через приложение его можно синхронизировать с музыкой']
    }
  };
  function initHalls() {
    const sec = $('#halls');
    if (!sec) return;
    const tabs = $$('[data-hall-id]', sec);
    const panel = $('#hall-panel');
    const info = $('[data-hall-info]', sec);
    const sw = $('[data-light-switch]', sec);
    const swLabel = $('[data-light-label]', sec);
    const light = { pink: true, black: true, grey: true };
    let cur = 'pink';

    const render = () => {
      const h = HALLS[cur];
      sec.dataset.hall = cur;
      sec.dataset.light = light[cur] ? 'on' : 'off';
      tabs.forEach((t) => { const on = t.dataset.hallId === cur; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'tab-' + cur);
      $('#room-title').textContent = `Схема: ${h.name.toLowerCase()}, ${light[cur] ? h.on.toLowerCase() : h.off.toLowerCase()}`;
      sw.setAttribute('aria-checked', String(light[cur]));
      swLabel.textContent = light[cur] ? h.on : h.off;
      info.innerHTML = `
        <h3 class="hall__name">${h.name}</h3>
        <div class="hall__stats">
          <p class="hall__stat"><b>${h.area}</b><span>площадь</span></p>
          <p class="hall__stat"><b>${h.cap.replace('до ', 'до&nbsp;')}</b><span>вместимость</span></p>
          <p class="hall__stat hall__stat--price"><b>${h.price}</b><span>аренда</span></p>
        </div>
        ${h.quote ? `<p class="hall__quote marker-note">${h.quote}</p>` : ''}
        <ul class="hall__list">${h.features.map((f) => `<li>${f}</li>`).join('')}</ul>
        ${h.warn ? `<p class="hall__warn"><span aria-hidden="true">!</span>${h.warn}</p>` : ''}`;
    };
    const select = (id, focus) => { cur = id; render(); if (focus) tabs.find((t) => t.dataset.hallId === id).focus(); };
    tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.hallId)));
    $('.halls__tabs', sec).addEventListener('keydown', (e) => {
      const ids = tabs.map((t) => t.dataset.hallId);
      let i = ids.indexOf(cur);
      if (e.key === 'ArrowRight') i = (i + 1) % ids.length;
      else if (e.key === 'ArrowLeft') i = (i - 1 + ids.length) % ids.length;
      else if (e.key === 'Home') i = 0; else if (e.key === 'End') i = ids.length - 1; else return;
      e.preventDefault(); select(ids[i], true);
    });
    sw.addEventListener('click', () => { light[cur] = !light[cur]; render(); });
    render();
  }

  /* ---------- Педагоги: карточки-коллекционки ---------- */
  function initCards() {
    const box = $('[data-cards]');
    if (!box) return;
    $$('.tcard', box).forEach((card) => {
      const name = card.dataset.teacher;
      const mine = ITEMS.filter((i) => i.teacher === name);
      const groups = new Map();
      mine.forEach((i) => { if (!groups.has(i.group)) groups.set(i.group, { it: i, times: [] }); groups.get(i.group).times.push(i); });
      const slots = $('[data-slots]', card);
      if (slots && groups.size) {
        slots.innerHTML = '<span class="tcard__slots-t">В расписании</span>' + [...groups.values()].map(({ it, times }) => {
          const ds = [...new Set(times.map((t) => dayById[t.day].short))].join(', ');
          const ts = [...new Set(times.map((t) => slotById[t.slot].start))].join(', ');
          return `<span class="tslot"><b>${esc(it.title)}</b> ${it.closed ? 'закрытая' : esc(it.age)} · ${ds} ${ts}</span>`;
        }).join('');
      }
      const inner = $('.tcard__inner', card);
      inner.addEventListener('click', () => inner.setAttribute('aria-pressed', String(inner.getAttribute('aria-pressed') !== 'true')));
      if (fine.matches && !reduced.matches) {
        inner.addEventListener('pointermove', (e) => {
          const r = inner.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          inner.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
          inner.style.setProperty('--ry', ((x - 0.5) * 18).toFixed(2) + 'deg');
          inner.style.setProperty('--hx', (x * 100).toFixed(1) + '%');
          inner.style.setProperty('--hy', (y * 100).toFixed(1) + '%');
        });
        inner.addEventListener('pointerleave', () => { inner.style.setProperty('--rx', '0deg'); inner.style.setProperty('--ry', '0deg'); });
      }
    });
  }

  /* ---------- Дневник дракона (декоративно) ---------- */
  function initDiary() {
    const root = $('[data-diary]');
    if (!root) return;
    const page = $('[data-diary-page]', root);
    const msg = $('[data-diary-msg]', root);
    const msgs = ['Нажми на наклейки', 'Одна есть!', 'Ещё одна!', 'Дневник собран!'];
    const upd = () => {
      const used = $$('.stk[aria-pressed="true"]', root);
      page.innerHTML = used.map((b, i) => `<span class="diary__stk diary__stk--${b.classList[1].replace('stk--', '')}" style="--i:${i}">${b.innerHTML}</span>`).join('');
      msg.innerHTML = msgs[used.length] + (used.length === 3 ? ' <button type="button" class="link-btn" data-diary-reset>Собрать заново</button>' : '');
    };
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.stk');
      if (b && b.getAttribute('aria-pressed') !== 'true') { b.setAttribute('aria-pressed', 'true'); upd(); }
      if (e.target.closest('[data-diary-reset]')) { $$('.stk', root).forEach((s) => s.setAttribute('aria-pressed', 'false')); upd(); $('.stk', root).focus(); }
    });
  }

  /* ---------- Форма заявки (демо) ---------- */
  function initForm() {
    const form = $('[data-form]');
    if (!form) return;
    const phone = $('#f-phone');
    const printer = $('[data-printer]');
    const digits = (v) => {
      let d = v.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (d && !d.startsWith('7')) d = '7' + d;
      return d.slice(0, 11);
    };
    const fmt = (d) => {
      if (!d) return '';
      const p = d.slice(1);
      let s = '+7';
      if (p.length) s += ' (' + p.slice(0, 3);
      if (p.length >= 3) s += ')';
      if (p.length > 3) s += ' ' + p.slice(3, 6);
      if (p.length > 6) s += '-' + p.slice(6, 8);
      if (p.length > 8) s += '-' + p.slice(8, 10);
      return s;
    };
    phone.addEventListener('input', () => { phone.value = fmt(digits(phone.value)); });
    phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+7 ('; });
    phone.addEventListener('blur', () => { if (digits(phone.value).length <= 1) phone.value = ''; });

    const rules = {
      'f-name': (el) => el.value.trim().length >= 2 || 'Напиши имя, хотя бы две буквы.',
      'f-age-in': (el) => { const n = Number(el.value); return (Number.isInteger(n) && n >= 5 && n <= 99) || 'Укажи возраст числом: занятия для детей с 5 лет.'; },
      'f-dir': (el) => !!el.value || 'Выбери направление или «Не знаю».',
      'f-phone': (el) => digits(el.value).length === 11 || 'Нужен номер из 10 цифр после +7.',
      'f-ok': (el) => el.checked || 'Без согласия заявку не отправить.'
    };
    const check = (id) => {
      const el = document.getElementById(id);
      const res = rules[id](el);
      const err = document.getElementById(id + '-err');
      const bad = res !== true;
      el.setAttribute('aria-invalid', String(bad));
      if (bad) el.setAttribute('aria-describedby', id + '-err'); else el.removeAttribute('aria-describedby');
      err.textContent = bad ? res : '';
      el.closest('.field').classList.toggle('is-bad', bad);
      return !bad;
    };
    Object.keys(rules).forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur', () => { if (el.getAttribute('aria-invalid')) check(id); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((id) => !check(id));
      if (bad.length) { document.getElementById(bad[0]).focus(); return; }
      const no = 'SDS-' + String(Math.floor(1000 + Math.random() * 9000));
      $('[data-ticket-no]').textContent = '№ ' + no;
      const fd = new FormData(form);
      $('[data-ticket-dl]').innerHTML = [['Имя', fd.get('name')], ['Возраст', fd.get('age')], ['Направление', fd.get('direction')], ['Телефон', phone.value]]
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(String(v).trim())}</dd></div>`).join('');
      form.hidden = true;
      printer.hidden = false;
      printer.classList.remove('is-printing'); void printer.offsetWidth; printer.classList.add('is-printing');
      $('[data-ticket-out]').focus({ preventScroll: true });
      printer.scrollIntoView({ block: 'center', behavior: reduced.matches ? 'auto' : 'smooth' });
    });
    $('[data-form-again]').addEventListener('click', () => {
      form.reset();
      $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
      printer.hidden = true; form.hidden = false;
      $('#f-name').focus();
    });
  }

  /* ---------- Старт ---------- */
  initHeader();
  initHeroLights();
  initGlow();
  initEvent();
  Schedule.render();
  initPicker();
  initHalls();
  initCards();
  initDiary();
  initForm();
  $$('.ladder, .notes, .diary').forEach(reveal);
})();
