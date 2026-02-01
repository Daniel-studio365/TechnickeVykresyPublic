const $ = (id)=>document.getElementById(id);
const svgRoot = $('svgRoot');

const state = {
  fontPx:14,
  bounds:{width:800,height:800},
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
  orderNo:'',
  orderNote:'',
  bgImageData:null,
  bgOpacity:0.6,
  bgWidth:null,
  bgHeight:null,
  bgOffsetX:0,
  bgOffsetY:0,
  bgRot:0,
  bgFlip:false,
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
'rollEnabled','rollType','rollVariant','photoW','photoH','photoNote','orderNo','orderNote','exportOrient','bgWidth','bgHeight','bgOpacity','measureMode'
].map(id=>$(id));

function num(el, fallback=0){ const v=parseFloat(el?.value); return Number.isFinite(v)?v:fallback; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

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
    boxHeight=null
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
    const r = create('rect',{x:cx - boxWidth/2,y:cy - boxHeight/2,width:boxWidth,height:boxHeight,fill:'white',opacity:'0.9'});
    g.insertBefore(r,t);
    return g;
  }
  const padX=1, padY=0;
  const r = create('rect',{x:bb.x-padX,y:bb.y-padY,width:bb.width+2*padX,height:bb.height+2*padY,fill:'white',opacity:'0.9'});
  g.insertBefore(r,t);
  return g;
}
const arrowLeft=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l 6 -4 v 8 z`,fill:c},p);
const arrowRight=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l -6 -4 v 8 z`,fill:c},p);
const arrowUp=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l -4 6 h 8 z`,fill:c},p);
const arrowDown=(x,y,c,p=svgRoot)=>create('path',{d:`M ${x} ${y} l -4 -6 h 8 z`,fill:c},p);

function formatVal(v){
  const d = state.decimals ?? 0;
  const pow = Math.pow(10,d);
  const rounded = Math.round(v * pow) / pow;
  const numStr = rounded.toFixed(d);
  return state.units === 'mm' ? `${numStr} mm` : numStr;
}
function formatPlain(v){
  const d = state.decimals ?? 0;
  const pow = Math.pow(10,d);
  return (Math.round(v * pow) / pow).toFixed(d);
}

function hDim(x1,y,x2,val,ext=10,color='#0f172a', fontScale=1, textOffset=null, useUnits=true, parent=svgRoot){
  if(x2<x1){ const t=x1; x1=x2; x2=t; }
  const sw = state.strokeWidth || 1;
  create('line',{x1,y1:y,x2,y2:y,stroke:color,'stroke-width':sw}, parent);
  create('line',{x1,y1:y-ext,x2:x1,y2:y+ext,stroke:color,'stroke-width':sw}, parent);
  create('line',{x1:x2,y1:y-ext,x2:x2,y2:y+ext,stroke:color,'stroke-width':sw}, parent);
  arrowLeft(x1,y,color,parent); arrowRight(x2,y,color,parent);
  const original = state.fontPx;
  state.fontPx = Math.max(6, original * fontScale);
  const txtOffset = (textOffset!==null ? textOffset : 6);
  const label = useUnits ? formatVal(val) : formatPlain(val);
  const g = parent || svgRoot;
  textWithBg(label,(x1+x2)/2,y-txtOffset,{color,parent:g});
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
  const g = create('g',{transform:`translate(${x - offset} ${(y1+y2)/2}) rotate(-90)`}, parent);
  const original = state.fontPx;
  state.fontPx = Math.max(6, original * fontScale);
  const t = create('text',{'text-anchor':'middle','dominant-baseline':'middle','font-size':state.fontPx,fill:color},g);
  t.textContent = useUnits ? formatVal(val) : formatPlain(val);
  state.fontPx = original;
}

function drawMeasurements(parent){
  const tgt = parent || svgRoot;
  for(const m of state.measures){
    if(m.type==='h'){
      hDim(m.x1, m.y1, m.x2, Math.abs(m.x2-m.x1), 8, '#16a34a', 0.95, null, true, tgt);
    }else if(m.type==='v'){
      vDim(m.x1, m.y1, m.y2, Math.abs(m.y2-m.y1), 8, '#16a34a', 0.95, null, true, tgt);
    }
  }
  if(state.measurePreview){
    const m = state.measurePreview;
    if(m.type==='h'){
      hDim(m.x1, m.y1, m.x2, Math.abs(m.x2-m.x1), 8, '#22c55e', 0.95, null, true, tgt);
    }else if(m.type==='v'){
      vDim(m.x1, m.y1, m.y2, Math.abs(m.y2-m.y1), 8, '#22c55e', 0.95, null, true, tgt);
    }
  }
}

function draw(){
  const W = num($('W'),400);
  const L = num($('L'),600);
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
  state.printOps = parseInt($('printOps')?.value,10) || 1;
    state.lacquerNext = document.querySelector('input[name="lacquerStep"]:checked')?.value === 'yes';
  state.printSide = document.querySelector('input[name="printSide"]:checked')?.value || 'bottom';
  state.rollCode = $('rollType')?.value || '1';
  state.rollVariant = $('rollVariant')?.value || 'A';
  state.photoW = num($('photoW'),15);
  state.photoH = num($('photoH'),7);
  state.photoNote = $('photoNote')?.value || '';
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
  state.rollType = (['1','2','5','6'].includes(state.rollCode) ? 'std' : 'alt');
  state.bgOpacity = clamp(num($('bgOpacity'), 0.6),0,1);
  $('bgOpacityVal').textContent = `${Math.round(state.bgOpacity*100)} %`;
  state.bgWidth = $('bgWidth')?.value ? num($('bgWidth'), null) : null;
  state.bgHeight = $('bgHeight')?.value ? num($('bgHeight'), null) : null;

  const offsetX=60, offsetY=80;
  const baseDimOffset = dimOffsetVal;
  const yTop=offsetY, yBottom=offsetY+W;

  clearSvg();
  const allGroup = create('g',{class:'content-bbox'});
  const contentGroup = create('g',{class:'content-core'}, allGroup);
  const rollGroup = create('g',{class:'roll-group'}, allGroup);

  if($('toggle-grid')?.checked){
    const gridPad = 200;
    const gx = offsetX - gridPad;
    const gy = offsetY - gridPad;
    const gW = L + gridPad*2;
    const gH = W + gridPad*2;
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
    const bgW = state.bgWidth ?? L;
    const bgH = state.bgHeight ?? W;
    const cx = offsetX + state.bgOffsetX + bgW/2;
    const cy = offsetY + state.bgOffsetY + bgH/2;
    const transforms = [];
    if(state.bgRot % 360 !== 0){ transforms.push(`rotate(${state.bgRot} ${cx} ${cy})`); }
    if(state.bgFlip){ transforms.push(`translate(${2*cx} 0) scale(-1 1)`); }
    if(navinMode==='tlac' && state.printSide==='bottom'){ transforms.push(`translate(${2*cx} 0) scale(-1 1)`); }
    const img = create('image',{
      href: state.bgImageData,
      x: offsetX + state.bgOffsetX,
      y: offsetY + state.bgOffsetY,
      width: bgW,
      height: bgH,
      opacity: state.bgOpacity
    }, contentGroup);
    if(transforms.length){ img.setAttribute('transform', transforms.join(' ')); }
  }

  // hlavny obdlznik
  create('rect',{x:offsetX,y:offsetY,width:L,height:W,fill:'none',stroke:'#0f172a','stroke-width':state.strokeWidth}, contentGroup);

  // delenie sirky
  const segValues = state.segments.map(inp => num(inp,0)).filter(v=>v>0);
  const sumSeg = segValues.reduce((a,b)=>a+b,0);
  const remainder = Math.max(L - sumSeg, 0);
  const parts = [...segValues];
  if (remainder > 0 || parts.length===0) parts.push(remainder);

  // delenie vysky
  const segValuesH = state.segmentsH.map(inp => num(inp,0)).filter(v=>v>0);
  const sumSegH = segValuesH.reduce((a,b)=>a+b,0);
  const remainderH = Math.max(W - sumSegH, 0);
  const partsH = [...segValuesH];
  if (remainderH > 0 || partsH.length===0) partsH.push(remainderH);

  // koty sirky
  const segOffset = Number.isFinite(baseDimOffset) ? baseDimOffset : 25;
  const segY = dimPosEff === 'top' ? yTop - segOffset : yBottom + segOffset;
  let cursor = offsetX;
  parts.forEach((len, idx)=>{
    const next = cursor + len;
    hDim(cursor, segY, next, len, 10, '#0f172a', 0.9, null, true, contentGroup);
    if (idx < parts.length - 1){
      create('line',{x1:next,y1:offsetY,x2:next,y2:offsetY+W,stroke:'#475569','stroke-width':state.strokeWidth,'stroke-dasharray':lineStyle || ''}, contentGroup);
    }
    cursor = next;
  });
  hDim(offsetX, segY + (dimPosEff==='top' ? -20 : 20), offsetX+L, L, 10, '#0f172a', 1.1, null, true, contentGroup);

  // koty vysky
  const segOffsetH = dimOffsetH || Math.max(50, Math.round(state.fontPx*3.2));
  const segX = dimPosH === 'left' ? offsetX - segOffsetH : offsetX + L + segOffsetH;
  cursor = offsetY;
  partsH.forEach((len, idx)=>{
    const next = cursor + len;
    vDim(segX, cursor, next, len, 10, '#0f172a', 0.9, null, true, contentGroup);
    if (idx < partsH.length - 1){
      create('line',{x1:offsetX,y1:next,x2:offsetX+L,y2:next,stroke:'#475569','stroke-width':state.strokeWidth,'stroke-dasharray':lineStyleH || ''}, contentGroup);
    }
    cursor = next;
  });
  vDim(segX + (dimPosH==='left' ? -20 : 20), offsetY, offsetY+W, W, 10, '#0f172a', 1.1, null, true, contentGroup);

  let rollBounds = null;
  // navin (preberene z predchadzajucej verzie)
  const rollActive = state.rollEnabled || state.rollPrintEnabled || state.rollAssemblyEnabled;
  const mirrorPrint = (navinMode==='tlac');
  const mirrorMontage = (navinMode==='montaz');
  if(rollActive){
    ensureDefs();
    const rollR = Math.max(40, (W/10));
    const innerR = rollR/2;
    const baseYRoll = yTop - 20 - rollR;
    const yRoll = rollTypeDraw === 'alt' ? baseYRoll - 65 : baseYRoll;
    const navParent = create('g',{class:'roll'}, rollGroup);

    if(rollTypeDraw === 'alt'){
      const leftCx = offsetX + rollR;
      const rightCx = offsetX + L;
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
      const rightCornerX = offsetX + L;
      const rightCornerY = yTop - 5;
      create('line',{x1:rightCornerX,y1:rightCornerY,x2:rightCx,y2:bottomY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      create('line',{x1:offsetX,y1:leftCornerY,x2:rightCornerX,y2:rightCornerY,stroke:'#0f172a','stroke-width':state.strokeWidth}, navParent);
      const arrowX = offsetX + L/2;
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

      const rightCornerX = offsetX + L;
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
    const labelX = offsetX + L/2;
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
      const markW = Math.max(1, Number.isFinite(state.photoW) ? state.photoW : 15);
      const markH = Math.max(1, Number.isFinite(state.photoH) ? state.photoH : 7);
      const topY = yTop - 5 - markH;
    const mirrorMark = (navinMode === 'tlac' && state.printSide === 'bottom');
    const drawMark = (x)=> {
      const mx = mirrorMark ? (2 * (offsetX + L/2) - (x + markW)) : x;
      create('rect',{x: mx, y:topY, width:markW, height:markH, fill:'#000'}, navParent);
    };
      if(rollVariantDraw==='A' || rollVariantDraw==='B'){
        drawMark(offsetX);
      }
      if(rollVariantDraw==='A' || rollVariantDraw==='C'){
        drawMark(offsetX + L - markW);
      }
      if(rollVariantDraw==='E'){
        const centerX = offsetX + L/2;
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
  const baseBottom = Math.max(offsetY + W, rollBounds ? rollBounds.maxY : 0);
  const noteY = baseBottom + 120;
  const photoText = `Rozmer fotobunky: ${state.photoW} x ${state.photoH}`;
  const noteText = state.photoNote || '';
  const stamp = new Date().toLocaleString('sk-SK');
  const footerGroup = create('g',{class:'footer-ui'}, allGroup);
  textWithBg(photoText, offsetX, noteY, {anchor:'start', baseline:'middle', parent:footerGroup, color:'#0f172a', fontWeight:'700', fontSize:14});
  textWithBg(noteText, offsetX + 260, noteY, {anchor:'start', baseline:'middle', parent:footerGroup, color:'#0f172a', fontWeight:'400', fontSize:14});
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
    const orderNoTxt = state.orderNo || '';
    const orderNoteTxt = state.orderNote || '';
    if (orderNoTxt || orderNoteTxt) {
      textWithBg(orderNoTxt, 10, titleY, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'700', fontSize:16});
      textWithBg(orderNoteTxt, 170, titleY, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#0f172a', fontWeight:'400', fontSize:16});
    }
    const sideText = state.printSide === 'top' ? 'vrchna' : 'spodna';
    const lacquerText = state.lacquerNext ? 'Lak na inom oddeleni (inseter/kasirka)' : '';
    const lacquerColor = state.lacquerNext ? '#dc2626' : '#0f172a';
    textWithBg(navinLabelText, 10, headerY + headerH/2, {anchor:'start', baseline:'middle', parent:headerGroup, color:'#dc2626', fontWeight:'700', fontSize:20});
    const headerNote = (navinMode === 'tlac' && state.printSide === 'bottom') ? 'Pohlad cez foliu' : '';
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
    const cx = offsetX + L / 2;
    const cy = offsetY + W / 2;
    contentGroup.setAttribute('transform', `rotate(180 ${cx} ${cy})`);
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
  svgRoot.setAttribute('width', width);
  svgRoot.setAttribute('height', height);
  state.bounds = {width,height};
}

function reset(){
  $('W').value=400; $('L').value=600; $('fontPx').value=14; $('fontPxVal').textContent='14 px'; $('toggle-grid').checked=false; $('lineStyle').value='solid';
  $('strokeWidth').value=1; $('dimPos').value='bottom'; $('dimOffset').value=25; $('dimPosH').value='right'; $('dimOffsetH').value=25; $('lineStyleH').value='solid';
  $('units').value='none'; $('decimals').value='0';
  $('rollEnabled').checked=true; $('rollPrint').checked=false; $('rollAssembly').checked=false; $('rollType').value='1'; $('rollVariant').value='A';
  $('printOps').value='1'; $('printSideBottom').checked=true;
  $('strokeWidth').value='0.8';
  if ($('lacquerNo')) $('lacquerNo').checked = true;
  $('photoW').value = 15; $('photoH').value = 7; if ($('photoNote')) $('photoNote').value = '';
  if ($('orderNo')) $('orderNo').value = '';
  if ($('orderNote')) $('orderNote').value = '';
  $('exportOrient').value='portrait';
  $('bgFile').value=''; state.bgImageData=null; $('bgWidth').value=''; $('bgHeight').value=''; state.bgWidth=null; state.bgHeight=null; state.bgOpacity=0.6; $('bgOpacity').value=0.6; $('bgOpacityVal').textContent='60 %'; state.bgRot=0; state.bgFlip=false; state.bgOffsetX=0; state.bgOffsetY=0;
  $('measureMode').value='off'; state.measureMode='off'; state.measurePick=null; state.measures=[]; state.measurePreview=null;
  state.calibActive=false; state.calibPoints=[]; $('bg-calib-cancel').style.display='none'; $('bg-calib').style.display='inline-block'; svgRoot.style.cursor='';
  $('segments').innerHTML=''; state.segments.length=0; addSegmentInput('');
  $('segmentsH').innerHTML=''; state.segmentsH.length=0; addSegmentInputH('');
  draw();
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
  const baseName = (state.orderNo || 'folia2').trim();

  clone.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
  clone.setAttribute('width', `${width}mm`);
  clone.setAttribute('height', `${height}mm`);
  const svgMarkup = new XMLSerializer().serializeToString(clone);
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${baseName} PDF</title>
  <style>
    @page { size: ${width}mm ${height}mm; margin: 0; }
    body { margin: 0; display:flex; justify-content:center; align-items:center; }
    svg { width:${width}mm; height:${height}mm; }
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

  const svgFull = svgRoot.cloneNode(true);
  // remove header boxes, keep only text
  svgFull.querySelectorAll('.header-ui rect').forEach(n=> n.remove());
  svgFull.removeAttribute('style');
  const bbFull = svgRoot.getBBox();
  svgFull.setAttribute('width', bbFull.width);
  svgFull.setAttribute('height', bbFull.height);
  svgFull.setAttribute('viewBox', `${bbFull.x} ${bbFull.y} ${bbFull.width} ${bbFull.height}`);
  svgFull.setAttribute('preserveAspectRatio','xMidYMid meet');

  const svgDraw = svgRoot.cloneNode(true);
  svgDraw.querySelectorAll('.header-ui, .footer-ui').forEach(n=> n.remove());
  svgDraw.querySelectorAll('.header-ui rect').forEach(n=> n.remove());
  svgDraw.removeAttribute('style');
  const liveGroup = svgRoot.querySelector('g.content-bbox') || svgRoot;
  const bbDraw = liveGroup.getBBox();
  svgDraw.setAttribute('width', bbDraw.width);
  svgDraw.setAttribute('height', bbDraw.height);
  svgDraw.setAttribute('viewBox', `${bbDraw.x} ${bbDraw.y} ${bbDraw.width} ${bbDraw.height}`);
  svgDraw.setAttribute('preserveAspectRatio','xMidYMid meet');

  const headerEl = svgRoot.querySelector('.header-ui');
  const footerEl = svgRoot.querySelector('.footer-ui');
  const headerBB = headerEl ? headerEl.getBBox() : null;
  const footerBB = footerEl ? footerEl.getBBox() : null;
  const headerH = headerBB ? headerBB.height : 0;
  const footerH = footerBB ? footerBB.height : 0;
  const gapPx = 10;

  const usableW = pxW - marginPx*2;
  const usableH = pxH - marginPx*2;
  const scaleW = usableW / bbDraw.width;
  const scaleH = (usableH - (headerH + footerH) * scaleW - gapPx*2) / bbDraw.height;
  const scale = Math.min(scaleW, scaleH > 0 ? scaleH : scaleW);

  const drawW = bbDraw.width * scale;
  const drawH = bbDraw.height * scale;
  const headerPxH = headerH * scale;
  const footerPxH = footerH * scale;
  const midAvailH = usableH - headerPxH - footerPxH - gapPx*2;
  const drawX = marginPx + (usableW - drawW) / 2;
  const drawY = marginPx + headerPxH + gapPx + Math.max(0, (midAvailH - drawH) / 2);

  const fullMarkup = new XMLSerializer().serializeToString(svgFull);
  const fullBlob = new Blob([fullMarkup], {type:'image/svg+xml'});
  const fullUrl = URL.createObjectURL(fullBlob);
  const fullImg = new Image();

  const drawMarkup = new XMLSerializer().serializeToString(svgDraw);
  const drawBlob = new Blob([drawMarkup], {type:'image/svg+xml'});
  const drawUrl = URL.createObjectURL(drawBlob);
  const drawImg = new Image();

  const baseName = (state.orderNo || 'folia2').trim();
  let fullReady = false;
  let drawReady = false;
  const tryRender = ()=>{
    if(!fullReady || !drawReady) return;
    const canvas = document.createElement('canvas');
    canvas.width = pxW;
    canvas.height = pxH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,pxW,pxH);

    // draw header (pinned to top)
    if(headerBB){
      const sx = headerBB.x - bbFull.x;
      const sy = headerBB.y - bbFull.y;
      ctx.drawImage(
        fullImg,
        sx, sy, headerBB.width, headerBB.height,
        marginPx, marginPx, headerBB.width * scale, headerBB.height * scale
      );
    }

    // draw drawing centered between header/footer
    ctx.drawImage(drawImg, drawX, drawY, drawW, drawH);

    // draw footer (pinned to bottom)
    if(footerBB){
      const sx = footerBB.x - bbFull.x;
      const sy = footerBB.y - bbFull.y;
      const fy = pxH - marginPx - footerBB.height * scale;
      ctx.drawImage(
        fullImg,
        sx, sy, footerBB.width, footerBB.height,
        marginPx, fy, footerBB.width * scale, footerBB.height * scale
      );
    }

    canvas.toBlob((blob)=>{
      if(!blob) return;
      const link = document.createElement('a');
      link.download = `${baseName}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
    URL.revokeObjectURL(fullUrl);
    URL.revokeObjectURL(drawUrl);
  };

  fullImg.onload = ()=>{ fullReady = true; tryRender(); };
  drawImg.onload = ()=>{ drawReady = true; tryRender(); };
  fullImg.src = fullUrl;
  drawImg.src = drawUrl;
}

function collectState(){
  return {
    vz:'folia',
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
    orderNo: state.orderNo,
    orderNote: state.orderNote,
    exportOrient:$('exportOrient')?.value || 'portrait',
    bgWidth:$('bgWidth')?.value || '',
    bgHeight:$('bgHeight')?.value || '',
    bgOpacity:state.bgOpacity,
    bgOffsetX:state.bgOffsetX,
    bgOffsetY:state.bgOffsetY,
    bgRot:state.bgRot,
    bgFlip:state.bgFlip,
    bgImageData:state.bgImageData,
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
  const baseName = (data.orderNo || 'folia2').trim();
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
  if ($('orderNo')) $('orderNo').value = data.orderNo ?? '';
  if ($('orderNote')) $('orderNote').value = data.orderNote ?? '';
  state.photoW = num($('photoW'),15);
  state.photoH = num($('photoH'),7);
  state.photoNote = $('photoNote')?.value || '';
  state.orderNo = $('orderNo')?.value || '';
  state.orderNote = $('orderNote')?.value || '';
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
  state.measureMode = data.measureMode ?? 'off';
  $('measureMode').value = state.measureMode;
  state.measures = Array.isArray(data.measures)? data.measures : [];
  $('segments').innerHTML=''; state.segments.length=0;
  (data.segments ?? ['']).forEach(v=> addSegmentInput(v));
  $('segmentsH').innerHTML=''; state.segmentsH.length=0;
  (data.segmentsH ?? ['']).forEach(v=> addSegmentInputH(v));
  draw();
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
      if (data.vz && data.vz !== 'folia'){
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
$('btn-reset')?.addEventListener('click', reset);
$('btn-export')?.addEventListener('click', ()=>{ draw(); exportPDF(); });
$('btn-export-png')?.addEventListener('click', ()=>{ draw(); exportPNG(); });
$('btn-save')?.addEventListener('click', saveJSON);
$('btn-load')?.addEventListener('click', ()=> $('loadFile')?.click());
$('loadFile')?.addEventListener('change', (e)=> handleLoadFile(e.target.files?.[0]));
$('seg-add')?.addEventListener('click', ()=> addSegmentInput(''));
$('seg-remove')?.addEventListener('click', removeSegmentInput);
$('segH-add')?.addEventListener('click', ()=> addSegmentInputH(''));
$('segH-remove')?.addEventListener('click', removeSegmentInputH);
$('printOps')?.addEventListener('change', draw);
document.querySelectorAll('input[name=\"lacquerStep\"]').forEach(el=> el.addEventListener('change', draw));
document.querySelectorAll('input[name="printSide"]').forEach(el=> el.addEventListener('change', draw));
$('rollEnabled')?.addEventListener('change', ()=> syncRollChecks('rollEnabled'));
$('rollPrint')?.addEventListener('change', ()=> syncRollChecks('rollPrint'));
$('rollAssembly')?.addEventListener('change', ()=> syncRollChecks('rollAssembly'));

$('bgFile')?.addEventListener('change', (e)=>{
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const r = new FileReader();
  r.onload = (ev)=>{ state.bgImageData = ev.target.result; draw(); };
  r.readAsDataURL(file);
});
$('bg-rot-left')?.addEventListener('click', ()=>{ state.bgRot = (state.bgRot - 90); draw(); });
$('bg-rot-180')?.addEventListener('click', ()=>{ state.bgRot = (state.bgRot + 180); draw(); });
$('bg-flip')?.addEventListener('click', ()=>{ state.bgFlip = !state.bgFlip; draw(); });
$('bgOpacity')?.addEventListener('input', ()=>{ state.bgOpacity = clamp(num($('bgOpacity'), 0.6),0,1); $('bgOpacityVal').textContent = `${Math.round(state.bgOpacity*100)} %`; draw(); });
$('bgWidth')?.addEventListener('input', ()=>{ state.bgWidth = $('bgWidth').value ? num($('bgWidth'), state.bgWidth) : null; draw(); });
$('bgHeight')?.addEventListener('input', ()=>{ state.bgHeight = $('bgHeight').value ? num($('bgHeight'), state.bgHeight) : null; draw(); });
$('bg-clear')?.addEventListener('click', ()=>{ state.bgImageData=null; state.bgWidth=null; state.bgHeight=null; state.bgOffsetX=0; state.bgOffsetY=0; $('bgFile').value=''; $('bgWidth').value=''; $('bgHeight').value=''; draw(); });
$('bg-calib')?.addEventListener('click', startCalib);
$('bg-calib-cancel')?.addEventListener('click', cancelCalib);

$('measureMode')?.addEventListener('change', ()=>{ state.measureMode = $('measureMode').value; state.measurePick=null; state.measurePreview=null; draw(); });
$('measure-cancel')?.addEventListener('click', ()=>{ state.measurePick=null; state.measurePreview=null; draw(); });
$('measure-clear')?.addEventListener('click', ()=>{ state.measures=[]; state.measurePick=null; state.measurePreview=null; draw(); });

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
svgRoot.addEventListener('pointerup', ()=>{ draggingBg=false; });
svgRoot.addEventListener('pointercancel', ()=>{ draggingBg=false; });

window.addEventListener('paste',(e)=>{
  const items = Array.from(e.clipboardData?.items||[]);
  const it = items.find(i=> i.type && i.type.startsWith('image/'));
  if(!it) return;
  const file = it.getAsFile();
  if(!file) return;
  const r=new FileReader();
  r.onload=(ev)=>{ state.bgImageData = ev.target.result; draw(); };
  r.readAsDataURL(file);
  e.preventDefault();
});

addSegmentInput('');
addSegmentInputH('');
reset();
