"use strict";
(function(){
  const $ = (id)=>document.getElementById(id);
  const svgRoot = $('svgRoot');
  const refPartA = $('refPartA');
  const refPartB = $('refPartB');
  const refCodeText = $('refCodeText');
  const porCislo = $('porCislo');
  const porCisloText = $('porCisloText');
  const finalNavinNumber = $('finalNavinNumber');
  const finalNavinLetter = $('finalNavinLetter');
  const navinTlacText = $('navinTlacText');
  const finalNavinText = $('finalNavinText');
  const rezanieYes = $('rezanie-ano');
  const rezanieNo = $('rezanie-nie');
  const btnOpenFirmManager = $('btnOpenFirmManager');

  function buildRefLabel(){
    const a = (refPartA && refPartA.value ? refPartA.value.trim() : '') || 'vz-22';
    const b = (refPartB && refPartB.value ? refPartB.value.trim() : '');
    return b ? `${a}/${b}` : a;
  }
  function updateRefDisplay(){
    if (refCodeText) refCodeText.textContent = buildRefLabel();
  }
  function updatePorCisloDisplay(){
    if (porCisloText) porCisloText.textContent = (porCislo && porCislo.value ? porCislo.value : '-') || '-';
  }
  function buildRefSlug(){
    return buildRefLabel().replace(/[^a-zA-Z0-9_-]+/g, '-');
  }
  const stampEl = $('stamp');
  const printSide = $('printSide');
  const lblNavinTlac = $('lblNavinTlac');
  const printSideText = $('printSideText');
  const rezanieText = $('rezanieText');
  const vzCodeEl = $('vzCode');
  const bgFile = $('bgFile');
  const bgWidthEl = $('bgWidth');
  const bgHeightEl = $('bgHeight');
  const bgOpacityEl = $('bgOpacity');
  const bgOpacityVal = $('bgOpacityVal');
  const bgClearBtn = $('bg-clear');
  const bgCalibBtn = $('bg-calib');
  const bgCalibCancelBtn = $('bg-calib-cancel');
  const bgRotLeftBtn = $('bg-rot-left');
  const bgRot180Btn = $('bg-rot-180');
  const bgFlipBtn = $('bg-flip');
  const svgHolder = $('svgHolder');
  const measureModeEl = $('measureMode');
  const measureCancelBtn = $('measure-cancel');
  const measureClearBtn = $('measure-clear');
  const exportSizeEl = $('exportSize');
  const exportOrientEl = $('exportOrient');
  const exportDPIEl = $('exportDPI');
  const printBtn = $('btn-print');
  const bottomImgInput = $('bottomImgInput');
  const bottomImgPreview = $('bottomImgPreview');
  const bottomText1 = $('bottomText1');
  const bottomText2 = $('bottomText2');
  const saveBtn = $('btn-save');
  const loadBtn = $('btn-load');
  const undoBtn = $('btn-undo');
  const redoBtn = $('btn-redo');
  const loadFile = $('loadFile');

  const prefillableIds = [
    'W','L','G','K','BagWidth','Cpitch','AxisInK','NotchLen','AirEdge','AirXAbs','AirInGOnly',
    'PerfOffset','PerfSide','printSide',
    'finalNavinNumber','finalNavinLetter','rezanie-ano','rezanie-nie',
    'porCislo','otherNotes','bottomText1','bottomText2','refPartA','refPartB',
    'bgWidth','bgHeight'
  ];
  const prefillableEls = prefillableIds.map(id=>$(id)).filter(Boolean);

  const state = {
    fontPx:14,
    bounds:{width:800,height:800},
    zoom:1,
    pan:{x:0,y:0},
    measureMode:'off',
    measurePick:null,
    measures:[],
    measurePreview:null
  };

  const historyState = {
    undo: [],
    redo: [],
    lastSig: '',
    isApplying: false
  };
  let historyTimer = null;

  const bgState = {
    data:null,
    natural:{w:0,h:0},
    opacity:0.6,
    offset:{x:0,y:0},
    rotation:0,
    flip:false,
    calib:{active:false, points:[]}
  };

  const inputs = [
    'W','L','G','K','BagWidth','Cpitch','AxisInK','NotchLen','AirEdge','AirXAbs','AirInGOnly',
    'PerfEnabled','PerfOffset','PerfSide','fontPx','toggle-grid','toggle-notches',
    'bgWidth','bgHeight','finalNavinNumber','finalNavinLetter','rezanie-ano','rezanie-nie'
  ].map(id => $(id));

  const airXInput = $('AirXAbs');
  if (airXInput){
    airXInput.addEventListener('input', ()=>{ airXInput.dataset.userSet = '1'; });
  }
  if (printSide) printSide.addEventListener('change', updateNavinTlac);
  if (finalNavinNumber) finalNavinNumber.addEventListener('change', updateNavinTlac);
  if (finalNavinLetter) finalNavinLetter.addEventListener('change', updateNavinTlac);
  if (rezanieYes) rezanieYes.addEventListener('change', updateNavinTlac);
  if (rezanieNo) rezanieNo.addEventListener('change', updateNavinTlac);
  if (refPartA) refPartA.addEventListener('input', updateRefDisplay);
  if (refPartB) refPartB.addEventListener('input', updateRefDisplay);
  if (porCislo) porCislo.addEventListener('input', updatePorCisloDisplay);
  const airEnabledEl = $('AirEnabled');
  const airEdgeEl = $('AirEdge');
  const airXAbsEl = $('AirXAbs');
  const airInGOnlyEl = $('AirInGOnly');
  function updateAirUiState(){
    const enabled = ((airEnabledEl?.value || 'ano').toLowerCase() === 'ano');
    if (airEdgeEl) airEdgeEl.disabled = !enabled;
    if (airXAbsEl) airXAbsEl.disabled = !enabled;
    if (airInGOnlyEl) airInGOnlyEl.disabled = !enabled;
  }
  if (airEnabledEl) airEnabledEl.addEventListener('change', ()=>{ updateAirUiState(); draw(); });
  const perfEnabledEl = $('PerfEnabled');
  const perfSideEl = $('PerfSide');
  const perfOffsetEl = $('PerfOffset');
  function updatePerfUiState(){
    const enabled = ((perfEnabledEl?.value || 'ano').toLowerCase() === 'ano');
    if (perfSideEl) perfSideEl.disabled = !enabled;
    if (perfOffsetEl) perfOffsetEl.disabled = !enabled;
  }
  if (perfEnabledEl) perfEnabledEl.addEventListener('change', ()=>{ updatePerfUiState(); draw(); });
  if (btnOpenFirmManager) {
    btnOpenFirmManager.addEventListener('click', () => {
      try { localStorage.setItem('index2_vz', 'vz22'); } catch (_) {}
      window.open('index2.html?vz=vz22', '_blank');
    });
  }
  if (undoBtn) undoBtn.addEventListener('click', doUndo);
  if (redoBtn) redoBtn.addEventListener('click', doRedo);
  document.addEventListener('keydown', (e)=>{
    const key = (e.key || '').toLowerCase();
    if (!(e.ctrlKey || e.metaKey)) return;
    if (key === 'z' && !e.shiftKey){
      e.preventDefault();
      doUndo();
      return;
    }
    if (key === 'y' || (key === 'z' && e.shiftKey)){
      e.preventDefault();
      doRedo();
    }
  });
  const controlsRoot = $('controls');
  if (controlsRoot){
    controlsRoot.addEventListener('input', (e)=>{
      if (isUndoTrackable(e.target)) scheduleUndoSnapshot();
    });
    controlsRoot.addEventListener('change', (e)=>{
      if (isUndoTrackable(e.target)) scheduleUndoSnapshot();
    });
  }

  // default zapnutĂ© zĂˇrezy (ak uĹľ nie je nastavenĂ© inak)
  if($('toggle-notches')) $('toggle-notches').checked = true;

  function num(el, fallback=0){ const v=parseFloat(el.value); return Number.isFinite(v)?v:fallback; }
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
  function fmtVal(n){ if(!Number.isFinite(n)) return ''; return Number.isInteger(n)? `${n}` : n.toFixed(1); }
  function isUndoTrackable(el){
    if (!el || !el.id) return false;
    if (el.id === 'loadFile' || el.id === 'Mostik') return false;
    if (el.type === 'file') return false;
    return true;
  }
  function captureUndoSnapshot(){
    const values = {};
    const nodes = document.querySelectorAll('#controls input[id], #controls select[id], #controls textarea[id]');
    nodes.forEach((el)=>{
      if (!isUndoTrackable(el)) return;
      if (el.type === 'checkbox' || el.type === 'radio') values[el.id] = !!el.checked;
      else values[el.id] = el.value;
    });
    return values;
  }
  function updateUndoRedoButtons(){
    if (undoBtn) undoBtn.disabled = historyState.undo.length <= 1;
    if (redoBtn) redoBtn.disabled = historyState.redo.length === 0;
  }
  function pushUndoSnapshot(clearRedo=true){
    if (historyState.isApplying) return;
    const snap = captureUndoSnapshot();
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
    Object.entries(snap).forEach(([id,val])=>{
      const el = $(id);
      if (!el) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!val;
      else el.value = val;
    });
    historyState.isApplying = false;
    updateRefDisplay();
    updatePorCisloDisplay();
    updateNavinTlac();
    updateAirUiState();
    updatePerfUiState();
    draw();
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
  function pickLabel(label, actual){
    if (typeof label === 'number') return fmtVal(actual);
    if (label === null || label === undefined || label === '') return fmtVal(actual);
    return label;
  }

  function updateStamp(){
    const now = new Intl.DateTimeFormat('sk-SK',{
      year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit'
    }).format(new Date());
    stampEl.textContent = now;
  }

  function getEffectiveNavin(){
    const finalCode = (finalNavinNumber?.value || '1').trim() || '1';
    const finalVariant = (finalNavinLetter?.value || 'A').trim() || 'A';
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
    if(rezanieYes?.checked){
      const mapped = printMap[`${finalCode}${finalVariant}`];
      if(mapped){
        effectiveCode = mapped.code;
        effectiveVariant = mapped.variant;
      }
    }
    return {effectiveCode, effectiveVariant, finalCode, finalVariant};
  }
  function updateNavinTlac(){
    const {effectiveCode, effectiveVariant, finalCode, finalVariant} = getEffectiveNavin();
    if(navinTlacText) navinTlacText.textContent = `${effectiveCode}${effectiveVariant}`;
    if(finalNavinText) finalNavinText.textContent = `${finalCode}${finalVariant}`;
    const prefix = (printSide?.value === 'spodna') ? 'S' : 'V';
    if(lblNavinTlac) lblNavinTlac.textContent = `${prefix}${effectiveCode}`;
    if (printSideText) printSideText.textContent = printSide?.value || 'vrchna';
    if (rezanieText) rezanieText.textContent = (rezanieYes?.checked ? 'ano' : 'nie');
    updateRefDisplay();
  }

  const mm2px = (mm,dpi)=> (mm/25.4)*dpi;

  const INLINE_ASSETS = {
    zhora: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAFNCAYAAAAKI+HUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAk3SURBVHhe7ZFBigQ3FMXm/pdOqE0wtfHXNKjliQXeNK+M1P7553IcP+8fLn3uox3IfbQDuY92IPfRDuQ+2oHcRzuQ+2gHch/tQO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH23Iz8/Pf+fbfN/gEO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH+1Apo+27sghbNfvy6fnrzFte/8P00PYrt+XT89fY9r2/h+mh7Bdvy+fnr/GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRtunsg25XtmlxMtqcxbZvuHsh2ZbsmF5PtaUzbprsHsl3ZrsnFZHsa07bp7oFsV7ZrcjHZnsa0bbp7INuV7ZpcvG7L5zdMv5/uHsh2ZbsmF7//nOr5DdPvp7sHsl3ZrsnF7z+nen7D9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7Jxeu2fH7D9Pvp7oFsV7ZrcvH7z6me3zD9frp7INuV7Zpc/P5zquc3TL+f7h7IdmW7JheT7WlM26a7B7Jd2a7JxWR7GtO26e6BbFe2a3Ix2Z7GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRt3ZFD2K7fl0/PX2Pa9v4fpoewXb8vn56/xrTt/T9MD2G7fl8+PX+NUtv3DQ7hPtqB3Ec7kPtoB3If7UDuox3IfbQDuY92IP/rRyvFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt26wxp96vo1u8P4DTjzfRjd4/wEnnm/zfYML5j7agdxHO5D7aAdyH+1A7qMdyH20A7mPdiD30Q7kPtqB3Ec7kPtoB3If7UDuox3Ivzo+yocvaAYcAAAAAElFTkSuQmCC',
    zdola: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAFNCAYAAAAKI+HUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAk3SURBVHhe7ZFBigQ3FMXm/pdOqE0wtfHXNKjliQXeNK+M1P7553IcP+8fLn3uox3IfbQDuY92IPfRDuQ+2oHcRzuQ+2gHch/tQO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH23Iz8/Pf+fbfN/gEO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH+1Apo+27sghbNfvy6fnrzFte/8P00PYrt+XT89fY9r2/h+mh7Bdvy+fnr/GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRtunsg25XtmlxMtqcxbZvuHsh2ZbsmF5PtaUzbprsHsl3ZrsnFZHsa07bp7oFsV7ZrcjHZnsa0bbp7INuV7ZpcvG7L5zdMv5/uHsh2ZbsmF7//nOr5DdPvp7sHsl3ZrsnF7z+nen7D9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7Jxeu2fH7D9Pvp7oFsV7ZrcvH7z6me3zD9frp7INuV7Zpc/P5zquc3TL+f7h7IdmW7JheT7WlM26a7B7Jd2a7JxWR7GtO26e6BbFe2a3Ix2Z7GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRt3ZFD2K7fl0/PX2Pa9v4fpoewXb8vn56/xrTt/T9MD2G7fl8+PX+NUtv3DQ7hPtqB3Ec7kPtoB3If7UDuox3IfbQDuY92IP/rRyvFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt26wxp96vo1u8P4DTjzfRjd4/wEnnm/zfYML5j7agdxHO5D7aAdyH+1A7qMdyH20A7mPdiD30Q7kPtqB3Ec7kPtoB3If7UDuox3Ivzo+yocvaAYcAAAAAElFTkSuQmCC'
  };

  async function inlineAsset(src){
    if(!src) return null;
    if(src.startsWith('data:')) return src;
    const lower = src.toLowerCase();
    if(lower.includes('zhora.png')) return INLINE_ASSETS.zhora;
    if(lower.includes('zdola.png')) return INLINE_ASSETS.zdola;
    try{
      const resp = await fetch(src);
      const blob = await resp.blob();
      return await new Promise((res,rej)=>{
        const fr=new FileReader();
        fr.onload=()=>res(fr.result);
        fr.onerror=()=>rej(new Error('read fail'));
        fr.readAsDataURL(blob);
      });
    }catch(_){
      return null;
    }
  }

  function prefillFromFirm(){
    let source = '';
    try { source = localStorage.getItem('prefill_source') || ''; } catch (_) {}
    if (source !== 'firm') return;
    let data = null;
    try {
      const raw = localStorage.getItem('selectedFirm');
      if (raw) data = JSON.parse(raw);
    } catch(_) { /* ignore */ }
    if (!data || data.vz !== 'vz22') return;
    const dims = data.dimensions || {};
    const clip = data.clip || {};
    const map = { W:'W', L:'L', G:'G', K:'K', bagWidth:'BagWidth', Cpitch:'Cpitch', AxisInK:'AxisInK', notchLen:'NotchLen', AirEdge:'AirEdge', AirXAbs:'AirXAbs', AirInGOnly:'AirInGOnly', PerfOffset:'PerfOffset', PerfSide:'PerfSide' };
    Object.values(map).forEach(id=>{
      const el=$(id);
      if (el) el.classList.remove('prefilled');
    });
    Object.entries(map).forEach(([key,id])=>{
      const el=$(id);
      let val=null;
      if (key === 'notchLen') val = dims.notchLen;
      else if (key === 'Cpitch') val = dims.Cpitch;
      else if (key === 'AxisInK') val = (dims.AxisInK != null) ? dims.AxisInK : (dims.K != null ? dims.K/2 : null);
      else if (key === 'PerfSide') val = dims.PerfSide;
      else if (key === 'bagWidth') val = dims.W;
      else val = dims[key];
      if (el && val != null && val !== '') {
        el.value = (el.tagName === 'SELECT') ? String(val) : val;
        el.classList.add('prefilled');
      }
    });

    const lines = [];
    if (clip.count) {
      const typTxt = clip.type ? ` (TYP: ${clip.type})` : '';
      lines.push(`POCET SPON V BALENI ${clip.count}${typTxt}`);
    }
    const noteLine = Array.isArray(data.notes) ? data.notes.filter(Boolean).join('; ').trim() : '';
    if (noteLine) lines.push(noteLine);
    bottomText1.classList.remove('prefilled');
    if (lines.length){
      bottomText1.value = lines.join('\n');
      bottomText1.classList.add('prefilled');
    }

    bottomText2.classList.remove('prefilled');
    const techLines = Array.isArray(data.techNotes) ? data.techNotes.filter(Boolean) : [];
    if (techLines.length){
      bottomText2.value = techLines.join('\n');
      bottomText2.classList.add('prefilled');
    }

    const resolveAsset = (p)=>{
      if(!p) return null;
      if(p === 'zhora') return 'img/zhora.png';
      if(p === 'zdola') return 'img/zdola.png';
      return p;
    };
    const assetPath = resolveAsset((data.clipImages && data.clipImages[0]) || (Array.isArray(data.assets) && data.assets[0]?.path));
    if (assetPath){
      bottomImgPreview.style.display = 'block';
      bottomImgPreview.style.transform = 'rotate(90deg)';
      inlineAsset(assetPath).then(dataUrl=>{
        if(dataUrl){
          bottomImgPreview.src = dataUrl;
        } else {
          bottomImgPreview.src='';
          bottomImgPreview.style.display='none';
          bottomImgPreview.style.transform='';
        }
      });
    } else {
      bottomImgPreview.src = '';
      bottomImgPreview.style.display = 'none';
      bottomImgPreview.style.transform = '';
    }

    try {
      localStorage.removeItem('selectedFirm');
      localStorage.removeItem('prefill_source');
    } catch (_) {}
  }

  function clearPrefilled(){
    prefillableEls.forEach(el=> el.classList.remove('prefilled'));
  }
  prefillableEls.forEach(el=>{
    const evt = (el.tagName === 'TEXTAREA' || el.type === 'text' || el.type === 'number') ? 'input' : 'change';
    el.addEventListener(evt, (e)=> {
      if (e && e.isTrusted === false) return;
      el.classList.remove('prefilled');
    });
  });

  function withNormalizedView(fn){
    const oldPan = {...state.pan};
    const oldZoom = state.zoom;
    state.pan = {x:0,y:0};
    state.zoom = 1;
    draw();
    const res = fn();
    state.pan = oldPan;
    state.zoom = oldZoom;
    draw();
    return res;
  }

  function create(tag, attrs={}, parent=svgRoot){
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k,v])=> el.setAttribute(k,v));
    parent.appendChild(el);
    return el;
  }

  function clearSvg(){
    while(svgRoot.firstChild) svgRoot.removeChild(svgRoot.firstChild);
  }

  function textWithBg(txt,x,y,opts={}){
    const {color='#0f172a', anchor='middle', baseline='middle'} = opts;
    const g = create('g');
    const t = create('text',{x,y,'text-anchor':anchor,'dominant-baseline':baseline,fill:color,'font-size':state.fontPx},g);
    t.textContent = txt;
    svgRoot.appendChild(g);
    const bb = t.getBBox();
    const pad = 3;
    const r = create('rect',{
      x: bb.x - pad, y: bb.y - pad, width: bb.width + 2*pad, height: bb.height + 2*pad,
      fill: 'white', stroke: 'none', opacity:'0.9'
    });
    g.insertBefore(r, t);
    return g;
  }

  function arrowLeft(x,y,color){ create('path',{d:`M ${x} ${y} l 5 -3 v 6 z`,fill:color}); }
  function arrowRight(x,y,color){ create('path',{d:`M ${x} ${y} l -5 -3 v 6 z`,fill:color}); }
  function arrowUp(x,y,color){ create('path',{d:`M ${x} ${y} l -3 5 h 6 z`,fill:color}); }
  function arrowDown(x,y,color){ create('path',{d:`M ${x} ${y} l -3 -5 h 6 z`,fill:color}); }

  function hDim(x1,y,x2,label,ext=10,color='#0f172a'){
    if(x2<x1){ const t=x1; x1=x2; x2=t; }
    create('line',{x1,y1:y,x2,y2:y,stroke:color,'stroke-width':1});
    create('line',{x1,y1:y-ext,x2:x1,y2:y+ext,stroke:color,'stroke-width':1});
    create('line',{x1:x2,y1:y-ext,x2:x2,y2:y+ext,stroke:color,'stroke-width':1});
    arrowLeft(x1,y,color); arrowRight(x2,y,color);
    const lbl = pickLabel(label, Math.abs(x2 - x1));
    textWithBg(lbl,(x1+x2)/2,y-6,{color});
  }

  function vDim(x,y1,y2,label,ext=10,color='#0f172a'){
    if(y2<y1){ const t=y1; y1=y2; y2=t; }
    create('line',{x1:x,x2:x,y1,y2,stroke:color,'stroke-width':1});
    create('line',{x1:x-ext,x2:x+ext,y1:y1,y2:y1,stroke:color,'stroke-width':1});
    create('line',{x1:x-ext,x2:x+ext,y1:y2,y2:y2,stroke:color,'stroke-width':1});
    arrowUp(x,y1,color); arrowDown(x,y2,color);
    const offset = ext + Math.max(4, Math.round(state.fontPx*0.35));
    const g = create('g',{transform:`translate(${x - offset} ${(y1+y2)/2}) rotate(-90)`});
    const t = create('text',{'text-anchor':'middle','dominant-baseline':'middle','font-size':state.fontPx,fill:color},g);
    const lbl = pickLabel(label, Math.abs(y2 - y1));
    t.textContent = lbl;
    const bb = t.getBBox();
    const pad=3;
    const r=create('rect',{x:bb.x-pad,y:bb.y-pad,width:bb.width+2*pad,height:bb.height+2*pad,fill:'white',opacity:0.9});
    g.insertBefore(r,t);
    svgRoot.appendChild(g);
  }

  function roundedRect(x,y,w,h,r){
    create('rect',{x,y,width:w,height:h,rx:r,ry:r,fill:'none',stroke:'#0f172a','stroke-width':1});
  }
  function cross(cx,cy,size=6){
    create('line',{x1:cx-size,x2:cx+size,y1:cy,y2:cy,stroke:'#0f172a','stroke-width':1});
    create('line',{x1:cx,y1:cy-size,x2:cx,y2:cy+size,stroke:'#0f172a','stroke-width':1});
  }

  function draw(){
    const W = num($('W'),400);
    const L = num($('L'),600);
    const G = num($('G'),50);
    const K = num($('K'),45);
    const C = Math.max(0,num($('Cpitch'),160));
    const axisInK = $('AxisInK').value==='' ? null : num($('AxisInK'), K/2);
    const showNotches = $('toggle-notches').checked;
    const notchLen = Math.max(1,num($('NotchLen'),7));
    const bagWidth = Math.max(0,num($('BagWidth'), 0));
    const airEnabled = (($('AirEnabled')?.value)||'ano').toLowerCase()==='ano';
    const airEdge = Math.max(0,num($('AirEdge'),30));
    const airInGOnly = !!$('AirInGOnly')?.checked;
    const airXAbsRaw = num($('AirXAbs'), NaN);
    const airCount = 2; // 4 otvory total (2 na kazdej strane)
    const airPitch = 40; // fixna roztec
    const perfEnabled = (($('PerfEnabled')?.value)||'ano').toLowerCase()==='ano';
    const perfSide = (($('PerfSide')?.value)||'prava').toLowerCase()==='lava'?'lava':'prava';
    const perfOffset = Math.max(0,num($('PerfOffset'),7));
    state.fontPx = parseInt($('fontPx').value,10)||14;
    $('fontPxVal').textContent = state.fontPx + ' px';

    const widths = [K,L,G,G,L];
    const totalWidth = widths.reduce((a,b)=>a+b,0);
    const offsetX = 120;
    const offsetY = 120;
    const yTop = offsetY;
    const yBottom = offsetY + W;
    state.cachedDims = {yTop, yBottom, width: totalWidth, height: W, offsetX, offsetY};

    clearSvg();

    if(bgState.data){
      const bw = num(bgWidthEl) || state.cachedDims.width;
      const bh = num(bgHeightEl) || state.cachedDims.height;
      const x = offsetX + bgState.offset.x;
      const y = offsetY + bgState.offset.y;
      const img = create('image',{href:bgState.data,x,y,width:bw,height:bh,opacity:bgState.opacity});
      const cx = x + bw/2;
      const cy = y + bh/2;
      const transforms = [];
      if(bgState.rotation){ transforms.push(`rotate(${bgState.rotation} ${cx} ${cy})`); }
      if(bgState.flip){ transforms.push(`translate(${2*cx} 0) scale(-1 1)`); }
      if(transforms.length){ img.setAttribute('transform', transforms.join(' ')); }
    }

    if ($('toggle-grid').checked){
      const defs = create('defs');
      const pattern = create('pattern',{id:'grid',width:50,height:50,patternUnits:'userSpaceOnUse'},defs);
      create('path',{d:'M 50 0 L 0 0 0 50',fill:'none',stroke:'#e2e8f0','stroke-width':1},pattern);
      create('rect',{x:0,y:0,width:2000,height:2000,fill:'url(#grid)'});
    }

    const xStart = offsetX + state.pan.x;
    const xKstart = xStart;
    const xKend = xKstart + K;
    const xLeftBodyStart = xKend;
    const xLeftGStart = xLeftBodyStart + L;
    const xRightGStart = xLeftGStart + G;
    const xRightGEnd = xRightGStart + G;
    const xRightBodyStart = xRightGEnd;
    const xRightBodyEnd = xRightBodyStart + L;
    const leftOuter = xStart;
    const rightOuter = xStart + totalWidth;

    const yMid = yTop + W/2;
    const y1 = yMid - C/2;
    const y2 = yMid + C/2;

    const topLimit = yTop + 7;
    const botLimit = yBottom - 7;
    $('warnC').style.display = (y1<topLimit || y2>botLimit) ? 'block' : 'none';

    const axisRaw = (axisInK===null || Number.isNaN(axisInK)) ? K/2 : axisInK;
    const axisVal = clamp(axisRaw, 0, K);
    $('warnAxis').style.display = (axisRaw<0 || axisRaw>K) ? 'block' : 'none';
    const xAxis = xKstart + axisVal;

    let ox = xStart;
    widths.forEach(w=>{
      create('rect',{x:ox,y:yTop,width:w,height:W,fill:'none',stroke:'#0f172a','stroke-width':1});
      ox += w;
    });

    const rHole = 7;
    create('circle',{cx:xAxis, cy:y1, r:rHole, fill:'none', stroke:'#0f172a','stroke-width':1});
    create('circle',{cx:xAxis, cy:y2, r:rHole, fill:'none', stroke:'#0f172a','stroke-width':1});
    textWithBg('Ø14', xAxis, y1 - rHole - Math.max(8, Math.round(state.fontPx*0.9)), {anchor:'middle', baseline:'middle'});

    const yDimAxis = yBottom + 90;
    create('line',{x1:xAxis,x2:xAxis,y1:yDimAxis,y2:y2,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'4 4'});

    const xDim = xKstart - 25;
    const xDimW = xDim - 30;
    vDim(xDim, yTop, y1, Math.round(W/2 - C/2));
    vDim(xDim, y1, y2, Math.round(C), 10, '#dc2626');
    vDim(xDim, yBottom, y2, Math.round(W/2 - C/2));
    vDim(xDimW, yTop, yBottom, Math.round(W));

    let rightLegendX = 0;
    let rightLegendW = 0;
    if(!state.lineOnly){
      const magenta = '#d0007a';
      const greenStroke = '#166534';
      const greenFill = '#86efac';
      const bandH = 5;
      create('rect',{x:leftOuter,y:offsetY,width:totalWidth,height:bandH,fill:magenta,'fill-opacity':0.25,stroke:'none'});
      create('rect',{x:leftOuter,y:offsetY + W - bandH,width:totalWidth,height:bandH,fill:magenta,'fill-opacity':0.25,stroke:'none'});

      const boxH = Math.max(16, Math.round(state.fontPx * 1.2));
      const padX = 6;
      const textY = offsetY - boxH / 2 - 6;

      const textLeft = 'ZONA BEZ TLACE';
      const textLeftW = Math.round(state.fontPx * 0.6 * textLeft.length);
      const boxLeftW = textLeftW + padX * 2;
      const legendX = leftOuter;
      const legendY = Math.round(textY - boxH / 2);
      create('rect',{x:legendX,y:legendY,width:boxLeftW,height:boxH,fill:magenta,'fill-opacity':0.25,stroke:magenta,'stroke-width':1});
      create('text',{x:legendX + padX,y:legendY + boxH/2,'text-anchor':'start','dominant-baseline':'middle','font-size':state.fontPx,fill:magenta}).textContent=textLeft;

      const textRight = 'BEZ KORONOVEJ UPRAVY';
      const textRightW = Math.round(state.fontPx * 0.6 * textRight.length);
      const boxRightW = textRightW + padX * 2;
      rightLegendX = rightOuter - boxRightW;
      rightLegendW = boxRightW;
      create('rect',{x:rightLegendX,y:legendY,width:boxRightW,height:boxH,fill:greenFill,'fill-opacity':0.25,stroke:greenStroke,'stroke-width':1});
      create('text',{x:rightLegendX + padX,y:legendY + boxH/2,'text-anchor':'start','dominant-baseline':'middle','font-size':state.fontPx,fill:greenStroke}).textContent=textRight;
    }

    const bridgeRaw = Math.max(0, (xAxis - rHole) - (xKstart + notchLen));
    const bridgeVal = Number(bridgeRaw.toFixed(1));
    if ($('Mostik')) $('Mostik').value = bridgeVal.toFixed(1);

    if (showNotches){
      const x1n = xKstart;
      const x2n = xKstart + notchLen;
      create('line',{x1:x1n,y1:y1,x2:x2n,y2:y1,stroke:'#0f172a'});
      create('line',{x1:x1n,y1:y2,x2:x2n,y2:y2,stroke:'#0f172a'});
      const upY = y2 - Math.max(18, Math.round(state.fontPx*2.2));
      const downY = y2 + Math.max(18, Math.round(state.fontPx*2.2));
      hDim(x1n, upY, x2n, Math.round(notchLen), 10, '#dc2626');
      hDim(x2n, downY, xAxis - rHole, bridgeVal.toFixed(1), 10, '#dc2626');
    }

    const xBagDim = rightOuter + 40;
    const bagLabel = `sirka vrecka ${Math.round(bagWidth)}`;
    let yBagStart = yTop + (W - bagWidth)/2;
    let yBagEnd = yBagStart + bagWidth;
    vDim(xBagDim, yBagStart, yBagEnd, bagLabel, 10, '#0f172a');
    create('line',{x1:xBagDim,x2:rightOuter,y1:yBagStart,y2:yBagStart,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'4 3'});
    create('line',{x1:xBagDim,x2:rightOuter,y1:yBagEnd,y2:yBagEnd,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'4 3'});

    // vzduchove otvory: fixne 2 na kazdej strane
    let xFirstRight = rightOuter;
    if (airEnabled){
      const rawAirX = (airXInput?.value || '').trim();
      const hasAirX = !!airXInput?.dataset.userSet && rawAirX !== '' && Number.isFinite(airXAbsRaw);
      const autoX = G/2;
      const X = clamp(hasAirX ? Math.max(0,airXAbsRaw) : autoX, 0, G);
      if(!hasAirX && airXInput){ airXInput.value = fmtVal(X); }
      const cyTop = yTop + airEdge;
      const cyBot = yBottom - airEdge;
      const xRefLeftG = xLeftGStart + X;
      const xFirstLeft = xLeftGStart - X;
      const xRefRightG = xRightGEnd - X;
      xFirstRight = xRightGEnd + X;
      const airXs = airInGOnly ? [xRefLeftG, xRefRightG] : [xRefLeftG,xFirstLeft,xRefRightG,xFirstRight];
      airXs.forEach(x=>{
        if(x!=null) { cross(x, cyTop); cross(x, cyBot); }
      });

      const yAirTop = yTop - Math.max(22, Math.round(state.fontPx*1.8));
      vDim(xLeftGStart - 25, yTop, cyTop, Math.round(airEdge), 10, '#dc2626');
      hDim(xLeftGStart, yAirTop, xRefLeftG, Math.round(X), 10, '#dc2626');
      if(!airInGOnly){
        hDim(xFirstLeft, yAirTop, xLeftGStart, Math.round(X), 10, '#dc2626');
      }
    }

    let maxRight = Math.max(xStart + totalWidth + 40, xFirstRight + 40, xBagDim + 40);
    if(rightLegendW > 0){
      maxRight = Math.max(maxRight, rightLegendX + rightLegendW + 10);
    }
    if (perfEnabled && perfOffset > 0){
      const off = Math.min(perfOffset, G);
      if (perfSide === 'prava'){
        const xPerf = xRightGStart + off;
        create('line',{x1:xPerf,y1:yTop,x2:xPerf,y2:yBottom,stroke:'#dc2626','stroke-width':1,'stroke-dasharray':'6 4'});
        const yPerfDim = yBottom + Math.max(24, Math.round(state.fontPx*2.2));
        hDim(xRightGStart, yPerfDim, xPerf, Math.round(off), 10, '#dc2626');
        maxRight = Math.max(maxRight, xPerf + 40);
      } else {
        const xPerf = xRightGStart - off;
        create('line',{x1:xPerf,y1:yTop,x2:xPerf,y2:yBottom,stroke:'#dc2626','stroke-width':1,'stroke-dasharray':'6 4'});
        const yPerfDim = yBottom + Math.max(24, Math.round(state.fontPx*2.2));
        hDim(xPerf, yPerfDim, xRightGStart, Math.round(off), 10, '#dc2626');
      }
    }

    const segY = yBottom + Math.max(45, Math.round(state.fontPx*3.5));
    const totalY = segY + Math.max(22, Math.round(state.fontPx*2.0));
    let sx = xStart;
    widths.forEach(w=>{ hDim(sx, segY, sx+w, Math.round(w)); sx += w; });
    hDim(xStart, totalY, xStart + totalWidth, Math.round(totalWidth));

    hDim(xKstart, yDimAxis, xAxis, Math.round(axisVal), 10, '#dc2626');

    drawUserMeasures();
    drawMeasurePreview();

    const bottomPad = Math.max(40, Math.round(state.fontPx * 3.5));
    const svgW = Math.max(maxRight, xDimW + 80);
    const svgH = yDimAxis + bottomPad;
    state.bounds.width = svgW;
    state.bounds.height = svgH;
    svgRoot.setAttribute('width', svgW * state.zoom);
    svgRoot.setAttribute('height', svgH * state.zoom);
    const vw = svgW;
    const vh = svgH;
    svgRoot.setAttribute('viewBox', `${-state.pan.x} ${-state.pan.y} ${vw} ${vh}`);
    updateStamp();
  }

  inputs.forEach(el=>{
    const ev = el && el.type==='range'?'input':'change';
    el && el.addEventListener(ev, draw);
  });
  bgOpacityEl.addEventListener('input', ()=>{
    bgState.opacity = parseFloat(bgOpacityEl.value)||0;
    bgOpacityVal.textContent = `${Math.round(bgState.opacity*100)} %`;
    draw();
  });

  function rotateBg(delta){
    bgState.rotation = ((bgState.rotation || 0) + delta + 360) % 360;
    draw();
  }
  if(bgRotLeftBtn) bgRotLeftBtn.addEventListener('click', ()=> rotateBg(-90));
  if(bgRot180Btn) bgRot180Btn.addEventListener('click', ()=> rotateBg(180));
  if(bgFlipBtn) bgFlipBtn.addEventListener('click', ()=>{ bgState.flip = !bgState.flip; draw(); });

    $('btn-reset').addEventListener('click', ()=>{
    clearPrefilled();
    $('W').value=400; $('L').value=600; $('G').value=50; $('K').value=45;
    $('BagWidth').value=400;
    $('Cpitch').value=160; $('AxisInK').value='';
    if ($('AirEnabled')) $('AirEnabled').value='ano';
    $('NotchLen').value=7; $('toggle-notches').checked=false;
    $('AirEdge').value=30; $('AirXAbs').value=''; $('AirInGOnly').checked=false;
    if (airXInput) airXInput.dataset.userSet='';
    if ($('PerfEnabled')) $('PerfEnabled').value='ano';
    $('PerfOffset').value=7;
    $('PerfSide').value='prava';
    if(finalNavinNumber) finalNavinNumber.value='1';
    if(finalNavinLetter) finalNavinLetter.value='A';
    if(rezanieYes) rezanieYes.checked=false;
    if(rezanieNo) rezanieNo.checked=true;
    $('fontPx').value=14; $('toggle-grid').checked=false;
    bgFile.value=''; bgWidthEl.value=''; bgHeightEl.value=''; bgState.data=null; bgState.natural={w:0,h:0}; bgState.offset={x:0,y:0}; bgState.rotation=0; bgState.flip=false;
    updateNavinTlac();
    updateAirUiState();
    updatePerfUiState();
    draw();
    pushUndoSnapshot(true);
  });

  $('btn-export').addEventListener('click', ()=>{ try{ exportPDF1(); } catch(err){ console.error(err); alert('Export PDF zlyhal. Detaily v konzole.'); }});
  if(printBtn){
    printBtn.addEventListener('click', ()=>{
      try{ exportPNGTables(); }
      catch(err){ console.error(err); alert('Export PNG zlyhal. Detaily v konzole.'); }
    });
  }
  bottomImgInput.addEventListener('change',(e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file){
      bottomImgPreview.style.display='none';
      bottomImgPreview.src='';
      bottomImgPreview.style.transform='';
      return;
    }
    if(!file.type.startsWith('image/')){
      alert('Podporovane su iba obrazky.');
      bottomImgInput.value='';
      bottomImgPreview.style.display='none';
      bottomImgPreview.style.transform='';
      return;
    }
    const r=new FileReader();
    r.onload=(ev)=>{
      bottomImgPreview.src = ev.target.result;
      bottomImgPreview.style.display='block';
      bottomImgPreview.style.transform='rotate(90deg)';
    };
    r.readAsDataURL(file);
  });

  function collectStateForSave(){
    return {
      vz: 'vz22',
      inputs: {
        W:$('W').value, L:$('L').value, G:$('G').value, K:$('K').value,
        BagWidth:$('BagWidth').value,
        Cpitch:$('Cpitch').value, AxisInK:$('AxisInK').value,
        NotchLen:$('NotchLen').value, toggleNotches:$('toggle-notches').checked,
        AirEnabled:$('AirEnabled')?.value || 'ano',
        AirEdge:$('AirEdge').value, AirXAbs:$('AirXAbs').value, AirInGOnly:$('AirInGOnly').checked,
        PerfEnabled:$('PerfEnabled')?.value || 'ano',
        PerfOffset:$('PerfOffset').value,
        PerfSide:$('PerfSide').value,
        fontPx:$('fontPx').value, grid:$('toggle-grid').checked,
        printSide:printSide.value,
        porCislo:$('porCislo').value,
        otherNotes:$('otherNotes').value,
        bottomText1:bottomText1.value,
        bottomText2:bottomText2.value,
        measureMode:state.measureMode,
        finalNavinNumber:finalNavinNumber?.value || '',
        finalNavinLetter:finalNavinLetter?.value || '',
        rezanie:!!rezanieYes?.checked
      },
      measures: state.measures,
      bottomImage: (bottomImgPreview && bottomImgPreview.style.display!=='none') ? bottomImgPreview.src : null,
      bg: {
        data: bgState.data,
        width: bgWidthEl.value,
        height: bgHeightEl.value,
        opacity: bgOpacityEl.value,
        offset: bgState.offset,
        rotation: bgState.rotation,
        flip: bgState.flip
      }
    };
  }

  function applyLoadedState(data){
    if(data.inputs){
      const i=data.inputs;
      $('W').value=i.W||'';
      $('L').value=i.L||'';
      $('G').value=i.G||'';
      $('K').value=i.K||'';
      $('BagWidth').value=i.BagWidth||'';
      $('Cpitch').value=i.Cpitch||'';
      $('AxisInK').value=i.AxisInK||'';
      if ($('AirEnabled')) $('AirEnabled').value=i.AirEnabled||'ano';
      $('AirEdge').value=(i.AirEdge!==undefined && i.AirEdge!==null)?i.AirEdge:30;
      $('AirXAbs').value=(i.AirXAbs!==undefined && i.AirXAbs!==null)?i.AirXAbs:'';
      $('AirInGOnly').checked=!!i.AirInGOnly;
      if(airXInput) airXInput.dataset.userSet = (i.AirXAbs!==undefined && i.AirXAbs!=='') ? '1' : '';
      if ($('PerfEnabled')) $('PerfEnabled').value=i.PerfEnabled||'ano';
      $('NotchLen').value=i.NotchLen||'';
      $('toggle-notches').checked=!!i.toggleNotches;
      $('PerfOffset').value=i.PerfOffset||'';
      $('PerfSide').value=i.PerfSide||'prava';
      $('fontPx').value=i.fontPx||14;
      $('toggle-grid').checked=!!i.grid;
      printSide.value=i.printSide||'vrchna';
      if(finalNavinNumber) finalNavinNumber.value=i.finalNavinNumber||'1';
      if(finalNavinLetter) finalNavinLetter.value=i.finalNavinLetter||'A';
      if(rezanieYes) rezanieYes.checked = (i.rezanie===true || i.rezanie==='ano');
      if(rezanieNo) rezanieNo.checked = !rezanieYes?.checked;
      $('porCislo').value=i.porCislo||'';
      $('otherNotes').value=i.otherNotes||'';
      bottomText1.value=i.bottomText1||'';
      bottomText2.value=i.bottomText2||'';
      state.measureMode = i.measureMode || 'off';
      updateNavinTlac();
      updateAirUiState();
      updatePerfUiState();
    }
    state.measures = Array.isArray(data.measures)? data.measures : [];

        if(data.bottomImage){
      bottomImgPreview.src = data.bottomImage;
      bottomImgPreview.style.display='block';
      bottomImgPreview.style.transform='rotate(90deg)';
    } else {
      bottomImgPreview.src = '';
      bottomImgPreview.style.display='none';
      bottomImgPreview.style.transform='';
    }
    if(data.bg){
      bgState.data = data.bg.data || null;
      bgWidthEl.value = data.bg.width || '';
      bgHeightEl.value = data.bg.height || '';
      bgOpacityEl.value = data.bg.opacity || 0.6;
      bgOpacityVal.textContent = `${Math.round((parseFloat(bgOpacityEl.value)||0)*100)} %`;
      bgState.offset = data.bg.offset || {x:0,y:0};
      bgState.rotation = data.bg.rotation || 0;
      bgState.flip = !!data.bg.flip;
    }
    draw();
    pushUndoSnapshot(true);
  }

  saveBtn.addEventListener('click', ()=>{
    const payload = collectStateForSave();
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${buildRefSlug()}_state.json`;
    a.click();
    setTimeout(()=> URL.revokeObjectURL(a.href), 2000);
  });

  loadBtn.addEventListener('click', ()=> loadFile.click());
  loadFile.addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const r = new FileReader();
    r.onload = (ev)=>{
      try{
        const data = JSON.parse(ev.target.result);
        if (data.vz && data.vz !== 'vz22'){
          alert('Tento JSON je pre iny vzor: ' + data.vz);
          return;
        }
        applyLoadedState(data);
      }catch(err){
        alert('NeplatnĂ˝ JSON.');
      }
    };
    r.readAsText(file);
    loadFile.value='';
  });

  function exportPDF1(){
    const {svgText,w,h} = withNormalizedView(()=>{
      const serializer = new XMLSerializer();
      const txt = serializer.serializeToString(svgRoot);
      return {svgText:txt, w: state.bounds.width || 800, h: state.bounds.height || 800};
    });
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>VZ31 PDF</title>
  <style>
    @page { size: ${w}mm ${h}mm; margin: 0; }
    body { margin: 0; display:flex; justify-content:center; align-items:center; }
    svg { width:${w}mm; height:${h}mm; }
  </style>
</head>
<body>
${svgText}
<script>window.onload=()=>{ window.print(); setTimeout(()=>window.close(), 500); }<\/script>
</body>
</html>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if(!win){ alert('PovoÄľte vyskakovacie okno pre export.'); }
    setTimeout(()=> URL.revokeObjectURL(url), 5000);
  }

  async function exportPNGTables(){
    const {svgText, w:drawWmm, h:drawHmm} = withNormalizedView(()=>{
      const serializer = new XMLSerializer();
      const txt = serializer.serializeToString(svgRoot);
      return {svgText:txt, w: state.bounds.width || 800, h: state.bounds.height || 800};
    });
    const safeVal = (el, def)=> (el && el.value) ? el.value : def;
    const size = safeVal(exportSizeEl,'A3');
    const orient = safeVal(exportOrientEl,'landscape');
    const dpi = parseInt(safeVal(exportDPIEl,'150'),10)||150;
    const sizesMM = {A4:{w:210,h:297}, A3:{w:297,h:420}};
    let {w:pw,h:ph} = sizesMM[size] || sizesMM.A3;
    if(orient==='landscape'){ [pw,ph]=[ph,pw]; }
    const marginMM = 0.5;
    const pageW = mm2px(pw,dpi);
    const pageH = mm2px(ph,dpi);
    const margin = mm2px(marginMM,dpi);
    const gap = mm2px(1,dpi);
    const lineH = Math.round(pageW*0.02);
    const notesH = Math.max(lineH*3 + gap, mm2px(10,dpi));
    const bottomH = Math.max(lineH*3 + gap, mm2px(10,dpi));
    const drawingArea = {
      x:margin,
      y:margin+notesH+gap,
      w:pageW-2*margin,
      h:pageH-2*margin-notesH-bottomH-2*gap
    };

    const svgBlob = new Blob([svgText], {type:'image/svg+xml'});
    const svgUrl = URL.createObjectURL(svgBlob);

    function loadImage(src){
      return new Promise((resolve,reject)=>{
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload=()=>resolve(im);
        im.onerror=()=>reject(new Error('image load fail'));
        im.src=src;
      });
    }

    const bottomImgSrc = (bottomImgPreview && bottomImgPreview.src && bottomImgPreview.style.display!=='none') ? bottomImgPreview.src : null;
    let bottomImgData = bottomImgSrc;
    if(bottomImgSrc && !bottomImgSrc.startsWith('data:')){
      bottomImgData = await inlineAsset(bottomImgSrc);
    }

    try{
      const [svgImage, bottomImage] = await Promise.all([
        loadImage(svgUrl),
        bottomImgData ? loadImage(bottomImgData) : Promise.resolve(null)
      ]);
      const canvas = document.createElement('canvas');
      canvas.width = pageW; canvas.height = pageH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,pageW,pageH);

      // notes
      ctx.fillStyle = "#0f172a";
      const fontBase = Math.round(pageW*0.014);
      ctx.font = `600 ${fontBase}px Arial,Helvetica,sans-serif`;
      let y = margin + Math.round(lineH*0.8);
      const leftX = margin;
      const rightX = pageW/2 + margin/2;
      const refLabel = buildRefLabel();
      ctx.fillText(`Nazov suboru: ${refLabel}`, leftX, y);
      const {effectiveCode, effectiveVariant, finalCode, finalVariant} = getEffectiveNavin();
      const navText = `${effectiveCode}${effectiveVariant}`;
      const finalNavText = `${finalCode}${finalVariant}`;
      ctx.fillText(`Finalny navin: ${finalNavText||'-'}`, leftX, y+=lineH);
      ctx.fillText(`Rezanie: ${(rezanieYes?.checked ? 'ano' : 'nie')}`, leftX, y+=lineH);
      ctx.fillText(`Navin tlac: ${navText}`, leftX, y+=lineH);
      ctx.fillText(`Navin montaz: ${lblNavinTlac.textContent||"V1"}`, leftX, y+=lineH);
      ctx.fillStyle="#dc2626"; ctx.fillText("ZADNA STRANA", leftX, y+=lineH);

      ctx.fillStyle="#0f172a";
      y = margin + Math.round(lineH*0.8);
      ctx.fillText(`Casova peciatka: ${stampEl.textContent||"-"}`, rightX, y);
      ctx.fillText(`Vzor: ${vzCodeEl.textContent||"vz-22"}`, rightX, y+=lineH);
      ctx.fillText(`Por. cislo vyrobku: ${$("porCislo").value||"-"}`, rightX, y+=lineH);
      ctx.fillText(`Ostatne poznamky: ${$("otherNotes").value||"-"}`, rightX, y+=lineH);
      ctx.fillStyle="#dc2626"; ctx.fillText("PREDNA STRANA", rightX, y+=lineH);

      // drawing
      const drawWpx = mm2px(drawWmm,dpi);
      const drawHpx = mm2px(drawHmm,dpi);
      const scaleW = drawingArea.w / drawWpx;
      const scaleH = drawingArea.h / drawHpx;
      let scale = scaleW;
      if(drawHpx * scale > drawingArea.h){
        scale = scaleH;
      }
      const dw = drawWpx * scale;
      const dh = drawHpx * scale;
      const dx = drawingArea.x + (drawingArea.w - dw)/2;
      const dy = drawingArea.y + (drawingArea.h - dh)/2;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(svgImage, dx, dy, dw, dh);

      // bottom section
      const bottomY = drawingArea.y + drawingArea.h + gap;
      const bottomW = pageW - 2*margin;
      const colGap = gap;
      const colW = (bottomW - colGap*2)/3;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4,4]);

      function drawBox(x,y,w,h){
        ctx.strokeRect(x,y,w,h);
      }
      function wrapText(text, x, y, maxWidth, lineHeight){
        ctx.fillStyle='#0f172a';
        ctx.font = `${fontBase}px system-ui,-apple-system,Segoe UI,Roboto,Arial`;
        const words = text.split(/\s+/);
        let line='', yy=y+lineHeight;
        for(let n=0;n<words.length;n++){
          const test=line?line+' '+words[n]:words[n];
          const width=ctx.measureText(test).width;
          if(width>maxWidth && line){ ctx.fillText(line,x,yy); line=words[n]; yy+=lineHeight; }
          else { line=test; }
        }
        if(line) ctx.fillText(line,x,yy);
      }

      // box1 image
      const b1x = margin, b1y = bottomY, b1w = colW, b1h = bottomH;
      drawBox(b1x, b1y, b1w, b1h);
            if(bottomImage){
        const pad = Math.round(gap);
        const availW = b1w - 2*pad;
        const availH = b1h - 2*pad;
        const scaleImg = Math.min(availW / bottomImage.height, availH / bottomImage.width);
        const rw = bottomImage.height * scaleImg;
        const rh = bottomImage.width * scaleImg;
        const ix = b1x + (b1w - rw)/2;
        const iy = b1y + (b1h - rh)/2;
        ctx.save();
        ctx.translate(ix + rw/2, iy + rh/2);
        ctx.rotate(Math.PI/2);
        ctx.setLineDash([]);
        ctx.drawImage(bottomImage, -bottomImage.width*scaleImg/2, -bottomImage.height*scaleImg/2, bottomImage.width*scaleImg, bottomImage.height*scaleImg);
        ctx.setLineDash([4,4]);
        ctx.restore();
      }

      // box2 text1
      const b2x = b1x + colW + colGap, b2y = bottomY;
      drawBox(b2x, b2y, colW, bottomH);
      wrapText(bottomText1.value || '', b2x + gap, b2y + gap, colW - 2*gap, lineH);

      // box3 text2
      const b3x = b2x + colW + colGap, b3y = bottomY;
      drawBox(b3x, b3y, colW, bottomH);
      wrapText(bottomText2.value || '', b3x + gap, b3y + gap, colW - 2*gap, lineH);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${buildRefSlug()}_${size}_${orient}.png`;
      a.click();
    }catch(_){
      alert('Nepodarilo sa vygenerovat PNG.');
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  (function initMeta(){
    const path = window.location.pathname.split('/').filter(Boolean);
    const base = (path[path.length-1] || 'vz-22').replace(/\.[^.]+$/,'');
    if(refPartA) refPartA.value = base.slice(0,10);
    if(refPartB) refPartB.value = '';
    vzCodeEl.textContent = 'vz-22';
    updateNavinTlac();
    updateStamp();
    bgOpacityVal.textContent = `${Math.round(bgState.opacity*100)} %`;
  })();

  printSide.addEventListener('change', updateNavinTlac);

  bgFile.addEventListener('change',(e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file){ return; }
    if(file.type === 'application/pdf'){
      alert('Podporovane su iba obrazky.');
      bgFile.value='';
      return;
    }
    if(!file.type.startsWith('image/')){
      alert('Podporovane su PNG/JPG/WebP/GIF.');
      bgFile.value='';
      return;
    }
    const r = new FileReader();
    r.onload = (ev)=>{
      const imgEl = new Image();
      imgEl.onload = ()=>{
        bgState.data = ev.target.result;
        draw();
      };
      imgEl.src = ev.target.result;
    };
    r.readAsDataURL(file);
  });

  bgClearBtn.addEventListener('click', ()=>{
    bgState.data=null;
    bgFile.value='';
    bgState.offset={x:0,y:0};
    bgState.rotation=0; bgState.flip=false;
    bgState.calib={active:false,points:[]};
    bgCalibCancelBtn.style.display='none';
    bgCalibBtn.style.display='inline-block';
    draw();
  });

  function svgPoint(evt){
    const pt = svgRoot.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const ctm = svgRoot.getScreenCTM();
    if(!ctm) return {x:0,y:0};
    const inv = ctm.inverse();
    const sp = pt.matrixTransform(inv);
    return {x:sp.x, y:sp.y};
  }

  function pointToImagePx(p){
    return p;
  }

  function cancelCalib(){
    bgState.calib={active:false, points:[]};
    bgCalibCancelBtn.style.display='none';
    bgCalibBtn.style.display='inline-block';
    svgRoot.style.cursor='';
  }
  bgCalibBtn.addEventListener('click', ()=>{
    if(!bgState.data){
      alert('Najprv vloz podklad.');
      return;
    }
    bgState.calib={active:true, points:[]};
    bgCalibBtn.style.display='none';
    bgCalibCancelBtn.style.display='inline-block';
    svgRoot.style.cursor='crosshair';
  });
  bgCalibCancelBtn.addEventListener('click', cancelCalib);

  svgRoot.addEventListener('click', (e)=>{
    const p = svgPoint(e);
    if(bgState.calib.active){
      const imgP = pointToImagePx(p);
      bgState.calib.points.push(imgP);
      if(bgState.calib.points.length===2){
        const [p1,p2]=bgState.calib.points;
        const dist = Math.hypot(p2.x-p1.x, p2.y-p1.y);
        const mmStr = prompt('Zadaj skutocnu vzdialenost medzi bodmi (mm):','100');
        const mmVal = parseFloat(mmStr||'0');
        if(Number.isFinite(mmVal) && mmVal>0 && dist>0){
          const factor = mmVal / dist;
          const curW = num(bgWidthEl) || state.cachedDims.width;
          const curH = num(bgHeightEl) || state.cachedDims.height;
          bgWidthEl.value = (curW * factor).toFixed(2);
          bgHeightEl.value = (curH * factor).toFixed(2);
          draw();
        }
        cancelCalib();
      }
      return;
    }

    if(state.measureMode!=='off'){
      if(!state.measurePick){
        state.measurePick = p;
      } else {
        state.measures.push({type:state.measureMode,x1:state.measurePick.x,y1:state.measurePick.y,x2:p.x,y2:p.y});
        state.measurePick = null;
        state.measurePreview = null;
        draw();
      }
      return;
    }
  });

  // Drag background
  let draggingBg=false, lastPt=null;
  svgRoot.addEventListener('mousedown',(e)=>{
    if(bgState.calib.active) return;
    if(state.measureMode!=='off') return;
    draggingBg=true;
    lastPt={x:e.clientX,y:e.clientY};
  });
  window.addEventListener('mousemove',(e)=>{
    if(!draggingBg) return;
    const dx=e.clientX-(lastPt?.x||e.clientX);
    const dy=e.clientY-(lastPt?.y||e.clientY);
    lastPt={x:e.clientX,y:e.clientY};
    const ctm = svgRoot.getScreenCTM();
    const scaleX = ctm ? ctm.a : 1;
    const scaleY = ctm ? ctm.d : 1;
    bgState.offset.x += dx / scaleX;
    bgState.offset.y += dy / scaleY;
    draw();
  });
  window.addEventListener('mouseup',()=>{ draggingBg=false; });

  // Measurement preview
  svgRoot.addEventListener('mousemove',(e)=>{
    if(state.measureMode==='off') return;
    if(!state.measurePick) return;
    const p = svgPoint(e);
    state.measurePreview = {
      type: state.measureMode,
      x1: state.measurePick.x,
      y1: state.measurePick.y,
      x2: p.x,
      y2: p.y
    };
    draw();
  });
  svgRoot.addEventListener('mouseleave', ()=>{
    if(state.measureMode==='off') return;
    state.measurePreview = null;
    draw();
  });

  // Paste image from clipboard
  window.addEventListener('paste',(e)=>{
    const items = Array.from(e.clipboardData?.items||[]);
    const it = items.find(i=> i.type && i.type.startsWith('image/'));
    if(!it) return;
    const file = it.getAsFile();
    if(!file) return;
    const r=new FileReader();
    r.onload=(ev)=>{
      const imgEl=new Image();
      imgEl.onload=()=>{
        bgState.data=ev.target.result;
        bgState.offset={x:0,y:0};
        draw();
      };
      imgEl.src=ev.target.result;
    };
    r.readAsDataURL(file);
  });

  measureModeEl.addEventListener('change', ()=>{
    state.measureMode = measureModeEl.value;
    state.measurePick = null;
    state.measurePreview = null;
    draw();
  });
  measureCancelBtn.addEventListener('click', ()=>{
    state.measurePick = null;
    state.measurePreview = null;
    draw();
  });
  measureClearBtn.addEventListener('click', ()=>{
    state.measures = [];
    state.measurePick = null;
    state.measurePreview = null;
    draw();
  });

  // Zoom (wheel)
  svgHolder.addEventListener('wheel',(e)=>{
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    const newZoom = clamp(state.zoom * factor, 0.25, 6);
    state.zoom = newZoom;
    draw();
  }, {passive:false});

  function drawUserMeasures(){
    const color = '#16a34a';
    for(const m of state.measures){
      if(m.type==='h'){
        const x1=Math.min(m.x1,m.x2), x2=Math.max(m.x1,m.x2);
        const yTop = state.cachedDims?.yTop ?? 0;
        const yBottom = state.cachedDims?.yBottom ?? 0;
        if(yBottom > yTop){
          create('line',{x1,y1:yTop,x2:x1,y2:yBottom,stroke:color,'stroke-width':1,'stroke-dasharray':'4 3'});
          create('line',{x1:x2,y1:yTop,x2:x2,y2:yBottom,stroke:color,'stroke-width':1,'stroke-dasharray':'4 3'});
          create('rect',{x:x1,y:yTop,width:x2-x1,height:(yBottom-yTop),fill:'#86efac',opacity:'0.25'});
        }
        hDim(x1, m.y1, x2, `${Math.round(Math.abs(x2-x1))}`, 10, color);
      } else if(m.type==='v'){
        const y1=Math.min(m.y1,m.y2), y2=Math.max(m.y1,m.y2);
        vDim(m.x1, y1, y2, `${Math.round(Math.abs(y2-y1))}`, 10, color);
      }
    }
  }
  function drawMeasurePreview(){
    if(!state.measurePreview) return;
    const m = state.measurePreview;
    if(m.type==='h'){
      const x1=Math.min(m.x1,m.x2), x2=Math.max(m.x1,m.x2);
      hDim(x1, m.y1, x2, `${Math.round(Math.abs(x2-x1))}`, 10, '#16a34a');
    }else if(m.type==='v'){
      const y1=Math.min(m.y1,m.y2), y2=Math.max(m.y1,m.y2);
      vDim(m.x1, y1, y2, `${Math.round(Math.abs(y2-y1))}`, 10, '#16a34a');
    }
  }

  prefillFromFirm();
  updatePorCisloDisplay();
  updateAirUiState();
  updatePerfUiState();
  let epsSource = '';
  try { epsSource = localStorage.getItem('prefill_source') || ''; } catch (_) {}
  if (epsSource === 'eps' && window.applyEpsPayload) {
    const applied = window.applyEpsPayload('vz22');
    if (applied) {
      try {
        localStorage.removeItem('eps_payload');
        localStorage.removeItem('prefill_source');
      } catch (_) {}
    }
  }
  window.addEventListener('storage', (e) => {
    if (e.key !== 'selectedFirm' && e.key !== 'prefill_source') return;
    let source = '';
    try { source = localStorage.getItem('prefill_source') || ''; } catch (_) {}
    if (source !== 'firm') return;
    prefillFromFirm();
    draw();
    pushUndoSnapshot(true);
  });
  draw();
  pushUndoSnapshot(true);
})();


