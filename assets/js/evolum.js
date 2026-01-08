// ==========================================================
// EVOLUM — JS PRINCIPAL (accesible, performante, mantenible)
// ==========================================================

/* ====== Utils ====== */
const $  = (s,root=document)=> root.querySelector(s);
const $$ = (s,root=document)=> Array.from(root.querySelectorAll(s));
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function moneyPYG(n){
  try { return new Intl.NumberFormat('es-PY',{style:'currency',currency:'PYG',maximumFractionDigits:0}).format(+n||0); }
  catch(e){ return 'Gs. ' + (+n||0).toLocaleString('es-PY'); }
}

function debounce(fn, wait=200){
  let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); };
}

function onImagesLoaded(root, cb){
  const imgs = $$('img', root).filter(i => !i.complete);
  if(imgs.length === 0){ cb(); return; }
  let left = imgs.length;
  imgs.forEach(img=>{
    const done = ()=>{ if(--left<=0) cb(); };
    img.addEventListener('load', done, {once:true});
    img.addEventListener('error', done, {once:true});
  });
}

/* ====== Video hero ====== */
function initHeroVideo(){
  const v = $('.hero-video__media');
  if(!v) return;

  if(prefersReduced){
    v.removeAttribute('autoplay');
    try{ v.pause(); }catch(e){}
    return;
  }

  v.muted = true; v.playsInline = true; v.defaultMuted = true;

  const play = ()=> v.play().catch(()=>{});
  play();

  const resume = ()=>{ play(); window.removeEventListener('click', resume); window.removeEventListener('touchstart', resume, {passive:true}); };
  window.addEventListener('click', resume, {once:true});
  window.addEventListener('touchstart', resume, {once:true, passive:true});
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) play(); });
}

/* ====== Menú móvil ====== */
function initNav(){
  const toggle = $('.nav-toggle');
  const menu = $('#navmenu');
  if(!toggle || !menu) return;

  const FIRST_FOCUS = ()=> menu.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
  const TRAP = (e)=>{
    if(!menu.classList.contains('open')) return;
    const focusables = $$('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])', menu)
      .filter(el => !el.disabled && el.offsetParent !== null);
    if(focusables.length === 0) return;
    const first = focusables[0], last = focusables[focusables.length-1];
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    if(e.key === 'Escape'){ close(); toggle.focus(); }
  };

  const open = ()=>{
    toggle.setAttribute('aria-expanded','true');
    menu.classList.add('open');
    document.body.classList.add('nav-open');
    const f = FIRST_FOCUS(); f && f.focus();
    document.addEventListener('keydown', TRAP);
  };
  const close = ()=>{
    toggle.setAttribute('aria-expanded','false');
    menu.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.removeEventListener('keydown', TRAP);
  };

  toggle.addEventListener('click', ()=>{
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  menu.addEventListener('click', e=>{
    if(e.target.tagName === 'A' && menu.classList.contains('open')) close();
  });
}

/* ====== Ripple ====== */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.ripple');
  if (!btn) return;
  let circle = btn.querySelector(':scope > .ripple-circle');
  if(!circle){
    circle = document.createElement('span');
    circle.className = 'ripple-circle';
    btn.appendChild(circle);
  }
  const rect = btn.getBoundingClientRect();
  const d = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = d + 'px';
  circle.style.left = (e.clientX - rect.left - d / 2) + 'px';
  circle.style.top = (e.clientY - rect.top - d / 2) + 'px';
  circle.style.animation = 'none';
  void circle.offsetWidth;
  circle.style.animation = '';
}, {passive:true});

/* ====== Accordion FAQ ====== */
function initFAQ(){
  const items = $$('.acc-item');
  if(!items.length) return;
  const triggers = items.map(it=>$('.acc-trigger', it));

  function open(t){
    triggers.forEach(x=> x.setAttribute('aria-expanded','false'));
    t.setAttribute('aria-expanded','true');
  }

  triggers.forEach((t, idx)=>{
    t.addEventListener('click', ()=> {
      const isOpen = t.getAttribute('aria-expanded') === 'true';
      isOpen ? t.setAttribute('aria-expanded','false') : open(t);
    });
    t.addEventListener('keydown', (e)=>{
      const key = e.key;
      if(key === 'ArrowDown'){ e.preventDefault(); (triggers[idx+1]||triggers[0]).focus(); }
      if(key === 'ArrowUp'){ e.preventDefault(); (triggers[idx-1]||triggers[triggers.length-1]).focus(); }
      if(key === 'Home'){ e.preventDefault(); triggers[0].focus(); }
      if(key === 'End'){ e.preventDefault(); triggers[triggers.length-1].focus(); }
    });
  });
}

/* ==========================================================
   Datos de productos (OFICIALES)
   ========================================================== */
const products = [
  // PROTEÍNAS
  { cat:'Whey', name:'Whey Black Skull 100% HD 900g',                 price:210000, img:'assets/img/proteina/whey-black-skull-100hd.png' },
  { cat:'Whey', name:'Whey Protein Bolic Evox Nutrition 1.8kg',       price:230000, img:'assets/img/proteina/whey-bolic.png' },
  { cat:'Whey', name:'Whey Protein Growth Supplements 1kg',           price:290000, img:'assets/img/proteina/whey-growth.png' },
  { cat:'Whey', name:'Whey Protein New Millen 900g',                  price:200000, img:'assets/img/proteina/whey-newmillen.png' },
  { cat:'Whey', name:'Whey Profit Isolate Mix 900g',                  price:200000, img:'assets/img/proteina/whey-profit-isolate.png' },
  { cat:'Whey', name:'Whey Profit Isolate Mix Pote 900g',             price:230000, img:'assets/img/proteina/whey-profit-mix.png' },
  { cat:'Whey', name:'Whey Protein Integralmedica 100% 900 g',        price:250000, img:'assets/img/proteina/whey-integral100.png' },
  { cat:'Whey', name:'Anabolic Mass Profit Nutrition 3kg',            price:220000, img:'assets/img/otros/profit-anabolic-mass.png' },
  { cat:'Whey', name:'Isolate Vegano Pro 480g',                       price:220000, img:'assets/img/proteina/isolate-vegano-pro.png' },
  
  // CREATINAS
  { cat:'Creatina', name:'Creatina Profit Nutrition 150g',            price: 90000, img:'assets/img/creatina/crea-profit-150.png' },
  { cat:'Creatina', name:'Creatina Profit Nutrition 300g',            price:170000, img:'assets/img/creatina/crea-profit-300.png' },
  { cat:'Creatina', name:'Creatina Black Skull 300g',                 price:180000, img:'assets/img/creatina/crea-black-skull.png' },
  { cat:'Creatina', name:'Creatina Sharkpro Premium 300g',            price:180000, img:'assets/img/creatina/crea-sharkpro.png' },
  { cat:'Creatina', name:'Creatina Universal Micronized 200g',        price:170000, img:'assets/img/creatina/crea-universal-200.png' },
  { cat:'Creatina', name:'Creatina Max Titanium 300g',                price:195000, img:'assets/img/creatina/crea-max-300.png' },
  { cat:'Creatina', name:'Creatina Growth Supplements 250g',          price:150000, img:'assets/img/creatina/crea-growth-250.png' },
  { cat:'Creatina', name:'Creatina Muscletech Platinum 400g',         price:230000, img:'assets/img/creatina/crea-muscletech-400.png' },
  { cat:'Creatina', name:'Creatina Muscletech Platinum Tablets 90u',  price:200000, img:'assets/img/creatina/crea-muscletech-tab.png' },
  { cat:'Creatina', name:'Creatina Carbfuel Integralmedica 300g',     price:150000, img:'assets/img/creatina/carbfuel-300.png' },
  { cat:'Creatina', name:'Creatina Soldiers 300g',                    price:160000, img:'assets/img/creatina/crea-soldiers.png' },
  { cat:'Creatina', name:'Creatina Beta-Alanine',                     price:160000, img:'assets/img/creatina/beta-alanine-muscletech.png' },

  // PRE
  { cat:'Pre', name:'Pre-Entreno Abduzido Nitro Max 300g',            price:140000, img:'assets/img/pre/pre-abduzido.png' },
  { cat:'Pre', name:'Pre-Entreno Bonecrusher Black Skull 300g',       price:175000, img:'assets/img/pre/pre-bone-300.png' },
  { cat:'Pre', name:'Pre-Entreno Bonecrusher Black Skull 150g',       price:100000, img:'assets/img/pre/pre-bone-150.png' },
  { cat:'Pre', name:'Pre-Entreno Ultimate Iron Profit 300g',          price:180000, img:'assets/img/pre/pre-ultimate-profit.png' },
  { cat:'Pre', name:'Pre-Entreno X7 Atlhetica Nutrition 300g',        price:200000, img:'assets/img/pre/pre-x7.png' },
  { cat:'Pre', name:'Pre-Entreno Insane Profit 200gr',                price:150000, img:'assets/img/pre/pre-insane-profit.png' },


  // OTROS
  { cat:'Otros', name:'Gel Energético Carb Up Probiotica 10 unidades',         price: 95000, img:'assets/img/otros/gel-carbup.png' },
  { cat:'Otros', name:'Termogénico Atlhetica Nutrition Thermo X 120 cápsulas', price:135000, img:'assets/img/otros/termogenico-atlheta.png' },
  { cat:'Otros', name:'Vitamina C 500mg Neo Quimica',                          price: 35000, img:'assets/img/otros/vitam_c.png' },
  { cat:'Otros', name:'Omega 3 Neo Quimica',                                   price: 95000, img:'assets/img/otros/vitam_a-z.png' },
  { cat:'Otros', name:'Vitamina A-Z  Neo Quimica',                             price: 65000, img:'assets/img/otros/omega3.png' },
  { cat:'Otros', name:'Multivitamínico Lavitan 30 cápsulas',                   price: 55000, img:'assets/img/otros/multivit-30-.png' },
  { cat:'Otros', name:'Vitamina Infantil Kid Gummy Lavitan 60 unidades',       price: 65000, img:'assets/img/otros/vit-kid-gummy.png' },
  { cat:'Otros', name:'Vitamina Profit Nutrition 90 cápsulas',                 price: 100000, img:'assets/img/otros/vit-profit-90.png' },
  { cat:'Otros', name:'Crema de Maní Dr. Peanut 600g',                         price:130000, img:'assets/img/otros/mani-drpeanut.png' },
  { cat:'Otros', name:'Crema de Maní Laganexa 1kg',                            price:155000, img:'assets/img/otros/mani-laganexa.png' },
  { cat:'Otros', name:'Barra Proteica Growth 12 unidades',                     price:135000, img:'assets/img/otros/barra-growth.png' },
  { cat:'Otros', name:'Barra Proteica Supino Protein Bar 20 unidades',         price:150000, img:'assets/img/otros/barrita-supino-protein.webp' },
  { cat:'Otros', name:'Shaker 700ml',                                          price: 35000, img:'assets/img/otros/shaker.png' },
  { cat:'Otros', name:'Colágeno Sharkpro Hidrolizado 300g',                    price:160000, img:'assets/img/otros/colageno-sharkpro.png' },
  { cat:'Otros', name:'Glutamina Integralmedica 300g',                         price:155000, img:'assets/img/otros/gluta-integral.png' },
  { cat:'Otros', name:'Colageno Profit Hidrolizado 300g',                      price:160000, img:'assets/img/otros/colageno-profit.png' },
  { cat:'Otros', name:'BCCA Profit 300g',                                      price:170000, img:'assets/img/otros/bcca-profit.png' },
  { cat:'Otros', name:'Magnesio + Inositol Profit 300g',                       price:230000, img:'assets/img/otros/magnesio-inositol-profit.png' },
  { cat:'Otros', name:'Inmunoshot Profit 300g',                                price:160000, img:'assets/img/otros/inmunoshot-profit.png' },

];

/* ====== Búsqueda ====== */
const searchDictionary = {
  'proteina':['whey','protein','proteina','isolate','concentrado','suero','leche'],
  'whey':['proteina','protein','whey','suero'],
  'isolate':['aislada','isolate','iso','pura'],
  'isolada':['isolate','aislada','iso'],
  'suero':['whey','proteina','suero'],
  'creatina':['creatine','creatina','monohidrato','micronizada','crea'],
  'creatine':['creatina','creatine','crea'],
  'crea':['creatina','creatine'],
  'monohidrato':['creatina','monohidrate'],
  'micronizada':['creatina','micronized'],
  'pre':['pre-entreno','preworkout','pre workout','pre','preentreno','energia'],
  'preworkout':['pre-entreno','pre','energia'],
  'preentrino':['pre-entreno','pre','preworkout'],
  'energia':['pre-entreno','energetico','pre'],
  'energetico':['pre-entreno','energia','gel'],
  'vitamina':['vitamin','vitamina','multi','multivitaminico','suplemento'],
  'vitamin':['vitamina','multi','multivitaminico'],
  'multi':['multivitaminico','vitamina','vitamin'],
  'multivitaminico':['multi','vitamina','vitamin'],
  'barra':['bar','barra','proteica','snack'],
  'bar':['barra','proteica','snack'],
  'snack':['barra','bar','colacion'],
  'mani':['peanut','mani','crema','mantequilla'],
  'peanut':['mani','crema','mantequilla'],
  'mantequilla':['mani','peanut','crema'],
  'gel':['energetico','carb','energia'],
  'mass':['masa','ganador','weight','gainer'],
  'ganador':['mass','gainer','masa'],
  'gainer':['ganador','mass','masa'],
  'termogenico':['quemador','fat burner','thermo'],
  'quemador':['termogenico','fat burner','grasa'],
  'colageno':['collagen','colageno','articulaciones'],
  'collagen':['colageno','articulaciones'],
  'glutamina':['glutamine','glutamina','recuperacion'],
  'glutamine':['glutamina','recuperacion'],
  'shaker':['vaso','mezclador','botella']
};
function normalizeText(text){
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
}
function expandSearchTerms(query){
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/);
  const all = new Set([normalized, ...words]);
  words.forEach(w=>{ if(searchDictionary[w]) searchDictionary[w].forEach(s=>all.add(s)); });
  return Array.from(all);
}
function smartSearch(product, searchTerms){
  const productText = normalizeText(product.name + ' ' + product.cat);
  return searchTerms.some(term=>{
    if(productText.includes(term)) return true;
    const ws = term.split(/\s+/); return ws.every(w=>productText.includes(w));
  });
}

/* ====== Carrusel estable (no-infinito, sin saltos) ====== */
function initShowcaseCarousel(){
  const viewport = $('#car-viewport');
  const track    = $('#car-track');
  const btnPrev  = $('.car-btn.prev');
  const btnNext  = $('.car-btn.next');
  const status   = $('#car-status');
  if(!viewport || !track) return;

  const waLink = (p)=>{
    const msg = encodeURIComponent(`Hola EVOLUM, quiero consultar sobre: ${p.name} (${moneyPYG(p.price)})`);
    return `https://wa.me/595981838707?text=${msg}`;
  };

  // Selección balanceada: 10 items
  const pickBalanced = (list)=>{
    const by = c => list.filter(p=>p.cat===c);
    const take=(a,n)=>a.slice(0,n);
    return [...take(by('Whey'),3), ...take(by('Creatina'),3), ...take(by('Pre'),2), ...take(by('Otros'),2)].slice(0,10);
  };
  const items = pickBalanced(products);

  track.innerHTML = items.map(p => `
    <li class="car-item" role="listitem">
      <a class="car-card" href="${waLink(p)}" target="_blank" rel="noopener" aria-label="${p.name}">
        <figure class="car-media">
          <img src="${p.img||'assets/img/evologo.png'}" alt="${p.name}" loading="lazy" decoding="async"
               onerror="this.onerror=null;this.src='assets/img/evologo.png'">
        </figure>
        <div class="car-body">
          <h3 class="car-title">${p.name}</h3>
          <span class="car-price">${moneyPYG(p.price)}</span>
        </div>
      </a>
    </li>
  `).join('');

  // --- Métricas (considera el padding del viewport) ---
  const metrics = ()=>{
    const csTrack = getComputedStyle(track);
    const gap  = parseFloat(csTrack.columnGap||'0');
    const card = track.querySelector('.car-item');
    const w    = card ? card.getBoundingClientRect().width : 240;
    const step = w + gap;

    const csVP  = getComputedStyle(viewport);
    const padL  = parseFloat(csVP.paddingLeft||'0');
    const padR  = parseFloat(csVP.paddingRight||'0');

    const perView = Math.max(1, Math.floor((viewport.clientWidth - padL - padR + gap*0.5)/step));
    const maxIndex = Math.max(0, items.length - perView);
    return {step, maxIndex, padL};
  };

  let currentIndex = 0;

  function updateUI(maxIndex){
    if(status) status.textContent = `Elemento ${currentIndex+1} de ${items.length}`;
    if(btnPrev) btnPrev.disabled = currentIndex <= 0;
    if(btnNext) btnNext.disabled = currentIndex >= maxIndex;
  }

  function goTo(index, behavior='smooth'){
    const {step, maxIndex, padL} = metrics();
    currentIndex = Math.min(Math.max(index,0), maxIndex);
    viewport.scrollTo({left: padL + currentIndex * step, behavior});
    updateUI(maxIndex);
  }

  // Controles
  btnPrev?.addEventListener('click', ()=> goTo(currentIndex - 1));
  btnNext?.addEventListener('click', ()=> goTo(currentIndex + 1));
  viewport.addEventListener('keydown', e=>{
    if(e.key==='ArrowRight'){ e.preventDefault(); goTo(currentIndex+1); }
    if(e.key==='ArrowLeft'){  e.preventDefault(); goTo(currentIndex-1); }
  }, {passive:false});

  // Al cargar imágenes: posicionar y calcular botones
  onImagesLoaded(track, ()=> goTo(0,'auto'));

  // En resize: recalcular y mantener el índice visible sin forzar snap
  window.addEventListener('resize', debounce(()=>{ goTo(currentIndex,'auto'); }, 150));

  // Scroll del usuario: actualizar índice/estado (sin reposicionar)
  viewport.addEventListener('scroll', debounce(()=>{
    const {step, maxIndex, padL} = metrics();
    const idx = Math.min(
      Math.max(Math.round((viewport.scrollLeft - padL)/step), 0),
      maxIndex
    );
    if(idx !== currentIndex){
      currentIndex = idx;
      updateUI(maxIndex);
    }
  }, 120), {passive:true});
}


/* ====== Catálogo con paginación (10 por página) ====== */
function initCatalog(){
  const grid       = $('#grid');
  const qInput     = $('#q');
  const catSelect  = $('#cat');
  const sortSelect = $('#sort');
  const clearBtn   = $('#clear');
  const live       = $('#catalog-live');

  // Paginación
  const pager      = $('#pager');
  const btnPrev    = $('#page-prev');
  const btnNext    = $('#page-next');
  const pageCount  = $('#page-count');

  if(!grid || !qInput || !catSelect || !sortSelect || !live || !pager) return;

  const PAGE_SIZE = 10;
  let currentPage = 1;
  let filtered = [];   // estado después de filtros/orden

  const waLink = p => {
    const msg = encodeURIComponent(`Hola EVOLUM, quiero consultar sobre: ${p.name} (${moneyPYG(p.price)})`);
    return `https://wa.me/595981838707?text=${msg}`;
  };

  // Renderiza sólo los ítems de la página actual
  function renderGridPage(){
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = filtered.slice(start, start + PAGE_SIZE);

    if (slice.length === 0){
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px 0">No se encontraron productos con esos criterios.</p>';
    } else {
      grid.innerHTML = slice.map(p => `
        <article class="p-card" role="listitem">
          <figure class="p-media">
            <img class="p-img" src="${p.img || 'assets/img/evologo.png'}" alt="${p.name}" loading="lazy" decoding="async"
                 onerror="this.onerror=null;this.src='assets/img/evologo.png'">
          </figure>
          <div class="p-body">
            <h3 class="p-title">${p.name}</h3>
            <p class="p-price">${moneyPYG(p.price)}</p>
            <a href="${waLink(p)}" target="_blank" rel="noopener" class="e-btn e-btn--primary ripple" style="width:100%;margin-top:8px">Consultar</a>
          </div>
        </article>
      `).join('');
    }

    // Estado del aria-live
    live.textContent = `${filtered.length} resultados. Mostrando página ${currentPage} de ${totalPages}.`;

    // Estado de los botones
    if (pageCount) pageCount.textContent = `Página ${currentPage} de ${totalPages}`;
    if (btnPrev)   btnPrev.disabled = currentPage <= 1;
    if (btnNext)   btnNext.disabled = currentPage >= totalPages;
  }

  // Aplica filtros + orden y resetea a página 1
  function applyFilters(){
    const q   = qInput.value.trim();
    const cat = catSelect.value;
    const sort= sortSelect.value;

    filtered = products.filter(p=>{
      let matchQuery = true;
      if(q !== ''){
        const terms = expandSearchTerms(q);
        matchQuery = smartSearch(p, terms);
      }
      const matchCat = (cat === 'all') || (p.cat === cat);
      return matchQuery && matchCat;
    });

    if (sort === 'price-asc')      filtered.sort((a,b)=> a.price - b.price);
    else if (sort === 'price-desc')filtered.sort((a,b)=> b.price - a.price);
    else if (sort === 'name-asc')  filtered.sort((a,b)=> a.name.localeCompare(b.name));
    else if (sort === 'name-desc') filtered.sort((a,b)=> b.name.localeCompare(a.name));
    // "recom": deja el orden tal cual está

    currentPage = 1;          // ← al filtrar/ordenar, volvé al inicio
    renderGridPage();
  }

  // Handlers de UI
  const debouncedApply = debounce(applyFilters, 200);
  qInput.addEventListener('input',  debouncedApply);
  catSelect.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
  clearBtn?.addEventListener('click', ()=>{
    qInput.value=''; catSelect.value='all'; sortSelect.value='recom';
    applyFilters();
  });

  // Paginación: botones y teclado
  btnPrev?.addEventListener('click', ()=>{
    currentPage--; renderGridPage();
    grid.scrollIntoView({behavior:'smooth', block:'start'});
  });
  btnNext?.addEventListener('click', ()=>{
    currentPage++; renderGridPage();
    grid.scrollIntoView({behavior:'smooth', block:'start'});
  });
  pager.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft'){  e.preventDefault(); if(!btnPrev.disabled) btnPrev.click(); }
    if(e.key === 'ArrowRight'){ e.preventDefault(); if(!btnNext.disabled) btnNext.click(); }
  });

  // Primera carga
  applyFilters();
}


/* ====== Vista previa de Catálogo (compacta) ====== */
function initCatalogPreview(){
  const wrap = document.getElementById('preview-grid');
  if(!wrap || !Array.isArray(products)) return;

  const by = cat => products.filter(p => p.cat === cat);
  const pick = (arr, n) => arr.slice().sort(() => Math.random() - 0.5).slice(0, n);

  // 8 items: 2 Whey, 2 Creatina, 2 Pre, 2 Otros
  const chosen = [
    ...pick(by('Whey'), 2),
    ...pick(by('Creatina'), 2),
    ...pick(by('Pre'), 2),
    ...pick(by('Otros'), 2),
  ].slice(0, 8);

  const wa = p => `https://wa.me/595981838707?text=${encodeURIComponent(`Hola EVOLUM, quiero consultar sobre: ${p.name} (${moneyPYG(p.price)})`)}`;

  wrap.innerHTML = chosen.map(p => `
    <article class="p-card" role="listitem">
      <figure class="p-media">
        <img class="p-img"
             src="${p.img || 'assets/img/evologo.png'}"
             alt="${p.name}" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='assets/img/evologo.png'">
      </figure>
      <div class="p-body">
        <h3 class="p-title">${p.name}</h3>
        <p class="p-price">${moneyPYG(p.price)}</p>
        <a href="${wa(p)}" target="_blank" rel="noopener"
           class="e-btn e-btn--primary ripple" style="width:100%;margin-top:6px">Consultar</a>
      </div>
    </article>
  `).join('');
}

/* ====== Init ====== */
document.addEventListener('DOMContentLoaded', ()=>{
  initHeroVideo();
  initNav();
  initFAQ();
  initShowcaseCarousel();
  initCatalog();
  initCatalogPreview();
});

// ====== Filtros (chips) + MODAL centrado para guía ======
document.addEventListener('DOMContentLoaded', () => {
  const chips = Array.from(document.querySelectorAll('.sup-chips .chip'));
  const cards = Array.from(document.querySelectorAll('.sup-grid .sup-card'));
  if (chips.length && cards.length){
    chips.forEach(ch => ch.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      ch.classList.add('is-active');
      const cat = ch.dataset.chip;
      cards.forEach(card => {
        const match = (cat === 'all') || (card.dataset.cat === cat);
        card.style.display = match ? '' : 'none';
      });
    }));
  }

  // ====== Modal (centrado y sin saltos) ======
  const openBtns = document.querySelectorAll('.sup-more');
  openBtns.forEach(btn => btn.addEventListener('click', () => {
    // Evita abrir modal en desktop
    if (window.matchMedia('(min-width: 860px)').matches) return;

    // Mantener el disparador en el viewport (centro) — evita que "salte"
    const card = btn.closest('.sup-card');
    try { card?.scrollIntoView({block:'center', inline:'nearest', behavior:'auto'}); } catch(e){}

    const id = btn.getAttribute('data-target');
    const modal = document.getElementById(id);
    if (!modal) return;

    const sheet = modal.querySelector('.sup-modal__sheet');
    const closeBtn = modal.querySelector('.sup-modal__close');

    // Mostrar + bloquear scroll fondo
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Centrar y evitar que aparezca en el fondo de la página (iOS fix)
    modal.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    sheet.scrollTop = 0;
    sheet.focus();

    // Cerrar: click fuera
    const onBackdrop = (e) => { if (e.target === modal) close(); };
    modal.addEventListener('click', onBackdrop);

    // Cerrar: botón X
    const onCloseBtn = () => close();
    closeBtn.addEventListener('click', onCloseBtn, { once: true });

    // Cerrar: ESC
    const onKey = (ev) => { if (ev.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);

    // Trap de foco simple
    const focusables = 'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const cycleFocus = (ev) => {
      if (ev.key !== 'Tab') return;
      const els = Array.from(sheet.querySelectorAll(focusables)).filter(el => !el.disabled && el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    };
    sheet.addEventListener('keydown', cycleFocus);

    function close(){
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      modal.removeEventListener('click', onBackdrop);
      document.removeEventListener('keydown', onKey);
      sheet.removeEventListener('keydown', cycleFocus);
      btn.focus(); // devolver foco al disparador
    }
  }));
});
