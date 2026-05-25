/* ── PAGE ROUTING ── */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nl').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===id);
  });
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  // trigger scroll-dependent animations
  if(id==='p-home') setTimeout(animateCards, 100);
  document.getElementById('nav').classList.remove('scrolled');
}

/* ── SCROLL + NAV ── */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

/* ── DARK MODE ── */
const tbtn=document.getElementById('tbtn');
const tlbl=document.getElementById('tbtn-lbl');
const tico=document.getElementById('tbtn-ico');
tbtn.addEventListener('click',()=>{
  const dark=document.documentElement.dataset.theme==='dark';
  document.documentElement.dataset.theme=dark?'light':'dark';
  tlbl.textContent=dark?'Dark':'Light';
  if(!dark){
    tico.setAttribute('viewBox','0 0 24 24');
    tico.setAttribute('stroke','currentColor');tico.setAttribute('fill','none');
    tico.setAttribute('stroke-width','2');
    tico.innerHTML='<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    tico.setAttribute('viewBox','0 0 16 16');
    tico.setAttribute('fill','currentColor');tico.removeAttribute('stroke');
    tico.innerHTML='<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>';
  }
});

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
        document.getElementById(sectionId)?.scrollIntoView({behavior:'smooth',block:'start'});
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

// Re-render map on dark mode toggle
tbtn.addEventListener('click',()=>{ setTimeout(renderMap,50); });

// Initial render
renderMap();

/* ── CALCULATOR ──
   Coefficients from the VOICES modelling work (see CostCalculator docs).
   Component order: Cohorted, J/P Clinic, Local Pathway, MDT, Nurse-Led, Own Day, WaitTimes<7d. */
const CALC_COEFS={
  'Serious Infection':            {Intercept:-1.6440643, c:[-0.0896134, 0.0991329,-0.0433361,-0.0672609, 0.0256200,-0.0012824,-0.1454075]},
  'CVD':                          {Intercept:-2.8332321, c:[-0.0185650, 0.2257906,-0.2293697, 0.3179252,-0.1794882,-0.4972610,-0.4497504]},
  'Cancer':                       {Intercept:-3.2475184, c:[ 0.1072834,-0.5214687, 0.1715520, 0.4019695,-0.2713268,-0.1606682, 0.0167743]},
  'Mortality':                    {Intercept:-1.9032649, c:[-0.1894864, 0.0225450, 0.2945728, 0.3367448,-0.2144581,-0.1737194,-0.6764509]},
  'Emergency Hospital Admissions':{Intercept:-0.4088766, c:[ 0.0129831,-0.0286491,-0.1520726, 0.0992871,-0.2126616, 0.0772243,-0.1983540]}
};
const CALC_COMP_IDS=['cc1','cc2','cc3','cc4','cc5','cc6','cc7'];

function updateCalc(){
  const vol=parseInt(document.getElementById('calc-patients').value)||0;
  const cost=parseFloat(document.getElementById('calc-cost').value)||0;
  const outcome=document.getElementById('calc-outcome').value;
  const checks=CALC_COMP_IDS.map(id=>document.getElementById(id).checked);
  const count=checks.filter(Boolean).length;
  document.getElementById('impact-count').textContent=`${count} / 7`;
  document.getElementById('impact-bar').style.width=`${(count/7)*100}%`;

  if(!vol){
    ['out-infect','out-avoided','out-hosp','out-saving','out-total','out-impl'].forEach(id=>{
      document.getElementById(id).textContent='—';
    });
    document.getElementById('out-impl').classList.remove('positive','negative');
    return;
  }

  const co=CALC_COEFS[outcome];
  const sumWith=co.Intercept + co.c.reduce((a,b,i)=>a+(checks[i]?b:0),0);
  const baseEvents=Math.round(Math.exp(co.Intercept)*vol);
  const compEvents=Math.round(Math.exp(sumWith)*vol);
  const baseCost=baseEvents*cost;
  const compCost=compEvents*cost;
  const diff=compCost-baseCost;
  const pct=baseEvents?((compEvents-baseEvents)/baseEvents)*100:0;

  document.getElementById('out-infect').textContent=`${baseEvents.toLocaleString()} events`;
  document.getElementById('out-avoided').textContent=`${compEvents.toLocaleString()} events`;
  document.getElementById('out-hosp').textContent=`${pct>=0?'+':''}${pct.toFixed(1)}%`;
  document.getElementById('out-saving').textContent=`£${baseCost.toLocaleString()}`;
  document.getElementById('out-total').textContent=`£${compCost.toLocaleString()}`;
  const sign=diff<0?'−':(diff>0?'+':'');
  document.getElementById('out-impl').textContent=`${sign}£${Math.abs(diff).toLocaleString()}`;
}
updateCalc();

// ── Editable Table ──────────────────────────────────────────────────────────
(function(){
  const KEY_COMPONENTS=['Wait times new <7 days','Access IV therapy <7 days','Care via cohorted clinics','Nurse-led components of care','Access to MDT meeting'];
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

  // ── add / delete ───────────────────────────────────────────────────────────
  function addColumn(name){
    const id='ec'+(++colCounter);
    state.cols.push({id,name:name||''});
    const headerRow=document.getElementById('etblHeaderRow');
    const th=document.createElement('th');
    th.className='dept-col'; th.dataset.colId=id; th.draggable=true;
    th.innerHTML='<div class="dept-header-cell"><button class="dept-name-btn'+(name?'':' empty')+'" data-col-id="'+id+'">'+(name||'Click to name')+'</button><button class="dept-delete-btn" title="Remove column">&#215;</button></div>';
    headerRow.appendChild(th);
    bindHeaderEvents(th,id);
    document.querySelectorAll('#etblBody tr').forEach((tr,ri)=>{
      const td=document.createElement('td');
      td.dataset.colId=id; td.dataset.rowIdx=ri; td.className='empty-status'; td.title='Click to set status';
      td.innerHTML='<div class="es-inner"><span class="es-text">Select status</span><svg class="es-arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>';
      td.addEventListener('click',()=>showStatusDD(td,ri,id));
      tr.appendChild(td);
    });
    updateUI();
    recalcAngle();
  }

  function deleteColumn(id){
    state.cols=state.cols.filter(c=>c.id!==id);
    Object.keys(state.cells).forEach(k=>{if(k.endsWith('-'+id))delete state.cells[k];});
    document.querySelector('th[data-col-id="'+id+'"]')?.remove();
    document.querySelectorAll('td[data-col-id="'+id+'"]').forEach(el=>el.remove());
    updateUI();
    recalcAngle();
  }

  function setCell(ri,id,status){
    state.cells[ck(ri,id)]=status;
    const s=STATUSES.find(x=>x.value===status);
    const td=document.querySelector('#etblBody tr:nth-child('+(ri+1)+') td[data-col-id="'+id+'"]');
    if(!td)return;
    td.className=''; td.dataset.status=status; td.title=s?.label||status;
    td.innerHTML='<svg viewBox="0 0 24 24">'+s.svg+'</svg>';
    td.addEventListener('click',()=>showStatusDD(td,ri,id));
    updateDL();
  }

  function setDeptName(id,name){
    const col=state.cols.find(c=>c.id===id);
    if(col)col.name=name;
    const btn=document.querySelector('th[data-col-id="'+id+'"] .dept-name-btn');
    if(btn){btn.textContent=name;btn.classList.remove('empty');}
    updateDL();
    recalcAngle();
  }

  // ── header events ──────────────────────────────────────────────────────────
  function bindHeaderEvents(th,id){
    th.querySelector('.dept-name-btn').addEventListener('click',e=>{e.stopPropagation();showDeptDD(th.querySelector('.dept-name-btn'),id);});
    th.querySelector('.dept-delete-btn').addEventListener('click',e=>{e.stopPropagation();deleteColumn(id);});
    // drag
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
    const hr=document.getElementById('etblHeaderRow');
    const fTh=hr.querySelector('th[data-col-id="'+fromId+'"]');
    const tTh=hr.querySelector('th[data-col-id="'+toId+'"]');
    const fNext=fTh.nextSibling;
    if(tTh.nextSibling===fTh){hr.insertBefore(fTh,tTh);}
    else{hr.insertBefore(tTh,fTh);if(fNext)hr.insertBefore(fTh,fNext);else hr.appendChild(fTh);}
    document.querySelectorAll('#etblBody tr').forEach(tr=>{
      const fTd=tr.querySelector('td[data-col-id="'+fromId+'"]');
      const tTd=tr.querySelector('td[data-col-id="'+toId+'"]');
      const fNextTd=fTd.nextSibling;
      if(tTd.nextSibling===fTd){tr.insertBefore(fTd,tTd);}
      else{tr.insertBefore(tTd,fTd);if(fNextTd)tr.insertBefore(fTd,fNextTd);else tr.appendChild(fTd);}
    });
  }

  // ── angle calc ─────────────────────────────────────────────────────────────
  function recalcAngle(){
    const ths=document.querySelectorAll('th.dept-col');
    if(!ths.length)return;
    // measure text widths using a hidden probe span
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
      if(btn){
        btn.style.transform='translateX(-50%) rotate(-'+angle.toFixed(1)+'deg)';
        btn.style.bottom=bottomPx+'px';
      }
    });
    const emptyColInner=document.querySelector('.empty-col-inner');
    if(emptyColInner)emptyColInner.style.height=finalH+'px';
  }

  // ── dept dropdown ──────────────────────────────────────────────────────────
  function showDeptDD(trigger,id){
    closeAll();
    const dd=document.getElementById('etblDeptDropdown');
    const inp=dd.querySelector('input');
    inp.value='';
    renderDeptList(dd.querySelector('.etbl-dd-list'),id,'');
    positionDD(dd,trigger);
    dd.classList.add('open');
    inp.oninput=()=>renderDeptList(dd.querySelector('.etbl-dd-list'),id,inp.value);
    requestAnimationFrame(()=>inp.focus());
  }

  function renderDeptList(list,id,q){
    const lq=q.toLowerCase().trim();
    const matches=DEPT_SUGGESTIONS.filter(d=>d.toLowerCase().includes(lq));
    const custom=lq&&!DEPT_SUGGESTIONS.some(d=>d.toLowerCase()===lq);
    const opts=custom?[{label:'"'+q+'" (custom)',value:q},...matches.map(d=>({label:d,value:d}))]
                      :matches.map(d=>({label:d,value:d}));
    list.innerHTML='';
    if(!opts.length){list.innerHTML='<div style="padding:6px 10px;color:var(--t3);font-size:var(--fs-base-md)">Type a custom name above</div>';return;}
    opts.forEach(o=>{
      const div=document.createElement('div');
      div.className='etbl-dd-opt'; div.textContent=o.label;
      div.addEventListener('mousedown',e=>{e.preventDefault();setDeptName(id,o.value);closeAll();});
      list.appendChild(div);
    });
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
    // snap to cell — no gap, min width 140px, right-align if wider than cell
    const r=trigger.getBoundingClientRect();
    const ddW=Math.max(r.width,140);
    dd.style.top=(r.bottom+window.scrollY)+'px';
    dd.style.left=Math.max(8,(r.right+window.scrollX)-ddW)+'px';
    dd.style.width=ddW+'px';
    dd.classList.add('open');
  }

  function positionDD(dd,trigger){
    const r=trigger.getBoundingClientRect();
    dd.style.top=(r.bottom+window.scrollY+6)+'px';
    dd.style.left=Math.max(8,Math.min(r.left+window.scrollX,window.innerWidth-220))+'px';
    dd.style.width='';
  }
  function closeAll(){document.querySelectorAll('.etbl-dropdown.open').forEach(d=>d.classList.remove('open'));}
  document.addEventListener('click',e=>{if(!e.target.closest('.etbl-dropdown')&&!e.target.closest('[data-col-id]')&&!e.target.closest('.dept-delete-btn'))closeAll();});

  // ── UI state ───────────────────────────────────────────────────────────────
  function addEmptyCol(){
    if(document.getElementById('etblEmptyColTh'))return;
    const hr=document.getElementById('etblHeaderRow');
    const th=document.createElement('th');
    th.className='empty-col'; th.id='etblEmptyColTh';
    th.innerHTML='<div class="empty-col-inner"></div>';
    th.addEventListener('click',()=>addColumn(''));
    hr.appendChild(th);
    const rows=document.querySelectorAll('#etblBody tr');
    if(rows.length){
      const td=document.createElement('td');
      td.className='empty-col'; td.id='etblEmptyColTd';
      td.rowSpan=rows.length;
      td.innerHTML='<div class="empty-col-body"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add department</span></div>';
      td.addEventListener('click',()=>addColumn(''));
      rows[0].appendChild(td);
      function setHover(on){th.classList.toggle('empty-col-hover',on);td.classList.toggle('empty-col-hover',on);}
      th.addEventListener('mouseenter',()=>setHover(true));
      th.addEventListener('mouseleave',()=>setHover(false));
      td.addEventListener('mouseenter',()=>setHover(true));
      td.addEventListener('mouseleave',()=>setHover(false));
    }
  }
  function removeEmptyCol(){
    document.getElementById('etblEmptyColTh')?.remove();
    document.querySelectorAll('#etblBody td.empty-col').forEach(el=>el.remove());
  }
  function updateUI(){
    const empty=state.cols.length===0;
    if(empty)addEmptyCol(); else removeEmptyCol();
    document.getElementById('etblAddColRight').style.display=empty?'none':'';
    updateDL();
  }
  function updateDL(){
    document.getElementById('dlBtn').disabled=!state.cols.some(c=>c.name.trim());
  }


  // ── export ─────────────────────────────────────────────────────────────────
  function exportData(){
    const cols=state.cols.filter(c=>c.name.trim());
    return KEY_COMPONENTS.map((kc,i)=>{
      const row={'Key Component':kc};
      cols.forEach(col=>{const v=state.cells[ck(i,col.id)];row[col.name]=v?v.replace(/-/g,' '):'Unknown';});
      return row;
    });
  }
  function triggerBlob(content,type,name){
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([content],{type}));
    a.download=name; a.click();
  }
  function doDownload(fmt){
    const data=exportData();
    const cols=['Key Component',...state.cols.filter(c=>c.name.trim()).map(c=>c.name)];
    if(fmt==='csv'){
      triggerBlob([cols.join(','),...data.map(r=>cols.map(c=>'"'+(r[c]||'').replace(/"/g,'""')+'"').join(','))].join('\n'),'text/csv','vasculitis-mapping.csv');
    } else if(fmt==='txt'){
      triggerBlob([cols.join('\t'),...data.map(r=>cols.map(c=>r[c]||'').join('\t'))].join('\n'),'text/plain','vasculitis-mapping.txt');
    } else if(fmt==='json'){
      triggerBlob(JSON.stringify(data,null,2),'application/json','vasculitis-mapping.json');
    } else if(fmt==='xlsx'){
      if(!window.XLSX){alert('Excel export requires internet.');return;}
      const ws=XLSX.utils.json_to_sheet(data,{header:cols});
      const wb=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,ws,'Mapping');
      XLSX.writeFile(wb,'vasculitis-mapping.xlsx');
    } else if(fmt==='pdf'){
      if(!window.jspdf){alert('PDF export requires internet.');return;}
      const {jsPDF}=window.jspdf;
      const doc=new jsPDF({orientation:'landscape'});
      doc.setFontSize(13); doc.text('Vasculitis Service Mapping',14,14);
      doc.setFontSize(8);
      let y=24; const cw=Math.min(38,(280-14)/cols.length);
      doc.setFillColor(139,107,154); doc.setTextColor(255,255,255);
      doc.rect(14,y-5,cw*cols.length,8,'F');
      cols.forEach((c,i)=>doc.text(c.substring(0,14),14+i*cw+1,y));
      y+=8; doc.setTextColor(0,0,0);
      data.forEach((row,ri)=>{
        if(ri%2===0){doc.setFillColor(239,236,230);doc.rect(14,y-5,cw*cols.length,8,'F');}
        cols.forEach((c,i)=>doc.text((row[c]||'').substring(0,14),14+i*cw+1,y));
        y+=8;
      });
      doc.save('vasculitis-mapping.pdf');
    } else if(fmt==='png'||fmt==='jpeg'){
      if(!window.html2canvas){alert('Image export requires internet.');return;}
      const unknownSvg='<svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;display:block;margin:auto"><line x1=\"5\" y1=\"19\" x2=\"19\" y2=\"5\"/></svg>';
      html2canvas(document.getElementById('etblTable'),{
        backgroundColor:'#fff',scale:2,
        onclone:function(doc){
          doc.querySelectorAll('#etblTable td.empty-status').forEach(td=>{
            td.style.background='#8c8c93';
            td.innerHTML=unknownSvg;
          });
          doc.querySelectorAll('.dept-delete-btn,.etbl-add-col-right').forEach(el=>el.style.display='none');
        }
      }).then(canvas=>{
        const a=document.createElement('a');
        a.download='vasculitis-mapping.'+fmt;
        a.href=canvas.toDataURL(fmt==='jpeg'?'image/jpeg':'image/png');
        a.click();
      });
    }
  }

  // ── download button ────────────────────────────────────────────────────────
  const dlBtn=document.getElementById('dlBtn');
  const dlDD=document.getElementById('dlDropdown');
  dlBtn.addEventListener('click',e=>{e.stopPropagation();if(!dlBtn.disabled)dlDD.classList.toggle('open');});
  document.addEventListener('click',e=>{if(!e.target.closest('.dl-wrap'))dlDD.classList.remove('open');});
  dlDD.querySelectorAll('.dl-opt').forEach(opt=>{
    opt.addEventListener('click',e=>{
      e.stopPropagation(); dlDD.classList.remove('open');
      doDownload(opt.dataset.fmt);
    });
  });

  // ── add col trigger ────────────────────────────────────────────────────────
  document.getElementById('etblAddCol').addEventListener('click',e=>{e.stopPropagation();addColumn('');});

  // ── init ───────────────────────────────────────────────────────────────────
  updateUI();
  window.addEventListener('resize',recalcAngle);
})();

