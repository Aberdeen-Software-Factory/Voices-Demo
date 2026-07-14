/* ── PAGE ROUTING ── */
const TOOLKIT_PAGES = new Set(['p-kc','p-change','p-calc','p-atys','p-res']);
let lastToolkitHash = '#p-kc';
let lastResHash = null; // tracks resources state independently

const SURVEY_LINK = "https://forms.microsoft.com/Pages/ResponsePage.aspx?id=rRkrjJxf1EmQdz7Dz8UrPz6elmDLCO9MlKQxuxbQCT5UNDNLWE0wR0dPNENONTBDUzNESFlZUFJTTS4u"

/* ── Survey nudge timer ── */
let _surveyNudged=false, _surveyTimer=null, _calcAccum=0, _calcEnter=null;
let _currentPage='p-home';

function trackVirtualPageView(){
  if(typeof window.gtag !== 'function') return;
  window.gtag('event','page_view',{
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.hash
  });
}

function _calcStart(){
  if(_surveyNudged) return;
  _calcEnter=Date.now();
  const remaining=Math.max(0,120000-_calcAccum);
  _surveyTimer=setTimeout(()=>{
    _surveyNudged=true;
    const btn=document.getElementById('surveyFloatBtn');
    if(!btn) return;
    btn.classList.add('survey-float-btn--nudge');
    btn.addEventListener('animationend',()=>btn.classList.remove('survey-float-btn--nudge'),{once:true});
  },remaining);
}

function _calcStop(){
  if(_calcEnter){_calcAccum+=Date.now()-_calcEnter;_calcEnter=null;}
  clearTimeout(_surveyTimer);
}

function goToToolkit(){
  if(lastToolkitHash.startsWith('#p-res')){
    // DOM state of the resources page is already correct — just re-show it
    showPage('p-res', false);
    history.pushState(null,'',lastToolkitHash);
    trackVirtualPageView();
  } else {
    _routeHash(lastToolkitHash, true);
  }
}

function closeMobile(){
  document.getElementById('mobile-menu').classList.remove('open');
}

function openToolkitMenu(){
  document.getElementById('toolkit-menu').classList.add('open');
}

function closeToolkitMenu(){
  document.getElementById('toolkit-menu').classList.remove('open');
}

window.matchMedia('(max-width: 900px)').addEventListener('change', e => {
  if (!e.matches) closeToolkitMenu();
});

function showPage(id, _push=true){
  const isToolkit = TOOLKIT_PAGES.has(id);

  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));

  // Main nav active state
  document.querySelectorAll('.nl').forEach(b=>{
    if(b.id==='nl-toolkit'){
      b.classList.toggle('active', isToolkit);
    } else {
      b.classList.toggle('active', b.dataset.page===id);
    }
  });

  // Sub-nav active state (in pg-hdr of each toolkit page)
  document.querySelectorAll('.snl').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===id);
  });

  // Mobile nav active state
  document.querySelectorAll('#mobile-menu button').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===id);
  });

  if(_currentPage==='p-calc' && id!=='p-calc') _calcStop();
  if(id==='p-calc' && _currentPage!=='p-calc') { _calcStart(); requestAnimationFrame(_initModeIndicator); }
  _currentPage=id;
  if(isToolkit && id !== 'p-res') lastToolkitHash = '#'+id;
  closeToolkitMenu();
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  if(id==='p-home') setTimeout(animateCards, 100);
  if(id==='p-res' && (!lastResHash || !lastResHash.startsWith('#p-res/'))) showResView('res-home');
  document.getElementById('nav').classList.remove('scrolled');
  if(_push){
    history.pushState(null,'','#'+id);
    trackVirtualPageView();
  }
}

/* ── RESOURCES VIEW SYSTEM ── */
let _resCat='patient';

/* ================================================================
   RESOURCE DATA — edit each object to customise an individual resource.
   Fields:
     cat   : 'patient' | 'primary' | 'nurse'
     title : title shown on the card and in the detail panel
     desc  : description (HTML allowed) shown on card and in detail
     img   : path to thumbnail image
     links : array of { label, href } — one button per link in the detail panel
             e.g. links: [
               { label: 'Visit website', href: 'https://...' },
               { label: 'Download PDF',  href: 'https://...' }
             ]
   ================================================================ */
const _RESOURCES=[

  /* ── Patient experience and service improvement ── */
  {
    cat  : 'patient',
    title: 'Health Experiences Insight (HEXI) – patient experience resource',
    img  : 'Figures/VOICES-logo.PNG',
    desc : `
      <p>A patient experience resource developed as part of the VOICES programme of research, covering:</p>
      <ul>
        <li>Challenges of getting to a systemic vasculitis diagnosis</li>
        <li>Managing systemic vasculitis flares and seeking help</li>
        <li>Systemic vasculitis and relationships with healthcare staff</li>
        <li>Coordination and organisation of systemic vasculitis care</li>
        <li>Services to help people live with systemic vasculitis</li>
        <li>Messages about systemic vasculitis for healthcare professionals</li>
      </ul>`,
    links: [
      { label: 'Systemic Vasculitis – Overview', 
        href: 'https://www.hexi.ox.ac.uk/Systemic-Vasculitis/overview' },
    ]
  },
  {
    cat  : 'patient',
    title: 'Health Experiences Insight (HEXI) – catalyst film to support local service improvements',
    img  : 'Figures/VOICES-logo.PNG',
    desc : `As part of the same work, we developed a 20-minute film to be used in imaginative ways as a 'catalyst' to get local patients, families and NHS staff talking together about your service and how you can jointly improve people's experiences.`,
    links: [
      { label: 'Systemic Vasculitis catalyst film', 
        href: 'https://www.hexi.ox.ac.uk/Systemic-Vasculitis-catalyst-film' }
    ]
  },

  /* ── Primary care recognition and referral ── */
  {
    cat  : 'primary',
    title: 'Easily missed? ANCA associated vasculitis',
    img  : 'Figures/VOICES-logo.PNG',
    links: [
      { label: 'ANCA associated vasculitis | The BMJ', 
        href: 'https://www.bmj.com/content/369/bmj.m1070' }
    ]
  },
  {
    cat  : 'primary',
    title: 'Health Improvement Scotland Right Decision Service',
    img  : 'Figures/VOICES-logo.PNG',
    links: [
      { label: ' Vasculitis Referral Guideline | Right Decisions (NHS Lanarkshire', 
        href: 'https://rightdecisions.scot.nhs.uk/nhsl-referral-pathways/rheumatology-referral-pathways/vasculitis-referral-guideline/' },
      { label: 'Suspected vasculitis | Right Decisions (NHS GGC)', 
        href: 'https://rightdecisions.scot.nhs.uk/ggc-referral-management/rheumatology/refer-to-rheumatology/suspected-vasculitis/' },
    ]
  },

  /* ── Specialist Vasculitis Nurse roles ── */
  {
    cat  : 'nurse',
    title: 'Job Descriptions',
    img  : 'Figures/VOICES-logo.PNG',
    desc : 'Example job descriptions, patient information and training resources to support development of specialist nurse roles. ',
    links: [
      { label: 'Specialist Vasculitis Nurse Job Description (attached file) ', 
        href: '#' },
      { label: 'Specialist Vasculitis Nurse | Job advert | Trac (posted 19/326, now closed, this has links to pdfs of the job description and person specification) ', 
        href: 'https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapps.trac.jobs%2Fjob-advert%2F7820723%3Ffeedid%3D9002&data=05%7C02%7Cavril.nicoll%40abdn.ac.uk%7Caa6cebef854d41341f6608deb0273825%7C8c2b19ad5f9c49d490773ec3cfc52b3f%7C0%7C0%7C639141879642329902%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=GnmiUAnaVwzA5ksFyikhWWJjzmb6XyqOzb0yKGz5FAI%3D&reserved=0' }
    ]
  },
  {
    cat  : 'nurse',
    title: 'Information for patients ',
    img  : 'Figures/VOICES-logo.PNG',
    links: [
      { label: 'Specialist Vasculitis Nurse Role - information leaflet NHS for patients (will send on when get proper PDF -currently just have a photocopy)', 
        href: '#' }
    ]
  },
  {
    cat  : 'nurse',
    title: 'Training resources ',
    img  : 'Figures/VOICES-logo.PNG',
    desc : 'NHS patient information leaflet explaining the Specialist Vasculitis Nurse role and how patients can access and benefit from the service.',
    links: [
      { label: 'Vasculitis Nurse Training | Cambridge VLRT', 
        href: 'https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.cambridge-vasculitislupuscentre.nhs.uk%2Fcourses%2Fvasculitis-nurse-training%2F&data=05%7C02%7Cavril.nicoll%40abdn.ac.uk%7Caa6cebef854d41341f6608deb0273825%7C8c2b19ad5f9c49d490773ec3cfc52b3f%7C0%7C0%7C639141879642363351%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=m9YUSxvZa0DI0M5m7AZFxPY2sSqaTnNc9bI7Sgd%2Bbps%3D&reserved=0' },
      { label: 'Psychological and self-management support for people with vasculitis or connective tissue diseases: UK health professionals\' perspectives | Rheumatology Advances in Practice | Oxford Academic ', 
        href: 'https://academic.oup.com/rheumap/article/4/2/rkaa016/5847602' },
    ]
  },
];

function _buildResGrid(){
  const grid=document.getElementById('res-grid');
  if(!grid) return;
  grid.innerHTML=_RESOURCES.map((r,i)=>`
    <div class="res-card" data-cat="${r.cat}" data-res-idx="${i}" onclick="openResource(this)">
      <div class="res-card-img"><img src="${r.img||''}" alt=""></div>
      <div class="res-card-title">${r.title}</div>
      <div class="res-card-desc">${r.desc||''}</div>
      <div class="res-meta"></div>
    </div>`).join('');
}

const _RES_CATS=[
  {cat:'patient',label:'Patient experience and service improvement',
   desc:'Resources to support use of patient experience data, including the systemic vasculitis experience resource and catalyst film. '},
  {cat:'primary',label:'Primary care recognition and referral',
   desc:'Resources to support earlier recognition of vasculitis and referral into specialist care.'},
  {cat:'nurse',  label:'Specialist Vasculitis Nurse roles',
   desc:'Resources to support earlier recognition of vasculitis and referral into specialist care. '}
];

function _animateIn(el){
  if(!el)return;
  void el.offsetWidth;
  el.classList.add('res-view-in');
  el.addEventListener('animationend',()=>el.classList.remove('res-view-in'),{once:true});
}

/* Build sidebar once: category heading + resource links under each */
function _buildSidebarResources(){
  const nav=document.getElementById('res-sidebar-links');
  if(!nav) return;
  nav.innerHTML=_RES_CATS.map(({cat,label})=>{
    const cards=[...document.querySelectorAll(`#res-grid .res-card[data-cat="${cat}"]`)];
    const items=cards.map((card,i)=>{
      const title=card.querySelector('.res-card-title')?.textContent.trim()||'';
      return `<a class="res-sidebar-item" data-cat="${cat}" data-idx="${i}" href="#"
        onclick="openResFromSidebar('${cat}',${i});return false">${title}</a>`;
    }).join('');
    return `<div class="res-sidebar-cat">
      <button class="res-cat-sidebar-btn${cat===_resCat?' active':''}" data-cat="${cat}"
        onclick="filterResCategory('${cat}')">${label}</button>
      <div class="res-sidebar-items">${items}</div>
    </div>`;
  }).join('');
}

function showResView(id){
  const home=document.getElementById('res-home');
  const layoutWrap=document.getElementById('res-layout-wrap');
  const detail=document.getElementById('res-detail');
  const resDetail=document.getElementById('res-resource-detail');
  if(id==='res-home'){
    if(layoutWrap) layoutWrap.style.display='none';
    if(home){home.style.display='';_animateIn(home);}
  } else if(id==='res-detail'){
    if(home) home.style.display='none';
    if(layoutWrap) layoutWrap.style.display='';
    if(resDetail) resDetail.style.display='none';
    if(detail){detail.style.display='';_animateIn(detail);}
  } else if(id==='res-resource-detail'){
    if(home) home.style.display='none';
    if(layoutWrap) layoutWrap.style.display='';
    if(detail) detail.style.display='none';
    if(resDetail){resDetail.style.display='';_animateIn(resDetail);}
  }
}

function filterResCategory(cat, _push=true){
  _resCat=cat;
  document.querySelectorAll('.res-cat-sidebar-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.cat===cat);
  });
  document.querySelectorAll('.res-sidebar-item').forEach(a=>a.classList.remove('active'));
  const descEl=document.getElementById('res-cat-desc');
  if(descEl) descEl.textContent=_RES_CATS.find(c=>c.cat===cat)?.desc||'';
  applyResFilters();
  showResView('res-detail');
  if(_push){
    history.pushState(null,'','#p-res/'+cat);
    trackVirtualPageView();
  }
  lastResHash = '#p-res/'+cat;
  lastToolkitHash = lastResHash;
}

function applyResFilters(){
  document.querySelectorAll('#res-grid .res-card').forEach(card=>{
    card.style.display=(card.dataset.cat===_resCat)?'':'none';
  });
}

/* Called from sidebar resource links */
function openResFromSidebar(cat,idx){
  if(cat!==_resCat){
    _resCat=cat;
    document.querySelectorAll('.res-cat-sidebar-btn').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.cat===cat);
    });
    applyResFilters();
  }
  const cards=[...document.querySelectorAll(`#res-grid .res-card[data-cat="${cat}"]`)];
  if(cards[idx]) openResource(cards[idx]);
}

function openResource(card, _push=true){
  const r=_RESOURCES[+card.dataset.resIdx];
  if(!r) return;
  document.getElementById('res-res-title').textContent=r.title;
  document.getElementById('res-res-desc').innerHTML=r.desc||'';
  const img=document.getElementById('res-res-img');
  img.src=r.img||''; img.alt=r.title;
  const ctasEl=document.getElementById('res-res-ctas');
  if(ctasEl){
    const links=r.links||[];
    ctasEl.innerHTML=links.map(l=>
      `<a class="learn-more" href="${l.href||'#'}" target="_blank" rel="noopener">${l.label}</a>`
    ).join('');
  }
  // Highlight matching sidebar item
  document.querySelectorAll('.res-sidebar-item').forEach(a=>a.classList.remove('active'));
  const cardCat=card.dataset.cat;
  const catCards=[...document.querySelectorAll(`#res-grid .res-card[data-cat="${cardCat}"]`)];
  const idx=catCards.indexOf(card);
  if(idx>=0){
    const link=document.querySelector(`.res-sidebar-item[data-cat="${cardCat}"][data-idx="${idx}"]`);
    if(link) link.classList.add('active');
  }
  // Breadcrumb — category part is clickable
  const catLabel=_RES_CATS.find(c=>c.cat===cardCat)?.label||'';
  const bc=document.getElementById('res-breadcrumb');
  if(bc){
    bc.innerHTML='';
    const catBtn=document.createElement('button');
    catBtn.className='res-bc-cat-btn';
    catBtn.textContent=catLabel;
    catBtn.addEventListener('click',()=>filterResCategory(cardCat));
    const sep=document.createElement('span');
    sep.setAttribute('aria-hidden','true');
    sep.textContent=' / ';
    const titleSpan=document.createElement('span');
    titleSpan.textContent=r.title;
    bc.append(catBtn,sep,titleSpan);
  }
  if(_push){
    history.pushState(null,'','#p-res/'+cardCat+'/'+card.dataset.resIdx);
    trackVirtualPageView();
  }
  lastResHash = '#p-res/'+cardCat+'/'+card.dataset.resIdx;
  lastToolkitHash = lastResHash;
  showResView('res-resource-detail');
}

function closeResource(){
  document.querySelectorAll('.res-sidebar-item').forEach(a=>a.classList.remove('active'));
  history.pushState(null,'','#p-res/'+_resCat);
  trackVirtualPageView();
  lastResHash = '#p-res/'+_resCat;
  lastToolkitHash = lastResHash;
  showResView('res-detail');
}

function goResHome(){
  history.pushState(null,'','#p-res');
  trackVirtualPageView();
  lastResHash = '#p-res';
  lastToolkitHash = '#p-res';
  showResView('res-home');
}

function _routeHash(hash, _push){
  const raw=(hash||'').replace(/^#/,'');
  const parts=raw.split('/');
  const page=parts[0]||'p-home';
  if(page==='p-res'){
    showPage('p-res', false);
    if(parts[1]){
      filterResCategory(parts[1], false);
      const resIdx=parts[2]!==undefined&&parts[2]!==''?parseInt(parts[2]):-1;
      if(resIdx>=0){
        const card=document.querySelector(`#res-grid .res-card[data-res-idx="${resIdx}"]`);
        if(card) openResource(card, _push);
        else if(_push){
          history.pushState(null,'','#p-res/'+parts[1]);
          trackVirtualPageView();
        }
      } else {
        if(_push){
          history.pushState(null,'','#p-res/'+parts[1]);
          trackVirtualPageView();
        }
      }
    } else {
      if(_push){
        history.pushState(null,'','#p-res');
        trackVirtualPageView();
      }
    }
  } else {
    const valid=['p-home','p-kc','p-change','p-calc','p-atys','p-abt','p-res'];
    showPage(valid.includes(page)?page:'p-home', _push);
  }
}

/* ── SCROLL + NAV ── */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

window.addEventListener('popstate',()=>_routeHash(location.hash,false));

/* ── DARK MODE (disabled) ── */
// const tbtn=document.getElementById('tbtn');
// tbtn.addEventListener('click',()=>{
//   const dark=document.documentElement.dataset.theme==='dark';
//   document.documentElement.dataset.theme=dark?'light':'dark';
// });

/* ── HAMBURGER MENU ── */
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobile-menu');
if(hamburger && mobileMenu){
  hamburger.addEventListener('click',()=>{
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-nav button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      mobileMenu.classList.remove('open');
    });
  });
  document.addEventListener('click',e=>{
    if(!hamburger.contains(e.target) && !mobileMenu.contains(e.target)){
      mobileMenu.classList.remove('open');
    }
  });
}

/* ── HOME CARDS ANIMATION ── */
function animateCards(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
  },{threshold:0.05});
  document.querySelectorAll('.tk-card').forEach(c=>{c.classList.remove('vis');obs.observe(c)});
}
animateCards();

/* ── SIDEBAR TOC ACCORDION ── */
document.querySelectorAll('.toc-parent').forEach(p=>{
  p.addEventListener('click',()=>p.classList.toggle('open'));
});

/* ── ACCORDION ── */
document.querySelectorAll('.kc-acc-trigger').forEach(btn=>{
  btn.addEventListener('click',()=>{
    btn.closest('.kc-acc-item').classList.toggle('open');
  });
});

/* ── FILTER TABS ── */
document.querySelectorAll('.filter-tabs .filter-tab').forEach(b=>{
  b.addEventListener('click',()=>{
    b.closest('.filter-tabs').querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
    b.classList.add('active');
  });
});

/* ── MINDMAP NODE CLICKS ── */
const kcSectionMap={'kc-a':'kcsec-1','kc-b':'kcsec-2','kc-c':'kcsec-3','kc-d':'kcsec-4','kc-e':'kcsec-5'};
document.querySelectorAll('.kc-orbit-item').forEach(node=>{
  node.addEventListener('click',()=>{
    const classNames=Array.from(node.classList);
    const sectionId=Object.entries(kcSectionMap).find(([key])=>classNames.includes(key))?.[1];
    if(sectionId){
      showPage('p-kc');
      setTimeout(()=>{
        document.querySelector('.'+sectionId)?.scrollIntoView({behavior:'smooth',block:'start'});
      },100);
    }
  });
});

/* ── priority tool ── */
const REGIONS=[
  {id:'region1',label:'Region One',score:4,comps:[1,1,1,1,0],
   path:'M65,5 L255,5 L270,20 L280,45 L265,80 L248,108 L220,128 L188,142 L158,148 L125,144 L95,132 L68,118 L48,92 L42,62 L50,32 Z'},
  {id:'region2',label:'Region Two',score:2,comps:[1,0,1,0,0],
   path:'M10,75 L58,64 L74,78 L70,104 L48,115 L12,104 Z'},
  {id:'region3',label:'Region Three',score:3,comps:[1,1,1,0,0],
   path:'M68,148 L138,144 L150,165 L155,195 L145,222 L90,226 L65,212 L58,186 L62,162 Z'},
  {id:'region4',label:'Region Four',score:2,comps:[1,0,1,0,0],
   path:'M138,144 L198,138 L232,148 L248,172 L242,200 L218,222 L178,226 L155,222 L150,200 L150,165 Z'},
  {id:'region5',label:'Region Five',score:1,comps:[1,0,0,0,0],
   path:'M42,220 L92,220 L100,235 L96,260 L82,278 L58,284 L36,270 L30,248 L34,230 Z'},
  {id:'region6',label:'Region Six',score:3,comps:[1,1,0,1,0],
   path:'M92,220 L158,220 L202,222 L222,236 L218,264 L200,276 L134,280 L98,272 L96,252 L96,232 Z'},
  {id:'region7',label:'Region Seven',score:4,comps:[1,1,1,0,1],
   path:'M202,218 L292,212 L312,238 L308,272 L280,295 L242,300 L218,282 L218,258 L222,238 Z'},
  {id:'region8',label:'Region Eight',score:5,comps:[1,1,1,1,1],
   path:'M196,272 L244,268 L252,282 L244,300 L200,304 L188,288 Z'},
  {id:'region9',label:'Region Nine',score:3,comps:[1,0,1,1,0],
   path:'M244,268 L308,272 L320,288 L314,315 L284,332 L248,340 L212,332 L196,312 L198,300 L244,300 L252,282 Z'},
  {id:'region10',label:'Region Ten',score:2,comps:[1,1,0,0,0],
   path:'M44,278 L98,272 L134,276 L196,272 L198,300 L192,330 L168,352 L132,358 L88,338 L46,310 L38,286 Z'},
];

const COMP_NAMES=['Component One','Component Two','Component Three','Component Four','Component Five'];
const SCORE_COLORS=['#C94040','#CC7030','#C9A820','#389858','#1C7040'];
const BINARY_COLORS={1:'#389858',0:'#C94040'};

let activeRegion=null;
let activeFilter='all';

function getColor(region,filter){
  if(filter==='all') return SCORE_COLORS[Math.min(region.score,4)];
  const ci=parseInt(filter);
  return region.comps[ci]===1?BINARY_COLORS[1]:BINARY_COLORS[0];
}

function renderMap(){
  const svg=document.getElementById('uk-map');
  if(!svg) return;
  const isDark=document.documentElement.dataset.theme==='dark';
  const stroke=isDark?'#1A1728':'#FFFFFF';
  svg.innerHTML='';
  REGIONS.forEach(r=>{
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',r.path);
    path.setAttribute('fill',getColor(r,activeFilter));
    path.setAttribute('stroke',stroke);
    path.setAttribute('stroke-width','2');
    path.setAttribute('stroke-linejoin','round');
    path.style.cursor='pointer';
    path.style.transition='opacity .15s,filter .15s';
    path.setAttribute('opacity',activeRegion&&activeRegion!==r.id?'0.55':'1');
    path.addEventListener('mouseenter',()=>{path.style.filter='brightness(1.15)'});
    path.addEventListener('mouseleave',()=>{path.style.filter=''});
    path.addEventListener('click',()=>selectRegion(r.id));
    // label
    const bb=getBbox(r.path);
    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',bb.cx); text.setAttribute('y',bb.cy);
    text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','middle');
    text.setAttribute('font-family','Poppins,sans-serif');
    text.setAttribute('font-size',r.id==='region8'?'7':'8.5');
    text.setAttribute('font-weight','700');
    text.setAttribute('fill','rgba(255,255,255,0.9)');
    text.setAttribute('pointer-events','none');
    text.textContent=r.id==='region2'?'R2':r.id==='region8'?'R8':r.label.split(' ').map(w=>w[0]).join('').slice(0,4);
    svg.appendChild(path);svg.appendChild(text);
  });
  renderLegend();
}

function getBbox(pathStr){
  const nums=pathStr.match(/[\d.]+/g).map(Number);
  const xs=[],ys=[];
  for(let i=0;i<nums.length;i+=2){xs.push(nums[i]);ys.push(nums[i+1]);}
  return{cx:(Math.min(...xs)+Math.max(...xs))/2,cy:(Math.min(...ys)+Math.max(...ys))/2};
}

function renderLegend(){
  const leg=document.getElementById('map-legend');
  if(!leg) return;
  if(activeFilter==='all'){
    leg.innerHTML=SCORE_COLORS.map((c,i)=>`
      <div class="legend-item"><div class="legend-dot" style="background:${c}"></div>${i} component${i!==1?'s':''}</div>
    `).join('');
  } else {
    leg.innerHTML=`
      <div class="legend-item"><div class="legend-dot" style="background:${BINARY_COLORS[1]}"></div>Component present</div>
      <div class="legend-item"><div class="legend-dot" style="background:${BINARY_COLORS[0]}"></div>Component absent</div>`;
  }
}

function selectRegion(id){
  activeRegion=id;
  const r=REGIONS.find(x=>x.id===id);
  const scoreColor=SCORE_COLORS[Math.min(r.score,4)];
  const det=document.getElementById('region-detail');
  if(!det) return;
  det.innerHTML=`
    <div class="rd-region-name">${r.label}</div>
    <div class="rd-score-row">
      <div class="rd-score" style="color:${scoreColor}">${r.score}/5</div>
      <div class="rd-score-lbl">components in place</div>
    </div>
    <div class="comp-rows">
      ${r.comps.map((c,i)=>`
        <div class="comp-row ${c?'has':'missing'}">
          <div class="comp-status">
            <svg viewBox="0 0 24 24">${c?'<polyline points="20 6 9 17 4 12"/>':'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}</svg>
          </div>
          <span class="comp-name">${COMP_NAMES[i]}</span>
          <span class="comp-badge">${c?'Present':'Missing'}</span>
        </div>
      `).join('')}
    </div>
    <div class="rd-actions">
      <button class="rd-btn">View services in region</button>
      <button class="rd-btn">Export region report</button>
    </div>`;
  renderMap();
}

// Component filter buttons
(function(){
  const btn=document.getElementById('col-select-btn');
  const dd=document.getElementById('col-select-dropdown');
  if(!btn||!dd) return;
  btn.addEventListener('click',e=>{e.stopPropagation();dd.classList.toggle('open');});
  document.addEventListener('click',()=>dd.classList.remove('open'));
  dd.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change',()=>{
      const col=cb.dataset.col;
      document.querySelectorAll(`[data-col="${col}"]`).forEach(el=>{
        el.style.display=cb.checked?'':'none';
      });
    });
  });
})();

// Re-render map on dark mode toggle (disabled with dark mode)
// tbtn.addEventListener('click',()=>{ setTimeout(renderMap,50); });

// Initial render
renderMap();

/* ── CALCULATOR ──
   Coefficients from the VOICES modelling work (see CostCalculator docs).
   Component order: Cohorted, MDT, Nurse-Led, WaitTimes<7d. */
const CALC_COEFS={
  'Serious Infection':            {Intercept:-1.6440643, c:[-0.0896134,-0.0672609, 0.0256200,-0.1454075]},
  'CVD':                          {Intercept:-2.8332321, c:[-0.0185650, 0.3179252,-0.1794882,-0.4497504]},
  'Cancer':                       {Intercept:-3.2475184, c:[ 0.1072834, 0.4019695,-0.2713268, 0.0167743]},
  'Emergency Hospital Admissions':{Intercept:-0.4088766, c:[ 0.0129831, 0.0992871,-0.2126616,-0.1983540]}
};
const CALC_COMP_IDS=['cc1','cc4','cc5','cc7'];

/* Univariate (single-component) model — each component analysed in isolation.
   {Absent, Present} log-rates per outcome per component.
   Source: UniCoef 1.csv (latest VOICES univariate run). Nurse-led care is split
   into 'Nurse-led clinic' (CSV "Nurse led clinic") and 'Nurse-led advice line'
   (CSV "Nurse Advice Line"). Wait times maps to CSV "Wait time for new patients
   (<1 week)", MDT meetings to CSV "Vasculitis MDT".
   NB: keys must match the radio `value` attributes in index.html. */
const CALC_UNI_COEFS={
  'Serious Infection':{
    'Cohorted clinic':              {A:-1.5382498615421132, P:-0.27298000378535847},
    'MDT meetings':                 {A:-1.6113328001652973, P:-0.3107674431753781},
    'Nurse-led clinic':             {A:-1.6929132845702903, P:-0.4983563220301629},
    'Nurse-led advice line':        {A:-1.655352838746271,  P:-0.29096896532507627},
    'Wait times < 7 days':          {A:-1.481334096221952,  P:-0.3454847759154589}
  },
  'CVD':{
    'Cohorted clinic':              {A:-3.6847828009373194, P:-0.134043517036335},
    'MDT meetings':                 {A:-3.643161689998526,  P:-0.34417352013951297},
    'Nurse-led clinic':             {A:-3.636223016014778,  P:-0.7974844919550333},
    'Nurse-led advice line':        {A:-3.7102524021728907, P:-0.16581834805440712},
    'Wait times < 7 days':          {A:-3.771798677225767,  P: 0.011868407083098598}
  },
  'Cancer':{
    'Cohorted clinic':              {A:-3.848753639004325,  P: 0.5109192418447568},
    'MDT meetings':                 {A:-3.316937525698516,  P:-0.37693998301592924},
    'Nurse-led clinic':             {A:-3.3784979956588277, P:-0.7138954549904106},
    'Nurse-led advice line':        {A:-3.336067730161107,  P:-0.40535635502762324},
    'Wait times < 7 days':          {A:-3.6772194431895353, P: 0.26979398612292455}
  },
  'Emergency Hospital Admissions':{
    'Cohorted clinic':              {A:-0.3901394036829162, P:-0.22000374603852033},
    'MDT meetings':                 {A:-0.48893683092856555,P:-0.15853856189803295},
    'Nurse-led clinic':             {A:-0.5312650984101688, P:-0.252259865527625},
    'Nurse-led advice line':        {A:-0.5070984206644306, P:-0.1661796009618174},
    'Wait times < 7 days':          {A:-0.3833236271534814, P:-0.23154838532627045}
  }
};

// Scottish average gross cost of a non-elective inpatient hospital admission.
const CALC_EVENT_COST=4851;

let calcMode='single'; // 'combined' | 'single'
let calcSnapshot=null;   // latest computed result, for PDF/CSV export

// Every slider below (inputs + the three output cards) is a fixed single/combined
// panel pair inside a 200%-wide flex track; switching mode just slides the track,
// it never rewrites panel content. updateCalc() keeps BOTH panels' numbers current
// on every call, so whichever panel slides into view is already up to date.
const CALC_SLIDER_TRACKS=['calcInputsTrack','calcEventsTrack','calcCostTrack','calcModelTrack'];
const CALC_SLIDER_PANEL_PAIRS=[
  ['calc-single-inputs','calc-combined-inputs'],
  ['calc-events-single','calc-events-combined'],
  ['calc-cost-single','calc-cost-combined'],
  ['calc-model-single','calc-model-combined']
];

function setCalcMode(mode){
  if(mode===calcMode) return;
  calcMode=mode;
  const combined=mode==='combined';

  // slide every track (inputs + the three output cards) in lockstep
  CALC_SLIDER_TRACKS.forEach(id=>{
    const track=document.getElementById(id);
    if(track) track.style.transform=combined?'translateX(-50%)':'translateX(0)';
  });
  CALC_SLIDER_PANEL_PAIRS.forEach(([singleId,combinedId])=>{
    const singlePanel=document.getElementById(singleId);
    const combinedPanel=document.getElementById(combinedId);
    if(!singlePanel||!combinedPanel) return;
    singlePanel.setAttribute('aria-hidden',String(combined));
    combinedPanel.setAttribute('aria-hidden',String(!combined));
    singlePanel.inert=combined;
    combinedPanel.inert=!combined;
  });

  // toggle active class on buttons
  document.getElementById('calc-mode-single').classList.toggle('active',!combined);
  document.getElementById('calc-mode-combined').classList.toggle('active',combined);
  document.getElementById('calc-mode-single').setAttribute('aria-pressed',String(!combined));
  document.getElementById('calc-mode-combined').setAttribute('aria-pressed',String(combined));

  // slide the indicator to the active button
  _slideModeIndicator(mode);

  updateCalc();
}

function _slideModeIndicator(mode){
  const ind=document.getElementById('calcModeIndicator');
  const btn=document.getElementById(mode==='single'?'calc-mode-single':'calc-mode-combined');
  if(!ind||!btn) return;
  ind.style.left=btn.offsetLeft+'px';
  ind.style.width=btn.offsetWidth+'px';
  ind.style.height=btn.offsetHeight+'px';
}

function _initModeIndicator(){
  const ind=document.getElementById('calcModeIndicator');
  if(!ind) return;
  ind.style.transition='none';
  _slideModeIndicator(calcMode);
  requestAnimationFrame(()=>{ ind.style.transition=''; });
}

window.addEventListener('resize',()=>_slideModeIndicator(calcMode));

// Colour a signed value: negative (saving / fewer events) = green, positive = red.
function applySignColor(el,value){
  el.classList.remove('val-good','val-bad');
  if(value<0) el.classList.add('val-good');
  else if(value>0) el.classList.add('val-bad');
}

// Visible text of a radio/checkbox: the first <span> inside its wrapping
// <label class="comp-check"> (later spans hold the info-popup, so skip them).
function _inputLabel(el){
  const sp=el&&el.closest('label')&&el.closest('label').querySelector('span');
  return sp?sp.textContent.trim().replace(/\s+/g,' '):'';
}

// Computes one model's results and writes them into the `${idSuffix}`-tagged
// output-card panel (e.g. out-infect-single / out-infect-combined). Both models
// are always computed and written together (see updateCalc below) so whichever
// panel the slider reveals next is already showing current numbers, not stale
// ones from the last time that panel was on screen.
function _writeCalcResults(idSuffix,baseEvents,compEvents,baseCost,compCost,money,mode){
  const valEl=id=>document.getElementById(`${id}-${idSuffix}`);
  const diff=compCost-baseCost;
  const pct=baseEvents?((compEvents-baseEvents)/baseEvents)*100:0;
  const evtDiff=compEvents-baseEvents;
  const evtFmt=v=>mode==='combined'
    ? `${v.toLocaleString()} events`
    : `${v.toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1})} events`;

  valEl('out-infect').textContent=evtFmt(baseEvents);
  valEl('out-avoided').textContent=evtFmt(compEvents);
  valEl('out-hosp').textContent=`${pct>=0?'+':''}${pct.toFixed(1)}%`;
  valEl('out-saving').textContent=money(baseCost);
  valEl('out-total').textContent=money(compCost);
  const sign=diff<0?'−':(diff>0?'+':'');
  valEl('out-impl').textContent=`${sign}${money(Math.abs(diff))}`;

  applySignColor(valEl('out-hosp'), evtDiff);
  applySignColor(valEl('out-impl'), diff);

  return {
    baselineEvents: valEl('out-infect').textContent,
    withEvents: valEl('out-avoided').textContent,
    changeRate: valEl('out-hosp').textContent,
    baselineCost: valEl('out-saving').textContent,
    withCost: valEl('out-total').textContent,
    difference: valEl('out-impl').textContent
  };
}

function updateCalc(){
  const vol=parseInt(document.getElementById('calc-patients').value)||0;
  const cost=CALC_EVENT_COST;
  if(!vol){
    calcSnapshot=null;
    ['single','combined'].forEach(suffix=>{
      ['out-infect','out-avoided','out-hosp','out-saving','out-total','out-impl'].forEach(id=>{
        const el=document.getElementById(`${id}-${suffix}`);
        el.textContent='—';
        el.classList.remove('val-good','val-bad');
      });
    });
    return;
  }

  // baseEvents/compEvents are the raw expected events per year.
  // Rounding deliberately differs by model to match the VOICES reference:
  //  - combined (multivariate): round events to whole numbers, then × unit cost
  //  - single (univariate):     keep fractional events, round only the final cost to 2dp

  // ---- combined (multivariable) ----
  const outcomeElC=document.querySelector('input[name="calc-outcome"]:checked');
  const outcomeC=outcomeElC.value;
  const outcomeLabelC=_inputLabel(outcomeElC);
  const checks=CALC_COMP_IDS.map(id=>document.getElementById(id).checked);
  const componentsLabelC=CALC_COMP_IDS.filter((_,i)=>checks[i])
    .map(id=>_inputLabel(document.getElementById(id)))
    .join(', ') || 'None selected';
  const count=checks.filter(Boolean).length;
  const total=CALC_COMP_IDS.length;
  document.getElementById('impact-count').textContent=`${count} / ${total}`;
  document.getElementById('impact-bar').style.width=`${(count/total)*100}%`;

  const coC=CALC_COEFS[outcomeC];
  const sumWithC=coC.Intercept + coC.c.reduce((a,b,i)=>a+(checks[i]?b:0),0);
  const baseEventsC=Math.round(Math.exp(coC.Intercept)*vol);
  const compEventsC=Math.round(Math.exp(sumWithC)*vol);
  const moneyC=v=>`£${Math.round(v).toLocaleString()}`;
  const resultsC=_writeCalcResults('combined',baseEventsC,compEventsC,baseEventsC*cost,compEventsC*cost,moneyC,'combined');

  // ---- single (univariable) ----
  const outcomeElS=document.querySelector('input[name="calc-outcome-single"]:checked');
  const outcomeS=outcomeElS.value;
  const outcomeLabelS=_inputLabel(outcomeElS);
  const compElS=document.querySelector('input[name="calc-component-single"]:checked');
  const compS=compElS.value;
  const componentsLabelS=_inputLabel(compElS);
  const coS=CALC_UNI_COEFS[outcomeS][compS];
  const baseEventsS=Math.exp(coS.A)*vol;
  const compEventsS=Math.exp(coS.A+coS.P)*vol;
  const baseCostS=Math.round(baseEventsS*cost*100)/100;
  const compCostS=Math.round(compEventsS*cost*100)/100;
  const moneyS=v=>`£${v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const resultsS=_writeCalcResults('single',baseEventsS,compEventsS,baseCostS,compCostS,moneyS,'single');

  // Snapshot (for PDF/CSV export) reflects whichever mode is currently on screen.
  const combined=calcMode==='combined';
  calcSnapshot={
    mode: combined ? 'Multivariable' : 'Univariable',
    patients: vol,
    unitCost: `£${CALC_EVENT_COST.toLocaleString()} (gross)`,
    outcome: combined ? outcomeLabelC : outcomeLabelS,
    components: combined ? componentsLabelC : componentsLabelS,
    ...(combined ? resultsC : resultsS)
  };
}
updateCalc();

// ── Calculator export (PDF / CSV) ────────────────────────────────────────────
function downloadCalc(type){
  if(!calcSnapshot){
    alert('Enter the number of patients to generate an estimate before downloading.');
    return;
  }
  const s=calcSnapshot;
  const stamp=new Date().toISOString().slice(0,10);
  const rows=[
    ['Model', s.mode],
    ['Total vasculitis patients seen per year', s.patients.toLocaleString()],
    ['Cost per event', s.unitCost],
    ['Event of interest', s.outcome],
    [calcMode==='combined'?'Components in place':'Component', s.components],
    ['Baseline events / year', s.baselineEvents],
    ['Events with component(s) / year', s.withEvents],
    ['Change in event rate', s.changeRate],
    ['Baseline cost / year', s.baselineCost],
    ['Cost with component(s) / year', s.withCost],
    ['Projected annual change (− = saving)', s.difference]
  ];

  if(type==='csv'){
    const esc=v=>`"${String(v).replace(/"/g,'""')}"`;
    const csv=[['Field','Value'],...rows].map(r=>r.map(esc).join(',')).join('\r\n');
    const blob=new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`voices-cost-estimate-${stamp}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  // PDF via jsPDF (UMD build exposes window.jspdf.jsPDF)
  const jsPDF=(window.jspdf||{}).jsPDF;
  if(!jsPDF){ alert('PDF library failed to load. Please try again.'); return; }
  // jsPDF's built-in Helvetica font does not reliably encode the Unicode
  // minus sign or pound sign. Use explicit ASCII equivalents in PDF output.
  const pdfText=value=>String(value).replace(/\u2212/g,'-').replace(/\u00a3/g,'GBP ');
  const doc=new jsPDF({unit:'pt',format:'a4'});
  const M=48; let y=64;
  doc.setFont('helvetica','bold'); doc.setFontSize(18);
  doc.text('VOICES Cost Estimate', M, y); y+=10;
  doc.setDrawColor(139,107,154); doc.setLineWidth(1.5); doc.line(M, y, 547, y); y+=28;
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(120);
  doc.text(`Generated ${stamp}`, M, y); y+=22;
  doc.setTextColor(34);
  rows.forEach(([label,val])=>{
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5);
    doc.text(pdfText(label), M, y);
    doc.setFont('helvetica','normal');
    const lines=doc.splitTextToSize(pdfText(val), 250);
    doc.text(lines, 547, y, {align:'right'});
    y+=Math.max(20, lines.length*14);
    doc.setDrawColor(225); doc.setLineWidth(0.5); doc.line(M, y-12, 547, y-12);
  });
  y+=14;
  doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(120);
  const note='Estimates use coefficients from the VOICES modelling work and a gross cost of GBP 4,851 per event. Univariable estimates are produced in isolation and should not be combined.';
  doc.text(doc.splitTextToSize(note, 499), M, y);
  doc.save(`voices-cost-estimate-${stamp}.pdf`);
}

// ── Editable Table ──────────────────────────────────────────────────────────
(function(){
  const DEPT_SUGGESTIONS=['Rheumatology','Nephrology','Respiratory','Ear, Nose & Throat','Neurology','Dermatology','Other'];
  const STATUSES=[
    {value:'established',label:'Established',svg:'<polyline points="20 6 9 17 4 12"/>'},
    {value:'developing',label:'Developing',svg:'<path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10h2c1.042 0 2.049.42 2.795 1.17L18 12h1.5"/>'},
    {value:'not-in-place',label:'Not in Place',svg:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'},
    {value:'unknown',label:'Unknown',svg:'<line x1="5" y1="19" x2="19" y2="5"/>'}
  ];
  let colCounter=0,dragColId=null;
  const state={cols:[],cells:{}};
  function ck(r,c){return r+'-'+c;}

  // ── instances — both tables share the same state ───────────────────────────
  const INST_CFGS=[
    {hdrId:'etblHeaderRow',bodyId:'etblBody',addRightId:'etblAddColRight',emptyThId:'etblEmptyColTh',emptyTdId:'etblEmptyColTd'},
    {hdrId:'etblHeaderRow2',bodyId:'etblBody2',addRightId:'etblAddColRight2',emptyThId:'etblEmptyColTh2',emptyTdId:'etblEmptyColTd2'},
  ];
  function getInstances(){
    return INST_CFGS.map(c=>Object.assign({},c,{
      hdr:document.getElementById(c.hdrId),
      body:document.getElementById(c.bodyId),
      addRight:document.getElementById(c.addRightId),
    })).filter(i=>i.hdr&&i.body);
  }

  // ── cell helpers ───────────────────────────────────────────────────────────
  function _makeTd(ri,id){
    const td=document.createElement('td');
    td.dataset.colId=id; td.dataset.rowIdx=ri; td.className='empty-status'; td.title='Click to set status';
    td.innerHTML='<div class="es-inner"><span class="es-text">Select status</span><svg class="es-arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>';
    td.addEventListener('click',()=>showStatusDD(td,ri,id));
    return td;
  }

  function _applyStatus(td,status){
    const s=STATUSES.find(x=>x.value===status);
    if(!s)return;
    td.className=''; td.dataset.status=status; td.title=s.label;
    td.innerHTML='<svg viewBox="0 0 24 24">'+s.svg+'</svg>';
  }

  // ── add / delete ───────────────────────────────────────────────────────────
  function addColumn(name){
    const id='ec'+(++colCounter);
    state.cols.push({id,name:name||''});
    getInstances().forEach(inst=>{
      const th=document.createElement('th');
      th.className='dept-col'; th.dataset.colId=id; th.draggable=true;
      th.innerHTML='<div class="dept-header-cell"><button class="dept-name-btn'+(name?'':' empty')+'" data-col-id="'+id+'">'+(name||'Click to name')+'</button><button class="dept-delete-btn" title="Remove column">&#215;</button></div>';
      inst.hdr.appendChild(th);
      bindHeaderEvents(th,id);
      inst.body.querySelectorAll('tr').forEach((tr,ri)=>{
        const td=_makeTd(ri,id);
        const existing=state.cells[ck(ri,id)];
        if(existing)_applyStatus(td,existing);
        tr.appendChild(td);
      });
    });
    updateUI();
    recalcAngle();
  }

  function deleteColumn(id){
    state.cols=state.cols.filter(c=>c.id!==id);
    Object.keys(state.cells).forEach(k=>{if(k.endsWith('-'+id))delete state.cells[k];});
    document.querySelectorAll('th[data-col-id="'+id+'"]').forEach(el=>el.remove());
    document.querySelectorAll('td[data-col-id="'+id+'"]').forEach(el=>el.remove());
    updateUI();
    recalcAngle();
  }

  function setCell(ri,id,status){
    state.cells[ck(ri,id)]=status;
    getInstances().forEach(inst=>{
      const rows=inst.body.querySelectorAll('tr');
      const tr=rows[ri];
      if(!tr)return;
      const td=tr.querySelector('td[data-col-id="'+id+'"]');
      if(!td)return;
      _applyStatus(td,status);
      td.addEventListener('click',()=>showStatusDD(td,ri,id));
    });
    updateDL();
  }

  function setDeptName(id,name){
    const col=state.cols.find(c=>c.id===id);
    if(col)col.name=name;
    document.querySelectorAll('th[data-col-id="'+id+'"] .dept-name-btn').forEach(btn=>{
      btn.textContent=name; btn.classList.remove('empty');
    });
    updateDL();
    recalcAngle();
  }

  // ── header events ──────────────────────────────────────────────────────────
  function bindHeaderEvents(th,id){
    th.addEventListener('click',e=>{if(!e.target.closest('.dept-delete-btn')){e.stopPropagation();showDeptDD(th.querySelector('.dept-name-btn'),id);}});
    th.querySelector('.dept-delete-btn').addEventListener('click',e=>{e.stopPropagation();closeAll();deleteColumn(id);});
    th.addEventListener('dragstart',e=>{dragColId=id;e.dataTransfer.effectAllowed='move';th.style.opacity='.5';});
    th.addEventListener('dragend',()=>{th.style.opacity='';document.querySelectorAll('.dept-col').forEach(t=>t.classList.remove('drag-over'));});
    th.addEventListener('dragover',e=>{if(dragColId&&dragColId!==id){e.preventDefault();th.classList.add('drag-over');}});
    th.addEventListener('dragleave',()=>th.classList.remove('drag-over'));
    th.addEventListener('drop',e=>{e.preventDefault();th.classList.remove('drag-over');if(dragColId&&dragColId!==id)swapColumns(dragColId,id);dragColId=null;});
  }

  // ── drag swap ──────────────────────────────────────────────────────────────
  function swapColumns(fromId,toId){
    const fi=state.cols.findIndex(c=>c.id===fromId);
    const ti=state.cols.findIndex(c=>c.id===toId);
    [state.cols[fi],state.cols[ti]]=[state.cols[ti],state.cols[fi]];
    getInstances().forEach(inst=>{
      const fTh=inst.hdr.querySelector('th[data-col-id="'+fromId+'"]');
      const tTh=inst.hdr.querySelector('th[data-col-id="'+toId+'"]');
      if(!fTh||!tTh)return;
      const fNext=fTh.nextSibling;
      if(tTh.nextSibling===fTh){inst.hdr.insertBefore(fTh,tTh);}
      else{inst.hdr.insertBefore(tTh,fTh);if(fNext)inst.hdr.insertBefore(fTh,fNext);else inst.hdr.appendChild(fTh);}
      inst.body.querySelectorAll('tr').forEach(tr=>{
        const fTd=tr.querySelector('td[data-col-id="'+fromId+'"]');
        const tTd=tr.querySelector('td[data-col-id="'+toId+'"]');
        if(!fTd||!tTd)return;
        const fNextTd=fTd.nextSibling;
        if(tTd.nextSibling===fTd){tr.insertBefore(fTd,tTd);}
        else{tr.insertBefore(tTd,fTd);if(fNextTd)tr.insertBefore(fTd,fNextTd);else tr.appendChild(fTd);}
      });
    });
  }

  // ── angle calc ─────────────────────────────────────────────────────────────
  function recalcAngle(){
    const ths=document.querySelectorAll('th.dept-col');
    if(!ths.length)return;
    const probe=document.createElement('span');
    probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;white-space:nowrap;font-family:var(--fb);font-size:var(--fs-base-md);font-weight:600;padding:2px 6px';
    document.body.appendChild(probe);
    let maxAngle=0,maxTextW=0;
    ths.forEach(th=>{
      const btn=th.querySelector('.dept-name-btn');
      if(!btn)return;
      const colW=th.offsetWidth||80;
      probe.textContent=btn.textContent||'Department';
      const textW=probe.offsetWidth+4;
      if(textW>maxTextW)maxTextW=textW;
      if(textW>colW){
        const ang=Math.min(85,Math.acos(Math.max(0.05,colW/textW))*180/Math.PI);
        if(ang>maxAngle)maxAngle=ang;
      }
    });
    document.body.removeChild(probe);
    const angle=Math.max(0,maxAngle);
    const bottomPx=Math.round(26+angle*0.55);
    const θ=angle*Math.PI/180;
    const H_TEXT=18;
    const requiredH=Math.ceil(bottomPx+H_TEXT*Math.cos(θ)+(maxTextW/2)*Math.sin(θ)+12);
    const finalH=Math.max(70,requiredH);
    ths.forEach(th=>{
      th.style.height=finalH+'px';
      const btn=th.querySelector('.dept-name-btn');
      if(btn){btn.style.transform='translateX(-50%) rotate(-'+angle.toFixed(1)+'deg)';btn.style.bottom=bottomPx+'px';}
    });
    document.querySelectorAll('.empty-col-inner').forEach(el=>el.style.height=finalH+'px');
  }

  // ── dept dropdown ──────────────────────────────────────────────────────────
  function getUsedNames(excludeId){
    return new Set(state.cols.filter(c=>c.id!==excludeId&&c.name.trim()).map(c=>c.name));
  }

  function showDeptDD(trigger,id){
    closeAll();
    const dd=document.getElementById('etblDeptDropdown');
    renderDeptList(dd.querySelector('.etbl-dd-list'),id);
    positionDD(dd,trigger);
    dd.classList.add('open');
  }

  function renderDeptList(list,id){
    const usedNames=getUsedNames(id);
    const customUsed=[...usedNames].filter(n=>!DEPT_SUGGESTIONS.includes(n));
    const allOpts=[...DEPT_SUGGESTIONS,...customUsed];
    list.innerHTML='';
    allOpts.forEach(name=>{
      const isOther=name==='Other';
      const isUsed=usedNames.has(name);
      const div=document.createElement('div');
      div.className='etbl-dd-opt'+(isUsed?' disabled':'');
      div.textContent=name;
      if(!isUsed){
        if(isOther){
          div.addEventListener('mousedown',e=>{e.preventDefault();showCustomDeptInput(list,id);});
        } else {
          div.addEventListener('mousedown',e=>{e.preventDefault();setDeptName(id,name);closeAll();});
        }
      }
      list.appendChild(div);
    });
  }

  function showCustomDeptInput(list,id){
    list.innerHTML='';
    const wrap=document.createElement('div');
    wrap.className='etbl-custom-input-wrap';
    const inp=document.createElement('input');
    inp.type='text'; inp.placeholder='Enter department name…'; inp.className='etbl-custom-input';
    const btn=document.createElement('button');
    btn.textContent='Add'; btn.className='etbl-custom-confirm'; btn.type='button';
    function confirm(){
      const val=inp.value.trim();
      if(val){setDeptName(id,val);closeAll();}
    }
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')confirm();if(e.key==='Escape')closeAll();});
    btn.addEventListener('mousedown',e=>{e.preventDefault();confirm();});
    wrap.appendChild(inp); wrap.appendChild(btn);
    list.appendChild(wrap);
    requestAnimationFrame(()=>inp.focus());
  }

  // ── status dropdown ────────────────────────────────────────────────────────
  function showStatusDD(trigger,ri,id){
    closeAll();
    const dd=document.getElementById('etblStatusDropdown');
    const list=dd.querySelector('.etbl-dd-list');
    list.innerHTML='';
    STATUSES.forEach(s=>{
      const div=document.createElement('div');
      div.className='etbl-dd-opt';
      div.innerHTML='<span class="status-dot '+s.value+'"><svg viewBox="0 0 24 24">'+s.svg+'</svg></span>'+s.label;
      div.addEventListener('mousedown',e=>{e.preventDefault();setCell(ri,id,s.value);closeAll();});
      list.appendChild(div);
    });
    const r=trigger.getBoundingClientRect();
    const ddW=Math.max(r.width,140);
    dd.style.top=r.bottom+'px';
    dd.style.left=Math.max(8,r.right-ddW)+'px';
    dd.style.width=ddW+'px';
    dd.classList.add('open');
  }

  function positionDD(dd,trigger){
    const r=trigger.getBoundingClientRect();
    dd.style.top=(r.bottom+6)+'px';
    dd.style.left=Math.max(8,Math.min(r.left,window.innerWidth-220))+'px';
    dd.style.width='';
  }
  function closeAll(){document.querySelectorAll('.etbl-dropdown.open').forEach(d=>d.classList.remove('open'));}
  document.addEventListener('click',e=>{if(!e.target.closest('.etbl-dropdown')&&!e.target.closest('[data-col-id]')&&!e.target.closest('.dept-delete-btn'))closeAll();});

  // ── UI state ───────────────────────────────────────────────────────────────
  function addEmptyCol(inst){
    if(document.getElementById(inst.emptyThId))return;
    const th=document.createElement('th');
    th.className='empty-col'; th.id=inst.emptyThId;
    th.innerHTML='<div class="empty-col-inner"></div>';
    th.addEventListener('click',()=>addColumn(''));
    inst.hdr.appendChild(th);
    const rows=inst.body.querySelectorAll('tr');
    if(rows.length){
      const td=document.createElement('td');
      td.className='empty-col'; td.id=inst.emptyTdId;
      td.rowSpan=rows.length;
      td.innerHTML='<div class="empty-col-body"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add department</span></div>';
      td.addEventListener('click',()=>addColumn(''));
      function setHover(on){th.classList.toggle('empty-col-hover',on);td.classList.toggle('empty-col-hover',on);}
      th.addEventListener('mouseenter',()=>setHover(true));
      th.addEventListener('mouseleave',()=>setHover(false));
      td.addEventListener('mouseenter',()=>setHover(true));
      td.addEventListener('mouseleave',()=>setHover(false));
      rows[0].appendChild(td);
    }
  }
  function removeEmptyCol(inst){
    document.getElementById(inst.emptyThId)?.remove();
    inst.body.querySelectorAll('td.empty-col').forEach(el=>el.remove());
  }
  function updateUI(){
    const empty=state.cols.length===0;
    getInstances().forEach(inst=>{
      if(empty)addEmptyCol(inst);else removeEmptyCol(inst);
      if(inst.addRight)inst.addRight.style.display=empty?'none':'';
    });
    updateDL();
  }
  function updateDL(){
    const hasName=state.cols.some(c=>c.name.trim());
    document.querySelectorAll('.dl-btn').forEach(btn=>btn.disabled=!hasName);
    if(hasName)hideNameTooltip();
  }

  function showNameTooltip(){
    const unnamedBtn=document.querySelector('th.dept-col .dept-name-btn.empty');
    if(!unnamedBtn)return;
    let tip=document.getElementById('etblNameTooltip');
    if(!tip){
      tip=document.createElement('div');
      tip.id='etblNameTooltip';
      tip.className='etbl-name-tooltip ui-tooltip ui-tooltip--error ui-tooltip--arrow-down';
      tip.textContent='Name at least one column to download';
      document.body.appendChild(tip);
    }
    const r=unnamedBtn.getBoundingClientRect();
    tip.style.left=(r.left+r.width/2+window.scrollX)+'px';
    tip.style.top=(r.top+window.scrollY-10)+'px';
    tip.classList.add('visible');
    clearTimeout(tip._t);
    tip._t=setTimeout(hideNameTooltip,3000);
  }

  function hideNameTooltip(){
    const tip=document.getElementById('etblNameTooltip');
    if(tip)tip.classList.remove('visible');
  }

  function exportData(){
    const cols=state.cols.filter(c=>c.name.trim());
    const sourceRows=(getInstances()[0]?.body.querySelectorAll('tr'))||[];
    return Array.from(sourceRows).map((tr,i)=>{
      const labelCell=tr.querySelector('td:first-child');
      const kc=labelCell?.querySelector('strong')?.textContent.trim()||labelCell?.textContent.trim()||'';
      const row={'Key Component':kc};
      cols.forEach(col=>{
        const status=state.cells[ck(i,col.id)]||'unknown';
        row[col.name]=(STATUSES.find(s=>s.value===status)||STATUSES[3]).label;
      });
      return row;
    });
  }

  function triggerBlob(content,type,name){
    const url=URL.createObjectURL(new Blob([content],{type}));
    const a=document.createElement('a');
    a.href=url; a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadPdf(data,departmentNames){
    const jsPDF=(window.jspdf||{}).jsPDF;
    if(!jsPDF){alert('PDF library failed to load. Please try again.');return;}

    // Portrait remains more readable for a small heatmap. Wider heatmaps use
    // landscape, with two six-department sections stacked on each page.
    const landscape=departmentNames.length>3;
    const departmentsPerSection=landscape?6:3;
    const sectionsPerPage=landscape?2:1;
    const orientation=landscape?'landscape':'portrait';
    const doc=new jsPDF({orientation,unit:'mm',format:'a4'});
    const pageW=doc.internal.pageSize.getWidth();
    const margin=12;
    const firstColW=landscape?82:72;
    const statusColours={
      Established:[55,126,82], Developing:[205,139,42],
      'Not in Place':[180,65,65], Unknown:[120,120,128]
    };
    const groups=[];
    for(let i=0;i<departmentNames.length;i+=departmentsPerSection){
      groups.push(departmentNames.slice(i,i+departmentsPerSection));
    }

    let y=20;
    groups.forEach((departments,groupIndex)=>{
      const sectionOnPage=groupIndex%sectionsPerPage;
      if(groupIndex&&sectionOnPage===0){
        doc.addPage('a4',orientation);
        y=20;
      }
      if(sectionOnPage===0){
        doc.setTextColor(34); doc.setFont('helvetica','bold'); doc.setFontSize(14);
        doc.text('Vasculitis Service Mapping',margin,y);
        y+=7;
      }else{
        y+=8;
      }
      const tableW=pageW-margin*2;
      const deptW=(tableW-firstColW)/departments.length;
      const headerH=15;
      if(groups.length>1){
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(100);
        const firstDepartment=groupIndex*departmentsPerSection+1;
        doc.text(`Departments ${firstDepartment}-${firstDepartment+departments.length-1} of ${departmentNames.length}`,pageW-margin,y,{align:'right'});
        y+=3;
      }
      doc.setFillColor(139,107,154); doc.rect(margin,y,tableW,headerH,'F');
      doc.setTextColor(255); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
      doc.text('Key Component',margin+2,y+9);
      departments.forEach((name,i)=>{
        const lines=doc.splitTextToSize(name,deptW-3).slice(0,2);
        doc.text(lines,margin+firstColW+i*deptW+deptW/2,y+6,{align:'center'});
      });
      y+=headerH;

      data.forEach((row,rowIndex)=>{
        const componentLines=doc.splitTextToSize(row['Key Component'],firstColW-4);
        const rowH=Math.max(9,componentLines.length*3.5+3);
        doc.setFillColor(rowIndex%2===0?245:255,rowIndex%2===0?243:255,rowIndex%2===0?248:255);
        doc.rect(margin,y,firstColW,rowH,'F');
        doc.setTextColor(34); doc.setFont('helvetica','normal'); doc.setFontSize(7);
        doc.text(componentLines,margin+2,y+4);
        departments.forEach((name,i)=>{
          const status=row[name]||'Unknown';
          const colour=statusColours[status]||statusColours.Unknown;
          const x=margin+firstColW+i*deptW;
          doc.setFillColor(...colour); doc.rect(x,y,deptW,rowH,'F');
          doc.setTextColor(255); doc.setFontSize(6.5);
          doc.text(doc.splitTextToSize(status,deptW-2).slice(0,2),x+deptW/2,y+rowH/2,{align:'center',baseline:'middle'});
        });
        doc.setDrawColor(225); doc.rect(margin,y,tableW,rowH,'S');
        y+=rowH;
      });
    });
    doc.save('vasculitis-mapping.pdf');
  }

  function doDownload(fmt){
    const data=exportData();
    const cols=['Key Component',...state.cols.filter(c=>c.name.trim()).map(c=>c.name)];
    if(fmt==='csv'){
      const esc=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
      triggerBlob('\ufeff'+[cols.map(esc).join(','),...data.map(row=>cols.map(c=>esc(row[c])).join(','))].join('\r\n'),'text/csv;charset=utf-8','vasculitis-mapping.csv');
    }else if(fmt==='txt'){
      triggerBlob([cols.join('\t'),...data.map(row=>cols.map(c=>row[c]||'').join('\t'))].join('\r\n'),'text/plain;charset=utf-8','vasculitis-mapping.txt');
    }else if(fmt==='json'){
      triggerBlob(JSON.stringify(data,null,2),'application/json','vasculitis-mapping.json');
    }else if(fmt==='xlsx'){
      if(!window.XLSX){alert('Excel library failed to load. Please try again.');return;}
      const ws=XLSX.utils.json_to_sheet(data,{header:cols});
      const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Mapping');
      XLSX.writeFile(wb,'vasculitis-mapping.xlsx');
    }else if(fmt==='pdf'){
      downloadPdf(data,cols.slice(1));
    }else if(fmt==='png'||fmt==='jpeg'){
      if(!window.html2canvas){alert('Image library failed to load. Please try again.');return;}
      const table=document.getElementById('etblTable2')||document.getElementById('etblTable');
      html2canvas(table,{backgroundColor:'#fff',scale:2}).then(canvas=>{
        const a=document.createElement('a'); a.download=`vasculitis-mapping.${fmt==='jpeg'?'jpg':'png'}`;
        a.href=canvas.toDataURL(`image/${fmt}`,0.92); a.click();
      });
    }
  }

  // ── download buttons ───────────────────────────────────────────────────────
  [['dlBtn','dlDropdown'],['dlBtn2','dlDropdown2']].forEach(([btnId,ddId])=>{
    const dlBtn=document.getElementById(btnId);
    const dlDD=document.getElementById(ddId);
    if(!dlBtn||!dlDD)return;
    dlBtn.addEventListener('click',e=>{e.stopPropagation();if(!dlBtn.disabled)dlDD.classList.toggle('open');});
    dlBtn.closest('.dl-wrap')?.addEventListener('click',()=>{if(dlBtn.disabled)showNameTooltip();});
    dlDD.querySelectorAll('.dl-opt').forEach(opt=>{
      opt.addEventListener('click',e=>{e.stopPropagation();dlDD.classList.remove('open');doDownload(opt.dataset.fmt);});
    });
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.dl-wrap'))document.querySelectorAll('.dl-dropdown').forEach(d=>d.classList.remove('open'));});

  // ── add col triggers ───────────────────────────────────────────────────────
  ['etblAddCol','etblAddCol2'].forEach(id=>{
    const btn=document.getElementById(id);
    if(btn)btn.addEventListener('click',e=>{e.stopPropagation();addColumn('');});
  });

  // ── init ───────────────────────────────────────────────────────────────────
  updateUI();
  window.addEventListener('resize',recalcAngle);
})();

/* ── init resources ── */
function _initResHome(){
  _RES_CATS.forEach(({cat})=>{
    const n=document.querySelectorAll(`#res-grid .res-card[data-cat="${cat}"]`).length;
    const el=document.getElementById('rhc-'+cat);
    if(el) el.textContent=n+' resource'+(n!==1?'s':'');
  });
}

document.addEventListener('DOMContentLoaded',function(){
  _buildResGrid();
  _buildSidebarResources();
  _initResHome();
  _routeHash(location.hash,false);
  _initModeIndicator();
  _initCompInfoPopups();
  ['surveyFloatBtn','surveyInlineLink'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.href=SURVEY_LINK;
  });
});

function _initCompInfoPopups(){
  const gp=document.getElementById('compInfoGlobalPopup');
  if(!gp) return;
  let _t;
  const _hide=()=>{ _t=setTimeout(()=>gp.style.display='none',80); };
  gp.addEventListener('mouseenter',()=>clearTimeout(_t));
  gp.addEventListener('mouseleave',_hide);

  document.querySelectorAll('.comp-info-wrap').forEach(wrap=>{
    const btn=wrap.querySelector('.comp-info-btn');
    const content=wrap.querySelector('.comp-info-popup');
    if(!btn||!content) return;
    wrap.addEventListener('mouseenter',()=>{
      clearTimeout(_t);
      const r=btn.getBoundingClientRect();
      gp.innerHTML=content.innerHTML;
      gp.style.top=(r.top+r.height/2)+'px';
      gp.style.left=(r.right+10)+'px';
      gp.style.display='block';
    });
    wrap.addEventListener('mouseleave',_hide);
  });
}

/* ── CASE STUDY EXPLORER ── */
(function() {
  const CS_DATA = {
    'Case Study 1': {
      region: 'Scotland',
      'Location': 'Scotland',
      'Service context': 'Single-site, joint renal-rheumatology vasculitis service',
      'Overall service model': 'All vasculitis patients are seen through a joint vasculitis service run by renal and rheumatology',
      'Renal-rheumatology relationship': 'Connected joint service',
      'Leadership model': 'Joint renal and rheumatology leadership',
      'Leadership background': 'Clinical',
      'Service focus and patient cohort': 'Joint vasculitis service seeing systemic vasculitis, complex LVV and complex lupus',
      'Specialist nursing provision': 'Vasculitis specialist nurse, including clinic and advice line',
      'Reflections on service development': '"we will deal with it" – but is this sustainable?'
    },
    'Case Study 2': {
      region: 'Scotland',
      'Location': 'Scotland',
      'Service context': 'Renal and rheumatology services based on separate sites',
      'Overall service model': 'Renal sees most vasculitis patients; rheumatology sees some patients separately',
      'Renal-rheumatology relationship': 'Separate services, not formally connected',
      'Leadership model': 'Separate renal and rheumatology leadership',
      'Leadership background': 'Clinical academic',
      'Service focus and patient cohort': 'Vasculitis service seeing most vasculitis patients, except LVV without renal involvement',
      'Specialist nursing provision': 'Research nurse',
      'Reflections on service development': '"uni-service speciality for a multi-systemic disease"'
    },
    'Case Study 3': {
      region: 'Scotland',
      'Location': 'Scotland',
      'Service context': 'Single-site rheumatology service with renal hub-and-spoke input from another Board',
      'Overall service model': 'Rheumatology and renal see vasculitis patients separately, with no formal connection',
      'Renal-rheumatology relationship': 'Separate services, not formally connected',
      'Leadership model': 'Separate renal and rheumatology leadership',
      'Leadership background': 'Clinical',
      'Service focus and patient cohort': 'Rheumatology-led vasculitis and CTD service; renal-only patients managed separately',
      'Specialist nursing provision': 'Rheumatology nurses',
      'Reflections on service development': '"aspirational"; still "finding the connection with renal here"'
    },
    'Case Study 4': {
      region: 'England',
      'Location': 'England',
      'Service context': 'Renal and rheumatology services based on separate sites',
      'Overall service model': 'Rheumatology and renal see vasculitis patients separately, with no formal connection',
      'Renal-rheumatology relationship': 'Separate services, not formally connected',
      'Leadership model': 'Separate renal and rheumatology leadership',
      'Leadership background': 'Clinical for CTD service; clinical academic for LVV and GCA services',
      'Service focus and patient cohort': 'Rheumatology-led vasculitis/CTD, LVV and GCA services; renal-only patients managed separately',
      'Specialist nursing provision': 'Rheumatology nurse advice line',
      'Reflections on service development': '"a very different set up from anywhere I\'ve ever seen"'
    },
    'Case Study 5': {
      region: 'England',
      'Location': 'England',
      'Service context': 'Single-site multidisciplinary vasculitis-plus service',
      'Overall service model': 'Renal sees most vasculitis patients, with some rheumatology input into the vasculitis clinic',
      'Renal-rheumatology relationship': 'Some connection between renal and rheumatology',
      'Leadership model': 'Renal-led, with multidisciplinary input',
      'Leadership background': 'Clinical academic',
      'Service focus and patient cohort': 'Multidisciplinary vasculitis-plus service for multisystem autoimmune/autoinflammatory disease, excluding uncomplicated GCA',
      'Specialist nursing provision': 'Vasculitis specialist nurses, including clinic and advice line',
      'Reflections on service development': '"organ-agnostic"; "changing from a vasculitis service to a severe inflammatory disease service"'
    },
    'Case Study 6': {
      region: 'England',
      'Location': 'England',
      'Service context': 'Renal and rheumatology services based on separate sites',
      'Overall service model': 'Rheumatology and renal see vasculitis patients separately, with no formal connection',
      'Renal-rheumatology relationship': 'Separate services, not formally connected',
      'Leadership model': 'Collective responsibility for vasculitis care, with renal and rheumatology services managed separately',
      'Leadership background': 'Mixed leadership in renal; clinical leadership in rheumatology',
      'Service focus and patient cohort': 'Parallel renal vasculitis and rheumatology CTD/vasculitis services, with patients largely distributed by renal or non-renal involvement',
      'Specialist nursing provision': 'Vasculitis specialist/research nurse in renal; vasculitis specialist nurse, including clinic, in rheumatology',
      'Reflections on service development': '"a little bit of tension between services … settled down to a very equitable level"'
    }
  };

  const CS_REGION_MAP = {
    Scotland: ['GBSCB','GBDGY','GBCLK','GBSTG','GBFAL','GBWLN','GBEDH','GBMLN','GBELN',
               'GBSAY','GBNAY','GBIVC','GBRFW','GBWDU','GBAGB','GBHLD','GBMRY','GBABD',
               'GBABE','GBANS','GBDND','GBPKN','GBFIF','GBELS','GBORK','GBZET','GBNLK',
               'GBEDU','GBGLG','GBERW','GBEAY','GBSLK'],
    England:  ['GBCHW','GBSHR','GBHEF','GBGLS','GBNBL','GBCMA','GBNTY','GBSTY','GBSND',
               'GBDUR','GBHPL','GBRCC','GBNYK','GBERY','GBKHL','GBNLN','GBNEL','GBLIN',
               'GBNFK','GBSFK','GBESS','GBSOS','GBTHR','GBKEN','GBMDW','GBESX','GBBNH',
               'GBWSX','GBHAM','GBPOR','GBSTH','GBDOR','GBBMH','GBPOL','GBDEV','GBTOB',
               'GBPLY','GBCON','GBSOM','GBNSM','GBBST','GBSGC','GBWRL','GBHAL','GBKWL',
               'GBLIV','GBSFT','GBLAN','GBBPL','GBSTT','GBDAL','GBMDB','GBRIC','GBLND',
               'GBTWH','GBGAT','GBNET','GBYOR','GBSHN','GBENF','GBHRT','GBBNE','GBWFT',
               'GBRDB','GBHAV','GBCAM','GBBEX','GBSTN','GBMIK','GBBKM','GBHIL','GBBEN',
               'GBLUT','GBHRW','GBCBF','GBBDF','GBRUT','GBNTT','GBNTH','GBCMD','GBISL',
               'GBPTE','GBLBH','GBSWK','GBDNC','GBCRY','GBLEW','GBHRY','GBKTT','GBNWM',
               'GBGRE','GBHCK','GBBDG','GBLEC','GBCHE','GBDBY','GBROT','GBSHF','GBSTE',
               'GBTFW','GBSTS','GBBRY','GBWOR','GBWAR','GBOXF','GBWGN','GBSKP','GBWRT',
               'GBWBK','GBWOK','GBBRC','GBWNM','GBSLG','GBRDG','GBSRY','GBBBD','GBSWD',
               'GBBAS','GBWIL','GBCLD','GBKIR','GBNGM','GBLCE','GBDER','GBLDS','GBBRD',
               'GBWKF','GBBNS','GBSLF','GBBOL','GBTRF','GBMAN','GBOLD','GBRCH','GBTAM',
               'GBBUR','GBSOL','GBCOV','GBBIR','GBSAW','GBDUD','GBWLL','GBWLV','GBWND',
               'GBMRT','GBWSM','GBKEC','GBHNS','GBEAL','GBHMF','GBIOW','GBIOS'],
    Wales:    ['GBFLN','GBWRX','GBPOW','GBMON','GBNWP','GBCRF','GBVGL','GBBGE','GBNTL',
               'GBSWA','GBCMN','GBPEM','GBCGN','GBGWN','GBCWY','GBDEN','GBAGY','GBCAY',
               'GBRCT','GBBGW','GBTOF','GBMTY'],
    NorthernIreland: ['GBDRY','GBSTB','GBFER','GBDGN','GBARM','GBNYM','GBLMV','GBCLR',
                      'GBMYL','GBLRN','GBCKF','GBNTA','GBBFS','GBNDN','GBARD','GBDOW',
                      'GBMFT','GBOMH','GBCKT','GBCGV','GBBNB','GBANT','GBLSB','GBBLY',
                      'GBBLA','GBCSR']
  };

  // build reverse lookup: id -> region
  const CS_ID_TO_REGION = {};
  Object.entries(CS_REGION_MAP).forEach(([region, ids]) => {
    ids.forEach(id => { CS_ID_TO_REGION[id] = region; });
  });

  let currentRegion = 'Scotland';
  let currentSite = 'Site 1';

  function sitesForRegion(region) {
    return Object.keys(CS_DATA).filter(s => CS_DATA[s].region === region);
  }

  function renderTabs(sites) {
    const tabs = document.getElementById('cs-site-tabs');
    if (!tabs) return;
    tabs.innerHTML = sites.map(s =>
      `<button class="cs-site-tab${s === currentSite ? ' active' : ''}" onclick="csSelectSite('${s}')">${s}</button>`
    ).join('');
  }

  function renderSiteData(site) {
    const dl = document.getElementById('cs-site-dl');
    if (!dl) return;
    const data = CS_DATA[site];
    dl.innerHTML = Object.entries(data)
      .filter(([k]) => k !== 'region')
      .map(([k, v]) => `<div class="cs-site-row"><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('');
  }

  function updateMapHighlight(region) {
    const svg = document.querySelector('#cs-map-container svg');
    if (!svg) return;
    svg.querySelectorAll('path[data-region]').forEach(p => {
      p.classList.toggle('cs-map-active', p.dataset.region === region);
    });
    const label = document.getElementById('cs-region-label');
    if (label) label.textContent = region;
  }

  function loadCsMap() {
    const container = document.getElementById('cs-map-container');
    if (!container || !window.CS_MAP_SVG) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(window.CS_MAP_SVG, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    svg.querySelectorAll('path[data-region="Scotland"], path[data-region="England"]').forEach(path => {
      path.addEventListener('click', () => window.csSelectRegion(path.dataset.region));
    });

    container.innerHTML = '';
    container.appendChild(svg);
    updateMapHighlight(currentRegion);
  }

  window.csSelectRegion = function(region) {
    currentRegion = region;
    updateMapHighlight(region);
    const sites = sitesForRegion(region);
    currentSite = sites[0];
    renderTabs(sites);
    renderSiteData(currentSite);
  };

  window.csSelectSite = function(site) {
    currentSite = site;
    renderTabs(sitesForRegion(currentRegion));
    renderSiteData(site);
  };

  document.addEventListener('DOMContentLoaded', function() {
    loadCsMap();
    window.csSelectRegion('Scotland');
  });
})();

