/* PlayboxTV – TV prototype engine.
   Focus-driven navigation (no scrolling, no mouse): the keyboard simulates a TV remote D-Pad.
   Arrow keys = D-Pad | Enter = OK (hold = long-press) | Delete/Backspace = Back | Esc = ignored. */
(function(){
'use strict';

/* ================= constants ================= */
const LEFT = 180, GAP = 24, TOPBAND = 124;            // rail left edge, card gap, title block height (48+52+24)
const SW = 1920, SH = 1080;
/* Images that are genuinely high-res landscape: used full-bleed as the backdrop. Everything else is shown as a crisp
   portrait poster on the right with a soft colour wash behind it (so low-res art is never stretched). */
const LANDSCAPE = new Set(['friends','herapheri','viratkohli','ronaldo','messi','f1sunset']);

/* Card geometry per rail type (design px). fw/fh = focused size, cy = screen Y of the card-row centre when focused,
   mode 'a' = full backdrop + title/description appear above the rail, 'b' = plain dark page. */
const TYPES = {
  poster:   {w:240,h:352,fw:326,fh:442,cy:805,mode:'a'},
  posterSm: {w:240,h:300,fw:312,fh:390,cy:805,mode:'a'},
  ottrail:  {w:240,h:356,fw:326,fh:442,cy:805,mode:'a'},         // no title/panel-less when focused: becomes a "Top Picks" style rail
  sports:   {w:372,h:209,fw:474,fh:265,cy:693,mode:'a',fx:70},
  upcoming: {w:504,h:315,fw:554,fh:347,cy:830,mode:'a'},
  cw:       {w:240,h:352,k:1.15,ch:384,cy:520,mode:'b'},
  stream:   {w:636,h:400,fw:771,fh:487,cy:506,mode:'b'},
  genre:    {w:240,h:327,fw:326,fh:442,cy:518,mode:'b'},
  live:     {w:174,h:174,fw:217,fh:217,cy:520,mode:'b'},
  banner:   {w:1568,h:591,fw:1568,fh:591,mode:'b'},
  spot:     {w:220,h:300,fw:600,fh:338,mode:'b',notitle:true,rowTop:490,focusX:657,fslot:520},   // 9:16 card grows into a 16:9 card on focus; focus stays at x=657, cards slide behind it
  hero:     {mode:'h'},
  otts:     {w:108,h:108,mode:'h'},
};

/* ================= icons ================= */
const svg = p => `<svg class="i" viewBox="0 0 24 24">${p}</svg>`;
const I = {
  lock:   `<svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3" style="fill:none;stroke:currentColor;stroke-width:2.4"/></svg>`,
  play:   `<svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M7 4.5v15l13-7.5z"/></svg>`,
  bell:   svg('<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>'),
  check:  svg('<path d="m5 12.5 5 5 9-11"/>'),
  user:   svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.6-4 3.8-6 7.5-6s6.900 2 7.500 6"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20.500 20.500-4.500-4.500"/>'),
  compass:svg('<circle cx="12" cy="12" r="9"/><path d="m15.800 8.200-2.100 5.500-5.500 2.100 2.100-5.500z"/>'),
  layers: svg('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.500 9 5 9-5"/><path d="m3 17 9 5 9-5"/>'),
  info:   svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500h.01"/>'),
  up:     svg('<path d="M7 11v9H4v-9z"/><path d="m7 11 4-8c2 0 3 1.500 2.500 3.500L13 10h6a2 2 0 0 1 2 2.300l-1.200 6A2 2 0 0 1 17.800 20H7"/>'),
  down:   `<svg class="i" viewBox="0 0 24 24" style="transform:rotate(180deg)"><path d="M7 11v9H4v-9z"/><path d="m7 11 4-8c2 0 3 1.500 2.500 3.500L13 10h6a2 2 0 0 1 2 2.300l-1.200 6A2 2 0 0 1 17.800 20H7"/></svg>`,
  heart:  svg('<path d="M12 20s-7.500-4.600-9.200-9.400A5 5 0 0 1 12 7.500a5 5 0 0 1 9.200 3.100C19.500 15.400 12 20 12 20z"/>'),
  plus:   svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  back:   svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  phone:  svg('<rect x="7" y="3" width="10" height="18" rx="2"/>'),
  tv:     svg('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>'),
  laptop: svg('<rect x="5" y="5" width="14" height="10" rx="1.500"/><path d="M3 19h18"/>'),
};

/* ================= helpers ================= */
const $ = (s, r) => (r||document).querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; };
const stage = $('#stage'), pageEl = $('#page'), detailsEl = $('#details'), navEl = $('#nav'), bdEl = $('#bd');
const ottLogo = k => `assets/l/${k}.png`;
/* The Sintel trailer has cinema-scope (2.35:1) black bars baked into its 16:9 frame. Scaling it up crops them away so the
   footage fills the whole screen. Other clips are true 16:9 and need no crop. */
const CLIP_SCALE = {'assets/v/trailer.mp4': 1.36};
const clipFit = (video, src) => { video.style.transform = CLIP_SCALE[src] ? `scale(${CLIP_SCALE[src]})` : ''; };
let toastTimer = null;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2200); }

function fit(){ const s = Math.min(innerWidth / SW, innerHeight / SH); stage.style.transform = `translate(-50%,-50%) scale(${s})`; }
addEventListener('resize', fit); fit();

/* ================= state ================= */
const SECS = SECTIONS;
const S = { zone:'page', sec:0, idx:{}, nav:2, overlay:null, ov:0, slide:0, trailer:false, ott:0, menuItem:null };
SECS.forEach(s => { s.T = TYPES[s.type]; S.idx[s.id] = 0; });
const sec = id => SECS.find(s => s.id === id);
const curSec = () => SECS[S.sec];
const curItem = () => { const s = curSec(); return s.items[S.idx[s.id]]; };
const ys = new Array(SECS.length).fill(0);

/* ================= geometry ================= */
function itemW(s, it){ return it.w || s.T.w; }
function itemH(s, it){ return it.h || s.T.h; }
function focusSize(s, it){
  const T = s.T, w = itemW(s,it), h = itemH(s,it);
  if(s.id === 'otts') return [160,160];
  if(T.k) return [Math.round(w*T.k), Math.round(h*T.k)];
  return [T.fw, T.fh];
}
function computeXs(s){
  const gap = s.id === 'otts' ? 48 : GAP; let x = 0; s.xs = [];
  s.items.forEach(it => { s.xs.push(x); x += itemW(s,it) + gap; });
}
function heights(s){
  const T = s.T;
  if(s.id === 'hero') { s.h = s.he = 776; return; }
  if(s.id === 'otts') { s.h = s.he = 228; return; }
  if(s.type === 'ottrail') { s.h = 48 + T.h + 48; s.he = TOPBAND + T.fh + 48; return; }   // collapsed: panel, no title. focused: titled rail
  if(s.type === 'banner') { s.h = s.he = 687; return; }
  if(s.type === 'spot')   { s.h = s.he = 970; return; }
  const ch = T.ch || T.h, fh = T.k ? Math.round(T.h*T.k) : T.fh;
  s.h  = TOPBAND + ch + 48;
  s.he = TOPBAND + (ch - T.h) + fh + (T.fx||0) + 48;
}
function anchor(i){
  const s = SECS[i], T = s.T;
  if(s.id === 'hero') return 0;
  if(s.id === 'otts') return 86;
  if(s.type === 'banner') return 204;
  if(s.type === 'spot') return -20;
  const fh = T.k ? Math.round(T.h*T.k) : T.fh;
  if(T.notitle) return T.cy - 48 - fh/2;
  return T.cy - TOPBAND - fh/2;
}

/* ================= building ================= */
function ottBadge(s, it){ const k = s.ottBadge || it.ott; return k ? `<div class="badge r${s.type==='sports'?' tr':''}" ${s.type==='sports'?'style="top:12px;bottom:auto"':''}><img src="${ottLogo(k)}" alt=""></div>` : ''; }
function cardInner(s, it){
  const bg = `background-image:url(${it.bdImg || it.img})`;
  switch(s.type){
    case 'genre':
      return `<div class="img" style="${bg};background-position:${it.pos||'center'}"><div class="g-tint" style="--c:${it.c}"></div><div class="g-label" style="--c:${it.c}">${it.t}</div></div>`;
    case 'stream':
      return `<div class="img noshade"><div class="kb" style="${bg}"></div><div class="stgrad"></div><div class="stpill">STREAM</div>
        <div class="stplay">${I.play}</div><div class="eq"><i></i><i></i><i></i></div>
        <div class="sttxt"><small>Currently Playing</small><b>${it.t}</b></div><div class="prog"><i style="--p:${Math.round(((it.t.length*7)%55)+8)}%"></i></div></div>`;
    case 'live':
      return `<div class="tile"><div class="plate"><img src="${it.logo}" alt=""></div></div>`;
    case 'upcoming':
      return `<div class="img" style="${bg}"></div><div class="tag u-date">${it.date}</div>
        <div class="u-ott"><img src="${ottLogo(it.ott)}" alt=""></div>
        <div class="remind${it.reminder?' set':''}">${it.reminder ? I.check + '<span>Reminder Set</span>' : I.bell + '<span>Remind Me</span>'}</div>`;
    case 'sports':
      return `<div class="img" style="${bg}"></div>${it.live ? '<div class="live">Live</div>' : ''}${it.locked ? `<div class="badge l">${I.lock}</div>` : ''}${ottBadge(s,it)}`;
    default: { // poster, posterSm, ottrail, cw, spot
      const spotWide = it.spotWide;
      return `<div class="img" style="${bg};background-position:${it.pos || 'center'}"></div>${it.tag ? `<div class="tag">${it.tag}</div>` : ''}${it.locked ? `<div class="badge l">${I.lock}</div>` : ''}${spotWide ? '' : ''}${it.ott || s.ottBadge ? ottBadge(s,it) : ''}${it.progress != null ? `<div class="prog"><i style="--p:${Math.round(it.progress*100)}%"></i></div>` : ''}`;
    }
  }
}
function buildRow(s){
  const T = s.T; s.slots = []; computeXs(s);
  s.rowEl.innerHTML = '';
  s.items.forEach((it, i) => {
    const w = itemW(s,it), h = itemH(s,it);
    const slot = el('div', 'slot'); slot.style.left = s.xs[i] + 'px'; slot.style.width = w + 'px'; slot.style.height = h + 'px';
    if(s.id === 'otts'){
      slot.innerHTML = `<div class="otf" style="width:108px;height:108px"><img src="${ottLogo(it.ott)}" alt=""></div>`;
      slot.face = slot.firstChild;
    } else if(s.type === 'banner'){
      slot.innerHTML = bannerHTML(); slot.face = null;
    } else {
      const face = el('div', 'face' + (s.type==='live' ? ' tf' : '') + (s.type==='stream' ? ' stream' : ''), cardInner(s,it));
      face.style.width = w + 'px'; face.style.height = h + 'px';
      slot.appendChild(face); slot.face = face;
      if(s.type === 'cw'){ const info = el('div','info',`<b>${it.t}</b><span>${it.sub||''}</span>`); slot.appendChild(info); slot.info = info; }
      if(s.type === 'sports'){ const cap = el('div','cap',`<b>${it.t}</b><span>${it.sub||''}</span>`); slot.appendChild(cap); slot.cap = cap; }
    }
    slot.dataset.i = i;
    s.rowEl.appendChild(slot); s.slots.push(slot);
  });
}
function bannerHTML(){
  const fan = [['lokah',-8,190,282,6,62,1],['mangalavaaram',-4,205,296,46,36,2],['f1poster',0,265,328,98,0,5],['vikram',4,205,296,250,36,2],['alpha',8,190,282,300,62,1]];
  const fanHTML = fan.map(([k,rot,w,h,x,y,z]) => `<i style="width:${w}px;height:${h}px;left:${x}px;top:${y}px;z-index:${z};transform:rotate(${rot}deg);background-image:url(assets/p/${k}.jpg)"></i>`).join('');
  return `<div class="banner"><h3>Watch Content from your favourite OTTs</h3>
    <div class="st">Starting at <b>₹99</b> /month</div>
    ${['sunnxt','zee5','jiohotstar'].map((k,i)=>`<div class="oc" style="left:${100+i*118}px"><img src="${ottLogo(k)}" alt=""></div>`).join('')}
    <div class="oc" style="left:${100+3*118}px">+11</div>
    <div class="fan" style="left:660px;width:460px;height:420px">${fanHTML}</div>
    <div class="qrc"><div class="q" style="background-image:url(${ottLogo('qr')})"></div><p>Scan QR Code to<br>Explore Plans</p></div></div>`;
}
function buildSection(s){
  const T = s.T;
  const e = el('div','sec'); s.el = e;
  heights(s);
  if(s.id === 'hero'){
    s.infoEl = el('div','hero-info'); e.appendChild(s.infoEl);
    const cta = el('div','hero-cta', `<div class="btn p">${I.play}<span>Watch Now</span></div><div class="btn s">${I.play}<span>More Info</span></div>`);
    e.appendChild(cta); s.btns = [cta.children[0], cta.children[1]];
    return e;
  }
  if(s.id === 'ottrail'){
    s.panel = el('div','panel'); s.panel.style.height = s.h + 'px'; e.appendChild(s.panel);
    s.titleEl = el('div','sec-title ot-title','Top Picks For You'); e.appendChild(s.titleEl);   // only visible once focus is inside the rail
    s.rowEl = el('div','row'); s.rowEl.style.top = '48px'; e.appendChild(s.rowEl);
    s.items = ottRailItems(OTT_ROW[0].k); buildRow(s); return e;
  }
  if(s.type === 'spot'){
    e.appendChild(el('div','spot-bg')).style.backgroundImage = `url(${s.bg})`;
    const l = el('div','spot-logo'); l.style.backgroundImage = `url(${s.logo})`; e.appendChild(l);
    e.appendChild(el('div','spot-blurb',`<em>NATURE STRIKES BACK</em>${s.blurb}`));
    s.clipEl = el('div','spot-clip'); s.clipEl.style.top = (T.rowTop - 90) + 'px'; s.clipEl.style.height = '560px'; e.appendChild(s.clipEl);   // masks the cards that slide off to the left
    s.rowEl = el('div','row'); s.rowEl.style.top = '90px'; s.clipEl.appendChild(s.rowEl);
    buildRow(s); return e;
  }
  if(s.id === 'otts'){
    const t = el('div','sec-title', s.title); t.style.left = '178px'; t.style.top = '0'; e.appendChild(t);
    s.rowEl = el('div','row'); s.rowEl.style.top = '73px'; e.appendChild(s.rowEl); buildRow(s); return e;
  }
  if(s.title) e.appendChild(el('div','sec-title', s.title));
  s.rowEl = el('div','row'); if(s.type === 'banner') s.rowEl.style.top = '48px'; e.appendChild(s.rowEl);
  buildRow(s); return e;
}

/* hero background + carousel */
const heroBg = el('div'); heroBg.id = 'heroBg';
HERO.forEach(h => { const b = el('div','hb'); b.style.backgroundImage = `url(${h.bg})`; heroBg.appendChild(b); });
/* hero trailer: real (stock) footage that fades in over the banner after 3 s of focus on the hero */
const hv = el('video','hv'); hv.muted = true; hv.loop = true; hv.playsInline = true; hv.preload = 'none'; hv.setAttribute('muted',''); hv.setAttribute('playsinline','');
hv.addEventListener('playing', () => { if(S.trailer) hv.classList.add('on'); });
heroBg.appendChild(hv);
heroBg.appendChild(el('div','shade'));
heroBg.appendChild(el('div','trailer-chip', `<div class="eq" style="display:flex;position:static;height:16px"><i></i><i></i><i></i></div><span>Trailer playing</span>`));
pageEl.appendChild(heroBg);
SECS.forEach(s => pageEl.appendChild(buildSection(s)));

function heroInfoHTML(h){
  const logo = h.logo ? `<div class="hero-logo" style="background-image:url(${h.logo});width:${h.logoW||517}px"></div>` : `<div class="hero-title">${h.title}</div>`;
  return logo + `<div class="meta hero-meta"><span class="rate">${h.rating}</span><i class="sep"></i><span>${h.yr}</span><i class="sep"></i><span>${h.d}</span><i class="sep"></i><span>${h.lang}</span></div>
    <div class="tags hero-tags">${h.g.map(g => `<span class="tag-chip">${g}</span>`).join('')}</div><div class="hero-desc">${h.desc}</div>`;
}
function showSlide(n, instant){
  S.slide = n;
  [...heroBg.querySelectorAll('.hb')].forEach((b,i) => b.classList.toggle('on', i === n));
  const s = sec('hero');
  if(instant){ s.infoEl.innerHTML = heroInfoHTML(HERO[n]); return; }
  s.infoEl.classList.add('swap');
  setTimeout(() => { s.infoEl.innerHTML = heroInfoHTML(HERO[n]); s.infoEl.classList.remove('swap'); }, 230);
}
showSlide(0, true);
setInterval(() => {                       // rotating carousel: pauses while the trailer plays or when the hero is off-screen
  if(S.trailer || S.overlay || S.sec > 1) return;
  showSlide((S.slide + 1) % HERO.length);
}, 7000);
let trailerTimer = null;
function updateTrailer(){
  const onHero = S.zone === 'page' && S.sec === 0 && !S.overlay;
  if(onHero){
    if(!S.trailer && !trailerTimer) trailerTimer = setTimeout(() => {
      trailerTimer = null; S.trailer = true; heroBg.classList.add('trailer');
      if(!hv.getAttribute('src')) hv.src = 'assets/v/trailer.mp4';
      clipFit(hv, 'assets/v/trailer.mp4');
      hv.currentTime = 0; const p = hv.play(); if(p && p.catch) p.catch(() => {});
    }, 3000);
  } else {
    clearTimeout(trailerTimer); trailerTimer = null; S.trailer = false; heroBg.classList.remove('trailer');
    hv.classList.remove('on'); if(!hv.paused) hv.pause();
  }
}

/* streams: one shared video element plays stock footage inside whichever stream card has focus */
const sv = el('video','sv'); sv.muted = true; sv.loop = true; sv.playsInline = true; sv.preload = 'auto'; sv.setAttribute('muted',''); sv.setAttribute('playsinline','');
sv.addEventListener('playing', () => sv.classList.add('on'));
function stopStreamVideo(){ if(sv.parentNode){ sv.pause(); sv.classList.remove('on'); sv.parentNode.removeChild(sv); } }
function updateStreamVideo(){
  const s = curSec();
  if(s.type !== 'stream' || S.zone !== 'page' || S.overlay){ stopStreamVideo(); return; }
  const i = S.idx[s.id], img = s.slots[i].face.querySelector('.img');
  if(sv.parentNode === img) return;
  stopStreamVideo();
  const src = 'assets/v/stream' + ((i % 2) + 1) + '.mp4';
  if(sv.getAttribute('src') !== src){ sv.setAttribute('src', src); }
  clipFit(sv, src);
  img.insertBefore(sv, img.querySelector('.stgrad'));
  sv.currentTime = (i * 2.3) % 8;
  const p = sv.play(); if(p && p.catch) p.catch(() => {});
}

/* ================= sidebar ================= */
const NAV = [{k:'profile',label:'Profile',icon:I.user},{k:'search',label:'Search',icon:I.search},{k:'home',label:'Home',icon:I.compass},{k:'library',label:'Content Library',icon:I.layers}];
navEl.innerHTML = '<div class="bg"></div><div class="logo"></div>';
NAV.forEach((n,i) => { const d = el('div','it'+(n.k==='home'?' active':''), n.icon); d.style.top = (340 + i*92) + 'px'; navEl.appendChild(d); n.el = d; });

/* ================= backdrop + details (rails that show a title above them) ================= */
let bdFlip = 0, lastDetail = null;
function setBackdrop(it){
  let url, full;
  if(it.bd){ url = `assets/b/${it.bd}.jpg`; full = true; }
  else { url = it.img; full = LANDSCAPE.has(it.k); }
  bdFlip ^= 1;
  const layers = bdEl.querySelectorAll('.bdl');
  const L = layers[bdFlip], other = layers[bdFlip ^ 1];
  L.className = 'bdl' + (full ? ' full' : '');
  L.querySelector('.amb').style.backgroundImage = `url(${url})`;
  L.querySelector('.fg').style.backgroundImage = `url(${url})`;
  L.classList.add('on'); other.classList.remove('on');
}
function detailsHTML(s, it){
  const up = s.type === 'upcoming';
  const title = it.logo ? `<div class="d-logo" style="background-image:url(assets/l/${it.logo}.png)"></div>` : `<div class="d-title">${it.t}</div>`;
  const sep = '<i class="sep"></i>';
  let meta;
  if(it.sports) meta = `<span>${it.sub}</span>${sep}<span>${it.d}</span>${sep}<span>${it.lang}</span>`;
  else if(up) meta = `${it.r ? `<span class="rate">${it.r}</span>` : ''}<span>${it.yr}</span>${sep}<span>${it.g[0]}</span>${sep}<span>${it.d}</span>${sep}<span>${it.lang}</span>`;
  else meta = `${it.r ? `<span class="rate">${it.r}</span>${sep}` : ''}<span>${it.yr}</span>${sep}<span>${it.d}</span>${sep}<span>${it.lang}</span>`;
  const tags = (it.sports || up) ? '' : `<div class="tags">${it.g.map(g => `<span class="tag-chip">${g}</span>`).join('')}</div>`;
  const badge = up ? `<div class="d-badge" style="background-image:url(${ottLogo(it.ott)})"></div>` : '';
  return `<div class="sw">${badge}${title}<div class="meta">${meta}</div>${tags}<div class="desc">${it.desc}</div></div>`;
}
function updateDetails(){
  const s = curSec(), on = s.T.mode === 'a';
  bdEl.classList.toggle('on', on); detailsEl.classList.toggle('on', on);
  if(!on) return;
  const it = curItem();
  detailsEl.className = (on ? 'on ' : '') + (s.type === 'upcoming' ? 'm-upcoming' : 'm-poster');
  if(lastDetail === it) return;
  lastDetail = it;
  setBackdrop(it);
  detailsEl.classList.add('swap');
  setTimeout(() => { if(lastDetail === it){ detailsEl.innerHTML = detailsHTML(s, it); detailsEl.classList.remove('swap'); } }, 140);
}

/* ================= focus rendering ================= */
function applyFocus(){
  const cur = S.sec, inPage = S.zone === 'page' || S.overlay;      // keep card enlarged while overlays are open
  stage.classList.toggle('nofocus', S.zone !== 'page' || !!S.overlay);
  stage.classList.toggle('hero-mode', cur === 0);
  SECS.forEach((s, si) => {
    const idx = S.idx[s.id], isCur = si === cur;
    const itemsLen = s.slots ? s.slots.length : 0;
    // row translation: focused card sits at the left edge, the rail slides through it
    if(s.rowEl && itemsLen){
      const anchorX = s.id === 'otts' ? 178 : LEFT;
      let ty = 0, tx = anchorX - s.xs[idx];
      if(isCur && s.id !== 'otts' && s.id !== 'spot'){ const [fw, fh] = focusSize(s, s.items[idx]); ty = (fh - itemH(s, s.items[idx])) / 2; }
      if(s.id === 'ottrail' && isCur) ty += 76;          // row drops from "panel" position (top 48) to "titled rail" position (top 124)
      if(s.id === 'spot'){                               // focus card stays put (x=657); the cards slide left behind a soft mask
        let x = 0;
        s.items.forEach((it, j) => {                     // the focused slot is 16:9-wide, the others stay 9:16
          const w = j === idx ? s.T.fslot : itemW(s, it);
          s.xs[j] = x; s.slots[j].style.left = x + 'px'; s.slots[j].style.width = w + 'px'; x += w + GAP;
        });
        tx = s.T.focusX - s.xs[idx];
      }
      s.rowEl.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    }
    if(s.btns){ s.btns.forEach((b,i) => { b.classList.toggle('f', isCur && inPage && S.zone==='page' && i === idx); b.classList.toggle('dimmed', !isCur); }); return; }
    (s.slots||[]).forEach((slot, i) => {
      const it = s.items[i], foc = isCur && i === idx;
      slot.classList.toggle('f', foc);
      if(s.id === 'otts'){                                  // the selected OTT stays big + red even when focus is elsewhere
        const sel = i === idx; slot.classList.toggle('sel', sel); slot.style.zIndex = sel ? 6 : '';
        slot.face.style.width = slot.face.style.height = (sel ? 160 : 108) + 'px'; return;
      }
      const [w,h] = foc ? focusSize(s,it) : [itemW(s,it), itemH(s,it)];
      if(slot.face){ slot.face.style.width = w + 'px'; slot.face.style.height = h + 'px'; }
      if(slot.info) slot.info.style.transform = foc ? `translateY(${(h - itemH(s,it))/2}px)` : '';
      if(slot.cap)  slot.cap.style.transform  = foc ? `translateY(${itemH(s,it)/2 + h/2 + 14}px)` : '';
      if(s.type === 'stream' && slot.face) slot.face.classList.toggle('playing', foc);   // simulated in-card playback
    });
  });
  NAV.forEach((n,i) => n.el.classList.toggle('f', S.zone === 'nav' && i === S.nav));
}
function layout(){
  const f = S.sec;
  ys[f] = anchor(f);
  for(let i = f+1; i < SECS.length; i++) ys[i] = ys[i-1] + (i-1 === f ? SECS[f].he : SECS[i-1].h);
  for(let i = f-1; i >= 0; i--) ys[i] = ys[i+1] - SECS[i].h;
  const hideAbove = SECS[f].T.mode === 'a';          // rails with a backdrop: nothing above them stays on screen
  SECS.forEach((s,i) => { s.el.style.transform = `translate3d(0,${ys[i]}px,0)`; s.el.classList.toggle('dim', i !== f); s.el.classList.toggle('gone', hideAbove && i < f); });
  heroBg.style.transform = `translate3d(0,${ys[0]}px,0)`;
  heroBg.style.opacity = f <= 1 ? 1 : 0;
  const rail = sec('ottrail');                               // the red panel disappears once focus enters the rail
  rail.panel.style.opacity = f === 2 ? 0 : 1; rail.titleEl.style.opacity = f === 2 ? 1 : 0;
}
/* rails with a backdrop: stay on one card for 3 s and its "trailer" (stock footage for now) starts playing in the backdrop */
const bdv = $('#bdv'), bv = bdv.querySelector('video');
const CLIPS = ['assets/v/trailer.mp4','assets/v/stream1.mp4','assets/v/stream2.mp4'];
let bvTimer = null, bvKey = null;
bv.addEventListener('playing', () => { if(bvKey) bdv.classList.add('on'); });
function stopBackdropVideo(){ bdv.classList.remove('on'); if(!bv.paused) bv.pause(); }
function startBackdropVideo(it){
  let h = 7; for(const ch of (it.k || it.t || 'x')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const src = CLIPS[h % CLIPS.length];
  if(bv.getAttribute('src') !== src) bv.setAttribute('src', src);
  clipFit(bv, src);
  try { bv.currentTime = (h % 6); } catch(e) {}
  const p = bv.play(); if(p && p.catch) p.catch(() => {});
}
function updateBackdropVideo(){
  const s = curSec(), eligible = s.T.mode === 'a' && S.zone === 'page' && !S.overlay;
  const key = eligible ? s.id + ':' + S.idx[s.id] : null;
  if(key === bvKey) return;                              // still on the same card: keep the timer / video running
  bvKey = key; clearTimeout(bvTimer); stopBackdropVideo();
  if(key){ const it = curItem(); bvTimer = setTimeout(() => { if(bvKey === key) startBackdropVideo(it); }, 3000); }
}

function render(){ layout(); applyFocus(); updateDetails(); updateTrailer(); updateStreamVideo(); updateBackdropVideo(); }

function refreshOttRail(){
  const k = OTT_ROW[S.idx.otts].k;
  if(S.ott === k) return; S.ott = k;
  const r = sec('ottrail'); r.items = ottRailItems(k); S.idx.ottrail = 0;
  r.rowEl.style.opacity = 0;
  setTimeout(() => { buildRow(r); applyFocus(); r.rowEl.style.opacity = 1; }, 120);
}

/* ================= navigation ================= */
function setFocus(si, ii){
  S.sec = si; S.idx[SECS[si].id] = ii;
  if(SECS[si].id === 'otts') refreshOttRail();
  render();
}
function move(dir){
  if(S.overlay) return overlayMove(dir);
  if(S.zone === 'nav'){
    if(dir === 'up') S.nav = Math.max(0, S.nav - 1);
    else if(dir === 'down') S.nav = Math.min(NAV.length - 1, S.nav + 1);
    else if(dir === 'right') S.zone = 'page';
    return render();
  }
  const s = curSec(), n = s.items.length, i = S.idx[s.id];
  if(dir === 'left'){ if(i > 0) setFocus(S.sec, i-1); else { S.zone = 'nav'; S.nav = 2; render(); } }
  else if(dir === 'right'){ if(i < n-1) setFocus(S.sec, i+1); }
  else if(dir === 'up'){ if(S.sec > 0) setFocus(S.sec-1, SECS[S.sec-1].id === 'hero' ? 0 : S.idx[SECS[S.sec-1].id]); }
  else if(dir === 'down'){ if(S.sec < SECS.length-1) setFocus(S.sec+1, S.idx[SECS[S.sec+1].id]); }
}

/* ================= overlays ================= */
const scrim = $('#scrim'), drawerSub = $('#drawerSub'), drawerMenu = $('#drawerMenu'), ph = $('#ph');
const MENU = [[I.info,'More Details'],[I.down,'Don’t Like'],[I.up,'Like'],[I.heart,'Love'],[I.plus,'Add to watchlist']];
function buildSubDrawer(){
  const chips = PLAN_OTT_CHIPS.map(([k,p]) => `<div class="chip">Worth<br>${p}<img src="${ottLogo(k)}" alt=""></div>`).join('') + `<div class="chip" style="padding-top:20px">+8<br>More</div>`;
  drawerSub.innerHTML = `<div class="back">${I.back}<span>Back to close</span></div><div class="dh">Subscribe to Start Watching</div>
    <div class="qbox"><div class="q" style="background-image:url(${ottLogo('qr')})"></div><p>Plans starting from ₹99/<br>Month<b>Scan QR Code to Explore<br>All Plans</b></p></div>` +
    PLANS.map(p => `<div class="plan"><div class="r1"><b>${p.name}</b><b><em>₹${p.price}</em><small> /Month</small></b></div>
      <div class="r2"><span>${p.devices}</span><span>Auto-renews | Cancel anytime</span></div><div class="chips">${chips}</div>
      <div class="r3"><span class="pill red">Worth ${p.worth}</span><span class="pill wh">Full HD</span><span style="font-size:24px;display:flex;gap:10px;color:#ddd">${I.phone}${I.laptop}${I.tv}</span><span class="pill" style="margin-left:auto">${p.otts}</span></div></div>`).join('');
}
buildSubDrawer();
function openSub(){ S.overlay = 'sub'; S.ov = 0; scrim.classList.add('on'); drawerSub.classList.add('on'); applyOverlay(); }
function openMenu(){
  const it = curItem(); S.menuItem = it; S.overlay = 'menu'; S.ov = 0;
  drawerMenu.innerHTML = `<div class="back">${I.back}<span>Back to close</span></div><div class="menu-t">${it.t}</div>` + MENU.map(([ic,l]) => `<div class="mi">${ic}<span>${l}</span></div>`).join('');
  scrim.classList.add('on'); drawerMenu.classList.add('on'); applyOverlay();
}
function placeholder(sub){
  S.overlay = 'ph';
  ph.innerHTML = `<div class="big">Not part of this demo</div><div class="sub">${sub}</div><div class="hint">Press Delete to go back</div>`;
  ph.classList.add('on');
}
function closeOverlay(){
  scrim.classList.remove('on'); drawerSub.classList.remove('on'); drawerMenu.classList.remove('on'); ph.classList.remove('on');
  S.overlay = null; render();
}
function applyOverlay(){
  if(S.overlay === 'menu') [...drawerMenu.querySelectorAll('.mi')].forEach((m,i) => m.classList.toggle('f', i === S.ov));
  if(S.overlay === 'sub')  [...drawerSub.querySelectorAll('.plan')].forEach((m,i) => m.classList.toggle('f', i === S.ov));
  render();
}
function overlayMove(dir){
  if(S.overlay === 'menu'){ if(dir==='up') S.ov = Math.max(0,S.ov-1); if(dir==='down') S.ov = Math.min(MENU.length-1,S.ov+1); applyOverlay(); }
  else if(S.overlay === 'sub'){ if(dir==='up') S.ov = Math.max(0,S.ov-1); if(dir==='down') S.ov = Math.min(PLANS.length-1,S.ov+1); applyOverlay(); }
}
function overlaySelect(){
  if(S.overlay === 'ph') return closeOverlay();
  if(S.overlay === 'sub') return toast('Scan the QR code with your phone to pick a plan');
  if(S.overlay === 'menu'){
    const it = S.menuItem, i = S.ov;
    closeOverlay();
    if(i === 0) return placeholder(`Details page: ${it.t}`);
    toast(['','Got it. We’ll show you less like this','Liked “' + it.t + '”','You love “' + it.t + '”','Added “' + it.t + '” to your watchlist'][i]);
  }
}

/* ================= actions ================= */
function onSelect(){
  if(S.overlay) return overlaySelect();
  if(S.zone === 'nav'){
    const n = NAV[S.nav];
    if(n.k === 'home'){ S.zone = 'page'; return setFocus(0, 0); }
    return placeholder(n.label + ' screen');
  }
  const s = curSec(), it = curItem();
  switch(s.type){
    case 'hero':   return placeholder((S.idx.hero === 0 ? 'Playback: ' : 'Details page: ') + (HERO[S.slide].title || ({gadar:'Gadar 2',f1:'F1: The Movie',interstellar:'Interstellar'})[HERO[S.slide].key]));
    case 'otts':   return setFocus(S.sec + 1, 0);
    case 'banner': return openSub();
    case 'upcoming': it.reminder = !it.reminder; refreshCard(s, S.idx[s.id]); return toast(it.reminder ? `Reminder set for “${it.t}”` : `Reminder removed for “${it.t}”`);
    case 'genre':  return placeholder(`Browse genre: ${it.t}`);
    case 'live':   return placeholder(`Live channel playback: ${it.t}`);
    default:       return it.locked ? openSub() : placeholder(`Playback: ${it.t}`);
  }
}
function refreshCard(s, i){
  const slot = s.slots[i];
  slot.face.innerHTML = cardInner(s, s.items[i]);
}
const HOLDABLE = new Set(['poster','posterSm','ottrail','cw','stream','sports','upcoming','spot']);
function canHold(){ return !S.overlay && S.zone === 'page' && HOLDABLE.has(curSec().type); }
function onBack(){
  if(S.overlay) return closeOverlay();
  if(S.zone === 'page'){ S.zone = 'nav'; S.nav = 2; render(); }
}

/* ================= keyboard (remote) ================= */
const DIRS = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
const lastMove = {};
let enterTimer = null, pendingSelect = false, heldDone = false;
addEventListener('keydown', e => {
  const k = e.key;
  if(DIRS[k]){
    e.preventDefault();
    const d = DIRS[k], now = performance.now(), gap = (d === 'up' || d === 'down') ? 230 : 95;
    if(e.repeat && now - (lastMove[d]||0) < gap) return;
    lastMove[d] = now; move(d); return;
  }
  if(k === 'Enter'){ e.preventDefault(); if(e.repeat || enterTimer) return;
    heldDone = false; pendingSelect = false;
    enterTimer = setTimeout(() => { enterTimer = null; if(canHold()){ heldDone = true; openMenu(); } else pendingSelect = true; }, 600);
    return; }
  if(k === 'Backspace' || k === 'Delete'){ e.preventDefault(); if(!e.repeat) onBack(); return; }
  if(k === 'Escape') return;                                    // Esc is intentionally not "Back"
  if(k === ' ' || k === 'Tab' || k.startsWith('Page') || k === 'Home' || k === 'End') e.preventDefault();
}, true);
addEventListener('keyup', e => {
  if(e.key !== 'Enter') return;
  e.preventDefault();
  if(enterTimer){ clearTimeout(enterTimer); enterTimer = null; onSelect(); }
  else if(pendingSelect){ pendingSelect = false; onSelect(); }
  else heldDone = false;
}, true);
addEventListener('blur', () => { clearTimeout(enterTimer); enterTimer = null; pendingSelect = false; });
['wheel','mousedown','click','contextmenu','dblclick'].forEach(t => addEventListener(t, e => e.preventDefault(), {capture:true, passive:false}));

/* ================= go ================= */
S.ott = OTT_ROW[0].k;
S.sec = 0;
render();
window.__tv = { S, SECS, setFocus };   // handy for debugging in the console
})();
