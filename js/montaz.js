const $ = (id)=>document.getElementById(id);
const svgRoot = $('svgRoot');

  const state = {
    fontPx:14,
    bounds:{width:800,height:800},
    zoom:1,
    segments:[],
    segmentsH:[],
  units:'mm',
  decimals:0,
  rollCode:'1',
  rollType:'std',
  rollEnabled:true,
  rollPrintEnabled:false,
  rollAssemblyEnabled:false,
  printOps:1,
  lacquerNext:false,
  printSide:'bottom',
  rollVariant:'A',
  photoW:15,
  photoH:7,
  photoNote:'',
  photoEnabled:true,
  photoOffsetTop:5,
  photoOffsetRight:10,
  motiv:'',
  refPartA:'',
  refPartB:'',
  porCislo:'',
  orderNo:'',
  orderNote:'',
  repeatX:1,
  repeatY:1,
  gapX:0,
  gapY:0,
  repeatMode:'standard',
  bgImageData:null,
  bgOpacity:0.6,
  bgWidth:null,
  bgHeight:null,
  bgOffsetX:0,
  bgOffsetY:0,
  bgRot:0,
  bgFlip:false,
  templateImageData:null,
  templateWidth:null,
  templateHeight:null,
  templateSide:'none',
  templateGap:0,
  templateOffsetX:0,
  templateOffsetY:0,
  orez:3,
  orezShow:true,
  markEnabled:true,
  markText:'',
  calibActive:false,
  calibPoints:[],
  measureMode:'off',
  measurePick:null,
  measures:[],
  measurePreview:null
};

  const inputs = [
    'W','L','fontPx','toggle-grid','lineStyle','lineStyleH','strokeWidth',
    'dimPos','dimOffset','dimPosH','dimOffsetH','units','decimals',
    'motivInput','refPartA','refPartB','porCislo',
    'repeatX','repeatY','gapX','gapY','repeatMode',
    'orez','orezShow',
    'templateOffsetX','templateOffsetY',
    'markEnabled','markText','markText2',
  'rollEnabled','rollType','rollVariant','photoW','photoH','photoNote','exportOrient','bgWidth','bgHeight','bgOpacity','measureMode'
].map(id=>$(id));
const undoBtn = $('btn-undo');
const redoBtn = $('btn-redo');
const historyState = {
  undo: [],
  redo: [],
  isApplying: false,
  lastSig: ''
};
let historyTimer = null;

function num(el, fallback=0){ const v=parseFloat(el?.value); return Number.isFinite(v)?v:fallback; }
function numOrNull(el){
  const raw = (el?.value ?? '').toString().trim();
  if (raw === '') return null;
  const v = parseFloat(raw);
  return Number.isFinite(v) ? v : null;
}
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function isUndoTrackable(el){
  if (!el) return false;
  if (!(el instanceof HTMLElement)) return false;
  if (el.id === 'loadFile') return false;
  if (el.closest('button')) return false;
  const tag = el.tagName;
  if (tag === 'SELECT' || tag === 'TEXTAREA') return true;
  if (tag !== 'INPUT') return false;
  const type = (el.type || '').toLowerCase();
  return !['file','button','submit','reset'].includes(type);
}
function updateUndoRedoButtons(){
  if (undoBtn) undoBtn.disabled = historyState.undo.length <= 1;
  if (redoBtn) redoBtn.disabled = historyState.redo.length === 0;
}
function pushUndoSnapshot(clearRedo=true){
  if (historyState.isApplying) return;
  const snap = collectState();
  const sig = JSON.stringify(snap);
  if (sig === historyState.lastSig) return;
  historyState.undo.push(snap);
  if (historyState.undo.length > 100) historyState.undo.shift();
  historyState.lastSig = sig;
  if (clearRedo) historyState.redo = [];
  updateUndoRedoButtons();
}
function scheduleUndoSnapshot(){
  if (historyState.isApplying) return;
  if (historyTimer) clearTimeout(historyTimer);
  historyTimer = setTimeout(()=> pushUndoSnapshot(true), 120);
}
function applyUndoSnapshot(snap){
  if (!snap) return;
  historyState.isApplying = true;
  loadData(snap);
  historyState.isApplying = false;
}
function doUndo(){
  if (historyState.undo.length <= 1) return;
  const current = historyState.undo.pop();
  historyState.redo.push(current);
  const prev = historyState.undo[historyState.undo.length - 1];
  historyState.lastSig = JSON.stringify(prev);
  applyUndoSnapshot(prev);
  updateUndoRedoButtons();
}
function doRedo(){
  if (!historyState.redo.length) return;
  const snap = historyState.redo.pop();
  historyState.undo.push(snap);
  historyState.lastSig = JSON.stringify(snap);
  applyUndoSnapshot(snap);
  updateUndoRedoButtons();
}

function create(tag, attrs={}, parent=svgRoot){
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k,v])=> el.setAttribute(k,v));
  parent.appendChild(el);
  return el;
}
function clearSvg(){ while(svgRoot.firstChild) svgRoot.removeChild(svgRoot.firstChild); }

function ensureDefs(){
  if(svgRoot.querySelector('#arrow-roll')) return;
  const defs = create('defs');
  const marker = create('marker',{id:'arrow-roll',viewBox:'0 0 21 21',refX:'12',refY:'10.5',markerWidth:'15',markerHeight:'15',orient:'auto',markerUnits:'userSpaceOnUse'},defs);
  create('path',{d:'M 0 0 L 21 10.5 L 0 21 z',fill:'#0f172a'},marker);
}

function addSegmentInput(val=''){
  const wrap = document.createElement('div');
  wrap.style.display='flex'; wrap.style.gap='6px'; wrap.style.alignItems='center';
  const lab = document.createElement('span'); lab.textContent = `cast S ${state.segments.length+1}:`; lab.style.fontSize='13px';
  const inp = document.createElement('input'); inp.type='number'; inp.min='0'; inp.value = val; inp.style.flex='1'; inp.className='seg-input';
  inp.addEventListener('input', draw);
  wrap.appendChild(lab); wrap.appendChild(inp);
  $('segments').appendChild(wrap);
  state.segments.push(inp);
}
function removeSegmentInput(){
  if(state.segments.length===0) return;
  const inp = state.segments.pop();
  inp.parentElement?.remove();
  draw();
}

function addSegmentInputH(val=''){
  const wrap = document.createElement('div');
  wrap.style.display='flex'; wrap.style.gap='6px'; wrap.style.alignItems='center';
  const lab = document.createElement('span'); lab.textContent = `cast V ${state.segmentsH.length+1}:`; lab.style.fontSize='13px';
  const inp = document.createElement('input'); inp.type='number'; inp.min='0'; inp.value = val; inp.style.flex='1'; inp.className='segH-input';
  inp.addEventListener('input', draw);
  wrap.appendChild(lab); wrap.appendChild(inp);
  $('segmentsH').appendChild(wrap);
  state.segmentsH.push(inp);
}
function removeSegmentInputH(){
  if(state.segmentsH.length===0) return;
  const inp = state.segmentsH.pop();
  inp.parentElement?.remove();
  draw();
}

function textWithBg(txt,x,y,opts={}){
  const {
    color='#0f172a',
    anchor='middle',
    baseline='middle',
    parent=svgRoot,
    fontSize=null,
    fontWeight=null,
    boxWidth=null,
    boxHeight=null,
    bgFill='white',
    bgOpacity=0.9,
    padX=1,
    padY=0
  } = opts;
  const g = create('g',{},parent);
  const tAttrs = {x,y,'text-anchor':anchor,'dominant-baseline':baseline,fill:color,'font-size': fontSize || state.fontPx};
  if(fontWeight) tAttrs['font-weight'] = fontWeight;
  const t = create('text',tAttrs,g);
  t.textContent = txt;
  const bb = t.getBBox();
  if(boxWidth && boxHeight){
    const cx = bb.x + bb.width/2;
    const cy = bb.y + bb.height/2;
    const r = create('rect',{x:cx - boxWidth/2,y:cy - boxHeight/2,width:boxWidth,height:boxHeight,fill:bgFill,opacity:bgOpacity});
    g.insertBefore(r,t);
    return g;
  }
  const r = create('rect',{x:bb.x-padX,y:bb.y-padY,width:bb.width+2*padX,height:bb.height+2*padY,fill:bgFill,opacity:bgOpacity});
  g.insertBefore(r,t);
  return g;
}
const arrowLeft=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l 6 -4 v 8 z`,fill:c},p);
const arrowRight=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l -6 -4 v 8 z`,fill:c},p);
const arrowUp=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l -4 6 h 8 z`,fill:c},p);
const arrowDown=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l -4 -6 h 8 z`,fill:c},p);
const CORONA_TEXT = 'BEZ KORONOVEJ UPRAVY';
const CORONA_COLOR = '#166534';
const CORONA_BG = '#86efac';

function formatVal(v, dOverride=null){
  const d = (dOverride !== null && dOverride !== undefined) ? dOverride : (state.decimals ?? 0);
  const pow = Math.pow(10,d);
  const rounded = Math.round(v * pow) / pow;
  const numStr = rounded.toFixed(d);
  return state.units === 'mm' ? `${numStr} mm` : numStr;
}

function drawCoronaLegendSvg(parent, x, y){
  return textWithBg(CORONA_TEXT, x, y, {
    anchor:'end',
    baseline:'middle',
    parent,
    color: CORONA_COLOR,
    fontWeight:'700',
    fontSize:16,
    bgFill: CORONA_BG,
    bgOpacity: 0.3,
    padX: 6,
    padY: 4
  });
}
function formatPlain(v, dOverride=null){
  const d = (dOverride !== null && dOverride !== undefined) ? dOverride : (state.decimals ?? 0);
  const pow = Math.pow(10,d);
  return (Math.round(v * pow) / pow).toFixed(d);
}

function hDim(x1,y,x2,val,ext=10,color='#0f172a', fontScale=1, textOffset=null, useUnits=true, parent=svgRoot, decimalsOverride=null){
  if(x2<x1){ const t=x1; x1=x2; x2=t; }
  const sw = state.strokeWidth || 1;
  create('line',{x1,y1:y,x2,y2:y,stroke:color,'stroke-width':sw}, parent);
  create('line',{x1,y1:y-ext,x2:x1,y2:y+ext,stroke:color,'stroke-width':sw}, parent);
  create('line',{x1:x2,y1:y-ext,x2:x2,y2:y+ext,stroke:color,'stroke-width':sw}, parent);
  arrowLeft(x1,y,color,parent); arrowRight(x2,y,color,parent);
  const original = state.fontPx;
  state.fontPx = Math.max(6, original * fontScale);
  const txtOffset = (textOffset!==null ? textOffset : 6);
  const label = useUnits ? formatVal(val, decimalsOverride) : formatPlain(val, decimalsOverride);
  const g = parent || svgRoot;
  const lbl = textWithBg(label,(x1+x2)/2,y-txtOffset,{color,parent:g});
  if(lbl) lbl.setAttribute('class', `${lbl.getAttribute('class') || ''} dim-label`.trim());
  state.fontPx = original;
}
function vDim(x,y1,y2,val,ext=10,color='#0f172a', fontScale=1, textOffset=null, useUnits=true, parent=svgRoot){
  if(y2<y1){ const t=y1; y1=y2; y2=t; }
  const sw = state.strokeWidth || 1;
  create('line',{x1:x,x2:x,y1,y2,stroke:color,'stroke-width':sw}, parent);
  create('line',{x1:x-ext,x2:x+ext,y1:y1,y2:y1,stroke:color,'stroke-width':sw}, parent);
  create('line',{x1:x-ext,x2:x+ext,y1:y2,y2:y2,stroke:color,'stroke-width':sw}, parent);
  arrowUp(x,y1,color,parent); arrowDown(x,y2,color,parent);
  const baseOffset = Math.max(1, ext*0.6 + Math.round(state.fontPx*0.12));
  const offset = (textOffset!==null ? textOffset : baseOffset);
  const g = create('g',{transform:`translate(${x - offset} ${(y1+y2)/2}) rotate(-90)`, class:'dim-label-v'}, parent);
  const original = state.fontPx;
  state.fontPx = Math.max(6, original * fontScale);
  const t = create('text',{'text-anchor':'middle','dominant-baseline':'middle','font-size':state.fontPx,fill:color},g);
  t.textContent = useUnits ? formatVal(val) : formatPlain(val);
  state.fontPx = original;
}

function keepDimTextReadable(parent){
  if(!parent) return;
  parent.querySelectorAll('.dim-label').forEach((el)=>{
    const bb = el.getBBox();
    const cx = bb.x + bb.width/2;
    const cy = bb.y + bb.height/2;
    const base = el.getAttribute('transform') || '';
    el.setAttribute('transform', `${base} rotate(180 ${cx} ${cy})`.trim());
  });
  parent.querySelectorAll('.dim-label-v').forEach((el)=>{
    const base = el.getAttribute('transform') || '';
    el.setAttribute('transform', `${base} rotate(180 0 0)`.trim());
  });
}

function drawMeasurements(parent){
  const tgt = parent || svgRoot;
  for(const m of state.measures){
    if(m.type==='h'){
      const x1 = Math.min(m.x1, m.x2);
      const x2 = Math.max(m.x1, m.x2);
      const yTop = state.measureExtent?.yTop ?? Math.min(m.y1, m.y2);
      const yBottom = state.measureExtent?.yBottom ?? Math.max(m.y1, m.y2);
      if (yBottom > yTop){
        create('rect',{x:x1,y:yTop,width:x2-x1,height:(yBottom-yTop),fill:'#86efac',opacity:0.25,stroke:'none'}, tgt);
      }
      hDim(x1, m.y1, x2, Math.abs(m.x2-m.x1), 8, '#16a34a', 0.95, null, true, tgt);
    }else if(m.type==='v'){
      vDim(m.x1, m.y1, m.y2, Math.abs(m.y2-m.y1), 8, '#16a34a', 0.95, null, true, tgt);
    }
  }
  if(state.measurePreview){
    const m = state.measurePreview;
    if(m.type==='h'){
      const x1 = Math.min(m.x1, m.x2);
      const x2 = Math.max(m.x1, m.x2);
      const yTop = state.measureExtent?.yTop ?? Math.min(m.y1, m.y2);
      const yBottom = state.measureExtent?.yBottom ?? Math.max(m.y1, m.y2);
      if (yBottom > yTop){
        create('rect',{x:x1,y:yTop,width:x2-x1,height:(yBottom-yTop),fill:'#bbf7d0',opacity:0.35,stroke:'none'}, tgt);
      }
      hDim(x1, m.y1, x2, Math.abs(m.x2-m.x1), 8, '#22c55e', 0.95, null, true, tgt);
    }else if(m.type==='v'){
      vDim(m.x1, m.y1, m.y2, Math.abs(m.y2-m.y1), 8, '#22c55e', 0.95, null, true, tgt);
    }
  }
}

function draw(){
  const unitH = num($('W'),400);
  const unitW = num($('L'),600);
  state.repeatX = Math.max(1, Math.round(num($('repeatX'), 1)));
  state.repeatY = Math.max(1, Math.round(num($('repeatY'), 1)));
  state.gapX = num($('gapX'), 0);
  state.gapY = num($('gapY'), 0);
  state.repeatMode = $('repeatMode')?.value || 'standard';
  state.orez = Math.max(0, num($('orez'), 0));
  state.orezShow = !!$('orezShow')?.checked;
  state.templateOffsetX = num($('templateOffsetX'), 0);
  state.templateOffsetY = num($('templateOffsetY'), 0);
  state.photoEnabled = !!$('photoEnabled')?.checked;
  state.photoOffsetTop = num($('photoOffsetTop'), 5);
  state.photoOffsetRight = num($('photoOffsetRight'), 10);
  state.markEnabled = !!$('markEnabled')?.checked;
  state.markText = $('markText')?.value || '';
  state.markText2 = $('markText2')?.value || '';
  state.fontPx = parseInt($('fontPx')?.value,10)||14;
  $('fontPxVal').textContent = state.fontPx + ' px';
  const lineStyle = $('lineStyle')?.value === 'dashed' ? '6 4' : null;
  const lineStyleH = $('lineStyleH')?.value === 'dashed' ? '6 4' : null;
  state.strokeWidth = Math.max(0.2, num($('strokeWidth'),1));
  state.units = $('units')?.value || 'none';
  state.decimals = parseInt($('decimals')?.value,10) || 0;
  const dimPos = $('dimPos')?.value || 'bottom';
  let dimPosEff = (state.rollPrintEnabled || state.rollAssemblyEnabled) ? 'top' : dimPos;
  const dimOffsetVal = Math.max(0, num($('dimOffset'), 80));
  const dimPosH = $('dimPosH')?.value || 'right';
  const dimOffsetH = Math.max(0, num($('dimOffsetH'), 25));
  state.rollEnabled = !!$('rollEnabled')?.checked;
  state.rollPrintEnabled = !!$('rollPrint')?.checked;
  state.rollAssemblyEnabled = !!$('rollAssembly')?.checked;
  {
    const parsedPrintOps = parseInt($('printOps')?.value,10);
    state.printOps = Number.isFinite(parsedPrintOps) ? parsedPrintOps : 1;
  }
    state.lacquerNext = document.querySelector('input[name="lacquerStep"]:checked')?.value === 'yes';
  state.printSide = document.querySelector('input[name="printSide"]:checked')?.value || 'bottom';
  state.rollCode = $('rollType')?.value || '1';
  state.rollVariant = $('rollVariant')?.value || 'A';
  state.photoW = numOrNull($('photoW'));
  state.photoH = numOrNull($('photoH'));
  state.photoNote = $('photoNote')?.value || '';
  state.motiv = $('motivInput')?.value || '';
  state.refPartA = $('refPartA')?.value || '';
  state.refPartB = $('refPartB')?.value || '';
  state.porCislo = $('porCislo')?.value || '';
  state.orderNo = $('orderNo')?.value || '';
  state.orderNote = $('orderNote')?.value || '';
  // vypocet efektivneho navinu podla tlace/montaze
  const finalCode = state.rollCode;
  const finalVariant = state.rollVariant;
  const printMap = {
    '1A':{code:'2',variant:'A'}, '1B':{code:'2',variant:'C'}, '1C':{code:'2',variant:'B'}, '1D':{code:'2',variant:'D'}, '1E':{code:'2',variant:'E'},
    '2A':{code:'1',variant:'A'}, '2B':{code:'1',variant:'C'}, '2C':{code:'1',variant:'B'}, '2D':{code:'1',variant:'D'}, '2E':{code:'1',variant:'E'},
    '3A':{code:'4',variant:'A'}, '3B':{code:'4',variant:'C'}, '3C':{code:'4',variant:'B'}, '3D':{code:'4',variant:'D'}, '3E':{code:'4',variant:'D'},
    '4A':{code:'3',variant:'A'}, '4B':{code:'3',variant:'C'}, '4C':{code:'3',variant:'B'}, '4D':{code:'3',variant:'D'}, '4E':{code:'4',variant:'E'},
    '5A':{code:'6',variant:'A'}, '5B':{code:'6',variant:'C'}, '5C':{code:'6',variant:'B'}, '5D':{code:'6',variant:'D'}, '5E':{code:'6',variant:'E'},
    '6A':{code:'5',variant:'A'}, '6B':{code:'6',variant:'C'}, '6C':{code:'5',variant:'B'}, '6D':{code:'5',variant:'D'}, '6E':{code:'5',variant:'E'},
    '7A':{code:'8',variant:'A'}, '7B':{code:'7',variant:'C'}, '7C':{code:'8',variant:'B'}, '7D':{code:'8',variant:'D'}, '7E':{code:'8',variant:'E'},
    '8A':{code:'7',variant:'A'}, '8B':{code:'7',variant:'C'}, '8C':{code:'7',variant:'B'}, '8D':{code:'7',variant:'D'}, '8E':{code:'7',variant:'E'}
  };
  let effectiveCode = finalCode;
  let effectiveVariant = finalVariant;
  let navinMode = 'finalny';
  const opsEffective = state.printOps + (state.lacquerNext ? 1 : 0);
  const rotatePrint = (state.rollPrintEnabled && (opsEffective % 2 === 0));
  if (rotatePrint) {
    dimPosEff = (dimPosEff === 'top') ? 'bottom' : 'top';
  }
  if(state.rollPrintEnabled){
    navinMode = 'tlac';
    const isEven = (opsEffective % 2) === 0;
    if(!isEven){
      const mapped = printMap[`${finalCode}${finalVariant}`];
      if(mapped){
        effectiveCode = mapped.code;
        effectiveVariant = mapped.variant;
      }
    }
    const sideLetter = state.printSide === 'top' ? 'V' : 'S';
    $('rollPrintInfo').textContent = `Navin pri tlaci: ${effectiveCode}${effectiveVariant} - ${sideLetter}${effectiveCode}`;
    $('rollAssemblyInfo').textContent = '';
  } else if(state.rollAssemblyEnabled){
    navinMode = 'montaz';
    const isEven = (opsEffective % 2) === 0;
    if(!isEven){
      const mapped = printMap[`${finalCode}${finalVariant}`];
      if(mapped){
        effectiveCode = mapped.code;
        effectiveVariant = mapped.variant;
      }
    }
    const sideLetter = state.printSide === 'top' ? 'V' : 'S';
    $('rollAssemblyInfo').textContent = `${sideLetter}${effectiveCode}`;
    $('rollPrintInfo').textContent = '';
  } else {
    $('rollPrintInfo').textContent = '';
    $('rollAssemblyInfo').textContent = '';
  }
    const rollTypeEffective = (['1','2','5','6'].includes(effectiveCode) ? 'std' : 'alt');
  const rollCodeDraw = effectiveCode;
  const rollVariantDraw = effectiveVariant;
    const rollTypeDraw = rollTypeEffective;
    const lacquerBadge = $('lacquerBadge');
    if(lacquerBadge){
      if(state.lacquerNext){
        lacquerBadge.style.display = 'block';
      } else {
        lacquerBadge.style.display = 'none';
      }
    }
  let navinLabelText = `Navin: ${rollCodeDraw}${rollVariantDraw} (${navinMode})`;
  if(navinMode==='tlac'){
    const info = $('rollPrintInfo')?.textContent || '';
    if(info) navinLabelText = info;
  } else if(navinMode==='montaz'){
    const info = $('rollAssemblyInfo')?.textContent || '';
    navinLabelText = `Navin: ${info} (montaz)`;
  } else if(navinMode==='finalny'){
    navinLabelText = `Finalny navin: ${rollCodeDraw}${rollVariantDraw}`;
  }
  const mirrorABC = (navinMode==='montaz' && state.printSide==='bottom') || (navinMode==='tlac' && state.printSide==='bottom');
  const mirrorDims = (navinMode==='tlac' && state.printSide==='bottom');
  const dimPosHEff = mirrorDims ? (dimPosH === 'left' ? 'right' : 'left') : dimPosH;
  state.rollType = (['1','2','5','6'].includes(state.rollCode) ? 'std' : 'alt');
  state.bgOpacity = clamp(num($('bgOpacity'), 0.6),0,1);
  $('bgOpacityVal').textContent = `${Math.round(state.bgOpacity*100)} %`;
  state.bgWidth = $('bgWidth')?.value ? num($('bgWidth'), null) : null;
  state.bgHeight = $('bgHeight')?.value ? num($('bgHeight'), null) : null;

  const totalW = state.repeatX * unitW + Math.max(0, state.repeatX - 1) * state.gapX;
  const totalH = state.repeatY * unitH + Math.max(0, state.repeatY - 1) * state.gapY;

  const offsetX=60, offsetY=80;
  state.measureExtent = {yTop: offsetY, yBottom: offsetY + totalH};
  const baseDimOffset = dimOffsetVal;
  const yTop=offsetY, yBottom=offsetY+totalH;

  clearSvg();
  const allGroup = create('g',{class:'content-bbox'});
  const contentGroup = create('g',{class:'content-core'}, allGroup);
  const rollGroup = create('g',{class:'roll-group'}, allGroup);

  if($('toggle-grid')?.checked){
    const gridPad = 200;
    const gx = offsetX - gridPad;
    const gy = offsetY - gridPad;
    const gW = totalW + gridPad*2;
    const gH = totalH + gridPad*2;
    const gridStep = 50;
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
    gridGroup.setAttribute('stroke','#e2e8f0');
    gridGroup.setAttribute('stroke-width','1');
    for(let x=Math.floor(gx/gridStep)*gridStep; x<=gx+gW; x+=gridStep){
      create('line',{x1:x,y1:gy,x2:x,y2:gy+gH},gridGroup);
    }
    for(let y=Math.floor(gy/gridStep)*gridStep; y<=gy+gH; y+=gridStep){
      create('line',{x1:gx,y1:y,x2:gx+gW,y2:y},gridGroup);
    }
    svgRoot.appendChild(gridGroup);
  }

  // podklad
  if (state.bgImageData){
    const bgW = state.bgWidth ?? unitW;
    const bgH = state.bgHeight ?? unitH;
    const isAlt180 = (row, col)=>{
      if (state.repeatMode === 'alt-columns') return (col % 2) === 1;
      if (state.repeatMode === 'alt-rows') return (row % 2) === 1;
      if (state.repeatMode === 'checkerboard') return ((row + col) % 2) === 1;
      return false;
    };
    for(let row=0; row<state.repeatY; row++){
      for(let col=0; col<state.repeatX; col++){
        const cellX = offsetX + col * (unitW + state.gapX);
        const cellY = offsetY + row * (unitH + state.gapY);
        const cx = cellX + state.bgOffsetX + bgW/2;
        const cy = cellY + state.bgOffsetY + bgH/2;
        const transforms = [];
        if(state.bgRot % 360 !== 0){ transforms.push(`rotate(${state.bgRot} ${cx} ${cy})`); }
        if(state.bgFlip){ transforms.push(`translate(${2*cx} 0) scale(-1 1)`); }
        if(navinMode==='tlac' && state.printSide==='bottom'){ transforms.push(`translate(${2*cx} 0) scale(-1 1)`); }
        if(isAlt180(row, col)){ transforms.push(`rotate(180 ${cx} ${cy})`); }
        const img = create('image',{
          href: state.bgImageData,
          x: cellX + state.bgOffsetX,
          y: cellY + state.bgOffsetY,
          width: bgW,
          height: bgH,
          opacity: state.bgOpacity
        }, contentGroup);
        if(transforms.length){ img.setAttribute('transform', transforms.join(' ')); }
      }
    }
  }

  if (state.templateImageData && state.templateSide !== 'none'){
    const templateW = state.templateWidth ?? Math.max(40, Math.round(unitW * 0.2));
    const maxTemplateH = Math.max(0, totalH - 20);
    let templateH = state.templateHeight ?? maxTemplateH;
    if (templateH > maxTemplateH) templateH = maxTemplateH;
    const templateX = state.templateSide === 'left'
      ? offsetX - state.templateGap - templateW + state.templateOffsetX
      : offsetX + totalW + state.templateGap + state.templateOffsetX;
    const templateY = offsetY + totalH - templateH - 20 + state.templateOffsetY;
    create('image',{
      href: state.templateImageData,
      x: templateX,
      y: templateY,
      width: templateW,
      height: templateH,
      opacity: state.bgOpacity
    }, contentGroup);
  }

  // fotobunka v kazdej jednotke
  const hasPhotoMark = state.photoEnabled && Number.isFinite(state.photoW) && state.photoW > 0 && Number.isFinite(state.photoH) && state.photoH > 0;
  if (hasPhotoMark){
    const markW = state.photoW;
    const markH = state.photoH;
    const drawMarkInCell = (cellX, cellY, row, col)=>{
      const x = cellX + unitW - state.photoOffsetRight - markW;
      const y = cellY + state.photoOffsetTop;
      const rect = create('rect',{x, y, width:markW, height:markH, fill:'#00b5ff', stroke:'#00b5ff', 'stroke-width':state.strokeWidth}, contentGroup);
      return {x, y, w:markW, h:markH, rect};
    };
    for(let row=0; row<state.repeatY; row++){
      for(let col=0; col<state.repeatX; col++){
        const cellX = offsetX + col * (unitW + state.gapX);
        const cellY = offsetY + row * (unitH + state.gapY);
        const mark = drawMarkInCell(cellX, cellY, row, col);
        // ak je bunka otocena 180, aplikuj rovnake transformy ako obrazok
        const cx = cellX + state.bgOffsetX + (state.bgWidth ?? unitW)/2;
        const cy = cellY + state.bgOffsetY + (state.bgHeight ?? unitH)/2;
        const transforms = [];
        if(state.repeatMode === 'alt-columns' && (col % 2) === 1) transforms.push(`rotate(180 ${cx} ${cy})`);
        if(state.repeatMode === 'alt-rows' && (row % 2) === 1) transforms.push(`rotate(180 ${cx} ${cy})`);
        if(state.repeatMode === 'checkerboard' && ((row + col) % 2) === 1) transforms.push(`rotate(180 ${cx} ${cy})`);
        if(transforms.length){ mark.rect.setAttribute('transform', transforms.join(' ')); }
      }
    }
    // koty len pre prvu jednotku (0,0)
    const baseX = offsetX;
    const baseY = offsetY;
    const markX = baseX + unitW - state.photoOffsetRight - markW;
    const markY = baseY + state.photoOffsetTop;
    const labelSize = Math.max(10, state.fontPx - 2);
    // rozmer s vynasacou ciarou 45 stupnov z laveho dolneho rohu, cca 10mm
    const leadLen = 10;
    const leadX = markX - leadLen;
    const leadY = markY + markH + leadLen;
    create('line',{x1:markX, y1:markY+markH, x2:leadX, y2:leadY, stroke:'#0f172a','stroke-width':state.strokeWidth}, contentGroup);
    textWithBg(`${formatVal(markW)} x ${formatVal(markH)}`, leadX, leadY + labelSize, {anchor:'end', baseline:'hanging', parent:contentGroup, color:'#0f172a', fontWeight:'700', fontSize: labelSize});
    // offset top pri lavom hornom rohu, tesne pri značke
    const topLabelX = markX;
    const topLabelY = markY - 2;
    textWithBg(formatVal(state.photoOffsetTop), topLabelX, topLabelY, {anchor:'end', baseline:'baseline', parent:contentGroup, color:'#0f172a', fontWeight:'600', fontSize: labelSize});
    // offset right pri pravom dolnom rohu, tesne pri značke
    const rightLabelX = markX + markW + 4;
    const rightLabelY = markY + markH;
    textWithBg(formatVal(state.photoOffsetRight), rightLabelX, rightLabelY, {anchor:'start', baseline:'middle', parent:contentGroup, color:'#0f172a', fontWeight:'600', fontSize: labelSize});
  }

  // template znacky (sipka + referencny bod + text)
  if (state.markEnabled && state.templateSide !== 'none'){
    const templateW = state.templateWidth ?? Math.max(40, Math.round(unitW * 0.2));
    const maxTemplateH = Math.max(0, totalH - 20);
    let templateH = state.templateHeight ?? maxTemplateH;
    if (templateH > maxTemplateH) templateH = maxTemplateH;
    const templateX = state.templateSide === 'left'
      ? offsetX - state.templateGap - templateW + state.templateOffsetX
      : offsetX + totalW + state.templateGap + state.templateOffsetX;
    const templateY = offsetY + totalH - templateH - 20 + state.templateOffsetY;
    const anchorX = state.templateSide === 'left'
      ? templateX + 3
      : templateX + templateW - 3;
    const arrowTipY = offsetY + 50;
    const arrowH = 10, arrowW = 5;
    const shaftW = 2;
    const tipX = anchorX;
    const tipY = arrowTipY;
    const baseY = tipY + 4;
    const shaftTop = baseY;
    const shaftBottom = tipY + arrowH;
    const pathD = [
      `M ${tipX} ${tipY}`,
      `L ${tipX - arrowW/2} ${baseY}`,
      `L ${tipX - shaftW/2} ${baseY}`,
      `L ${tipX - shaftW/2} ${shaftBottom}`,
      `L ${tipX + shaftW/2} ${shaftBottom}`,
      `L ${tipX + shaftW/2} ${baseY}`,
      `L ${tipX + arrowW/2} ${baseY}`,
      'Z'
    ].join(' ');
    create('path',{d:pathD, fill:'#0f172a'}, contentGroup);
    const dotY = tipY + 30;
    create('circle',{cx:tipX, cy:dotY, r:1.5, fill:'#0f172a'}, contentGroup);
    const textY = offsetY + 110;
    const fullTxt1 = (state.markText || 'Essity template').trim();
    const fullTxt2 = (state.markText2 || '').trim();
    const part1 = fullTxt1.slice(0,20) || ' ';
    const part2 = fullTxt2 ? fullTxt2.slice(0,15) : '';
    const addRotatedText = (txt, yPos)=>{
      const node = textWithBg(txt, tipX, yPos, {anchor:'start', baseline:'middle', parent:contentGroup, color:'#0f172a', fontWeight:'700', fontSize: 4});
      if (node) {
        const bb = node.getBBox();
        const cx = bb.x;
        const cy = bb.y + bb.height/2;
        node.setAttribute('transform', `rotate(90 ${cx} ${cy})`);
      }
    };
    addRotatedText(part1, textY);
    if (part2) addRotatedText(part2, offsetY + 160);
  }

  // hlavny obdlznik montaze
  create('rect',{x:offsetX,y:offsetY,width:totalW,height:totalH,fill:'none',stroke:'#0f172a','stroke-width':state.strokeWidth}, contentGroup);

  // orezove ciary a koty
  const orez = state.orez;
  const orezLeftX = offsetX - orez;
  const orezRightX = offsetX + totalW + orez;
  if (orez > 0 && state.orezShow){
    const orezStyle = {'stroke':'#dc2626','stroke-width':state.strokeWidth,'stroke-dasharray':'4 3'};
    create('line',{x1:orezLeftX,y1:offsetY,x2:orezLeftX,y2:yBottom,...orezStyle}, contentGroup);
    create('line',{x1:orezRightX,y1:offsetY,x2:orezRightX,y2:yBottom,...orezStyle}, contentGroup);
    const baseGap = Math.max(80, state.fontPx*5);
    const dimBaseY = dimPosEff === 'top' ? (yTop - baseGap) : (yBottom + baseGap);
    const delta = dimPosEff === 'top' ? -18 : 18;
    hDim(orezLeftX, dimBaseY, offsetX, orez, 10, '#dc2626', 1.0, null, true, contentGroup);
    hDim(offsetX+totalW, dimBaseY, orezRightX, orez, 10, '#dc2626', 1.0, null, true, contentGroup);
    hDim(orezLeftX, dimBaseY + delta, orezRightX, totalW + 2*orez, 10, '#dc2626', 1.1, null, true, contentGroup);
  }

  // delenie sirky
  const segValues = state.segments.map(inp => num(inp,0)).filter(v=>v>0);
  const sumSeg = segValues.reduce((a,b)=>a+b,0);
  const remainder = Math.max(unitW - sumSeg, 0);
  const parts = [...segValues];
  if (remainder > 0 || parts.length===0) parts.push(remainder);
  const partsEff = mirrorDims ? [...parts].reverse() : parts;

  // delenie vysky
  const segValuesH = state.segmentsH.map(inp => num(inp,0)).filter(v=>v>0);
  const sumSegH = segValuesH.reduce((a,b)=>a+b,0);
  const remainderH = Math.max(unitH - sumSegH, 0);
  const partsH = [...segValuesH];
  if (remainderH > 0 || partsH.length===0) partsH.push(remainderH);

  // koty sirky
  const segOffset = Number.isFinite(baseDimOffset) ? baseDimOffset : 25;
  const segY = dimPosEff === 'top' ? yTop - segOffset : yBottom + segOffset;
  let cursor = offsetX;
  partsEff.forEach((len, idx)=>{
    const next = cursor + len;
    hDim(cursor, segY, next, len, 10, '#0f172a', 0.9, null, true, contentGroup);
    cursor = next;
  });
  for(let col=0; col<state.repeatX; col++){
    const cellX = offsetX + col * (unitW + state.gapX);
    let partCursor = cellX;
    partsEff.forEach((len, idx)=>{
      const next = partCursor + len;
      if (idx < partsEff.length - 1){
        create('line',{x1:next,y1:offsetY,x2:next,y2:yBottom,stroke:'#475569','stroke-width':state.strokeWidth,'stroke-dasharray':lineStyle || ''}, contentGroup);
      }
      partCursor = next;
    });
    if (col < state.repeatX - 1){
      const splitX = cellX + unitW;
      create('line',{x1:splitX,y1:offsetY,x2:splitX,y2:yBottom,stroke:'#0f172a','stroke-width':state.strokeWidth}, contentGroup);
    }
  }
  hDim(offsetX, segY + (dimPosEff==='top' ? -20 : 20), offsetX+unitW, unitW, 10, '#0f172a', 1.1, null, true, contentGroup);
  if (state.repeatX > 1 || state.gapX !== 0){
    hDim(offsetX, segY + (dimPosEff==='top' ? -40 : 40), offsetX+totalW, totalW, 10, '#0f172a', 1.1, null, true, contentGroup);
  }

  // koty vysky
  const segOffsetH = dimOffsetH || Math.max(50, Math.round(state.fontPx*3.2));
  const segX = dimPosHEff === 'left' ? offsetX - segOffsetH : offsetX + totalW + segOffsetH;
  cursor = offsetY;
  partsH.forEach((len, idx)=>{
    const next = cursor + len;
    vDim(segX, cursor, next, len, 10, '#0f172a', 0.9, null, true, contentGroup);
    cursor = next;
  });
  for(let row=0; row<state.repeatY; row++){
    const cellY = offsetY + row * (unitH + state.gapY);
    let partCursorY = cellY;
    partsH.forEach((len, idx)=>{
      const next = partCursorY + len;
      if (idx < partsH.length - 1){
        create('line',{x1:offsetX,y1:next,x2:offsetX+totalW,y2:next,stroke:'#475569','stroke-width':state.strokeWidth,'stroke-dasharray':lineStyleH || ''}, contentGroup);
      }
      partCursorY = next;
    });
    if (row < state.repeatY - 1){
      const splitY = cellY + unitH;
      create('line',{x1:offsetX,y1:splitY,x2:offsetX+totalW,y2:splitY,stroke:'#0f172a','stroke-width':state.strokeWidth}, contentGroup);
    }
  }
  vDim(segX + (dimPosHEff==='left' ? -20 : 20), offsetY, offsetY+unitH, unitH, 10, '#0f172a', 1.1, null, true, contentGroup);
  if (state.repeatY > 1 || state.gapY !== 0){
    vDim(segX + (dimPosHEff==='left' ? -40 : 40), offsetY, offsetY+totalH, totalH, 10, '#0f172a', 1.1, null, true, contentGroup);
  }

  let rollBounds = null;
  // navin (preberene z predchadzajucej verzie)
  const rollActive = state.rollEnabled || state.rollPrintEnabled || state.rollAssemblyEnabled;
  const mirrorPrint = (navinMode==='tlac');
  const mirrorMontage = (navinMode==='montaz');
  if(rollActive){
    ensureDefs();
    const rollR = Math.max(40, (totalH/10));
    const innerR = rollR/2;
    const baseYRoll = yTop - 20 - rollR;
    const yRoll = rollTypeDraw === 'alt' ? baseYRoll - 65 : baseYRoll;
    const navParent = create('g',{class:'roll'}, rollGroup);

    if(rollTypeDraw === 'alt'){
      const leftCx = offsetX + rollR;
      const rightCx = offsetX + totalW;
      create('circle',{cx:leftCx, cy:yRoll, r:rollR, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const topRightY = yRoll - rollR;
      const bottomRightY = yRoll + rollR;
      const rightHalfPath = `M ${rightCx} ${topRightY} A ${rollR} ${rollR} 0 0 1 ${rightCx} ${bottomRightY}`;
      create('path',{d:rightHalfPath, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      create('circle',{cx:leftCx, cy:yRoll, r:innerR, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const topY = yRoll - rollR;
      const bottomY = yRoll + rollR;
      create('line',{x1:leftCx,y1:topY,x2:rightCx,y2:topY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      create('line',{x1:leftCx,y1:bottomY,x2:rightCx,y2:bottomY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const leftLinkX = leftCx - rollR;
      const leftLinkY = yRoll;
      const leftCornerY = yTop - 5;
      create('line',{x1:leftLinkX,y1:leftLinkY,x2:offsetX,y2:leftCornerY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const rightCornerX = offsetX + totalW;
      const rightCornerY = yTop - 5;
      create('line',{x1:rightCornerX,y1:rightCornerY,x2:rightCx,y2:bottomY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      create('line',{x1:offsetX,y1:leftCornerY,x2:rightCornerX,y2:rightCornerY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const arrowX = offsetX + totalW/2;
      const arrowEndY = leftCornerY - 5;
      const arrowStartY = arrowEndY - rollR;
      create('line',{x1:arrowX,y1:arrowStartY,x2:arrowX,y2:arrowEndY,stroke:'#0f172a','stroke-width':state.strokeWidth,'marker-end':'url(#arrow-roll)'}, navParent);
      rollBounds = {
        minX: leftCx - rollR,
        maxX: rightCx + rollR,
        minY: Math.min(topY, arrowStartY),
        maxY: Math.max(bottomY, arrowEndY)
      };
    } else {
      const leftCx = offsetX - rollR;
      create('circle',{cx:leftCx, cy:yRoll, r:rollR, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      create('circle',{cx:leftCx, cy:yRoll, r:innerR, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const leftTouchX = leftCx + rollR;
      const leftCornerX = offsetX;
      const leftCornerY = yTop - 5;
      create('line',{x1:leftTouchX,y1:yRoll,x2:leftCornerX,y2:leftCornerY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);

      const rightCornerX = offsetX + totalW;
      const rightCornerY = yTop - 5;
      const arcStartX = rightCornerX - rollR;
      const arcStartY = yRoll - rollR;
      const arcEndX = rightCornerX;
      const arcEndY = yRoll;
      create('line',{x1:leftCx,y1:yRoll-rollR,x2:arcStartX,y2:arcStartY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const arcPath = `M ${arcStartX} ${arcStartY} A ${rollR} ${rollR} 0 0 1 ${arcEndX} ${arcEndY}`;
      create('path',{d:arcPath, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const lowerEndY = rightCornerY;
      create('line',{x1:arcEndX,y1:arcEndY,x2:rightCornerX,y2:lowerEndY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      create('line',{x1:leftCornerX,y1:leftCornerY,x2:rightCornerX,y2:rightCornerY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const leftBottomY = yRoll + rollR;
      create('line',{x1:leftCx,y1:leftBottomY,x2:leftCornerX,y2:leftBottomY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const arrowX = (leftCornerX + rightCornerX) / 2;
      const arrowStartX = arrowX - rollR;
      const arrowStartY = yRoll - rollR;
      const arrowMidX = arrowX;
      const arrowMidY = yRoll;
      const arrowBottomY = yRoll + rollR;
      const arrowPath = `M ${arrowStartX} ${arrowStartY} A ${rollR} ${rollR} 0 0 1 ${arrowMidX} ${arrowMidY} L ${arrowMidX} ${arrowBottomY}`;
      create('path',{d:arrowPath, fill:'none', stroke:'#0f172a','stroke-width':state.strokeWidth,'marker-end':'url(#arrow-roll)'}, navParent);

      rollBounds = {
        minX: Math.min(leftCx - rollR, arcStartX - rollR),
        maxX: Math.max(rightCornerX, leftCx + rollR),
        minY: Math.min(yRoll - rollR, arcStartY),
        maxY: yRoll + rollR
      };
    }

    // jednotne vykreslenie ABC podla typu navinu
    const labelX = offsetX + totalW/2;
    const rollLabelConfig = {
      '1': {y: yTop - 50, dx: 0, rot: 0},
      '2': {y: yTop - 50, dx: 0, rot: 180},
      '3': {y: yTop - 40, dx: 0, rot: 0},
      '4': {y: yTop - 40, dx: 0, rot: 180},
      '5': {y: yTop - 50, dx: 25, rot: 90},
      '6': {y: yTop - 50, dx: -25, rot: -90},
      '7': {y: yTop - 45, dx: 25, rot: 90},
      '8': {y: yTop - 45, dx: -25, rot: -90}
    };
    const labelCfg = rollLabelConfig[rollCodeDraw];
    if(labelCfg){
      const lx = labelX + (labelCfg.dx || 0);
      const ly = labelCfg.y;
      const g = textWithBg('ABC', lx, ly, {
        anchor:'middle',
        baseline:'middle',
        color:'#0f172a',
        parent:navParent,
        fontSize: 40,
        fontWeight:'700',
        boxWidth:70,
        boxHeight:30
      });
      const tParts = [];
      // mirror musi byt aplikovany po rotacii (poradie transformov je sprava dolava)
      if(mirrorABC){
        tParts.push(`translate(${2*lx} 0) scale(-1 1)`);
      }
      if(labelCfg.rot){
        tParts.push(`rotate(${labelCfg.rot} ${lx} ${ly})`);
      }
      if(tParts.length) g.setAttribute('transform', tParts.join(' '));
    }

    // varianty fotoznakov v navine
    if(['A','B','C','E'].includes(rollVariantDraw)){
      const hasPhotoMark = Number.isFinite(state.photoW) && state.photoW > 0 && Number.isFinite(state.photoH) && state.photoH > 0;
      const markW = hasPhotoMark ? Math.max(1, state.photoW) : 0;
      const markH = hasPhotoMark ? Math.max(1, state.photoH) : 0;
      const topY = yTop - 5 - markH;
      if (hasPhotoMark){
        const mirrorMark = (navinMode === 'tlac' && state.printSide === 'bottom');
        const drawMark = (x)=> {
          const mx = mirrorMark ? (2 * (offsetX + totalW/2) - (x + markW)) : x;
          create('rect',{x: mx, y:topY, width:markW, height:markH, fill:'#000'}, navParent);
        };
        if(rollVariantDraw==='A' || rollVariantDraw==='B'){
          drawMark(offsetX);
        }
        if(rollVariantDraw==='A' || rollVariantDraw==='C'){
          drawMark(offsetX + totalW - markW);
        }
        if(rollVariantDraw==='E'){
          const centerX = offsetX + totalW/2;
          if(['1','2','3','4'].includes(rollCodeDraw)){
            drawMark(centerX + markW/2 + 5);
          }else{
            let posX = centerX;
            if(rollCodeDraw==='5') posX = centerX - 25;
            else if(rollCodeDraw==='6') posX = centerX + 25;
            else if(rollCodeDraw==='7') posX = centerX - 25;
            else if(rollCodeDraw==='8') posX = centerX + 25;
            drawMark(posX - markW/2);
          }
        }
      }
    }

    // rollBounds: ak nie je nastavene, pokryje navin
    if(!rollBounds){
      const bb = navParent.getBBox();
      rollBounds = {minX:bb.x, maxX:bb.x+bb.width, minY:bb.y, maxY:bb.y+bb.height};
    }

    if(mirrorPrint || mirrorMontage){
      // otocime okolo stredu vlastneho bboxu, potom posunieme o dx/dy podla typu
      const bb = navParent.getBBox();
      const cx = bb.x + bb.width/2;
      const cy = bb.y + bb.height/2;
      navParent.setAttribute('transform', `rotate(180 ${cx} ${cy})`);
      const bbRot = navParent.getBBox();
      const dx = (['1','2','5','6'].includes(rollCodeDraw) ? rollR*2 : -rollR);
      const dy = (yBottom + 5) - bbRot.y;
      navParent.setAttribute('transform', `translate(${dx} ${dy}) rotate(180 ${cx} ${cy})`);
      const bb2 = navParent.getBBox();
      rollBounds = {minX:bb2.x, maxX:bb2.x+bb2.width, minY:bb2.y, maxY:bb2.y+bb2.height};
    }
  }

  // popis pouziteho navinu
  // hlavicka nad platnom: dva obdlzniky a text navinu v prvom, dynamicky podla navin bounds
  // spodny textovy blok (mimo kresliace platno, pod vykresom)
  const baseBottom = Math.max(offsetY + totalH, rollBounds ? rollBounds.maxY : 0);
  const noteY = baseBottom + 120;
  const hasPhotoText = Number.isFinite(state.photoW) && state.photoW > 0 && Number.isFinite(state.photoH) && state.photoH > 0;
  const photoText = hasPhotoText ? `Rozmer fotobunky: ${state.photoW} x ${state.photoH}` : '';
  const noteText = state.photoNote || '';
  const stamp = new Date().toLocaleString('sk-SK');
  const footerGroup = create('g',{class:'footer-ui'}, allGroup);
  if (photoText){
    textWithBg(photoText, offsetX, noteY, {anchor:'start', baseline:'middle', parent:footerGroup, color:'#0f172a', fontWeight:'700', fontSize:14});
  }
  textWithBg(noteText, photoText ? (offsetX + 260) : offsetX, noteY, {anchor:'start', baseline:'middle', parent:footerGroup, color:'#0f172a', fontWeight:'400', fontSize:14});
  textWithBg(stamp, offsetX, noteY + 18, {anchor:'start', baseline:'middle', parent:footerGroup, color:'#64748b', fontWeight:'400', fontSize:12});

  // hlavicka nad vykresom (vlozene do allGroup, aby bola viditelna)
    if(rollBounds){
      const headerH = 32;
      const headerW = 220;
      const dimOffsetVal = num($('dimOffset'), 25);
      const topPad = (dimPosEff === 'top') ? (dimOffsetVal + 24) : 24;
      const aboveDrawingY = yTop - headerH - topPad;
      const aboveRollY = rollBounds.minY - headerH - 10;
      const headerY = Math.min(aboveDrawingY, aboveRollY);
      const headerGroup = create('g',{class:'header-ui'}, allGroup);
      const titleY = headerY - 18;
    const refA = (state.refPartA || '').trim();
    const refB = (state.refPartB || '').trim();
    const refLabel = refB ? `${refA}/${refB}` : refA;
    const porTxt = (state.porCislo || '').trim();
    const motivTxt = (state.motiv || '').trim();
    if (refLabel || porTxt || motivTxt) {
      textWithBg(`CRV ${refLabel}`, 10, titleY, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      if (porTxt) {
        textWithBg(`PCV ${porTxt}`, 220, titleY, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      }
      if (motivTxt) {
        textWithBg(`Motiv ${motivTxt}`, 430, titleY, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      }
    }
    const sideText = state.printSide === 'top' ? 'vrchna' : 'spodna';
    const lacquerText = state.lacquerNext ? 'Lak na inom oddeleni (inseter/kasirka)' : '';
    const lacquerColor = state.lacquerNext ? '#dc2626' : '#0f172a';
    const headerMidY = headerY + headerH/2;
    textWithBg(navinLabelText, 10, headerMidY, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#dc2626', fontWeight:'700', fontSize:20});
    drawCoronaLegendSvg(headerGroup, offsetX + totalW, headerMidY);
    const headerNote = (navinMode === 'tlac' && state.printSide === 'bottom') ? 'Pohlad cez montaz' : '';
    if (headerNote) {
      textWithBg(headerNote, headerW + 18, headerY + headerH/2, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      textWithBg(`Sposob tlace: ${sideText}`, 10, headerY + headerH/2 + 18, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      if(lacquerText){
        textWithBg(lacquerText, 230, headerY + headerH/2 + 18, {anchor:'start', baseline:'middle', parent:headerGroup, color:lacquerColor, fontWeight:'700', fontSize:16});
      }
    } else {
      textWithBg(`Sposob tlace: ${sideText}`, 10, headerY + headerH/2 + 18, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      if(lacquerText){
        textWithBg(lacquerText, 230, headerY + headerH/2 + 18, {anchor:'start', baseline:'middle', parent:headerGroup, color:lacquerColor, fontWeight:'700', fontSize:16});
      }
    }
  }

  // merania
  drawMeasurements(contentGroup);

  ensureDefs();

  // rotacia celeho vykresu pri navine 1 a duplex (iba tlac)
  if (rotatePrint) {
    const cx = offsetX + totalW / 2;
    const cy = offsetY + totalH / 2;
    contentGroup.setAttribute('transform', `rotate(180 ${cx} ${cy})`);
    keepDimTextReadable(contentGroup);
  }

  // viewBox to content (bez mriezky) pre zachovanie mierky
  const bb = allGroup.getBBox();
  const pad = 60;
  let minX = Math.floor(bb.x - pad);
  let minY = Math.floor(bb.y - pad);
  let maxX = Math.ceil(bb.x + bb.width + pad);
  let maxY = Math.ceil(bb.y + bb.height + pad);
  if(rollBounds){
    minX = Math.min(minX, rollBounds.minX - pad);
    minY = Math.min(minY, rollBounds.minY - pad);
    maxX = Math.max(maxX, rollBounds.maxX + pad);
    maxY = Math.max(maxY, rollBounds.maxY + pad);
  }
  const width = maxX - minX;
  const height = maxY - minY;
    svgRoot.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
    const zw = width * state.zoom;
    const zh = height * state.zoom;
    svgRoot.setAttribute('width', zw);
    svgRoot.setAttribute('height', zh);
    svgRoot.style.width = `${zw}px`;
    svgRoot.style.height = `${zh}px`;
  svgRoot.setAttribute('width', width);
  svgRoot.setAttribute('height', height);
  state.bounds = {width,height};
}

function reset(){
  $('W').value=400; $('L').value=600; $('fontPx').value=14; $('fontPxVal').textContent='14 px'; $('toggle-grid').checked=false; $('lineStyle').value='solid';
  $('repeatX').value='1'; $('repeatY').value='1'; $('gapX').value='0'; $('gapY').value='0'; $('repeatMode').value='standard';
  $('orez').value='3';
  $('orezShow').checked = true;
  $('strokeWidth').value=1; $('dimPos').value='bottom'; $('dimOffset').value=25; $('dimPosH').value='right'; $('dimOffsetH').value=25; $('lineStyleH').value='solid';
  $('units').value='none'; $('decimals').value='0';
  $('rollEnabled').checked=true; $('rollPrint').checked=false; $('rollAssembly').checked=false; $('rollType').value='1'; $('rollVariant').value='A';
  $('printOps').value='1'; $('printSideBottom').checked=true;
  $('strokeWidth').value='0.8';
  if ($('lacquerNo')) $('lacquerNo').checked = true;
  $('photoW').value = 15; $('photoH').value = 7; if ($('photoNote')) $('photoNote').value = '';
  if ($('photoEnabled')) $('photoEnabled').checked = true;
  if ($('photoOffsetTop')) $('photoOffsetTop').value = 5;
  if ($('photoOffsetRight')) $('photoOffsetRight').value = 10;
  if ($('markEnabled')) $('markEnabled').checked = true;
  if ($('markText')) $('markText').value = '';
  if ($('markText2')) $('markText2').value = '';
  if ($('motivInput')) $('motivInput').value = '';
  if ($('refPartA')) $('refPartA').value = '';
  if ($('refPartB')) $('refPartB').value = '';
  if ($('porCislo')) $('porCislo').value = '';
  if ($('orderNo')) $('orderNo').value = '';
  if ($('orderNote')) $('orderNote').value = '';
  state.repeatX = 1; state.repeatY = 1; state.gapX = 0; state.gapY = 0; state.repeatMode = 'standard'; state.orez = 3; state.orezShow = true;
  $('exportOrient').value='portrait';
  $('bgFile').value=''; state.bgImageData=null; $('bgWidth').value=''; $('bgHeight').value=''; state.bgWidth=null; state.bgHeight=null; state.bgOpacity=0.6; $('bgOpacity').value=0.6; $('bgOpacityVal').textContent='60 %'; state.bgRot=0; state.bgFlip=false; state.bgOffsetX=0; state.bgOffsetY=0;
  $('templateFile').value=''; $('templateWidth').value=''; $('templateHeight').value=''; $('templateSide').value='none'; $('templateGap').value='0'; $('templateOffsetX').value='0'; $('templateOffsetY').value='0'; state.templateImageData=null; state.templateWidth=null; state.templateHeight=null; state.templateSide='none'; state.templateGap=0; state.templateOffsetX=0; state.templateOffsetY=0;
  $('measureMode').value='off'; state.measureMode='off'; state.measurePick=null; state.measures=[]; state.measurePreview=null;
  state.photoEnabled = true; state.photoOffsetTop = 5; state.photoOffsetRight = 10;
  state.markEnabled = true; state.markText = ''; state.markText2 = '';
  state.calibActive=false; state.calibPoints=[]; $('bg-calib-cancel').style.display='none'; $('bg-calib').style.display='inline-block'; svgRoot.style.cursor='';
  $('segments').innerHTML=''; state.segments.length=0; addSegmentInput('');
  $('segmentsH').innerHTML=''; state.segmentsH.length=0; addSegmentInputH('');
  document.querySelectorAll('.epsfilled').forEach(el=> el.classList.remove('epsfilled'));
  draw();
  if (!historyState.isApplying) pushUndoSnapshot(true);
}

function exportPDF(){
  draw();
  const liveGroup = svgRoot.querySelector('g.content-bbox') || svgRoot;
  const bb = liveGroup.getBBox();
  const clone = svgRoot.cloneNode(true);
  // remove headers/footers for PDF export (keep technical drawing + navin)
  clone.querySelectorAll('.header-ui, .footer-ui').forEach(n=> n.remove());
  const width = bb.width || state.bounds.width || 800;
  const height = bb.height || state.bounds.height || 800;
  const refName = [state.refPartA, state.refPartB].map(v => (v || '').trim()).filter(Boolean).join('_');
  const baseName = (refName || state.orderNo || 'montaz').trim();

  // remove zoom sizing/styles so PDF is 1:1
  clone.removeAttribute('style');
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  clone.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
  clone.setAttribute('width', `${width}mm`);
  clone.setAttribute('height', `${height}mm`);
  clone.setAttribute('preserveAspectRatio','none');
  const svgMarkup = new XMLSerializer().serializeToString(clone);
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${baseName} PDF</title>
  <style>
    @page { size: ${width}mm ${height}mm; margin: 0; }
    html, body { width:${width}mm; height:${height}mm; margin:0; padding:0; }
    svg { width:${width}mm; height:${height}mm; display:block; }
  </style>
</head>
<body>
${svgMarkup}
<script>window.onload=()=>{ window.print(); setTimeout(()=>window.close(), 500); }<\/script>
</body>
</html>`;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if(!win){ alert('Povolte vyskakovacie okno pre export.'); }
  setTimeout(()=> URL.revokeObjectURL(url), 5000);
}

function exportPNG(){
  const orient = $('exportOrient')?.value || 'portrait';
  const pxW = orient==='portrait' ? 3508 : 4961; // A3 at 300dpi
  const pxH = orient==='portrait' ? 4961 : 3508;
  const marginPx = Math.round(0.04 * Math.min(pxW, pxH));
  const finalCode = state.rollCode || $('rollType')?.value || '1';
  const finalVariant = state.rollVariant || $('rollVariant')?.value || 'A';
  const printMap = {
    '1A':{code:'2',variant:'A'}, '1B':{code:'2',variant:'C'}, '1C':{code:'2',variant:'B'}, '1D':{code:'2',variant:'D'}, '1E':{code:'2',variant:'E'},
    '2A':{code:'1',variant:'A'}, '2B':{code:'1',variant:'C'}, '2C':{code:'1',variant:'B'}, '2D':{code:'1',variant:'D'}, '2E':{code:'1',variant:'E'},
    '3A':{code:'4',variant:'A'}, '3B':{code:'4',variant:'C'}, '3C':{code:'4',variant:'B'}, '3D':{code:'4',variant:'D'}, '3E':{code:'4',variant:'D'},
    '4A':{code:'3',variant:'A'}, '4B':{code:'3',variant:'C'}, '4C':{code:'3',variant:'B'}, '4D':{code:'3',variant:'D'}, '4E':{code:'4',variant:'E'},
    '5A':{code:'6',variant:'A'}, '5B':{code:'6',variant:'C'}, '5C':{code:'6',variant:'B'}, '5D':{code:'6',variant:'D'}, '5E':{code:'6',variant:'E'},
    '6A':{code:'5',variant:'A'}, '6B':{code:'6',variant:'C'}, '6C':{code:'5',variant:'B'}, '6D':{code:'5',variant:'D'}, '6E':{code:'5',variant:'E'},
    '7A':{code:'8',variant:'A'}, '7B':{code:'7',variant:'C'}, '7C':{code:'8',variant:'B'}, '7D':{code:'8',variant:'D'}, '7E':{code:'8',variant:'E'},
    '8A':{code:'7',variant:'A'}, '8B':{code:'7',variant:'C'}, '8C':{code:'7',variant:'B'}, '8D':{code:'7',variant:'D'}, '8E':{code:'7',variant:'E'}
  };
  let navinMode = 'finalny';
  let effectiveCode = finalCode;
  let effectiveVariant = finalVariant;
  const opsEffective = state.printOps + (state.lacquerNext ? 1 : 0);
  if(state.rollPrintEnabled){
    navinMode = 'tlac';
    if((opsEffective % 2) !== 0){
      const mapped = printMap[`${finalCode}${finalVariant}`];
      if(mapped){
        effectiveCode = mapped.code;
        effectiveVariant = mapped.variant;
      }
    }
  } else if(state.rollAssemblyEnabled){
    navinMode = 'montaz';
    if((opsEffective % 2) !== 0){
      const mapped = printMap[`${finalCode}${finalVariant}`];
      if(mapped){
        effectiveCode = mapped.code;
        effectiveVariant = mapped.variant;
      }
    }
  }
  let navinLabelText = `Finalny navin: ${effectiveCode}${effectiveVariant}`;
  if(navinMode === 'tlac'){
    const sideLetter = state.printSide === 'top' ? 'V' : 'S';
    navinLabelText = `Navin pri tlaci: ${effectiveCode}${effectiveVariant} - ${sideLetter}${effectiveCode}`;
  } else if(navinMode === 'montaz'){
    const sideLetter = state.printSide === 'top' ? 'V' : 'S';
    navinLabelText = `Navin: ${sideLetter}${effectiveCode} (montaz)`;
  }

  const svgDraw = svgRoot.cloneNode(true);
  svgDraw.querySelectorAll('.header-ui, .footer-ui').forEach(n=> n.remove());
  svgDraw.querySelectorAll('.header-ui rect').forEach(n=> n.remove());
  svgDraw.removeAttribute('style');
  const liveCore = svgRoot.querySelector('g.content-core');
  const liveRoll = svgRoot.querySelector('g.roll-group');
  const coreBB = liveCore ? liveCore.getBBox() : null;
  const rollBB = liveRoll ? liveRoll.getBBox() : null;
  let bbDraw = coreBB || rollBB || svgRoot.getBBox();
  if(coreBB && rollBB && rollBB.width > 0 && rollBB.height > 0){
    const minX = Math.min(coreBB.x, rollBB.x);
    const minY = Math.min(coreBB.y, rollBB.y);
    const maxX = Math.max(coreBB.x + coreBB.width, rollBB.x + rollBB.width);
    const maxY = Math.max(coreBB.y + coreBB.height, rollBB.y + rollBB.height);
    bbDraw = {x:minX, y:minY, width:maxX-minX, height:maxY-minY};
  }
  svgDraw.setAttribute('width', bbDraw.width);
  svgDraw.setAttribute('height', bbDraw.height);
  svgDraw.setAttribute('viewBox', `${bbDraw.x} ${bbDraw.y} ${bbDraw.width} ${bbDraw.height}`);
  svgDraw.setAttribute('preserveAspectRatio','xMidYMid meet');

  const drawMarkup = new XMLSerializer().serializeToString(svgDraw);
  const drawBlob = new Blob([drawMarkup], {type:'image/svg+xml'});
  const drawUrl = URL.createObjectURL(drawBlob);
  const drawImg = new Image();

  const refName = [state.refPartA, state.refPartB].map(v => (v || '').trim()).filter(Boolean).join('_');
  const baseName = (refName || state.orderNo || 'montaz').trim();
  const tryRender = ()=>{
    const canvas = document.createElement('canvas');
    canvas.width = pxW;
    canvas.height = pxH;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,pxW,pxH);

    const refA = (state.refPartA || '').trim();
    const refB = (state.refPartB || '').trim();
    const refLabel = refB ? `${refA}/${refB}` : refA;
    const porTxt = (state.porCislo || '').trim();
    const motivTxt = (state.motiv || '').trim();
    const sideText = state.printSide === 'top' ? 'vrchna' : 'spodna';
    const lacquerText = state.lacquerNext ? 'Lak na inom oddeleni (inseter/kasirka)' : '';
    const headerNote = (navinMode === 'tlac' && state.printSide === 'bottom') ? 'Pohlad cez montaz' : '';
    const hasPhotoText = Number.isFinite(state.photoW) && state.photoW > 0 && Number.isFinite(state.photoH) && state.photoH > 0;
    const photoText = hasPhotoText ? `Rozmer fotobunky: ${state.photoW} x ${state.photoH}` : '';
    const noteText = state.photoNote || '';
    const stamp = new Date().toLocaleString('sk-SK');
    const usableW = pxW - marginPx*2;
    const usableH = pxH - marginPx*2;
    const mmToPx300 = (mm)=> Math.round((mm / 25.4) * 300);
    const gapPx = Math.max(16, Math.round(pxW * 0.004));
    // Minimalne fyzicke velkosti pre citatelnost aj pri tlaci PNG zmensenej na A4.
    const bodyFont = Math.max(mmToPx300(4.2), Math.round(pxW * 0.009));
    const smallFont = Math.max(mmToPx300(3.2), Math.round(pxW * 0.007));
    const titleFont = Math.max(mmToPx300(5.8), Math.round(pxW * 0.011));
    const red = '#dc2626';
    const ink = '#0f172a';
    const muted = '#64748b';
    const lineStep = Math.round(bodyFont * 1.25);

    function wrapCanvasText(text, x, y, maxWidth, lineHeight, color, font){
      if(!text) return y;
      ctx.fillStyle = color;
      ctx.font = font;
      const words = String(text).split(/\s+/).filter(Boolean);
      if(!words.length) return y;
      let line = '';
      let yy = y;
      words.forEach((word)=>{
        const test = line ? `${line} ${word}` : word;
        if(ctx.measureText(test).width > maxWidth && line){
          ctx.fillText(line, x, yy);
          line = word;
          yy += lineHeight;
        } else {
          line = test;
        }
      });
      if(line){
        ctx.fillText(line, x, yy);
        yy += lineHeight;
      }
      return yy;
    }

    function drawHeader(){
      const leftX = marginPx;
      const topY = marginPx + titleFont;
      let y = topY;
      ctx.textBaseline = 'alphabetic';

      const leftColW = Math.round(usableW * 0.42);
      const rightColX = marginPx + leftColW + gapPx * 2;

      ctx.fillStyle = ink;
      ctx.font = `700 ${bodyFont}px Arial, Helvetica, sans-serif`;
      if(refLabel) ctx.fillText(`CRV ${refLabel}`, leftX, y);
      if(porTxt) ctx.fillText(`PCV ${porTxt}`, rightColX, y);
      y += lineStep;

      if(motivTxt){
        y = wrapCanvasText(`Motiv ${motivTxt}`, leftX, y, usableW, lineStep, ink, `700 ${bodyFont}px Arial, Helvetica, sans-serif`);
      }

      ctx.fillStyle = red;
      ctx.font = `700 ${titleFont}px Arial, Helvetica, sans-serif`;
      ctx.fillText(navinLabelText, leftX, y);
      ctx.font = `700 ${bodyFont}px Arial, Helvetica, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillStyle = CORONA_COLOR;
      const coronaMetrics = ctx.measureText(CORONA_TEXT);
      const coronaPadX = Math.round(bodyFont * 0.35);
      const coronaPadY = Math.round(bodyFont * 0.2);
      const coronaW = Math.ceil(coronaMetrics.width + coronaPadX * 2);
      const coronaH = Math.ceil(bodyFont + coronaPadY * 2);
      const coronaX = marginPx + usableW - coronaW;
      const coronaY = Math.round(y - bodyFont + 2 - coronaPadY);
      ctx.fillStyle = CORONA_BG;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(coronaX, coronaY, coronaW, coronaH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = CORONA_COLOR;
      ctx.fillText(CORONA_TEXT, marginPx + usableW - coronaPadX, y);
      ctx.textAlign = 'left';
      y += Math.round(titleFont * 1.15);

      ctx.fillStyle = ink;
      ctx.font = `700 ${bodyFont}px Arial, Helvetica, sans-serif`;
      if(headerNote){
        ctx.fillText(headerNote, leftX, y);
        y += lineStep;
      }

      ctx.fillText(`Sposob tlace: ${sideText}`, leftX, y);
      if(lacquerText){
        const lacquerX = leftX + Math.round(usableW * 0.32);
        wrapCanvasText(lacquerText, lacquerX, y, pxW - marginPx - lacquerX, lineStep, red, `700 ${bodyFont}px Arial, Helvetica, sans-serif`);
      }
      return y + gapPx;
    }

    function drawFooter(){
      const leftX = marginPx;
      let lines = 1;
      if(photoText) lines += Math.max(0, Math.ceil(ctx.measureText(photoText).width / usableW) - 1);
      if(noteText) lines += Math.max(0, Math.ceil((noteText.length * smallFont * 0.55) / usableW));
      const footerTop = pxH - marginPx - (Math.max(2, lines) * lineStep) - smallFont;
      let y = footerTop;
      if(photoText){
        y = wrapCanvasText(photoText, leftX, y, usableW, lineStep, ink, `700 ${bodyFont}px Arial, Helvetica, sans-serif`);
      }
      if(noteText){
        y = wrapCanvasText(noteText, leftX, y, usableW, lineStep, ink, `${bodyFont}px Arial, Helvetica, sans-serif`);
      }
      ctx.fillStyle = muted;
      ctx.font = `${smallFont}px Arial, Helvetica, sans-serif`;
      ctx.fillText(stamp, leftX, pxH - marginPx);
      return footerTop - gapPx;
    }

    const headerBottom = drawHeader();
    const footerTop = drawFooter();
    const midAvailH = Math.max(100, footerTop - headerBottom);
    const scaleW = usableW / bbDraw.width;
    const scaleH = midAvailH / bbDraw.height;
    const scale = Math.min(scaleW, scaleH);
    const drawW = bbDraw.width * scale;
    const drawH = bbDraw.height * scale;
    const drawX = marginPx + (usableW - drawW) / 2;
    const drawY = headerBottom + Math.max(0, (midAvailH - drawH) / 2);

    // draw drawing centered between header/footer
    ctx.drawImage(drawImg, drawX, drawY, drawW, drawH);

    canvas.toBlob((blob)=>{
      if(!blob) return;
      const link = document.createElement('a');
      link.download = `${baseName}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
    URL.revokeObjectURL(drawUrl);
  };

  drawImg.onload = ()=>{ tryRender(); };
  drawImg.src = drawUrl;
}

function collectState(){
  return {
    vz:'montaz',
    W:num($('W'),400),
    L:num($('L'),600),
    fontPx:state.fontPx,
    strokeWidth:state.strokeWidth,
    dimPos:$('dimPos')?.value || 'bottom',
    dimOffset:num($('dimOffset'),80),
    dimPosH:$('dimPosH')?.value || 'right',
    dimOffsetH:num($('dimOffsetH'),25),
    lineStyle:$('lineStyle')?.value || 'solid',
    lineStyleH:$('lineStyleH')?.value || 'solid',
    units:state.units,
    decimals:state.decimals,
    rollEnabled:state.rollEnabled,
    rollPrintEnabled:state.rollPrintEnabled,
    rollAssemblyEnabled:state.rollAssemblyEnabled,
    printOps: state.printOps,
    lacquerNext: state.lacquerNext,
    printSide: state.printSide,
    rollType:state.rollCode,
    rollVariant:state.rollVariant,
    photoW: state.photoW,
    photoH: state.photoH,
    photoNote: state.photoNote,
    photoEnabled: state.photoEnabled,
    photoOffsetTop: state.photoOffsetTop,
    photoOffsetRight: state.photoOffsetRight,
    motiv: state.motiv,
    refPartA: state.refPartA,
    refPartB: state.refPartB,
    porCislo: state.porCislo,
    orderNo: state.orderNo,
    orderNote: state.orderNote,
    repeatX: state.repeatX,
    repeatY: state.repeatY,
    gapX: state.gapX,
    gapY: state.gapY,
    repeatMode: state.repeatMode,
    exportOrient:$('exportOrient')?.value || 'portrait',
    bgWidth:$('bgWidth')?.value || '',
    bgHeight:$('bgHeight')?.value || '',
    bgOpacity:state.bgOpacity,
    bgOffsetX:state.bgOffsetX,
    bgOffsetY:state.bgOffsetY,
    bgRot:state.bgRot,
    bgFlip:state.bgFlip,
    bgImageData:state.bgImageData,
    templateImageData:state.templateImageData,
    templateWidth:$('templateWidth')?.value || '',
    templateHeight:$('templateHeight')?.value || '',
    templateSide:state.templateSide,
    templateGap:state.templateGap,
    templateOffsetX: state.templateOffsetX,
    templateOffsetY: state.templateOffsetY,
    orez: state.orez,
    orezShow: state.orezShow,
    markEnabled: state.markEnabled,
    markText: state.markText,
    markText2: state.markText2,
    measures: state.measures,
    measureMode: state.measureMode,
    segments: state.segments.map(inp=>num(inp,0)),
    segmentsH: state.segmentsH.map(inp=>num(inp,0))
  };
}

function saveJSON(){
  const data = collectState();
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const refName = [data.refPartA, data.refPartB].map(v => (v || '').trim()).filter(Boolean).join('_');
  const baseName = (refName || data.orderNo || 'montaz').trim();
  a.href = url; a.download = `${baseName}.json`; a.click();
  URL.revokeObjectURL(url);
}

function loadData(data){
  if(!data) return;
  $('W').value = data.W ?? 400;
  $('L').value = data.L ?? 600;
  $('fontPx').value = data.fontPx ?? 14;
  $('strokeWidth').value = data.strokeWidth ?? 1;
  $('dimPos').value = data.dimPos ?? 'bottom';
  $('dimOffset').value = data.dimOffset ?? 80;
  $('dimPosH').value = data.dimPosH ?? 'right';
  $('dimOffsetH').value = data.dimOffsetH ?? 25;
  $('lineStyle').value = data.lineStyle ?? 'solid';
  $('lineStyleH').value = data.lineStyleH ?? 'solid';
  $('units').value = data.units ?? 'mm';
  $('decimals').value = data.decimals ?? 0;
  $('rollEnabled').checked = !!data.rollEnabled;
  $('rollPrint').checked = !!data.rollPrintEnabled;
  $('rollAssembly').checked = !!data.rollAssemblyEnabled;
  $('rollType').value = data.rollType ?? '1';
  $('rollVariant').value = data.rollVariant ?? 'A';
  $('printOps').value = data.printOps ?? 1;
  if (data.lacquerNext) {
    if ($('lacquerYes')) $('lacquerYes').checked = true;
  } else {
    if ($('lacquerNo')) $('lacquerNo').checked = true;
  }
  const side = data.printSide ?? 'bottom';
  if(side==='top'){ $('printSideTop').checked = true; } else { $('printSideBottom').checked = true; }
  $('photoW').value = data.photoW ?? 15;
  $('photoH').value = data.photoH ?? 7;
  if ($('photoNote')) $('photoNote').value = data.photoNote ?? '';
  $('photoEnabled').checked = data.photoEnabled ?? true;
  $('photoOffsetTop').value = data.photoOffsetTop ?? 5;
  $('photoOffsetRight').value = data.photoOffsetRight ?? 10;
  if ($('motivInput')) $('motivInput').value = data.motiv ?? data.orderNote ?? '';
  if ($('refPartA')) $('refPartA').value = data.refPartA ?? '';
  if ($('refPartB')) $('refPartB').value = data.refPartB ?? '';
  if ($('porCislo')) $('porCislo').value = data.porCislo ?? '';
  if ($('orderNo')) $('orderNo').value = data.orderNo ?? '';
  if ($('orderNote')) $('orderNote').value = data.orderNote ?? '';
  $('repeatX').value = data.repeatX ?? 1;
  $('repeatY').value = data.repeatY ?? 1;
  $('gapX').value = data.gapX ?? 0;
  $('gapY').value = data.gapY ?? 0;
  $('repeatMode').value = data.repeatMode ?? 'standard';
  state.repeatX = Math.max(1, Math.round(num($('repeatX'), 1)));
  state.repeatY = Math.max(1, Math.round(num($('repeatY'), 1)));
  state.gapX = num($('gapX'), 0);
  state.gapY = num($('gapY'), 0);
  state.repeatMode = $('repeatMode').value || 'standard';
  $('orez').value = data.orez ?? 3;
  state.orez = Math.max(0, num($('orez'), 3));
  $('orezShow').checked = data.orezShow ?? true;
  state.orezShow = !!$('orezShow')?.checked;
  $('markEnabled').checked = data.markEnabled ?? true;
  $('markText').value = data.markText ?? '';
  $('markText2').value = data.markText2 ?? '';
  state.markEnabled = !!$('markEnabled')?.checked;
  state.markText = $('markText')?.value || '';
  state.markText2 = $('markText2')?.value || '';
  state.photoW = numOrNull($('photoW'));
  state.photoH = numOrNull($('photoH'));
  state.photoNote = $('photoNote')?.value || '';
  state.photoEnabled = !!$('photoEnabled')?.checked;
  state.photoOffsetTop = num($('photoOffsetTop'), 5);
  state.photoOffsetRight = num($('photoOffsetRight'), 10);
  state.motiv = $('motivInput')?.value || '';
  state.refPartA = $('refPartA')?.value || '';
  state.refPartB = $('refPartB')?.value || '';
  state.porCislo = $('porCislo')?.value || '';
  state.orderNo = $('orderNo')?.value || '';
  state.orderNote = $('orderNote')?.value || '';
  state.colorNumber = $('colorNumber')?.value || '';
  state.colorName = $('colorName')?.value || '';
  $('exportOrient').value = data.exportOrient ?? 'portrait';
  $('bgWidth').value = data.bgWidth ?? '';
  $('bgHeight').value = data.bgHeight ?? '';
  state.bgOpacity = clamp(data.bgOpacity ?? 0.6,0,1);
  $('bgOpacity').value = state.bgOpacity;
  $('bgOpacityVal').textContent = `${Math.round(state.bgOpacity*100)} %`;
  state.bgRot = data.bgRot ?? 0;
  state.bgFlip = !!data.bgFlip;
  state.bgOffsetX = data.bgOffsetX ?? 0;
  state.bgOffsetY = data.bgOffsetY ?? 0;
  state.bgImageData = data.bgImageData ?? null;
  state.templateImageData = data.templateImageData ?? null;
  $('templateWidth').value = data.templateWidth ?? '';
  $('templateHeight').value = data.templateHeight ?? '';
  $('templateSide').value = data.templateSide ?? 'none';
  $('templateGap').value = data.templateGap ?? 0;
  $('templateOffsetX').value = data.templateOffsetX ?? 0;
  $('templateOffsetY').value = data.templateOffsetY ?? 0;
  state.templateWidth = $('templateWidth').value ? num($('templateWidth'), null) : null;
  state.templateHeight = $('templateHeight').value ? num($('templateHeight'), null) : null;
  state.templateSide = $('templateSide').value || 'none';
  state.templateGap = num($('templateGap'), 0);
  state.templateOffsetX = num($('templateOffsetX'), 0);
  state.templateOffsetY = num($('templateOffsetY'), 0);
  state.measureMode = data.measureMode ?? 'off';
  $('measureMode').value = state.measureMode;
  state.measures = Array.isArray(data.measures)? data.measures : [];
  $('colorNumber').value = data.colorNumber ?? '';
  $('colorName').value = data.colorName ?? '';
  state.colorNumber = $('colorNumber')?.value || '';
  state.colorName = $('colorName')?.value || '';
  $('segments').innerHTML=''; state.segments.length=0;
  (data.segments ?? ['']).forEach(v=> addSegmentInput(v));
  $('segmentsH').innerHTML=''; state.segmentsH.length=0;
  (data.segmentsH ?? ['']).forEach(v=> addSegmentInputH(v));
  draw();
  if (!historyState.isApplying) pushUndoSnapshot(true);
}

function syncRollChecks(changedId){
  const boxes = [
    {id:'rollEnabled', key:'rollEnabled'},
    {id:'rollPrint', key:'rollPrintEnabled'},
    {id:'rollAssembly', key:'rollAssemblyEnabled'}
  ];
  const changed = $(changedId);
  if(!changed) return;
  if(changed.checked){
    boxes.forEach(b=>{
      if(b.id !== changedId){
        const el = $(b.id);
        if(el) el.checked = false;
      }
    });
  }
  state.rollEnabled = !!$('rollEnabled')?.checked;
  state.rollPrintEnabled = !!$('rollPrint')?.checked;
  state.rollAssemblyEnabled = !!$('rollAssembly')?.checked;
  draw();
}

function handleLoadFile(file){
  if(!file) return;
  const r = new FileReader();
  r.onload = (ev)=>{
    try{
      const data = JSON.parse(ev.target.result);
      if (data.vz && data.vz !== 'montaz'){
        alert('Tento JSON je pre iny vzor: ' + data.vz);
        return;
      }
      loadData(data);
    }catch(_){ }
  };
  r.readAsText(file);
}

function getSvgPoint(evt){
  const pt = svgRoot.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  const ctm = svgRoot.getScreenCTM();
  if(!ctm) return {x:0,y:0};
  const inv = ctm.inverse();
  const sp = pt.matrixTransform(inv);
  return {x:sp.x, y:sp.y};
}

function startCalib(){
  if(!state.bgImageData){ alert('Najprv vloz podklad.'); return; }
  state.calibActive=true; state.calibPoints=[];
  $('bg-calib').style.display='none';
  $('bg-calib-cancel').style.display='inline-block';
  svgRoot.style.cursor='crosshair';
}
function cancelCalib(){
  state.calibActive=false; state.calibPoints=[];
  $('bg-calib').style.display='inline-block';
  $('bg-calib-cancel').style.display='none';
  svgRoot.style.cursor='';
}

function applyCalibIfReady(){
  if(state.calibPoints.length<2) return;
  const [p1,p2]=state.calibPoints;
  const dist = Math.hypot(p2.x-p1.x, p2.y-p1.y);
  const mmStr = prompt('Zadaj skutocnu vzdialenost medzi bodmi (mm):','100');
  const mmVal = parseFloat(mmStr);
  if(Number.isFinite(mmVal) && mmVal>0 && dist>0){
    const factor = mmVal / dist;
    const curW = state.bgWidth ?? num($('L'),600);
    const curH = state.bgHeight ?? num($('W'),400);
    state.bgWidth = curW * factor;
    state.bgHeight = curH * factor;
    $('bgWidth').value = state.bgWidth.toFixed(1);
    $('bgHeight').value = state.bgHeight.toFixed(1);
  }
  cancelCalib();
  draw();
}

function handleSvgClick(e){
  const p = getSvgPoint(e);
  if(state.calibActive){
    state.calibPoints.push(p);
    applyCalibIfReady();
    return;
  }
  if(state.measureMode==='off') return;
  if(!state.measurePick){
    state.measurePick = p;
  }else{
    if(state.measureMode==='h'){
      state.measures.push({type:'h',x1:state.measurePick.x,y1:p.y,x2:p.x,y2:p.y});
    }else if(state.measureMode==='v'){
      state.measures.push({type:'v',x1:p.x,y1:state.measurePick.y,x2:p.x,y2:p.y});
    }
    state.measurePick=null; state.measurePreview=null;
    draw();
  }
}
function handleSvgMove(e){
  if(state.calibActive) return;
  if(state.measureMode==='off') return;
  if(!state.measurePick) return;
  const p = getSvgPoint(e);
  if(state.measureMode==='h'){
    state.measurePreview = {type:'h',x1:state.measurePick.x,y1:state.measurePick.y,x2:p.x,y2:state.measurePick.y};
  }else if(state.measureMode==='v'){
    state.measurePreview = {type:'v',x1:state.measurePick.x,y1:state.measurePick.y,x2:state.measurePick.x,y2:p.y};
  }
  draw();
}

inputs.forEach(el=> el && el.addEventListener('input', draw));
if (undoBtn) undoBtn.addEventListener('click', doUndo);
if (redoBtn) redoBtn.addEventListener('click', doRedo);
document.addEventListener('keydown', (e)=>{
  const key = (e.key || '').toLowerCase();
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && key === 'z') {
    e.preventDefault();
    doUndo();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && (key === 'y' || (e.shiftKey && key === 'z'))) {
    e.preventDefault();
    doRedo();
  }
});
document.addEventListener('input', (e)=>{
  if (isUndoTrackable(e.target)) scheduleUndoSnapshot();
}, true);
document.addEventListener('change', (e)=>{
  if (isUndoTrackable(e.target)) scheduleUndoSnapshot();
}, true);
$('btn-reset')?.addEventListener('click', ()=>{
  try {
    localStorage.removeItem('prefill_source');
    localStorage.removeItem('eps_payload');
  } catch (_) {}
  reset();
});
$('btn-export')?.addEventListener('click', ()=>{ draw(); exportPDF(); });
$('btn-export-png')?.addEventListener('click', ()=>{ draw(); exportPNG(); });
$('btn-save')?.addEventListener('click', saveJSON);
$('btn-load')?.addEventListener('click', ()=> $('loadFile')?.click());
$('loadFile')?.addEventListener('change', (e)=> handleLoadFile(e.target.files?.[0]));
$('seg-add')?.addEventListener('click', ()=>{ addSegmentInput(''); pushUndoSnapshot(true); });
$('seg-remove')?.addEventListener('click', ()=>{ removeSegmentInput(); pushUndoSnapshot(true); });
$('segH-add')?.addEventListener('click', ()=>{ addSegmentInputH(''); pushUndoSnapshot(true); });
$('segH-remove')?.addEventListener('click', ()=>{ removeSegmentInputH(); pushUndoSnapshot(true); });
$('printOps')?.addEventListener('change', draw);
$('repeatX')?.addEventListener('input', ()=>{ draw(); });
$('repeatY')?.addEventListener('input', ()=>{ draw(); });
$('gapX')?.addEventListener('input', ()=>{ draw(); });
$('gapY')?.addEventListener('input', ()=>{ draw(); });
$('repeatMode')?.addEventListener('change', ()=>{ draw(); });
$('orez')?.addEventListener('input', ()=>{ state.orez = Math.max(0, num($('orez'), 0)); draw(); });
$('orezShow')?.addEventListener('change', ()=>{ state.orezShow = !!$('orezShow')?.checked; draw(); });
$('photoEnabled')?.addEventListener('change', ()=>{ state.photoEnabled = !!$('photoEnabled')?.checked; draw(); });
$('photoOffsetTop')?.addEventListener('input', ()=>{ state.photoOffsetTop = num($('photoOffsetTop'), 5); draw(); });
$('photoOffsetRight')?.addEventListener('input', ()=>{ state.photoOffsetRight = num($('photoOffsetRight'), 10); draw(); });
$('markEnabled')?.addEventListener('change', ()=>{ state.markEnabled = !!$('markEnabled')?.checked; draw(); });
$('markText')?.addEventListener('input', ()=>{ state.markText = $('markText')?.value || ''; draw(); });
document.querySelectorAll('input[name=\"lacquerStep\"]').forEach(el=> el.addEventListener('change', draw));
document.querySelectorAll('input[name="printSide"]').forEach(el=> el.addEventListener('change', draw));
$('rollEnabled')?.addEventListener('change', ()=> syncRollChecks('rollEnabled'));
$('rollPrint')?.addEventListener('change', ()=> syncRollChecks('rollPrint'));
$('rollAssembly')?.addEventListener('change', ()=> syncRollChecks('rollAssembly'));

$('bgFile')?.addEventListener('change', (e)=>{
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const r = new FileReader();
  r.onload = (ev)=>{ state.bgImageData = ev.target.result; draw(); pushUndoSnapshot(true); };
  r.readAsDataURL(file);
});
$('templateFile')?.addEventListener('change', (e)=>{
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const r = new FileReader();
  r.onload = (ev)=>{ state.templateImageData = ev.target.result; draw(); pushUndoSnapshot(true); };
  r.readAsDataURL(file);
});
$('bg-rot-left')?.addEventListener('click', ()=>{ state.bgRot = (state.bgRot - 90); draw(); pushUndoSnapshot(true); });
$('bg-rot-180')?.addEventListener('click', ()=>{ state.bgRot = (state.bgRot + 180); draw(); pushUndoSnapshot(true); });
$('bg-flip')?.addEventListener('click', ()=>{ state.bgFlip = !state.bgFlip; draw(); pushUndoSnapshot(true); });
$('bgOpacity')?.addEventListener('input', ()=>{ state.bgOpacity = clamp(num($('bgOpacity'), 0.6),0,1); $('bgOpacityVal').textContent = `${Math.round(state.bgOpacity*100)} %`; draw(); });
$('bgWidth')?.addEventListener('input', ()=>{ state.bgWidth = $('bgWidth').value ? num($('bgWidth'), state.bgWidth) : null; draw(); });
$('bgHeight')?.addEventListener('input', ()=>{ state.bgHeight = $('bgHeight').value ? num($('bgHeight'), state.bgHeight) : null; draw(); });
$('bg-clear')?.addEventListener('click', ()=>{ state.bgImageData=null; state.bgWidth=null; state.bgHeight=null; state.bgOffsetX=0; state.bgOffsetY=0; $('bgFile').value=''; $('bgWidth').value=''; $('bgHeight').value=''; draw(); pushUndoSnapshot(true); });
$('templateWidth')?.addEventListener('input', ()=>{ state.templateWidth = $('templateWidth').value ? num($('templateWidth'), state.templateWidth) : null; draw(); });
$('templateHeight')?.addEventListener('input', ()=>{ state.templateHeight = $('templateHeight').value ? num($('templateHeight'), state.templateHeight) : null; draw(); });
$('templateSide')?.addEventListener('change', ()=>{ state.templateSide = $('templateSide').value || 'none'; draw(); });
$('templateGap')?.addEventListener('input', ()=>{ state.templateGap = num($('templateGap'), 0); draw(); });
$('templateOffsetX')?.addEventListener('input', ()=>{ state.templateOffsetX = num($('templateOffsetX'), 0); draw(); });
$('templateOffsetY')?.addEventListener('input', ()=>{ state.templateOffsetY = num($('templateOffsetY'), 0); draw(); });
$('template-clear')?.addEventListener('click', ()=>{ state.templateImageData=null; state.templateWidth=null; state.templateHeight=null; state.templateSide='none'; state.templateGap=0; state.templateOffsetX=0; state.templateOffsetY=0; $('templateFile').value=''; $('templateWidth').value=''; $('templateHeight').value=''; $('templateSide').value='none'; $('templateGap').value='0'; $('templateOffsetX').value='0'; $('templateOffsetY').value='0'; draw(); pushUndoSnapshot(true); });
$('markText2')?.addEventListener('input', ()=>{ state.markText2 = $('markText2').value || ''; draw(); });
$('bg-calib')?.addEventListener('click', startCalib);
$('bg-calib-cancel')?.addEventListener('click', cancelCalib);

$('measureMode')?.addEventListener('change', ()=>{ state.measureMode = $('measureMode').value; state.measurePick=null; state.measurePreview=null; draw(); });
$('measure-cancel')?.addEventListener('click', ()=>{ state.measurePick=null; state.measurePreview=null; draw(); pushUndoSnapshot(true); });
$('measure-clear')?.addEventListener('click', ()=>{ state.measures=[]; state.measurePick=null; state.measurePreview=null; draw(); pushUndoSnapshot(true); });

svgRoot.addEventListener('click', handleSvgClick);
svgRoot.addEventListener('mousemove', handleSvgMove);

let draggingBg=false, dragStart=null;
svgRoot.addEventListener('pointerdown',(e)=>{
  if(state.calibActive) return;
  if(state.measureMode!=='off') return;
  if(e.button!==0) return;
  draggingBg=true;
  dragStart = {x:e.clientX,y:e.clientY,ox:state.bgOffsetX,oy:state.bgOffsetY};
  svgRoot.setPointerCapture(e.pointerId);
});
svgRoot.addEventListener('pointermove',(e)=>{
  if(!draggingBg) return;
  const dx = e.clientX - dragStart.x;
  const dy = e.clientY - dragStart.y;
  const ctm = svgRoot.getScreenCTM();
  const scaleX = ctm ? ctm.a : 1;
  const scaleY = ctm ? ctm.d : 1;
  state.bgOffsetX = dragStart.ox + dx / scaleX;
  state.bgOffsetY = dragStart.oy + dy / scaleY;
  draw();
});
  svgRoot.addEventListener('pointerup', ()=>{ draggingBg=false; pushUndoSnapshot(true); });
  svgRoot.addEventListener('pointercancel', ()=>{ draggingBg=false; });
  const svgHolder = $('svgHolder');
  const onWheelZoom = (e)=>{
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    const newZoom = clamp(state.zoom * factor, 0.25, 6);
    state.zoom = newZoom;
    draw();
  };
  svgHolder?.addEventListener('wheel', onWheelZoom, {passive:false});
  svgRoot.addEventListener('wheel', onWheelZoom, {passive:false});
  const canvasWrap = $('canvas-wrap');
  canvasWrap?.addEventListener('wheel', onWheelZoom, {passive:false});
  document.addEventListener('wheel', (e)=>{
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el && (svgRoot.contains(el) || svgHolder?.contains(el) || canvasWrap?.contains(el))) {
      onWheelZoom(e);
    }
  }, {passive:false});

window.addEventListener('paste',(e)=>{
  const items = Array.from(e.clipboardData?.items||[]);
  const it = items.find(i=> i.type && i.type.startsWith('image/'));
  if(!it) return;
  const file = it.getAsFile();
  if(!file) return;
  const r=new FileReader();
  r.onload=(ev)=>{ state.bgImageData = ev.target.result; draw(); pushUndoSnapshot(true); };
  r.readAsDataURL(file);
  e.preventDefault();
});

addSegmentInput('');
addSegmentInputH('');
reset();
draw();
pushUndoSnapshot(true);
updateUndoRedoButtons();
