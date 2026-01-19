const $ = (id)=>document.getElementById(id);
const svgRoot = $('svgRoot');

function num(val, fb=0){
  const v = parseFloat(val);
  return Number.isFinite(v) ? v : fb;
}

function compute(){
  const B = num($('inp-len').value, 0);      // dlzka
  const C = num($('inp-width').value, 0);    // sirka
  const D = num($('inp-flap').value, 0);     // bocna zalozka
  const E = num($('inp-cross').value, 0);    // kriz
  const F = num($('inp-glue-add').value, 0); // pridanie na zlep
  const G = ($('inp-glue-pos').value || '').toUpperCase(); // KRAJ/STRED

  const machine = (G === 'STRED') ? 'STARÝ' : 'NOVÝ';
  const I = B + E; // sek (celkova vyska)

  const K = (C > 120) ? (F + 25) : (G === 'STRED' ? 0 : (F + 15));
  const L = (G === 'STRED') ? F : 0;
  const M = (G === 'STRED') ? (C / 2) : 0;
  const N = D;
  const O = C;
  const P = D; // symetricka bocna zalozka P
  const Q = (G === 'KRAJ') ? (C - 5) : 0;
  const R = (G === 'STRED') ? (C / 2) : 0;
  const S = (G === 'STRED') ? F : 0;

  const widths = [K,L,M,N,O,P,Q,R,S].filter(v=>v>0);
  const J = widths.reduce((a,b)=>a+b,0); // sirka celkovo
  const T = J; // alias

  return {B,C,D,E,F,G,I,J,K,L,M,N,O,P,Q,R,S,T,V:B,W:I,machine};
}

function setOutputs(res){
  $('out-machine').value = res.machine;
  $('out-sek').value = res.I.toFixed(1);
  $('out-w-total').value = res.J.toFixed(1);
  $('out-k').value = res.K.toFixed(1);
  $('out-l').value = res.L.toFixed(1);
  $('out-m').value = res.M.toFixed(1);
  $('out-n').value = res.N.toFixed(1);
  $('out-o').value = res.O.toFixed(1);
  $('out-p').value = res.P.toFixed(1);
  $('out-q').value = res.Q.toFixed(1);
  $('out-r').value = res.R.toFixed(1);
  $('out-s').value = res.S.toFixed(1);
  $('out-v').value = res.V.toFixed(1);
  $('out-w').value = res.W.toFixed(1);
}

function clearSvg(){ while(svgRoot.firstChild) svgRoot.removeChild(svgRoot.firstChild); }

function draw(){
  const res = compute();
  setOutputs(res);

  const offsetX = 60;
  const offsetY = 80;
  const W = res.W; // vyska (sek)
  const L = res.J || 100; // sirka celkovo

  clearSvg();
  const content = document.createElementNS('http://www.w3.org/2000/svg','g');
  content.setAttribute('class','content');
  svgRoot.appendChild(content);

  // hlavny obdlznik
  const mainRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
  mainRect.setAttribute('x', offsetX);
  mainRect.setAttribute('y', offsetY);
  mainRect.setAttribute('width', L);
  mainRect.setAttribute('height', W);
  mainRect.setAttribute('fill','none');
  mainRect.setAttribute('stroke','#0f172a');
  mainRect.setAttribute('stroke-width','1');
  content.appendChild(mainRect);

  // horizont. delenie vysky (kriz/spodok)
  const ySplit = offsetY + (res.W - res.E); // vrchna cast = W - E, spodna = E
  const hLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  hLine.setAttribute('x1', offsetX);
  hLine.setAttribute('x2', offsetX + L);
  hLine.setAttribute('y1', ySplit);
  hLine.setAttribute('y2', ySplit);
  hLine.setAttribute('stroke','#0f172a');
  hLine.setAttribute('stroke-dasharray','4 4');
  content.appendChild(hLine);

  // vertikalne delenie sirky podla K..S
  const segments = [
    {label:'K',val:res.K},
    {label:'L',val:res.L},
    {label:'M',val:res.M},
    {label:'N',val:res.N},
    {label:'O',val:res.O},
    {label:'P',val:res.P},
    {label:'Q',val:res.Q},
    {label:'R',val:res.R},
    {label:'S',val:res.S},
  ];
  let cursor = offsetX;
  segments.forEach(seg=>{
    if(seg.val<=0) return;
    const next = cursor + seg.val;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', next);
    line.setAttribute('x2', next);
    line.setAttribute('y1', offsetY);
    line.setAttribute('y2', offsetY + W);
    line.setAttribute('stroke','#475569');
    line.setAttribute('stroke-width','0.8');
    line.setAttribute('stroke-dasharray','3 3');
    content.appendChild(line);

    // popis segmentu hore
    const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
    txt.setAttribute('x', cursor + seg.val/2);
    txt.setAttribute('y', offsetY - 8);
    txt.setAttribute('text-anchor','middle');
    txt.setAttribute('font-size','12');
    txt.textContent = `${seg.label} ${seg.val.toFixed(1)}`;
    content.appendChild(txt);

    cursor = next;
  });

  // koty sirky
  const dimY = offsetY + W + 18;
  const dimLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  dimLine.setAttribute('x1', offsetX);
  dimLine.setAttribute('x2', offsetX + L);
  dimLine.setAttribute('y1', dimY);
  dimLine.setAttribute('y2', dimY);
  dimLine.setAttribute('stroke','#0f172a');
  dimLine.setAttribute('marker-end','url(#arrow-end)');
  dimLine.setAttribute('marker-start','url(#arrow-start)');
  content.appendChild(dimLine);
  const dimText = document.createElementNS('http://www.w3.org/2000/svg','text');
  dimText.setAttribute('x', offsetX + L/2);
  dimText.setAttribute('y', dimY - 6);
  dimText.setAttribute('text-anchor','middle');
  dimText.setAttribute('font-size','12');
  dimText.textContent = `Šírka celkovo J/T = ${L.toFixed(1)} mm`;
  content.appendChild(dimText);

  // kota vysky
  const dimX = offsetX - 18;
  const vLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  vLine.setAttribute('x1', dimX);
  vLine.setAttribute('x2', dimX);
  vLine.setAttribute('y1', offsetY);
  vLine.setAttribute('y2', offsetY + W);
  vLine.setAttribute('stroke','#0f172a');
  vLine.setAttribute('marker-end','url(#arrow-end)');
  vLine.setAttribute('marker-start','url(#arrow-start)');
  content.appendChild(vLine);
  const vText = document.createElementNS('http://www.w3.org/2000/svg','text');
  vText.setAttribute('x', dimX - 4);
  vText.setAttribute('y', offsetY + W/2);
  vText.setAttribute('text-anchor','middle');
  vText.setAttribute('font-size','12');
  vText.setAttribute('transform', `rotate(-90 ${dimX-4} ${offsetY + W/2})`);
  vText.textContent = `Výška (sek) = ${W.toFixed(1)} mm`;
  content.appendChild(vText);

  // legenda kríž / zvyšok
  const lblTop = document.createElementNS('http://www.w3.org/2000/svg','text');
  lblTop.setAttribute('x', offsetX + L + 10);
  lblTop.setAttribute('y', offsetY + (res.W - res.E)/2);
  lblTop.setAttribute('font-size','12');
  lblTop.textContent = `Horná časť: ${res.B.toFixed(1)} mm`;
  content.appendChild(lblTop);
  const lblBot = document.createElementNS('http://www.w3.org/2000/svg','text');
  lblBot.setAttribute('x', offsetX + L + 10);
  lblBot.setAttribute('y', ySplit + res.E/2);
  lblBot.setAttribute('font-size','12');
  lblBot.textContent = `Kríž (spodok): ${res.E.toFixed(1)} mm`;
  content.appendChild(lblBot);

  ensureDefs();
  fitViewBox();
}

function ensureDefs(){
  if(svgRoot.querySelector('#arrow-end')) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');

  const endMarker = document.createElementNS('http://www.w3.org/2000/svg','marker');
  endMarker.setAttribute('id','arrow-end');
  endMarker.setAttribute('viewBox','0 0 10 10');
  endMarker.setAttribute('refX','10');
  endMarker.setAttribute('refY','5');
  endMarker.setAttribute('markerWidth','8');
  endMarker.setAttribute('markerHeight','8');
  endMarker.setAttribute('orient','auto');
  endMarker.setAttribute('markerUnits','userSpaceOnUse');
  const pathEnd = document.createElementNS('http://www.w3.org/2000/svg','path');
  pathEnd.setAttribute('d','M 0 0 L 10 5 L 0 10 z');
  pathEnd.setAttribute('fill','#0f172a');
  endMarker.appendChild(pathEnd);
  defs.appendChild(endMarker);

  const startMarker = document.createElementNS('http://www.w3.org/2000/svg','marker');
  startMarker.setAttribute('id','arrow-start');
  startMarker.setAttribute('viewBox','0 0 10 10');
  startMarker.setAttribute('refX','0');
  startMarker.setAttribute('refY','5');
  startMarker.setAttribute('markerWidth','8');
  startMarker.setAttribute('markerHeight','8');
  startMarker.setAttribute('orient','auto');
  startMarker.setAttribute('markerUnits','userSpaceOnUse');
  const pathStart = document.createElementNS('http://www.w3.org/2000/svg','path');
  pathStart.setAttribute('d','M 10 0 L 0 5 L 10 10 z');
  pathStart.setAttribute('fill','#0f172a');
  startMarker.appendChild(pathStart);
  defs.appendChild(startMarker);

  svgRoot.appendChild(defs);
}

function fitViewBox(){
  const bb = svgRoot.getBBox();
  const minX = Math.min(0, bb.x - 40);
  const minY = Math.min(0, bb.y - 40);
  const width = bb.width + 80;
  const height = bb.height + 80;
  svgRoot.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
  svgRoot.setAttribute('width', width);
  svgRoot.setAttribute('height', height);
}

function reset(){
  $('inp-len').value = 165;
  $('inp-width').value = 60;
  $('inp-flap').value = 40;
  $('inp-cross').value = 30;
  $('inp-glue-add').value = 10;
  $('inp-glue-pos').value = 'KRAJ';
  $('exportOrient').value = 'portrait';
  draw();
}

function collectState(){
  return {
    len: $('inp-len').value,
    width: $('inp-width').value,
    flap: $('inp-flap').value,
    cross: $('inp-cross').value,
    glueAdd: $('inp-glue-add').value,
    gluePos: $('inp-glue-pos').value,
    exportOrient: $('exportOrient').value
  };
}

function saveJSON(){
  const data = collectState();
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'vz108.json'; a.click();
  URL.revokeObjectURL(url);
}

function loadData(data){
  if(!data) return;
  $('inp-len').value = data.len ?? '165';
  $('inp-width').value = data.width ?? 60;
  $('inp-flap').value = data.flap ?? 40;
  $('inp-cross').value = data.cross ?? 30;
  $('inp-glue-add').value = data.glueAdd ?? 10;
  $('inp-glue-pos').value = data.gluePos ?? 'KRAJ';
  $('exportOrient').value = data.exportOrient ?? 'portrait';
  draw();
}

function handleLoadFile(file){
  if(!file) return;
  const r = new FileReader();
  r.onload = (ev)=>{
    try{
      const data = JSON.parse(ev.target.result);
      loadData(data);
    }catch(_){ }
  };
  r.readAsText(file);
}

function exportPDF(){
  draw();
  const bb = svgRoot.getBBox();
  const width = bb.width || 800;
  const height = bb.height || 800;
  const clone = svgRoot.cloneNode(true);
  clone.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
  clone.setAttribute('width', `${width}mm`);
  clone.setAttribute('height', `${height}mm`);
  const svgMarkup = new XMLSerializer().serializeToString(clone);
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>vz108 PDF</title>
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
  const vb = svgRoot.viewBox.baseVal;
  const width = vb.width || 800;
  const height = vb.height || 800;
  const orient = $('exportOrient')?.value || 'portrait';
  const pxW = orient==='portrait' ? 2480 : 3508; // A4 300dpi
  const pxH = orient==='portrait' ? 3508 : 2480;
  const marginPx = 0.05 * Math.min(pxW, pxH);
  const usableW = pxW - marginPx*2;
  const usableH = pxH - marginPx*2;
  const bb = svgRoot.getBBox();
  const bbW = bb.width;
  const bbH = bb.height;
  const scale = Math.min(usableW / bbW, usableH / bbH);
  const drawW = bbW * scale;
  const drawH = bbH * scale;
  const offsetX = marginPx + (usableW - drawW) / 2;
  const offsetY = marginPx + (usableH - drawH) / 2;

  const svgCopy = svgRoot.cloneNode(true);
  svgCopy.removeAttribute('style');
  svgCopy.setAttribute('width', bbW);
  svgCopy.setAttribute('height', bbH);
  svgCopy.setAttribute('viewBox', `${bb.x} ${bb.y} ${bbW} ${bbH}`);
  svgCopy.setAttribute('preserveAspectRatio','xMidYMid meet');
  const svgMarkup = new XMLSerializer().serializeToString(svgCopy);
  const svgBlob = new Blob([svgMarkup], {type:'image/svg+xml'});
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = ()=>{
    const canvas = document.createElement('canvas');
    canvas.width = pxW;
    canvas.height = pxH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,pxW,pxH);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    canvas.toBlob((blob)=>{
      if(!blob) return;
      const link = document.createElement('a');
      link.download = 'vz108.png';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function initLenOptions(){
  const sel = $('inp-len');
  sel.innerHTML = '';
  for(let v=155; v<=410; v+=5){
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  }
  sel.value = '165';
}

['inp-len','inp-width','inp-flap','inp-cross','inp-glue-add','inp-glue-pos'].forEach(id=>{
  $(id).addEventListener('input', draw);
});
$('btn-reset').addEventListener('click', reset);
$('btn-save').addEventListener('click', saveJSON);
$('btn-load').addEventListener('click', ()=> $('loadFile').click());
$('loadFile').addEventListener('change', (e)=> handleLoadFile(e.target.files?.[0]));
$('btn-export').addEventListener('click', ()=>{ draw(); exportPDF(); });
$('btn-export-png').addEventListener('click', ()=>{ draw(); exportPNG(); });

initLenOptions();
draw();
