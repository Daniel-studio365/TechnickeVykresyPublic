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
  const printOps = $('printOps');
  const navinTlacText = $('navinTlacText');
  const finalNavinText = $('finalNavinText');
  const btnOpenFirmManager = $('btnOpenFirmManager');

  function buildRefLabel(){
    const a = (refPartA && refPartA.value ? refPartA.value.trim() : '') || 'vz-31';
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
  function getBottomTextStyle(idx){
    const is1 = idx === 1;
    return {
      size: parseInt((is1 ? bottomText1Size : bottomText2Size)?.value || '14', 10) || 14,
      bold: !!((is1 ? bottomText1Bold : bottomText2Bold)?.checked),
      italic: !!((is1 ? bottomText1Italic : bottomText2Italic)?.checked),
      color: (is1 ? bottomText1Color : bottomText2Color)?.value || '#0f172a'
    };
  }
  function applyBottomTextStyle(idx){
    const ta = idx === 1 ? bottomText1 : bottomText2;
    if(!ta) return;
    const style = getBottomTextStyle(idx);
    ta.style.fontSize = `${style.size}px`;
    ta.style.fontWeight = style.bold ? '700' : '400';
    ta.style.fontStyle = style.italic ? 'italic' : 'normal';
    ta.style.color = style.color;
    ta.style.lineHeight = '1.2';
  }
  const stampEl = $('stamp');
  const printSide = $('printSide');
  const printSideText = $('printSideText');
  const printSideHint = $('printSideHint');
  const printSideHintTail = $('printSideHintTail');
  const printOpsText = $('printOpsText');
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
  const bottomText1Size = $('bottomText1Size');
  const bottomText1Bold = $('bottomText1Bold');
  const bottomText1Italic = $('bottomText1Italic');
  const bottomText1Color = $('bottomText1Color');
  const bottomText2Size = $('bottomText2Size');
  const bottomText2Bold = $('bottomText2Bold');
  const bottomText2Italic = $('bottomText2Italic');
  const bottomText2Color = $('bottomText2Color');
  const sideClipColor = $('sideClipColor');
  const bottomText1 = $('bottomText1');
  const bottomText2 = $('bottomText2');
  const saveBtn = $('btn-save');
  const loadBtn = $('btn-load');
  const undoBtn = $('btn-undo');
  const redoBtn = $('btn-redo');
  const loadFile = $('loadFile');
  const motivInput = $('motivInput');
  const motivText = $('motivText');

    const prefillableIds = [
      'W','L','G','K','Cpitch','AxisInK','NotchLen','toggle-notch-shift','NotchShift','AirEdge','AirXAbs','AirCount','AirType','AirPitch',
      'PerfShape','PerfSide','PerfOffset','PerfHalfLen','FingerHole','SideClipView','peFoilBand','sideClipColor','printSide',
    'finalNavinNumber','finalNavinLetter','printOps',
    'porCislo','motivInput','bottomText1','bottomText2','refPartA','refPartB',
    'bgWidth','bgHeight'
  ];
  const prefillableEls = prefillableIds.map(id=>$(id)).filter(Boolean);

  function normalizePerfShape(val){
    const v = (val || '').toString().toLowerCase().trim();
    if(v.startsWith('r')) return 'rovna';
    if(v.startsWith('v')) return 'vodorovna';
    if(v.startsWith('u')) return 'U';
    if(v.startsWith('z')) return 'zahnut';
    return 'none';
  }
  function normalizePerfSide(val){
    if(!val) return 'prava';
    const v = String(val).toLowerCase();
    if(v === 'l') return 'lava';
    if(v === 'p') return 'prava';
    return v;
  }

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
      'W','L','G','K','BagWidth','Cpitch','AxisInK','NotchLen','toggle-notch-shift','NotchShift','AirEdge','AirXAbs','AirCount','AirType','AirPitch',
      'PerfShape','PerfSide','PerfOffset','PerfHalfLen','FingerHole','SideClipView','peFoilBand','sideClipColor','PhotoMarkEnabled','fontPx','toggle-grid','toggle-notches',
    'bgWidth','bgHeight','finalNavinNumber','finalNavinLetter','printOps'
  ].map(id => $(id));

  function updateNotchShiftUiState(){
    const shiftEnabled = !!$('toggle-notch-shift')?.checked;
    const shiftInput = $('NotchShift');
    const mostikInput = $('Mostik');
    if (shiftInput) shiftInput.disabled = !shiftEnabled;
    if (mostikInput) {
      mostikInput.disabled = shiftEnabled;
      if (shiftEnabled) mostikInput.value = '';
    }
  }

  if (printSide) printSide.addEventListener('change', ()=>{ updateNavinTlac(); draw(); });
  if (finalNavinNumber) finalNavinNumber.addEventListener('change', updateNavinTlac);
  if (finalNavinLetter) finalNavinLetter.addEventListener('change', updateNavinTlac);
  if (printOps) printOps.addEventListener('change', updateNavinTlac);
  if (refPartA) refPartA.addEventListener('input', updateRefDisplay);
  if (refPartB) refPartB.addEventListener('input', updateRefDisplay);
  if (porCislo) porCislo.addEventListener('input', updatePorCisloDisplay);
  function updateMotivDisplay(){
    if (motivText) motivText.textContent = (motivInput?.value || '').trim() || '-';
  }
  if (motivInput) motivInput.addEventListener('input', updateMotivDisplay);
  [bottomText1Size,bottomText1Bold,bottomText1Italic,bottomText1Color].forEach(el=> el && el.addEventListener('change', ()=>{ applyBottomTextStyle(1); draw(); }));
    [bottomText2Size,bottomText2Bold,bottomText2Italic,bottomText2Color,sideClipColor].forEach(el=> el && el.addEventListener('change', ()=>{ applyBottomTextStyle(2); draw(); }));
  bottomText1?.addEventListener('input', ()=>{ applyBottomTextStyle(1); draw(); });
  bottomText2?.addEventListener('input', ()=>{ applyBottomTextStyle(2); draw(); });
  if (btnOpenFirmManager) {
    btnOpenFirmManager.addEventListener('click', () => {
      try { localStorage.setItem('index2_vz', 'vz31'); } catch (_) {}
      window.open('../../shared/entry/index2.html?vz=vz31', '_blank');
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

  // default zapnuté zárezy (ak už nie je nastavené inak)
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
    updateMotivDisplay();
    updateNotchShiftUiState();
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
    if((printOps?.value || '0') === '1'){
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
    const prefix = (printSide?.value === 'spodna') ? 'S' : 'V';
    if(navinTlacText) navinTlacText.textContent = `${effectiveCode}${effectiveVariant} / ${prefix}${effectiveCode}`;
    if(printSideHint){
      if (printSideHintTail) {
        printSideHintTail.textContent = (printSide?.value === 'spodna') ? '- POHLAD CEZ FOLIU (FARBU)' : '';
      }
    }
    if(finalNavinText) finalNavinText.textContent = `${finalCode}${finalVariant}`;
    if (printSideText) printSideText.textContent = printSide?.value || 'vrchna';
    if (printOpsText) {
      const ops = (printOps?.value || '0');
      printOpsText.textContent = ops === '1' ? '1 - rezanie' : (ops === '2' ? '2 - kasirka + rezanie' : '0 - vreckaren');
    }
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
    return src;
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
    if (!data || data.vz !== 'vz31') return;
    const dims = data.dimensions || {};
    const air = data.air || {};
    const perf = data.perforation || {};
    const clip = data.clip || {};
      const map = { W:'W', L:'L', G:'G', K:'K', bagWidth:'BagWidth', Cpitch:'Cpitch', AxisInK:'AxisInK', notchLen:'NotchLen', notchShiftEnabled:'toggle-notch-shift', notchShift:'NotchShift', AirEdge:'AirEdge', AirCount:'AirCount', AirType:'AirType', AirPitch:'AirPitch', PerfShape:'PerfShape', PerfSide:'PerfSide', PerfOffset:'PerfOffset', SideClipView:'SideClipView' };
    Object.values(map).forEach(id=>{
      const el=$(id);
      if (el) el.classList.remove('prefilled');
    });
    Object.entries(map).forEach(([key,id])=>{
      const el=$(id);
      let val=null;
      if (key === 'notchLen') val = dims.notchLen;
      else if (key === 'notchShiftEnabled') val = !!dims.notchShiftEnabled;
      else if (key === 'notchShift') val = dims.notchShift;
      else if (key === 'Cpitch') val = dims.Cpitch;
      else if (key === 'AxisInK') val = (dims.AxisInK != null) ? dims.AxisInK : (dims.K != null ? dims.K/2 : null);
      else if (key === 'PerfShape') {
        if (perf.shape) val = normalizePerfShape(perf.shape);
        else if ((perf.enabled || '').toLowerCase() === 'no') val = 'none';
        else if ((perf.enabled || '').toLowerCase() === 'yes') val = 'rovna';
      }
        else if (key === 'PerfSide') val = perf.side || dims.PerfSide;
        else if (key === 'PerfOffset') val = (perf.offset != null ? perf.offset : dims.PerfOffset);
        else if (key === 'SideClipView') val = ((clip.clipImages && clip.clipImages[0]) || '').toLowerCase();
        else if (key === 'AirEdge') val = air.offsetFromEdge;
      else if (key === 'AirCount') {
        const hasAir = air.count !== null && air.count !== undefined;
        const half = hasAir ? Math.max(1, Math.min(4, Math.round(air.count / 2))) : null;
        val = half ? Math.min(8, Math.max(2, half * 2)) : null; // dropdown zobrazuje celkovy pocet (2,4,6,8)
      }
      else if (key === 'AirType') val = air.diameter;
      else if (key === 'AirPitch') val = air.pitch;
      else if (key === 'bagWidth') val = (dims.W != null ? dims.W : null);
      else val = dims[key];
      if (el && val != null && val !== '') {
        if (el.type === 'checkbox') el.checked = !!val;
        else el.value = (el.tagName === 'SELECT') ? String(val) : val;
        el.classList.add('prefilled');
      }
    });
    updateNotchShiftUiState();

    const lines = [];
    if (clip.count) {
      const typTxt = clip.type ? ` (TYP: ${clip.type})` : '';
      lines.push(`POCET SPON V BALENI ${clip.count}${typTxt}`);
    }
    if (air.diameter) lines.push(`TYP VZDUCHOVYCH OTVOROV: ${air.diameter}`);
    const noteLine = Array.isArray(data.notes) ? data.notes.filter(Boolean).join('; ').trim() : '';
      if (noteLine) lines.push(noteLine);
      if ($('SideClipView')) $('SideClipView').value = ((clip.clipImages && clip.clipImages[0]) || $('SideClipView').value || 'zhora').toLowerCase();
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
    const {color='#0f172a', anchor='middle', baseline='middle', bg=true, pad=3} = opts;
    const g = create('g');
    const t = create('text',{x,y,'text-anchor':anchor,'dominant-baseline':baseline,fill:color,'font-size':state.fontPx},g);
    t.textContent = txt;
    svgRoot.appendChild(g);
    if (bg) {
      const bb = t.getBBox();
      const r = create('rect',{
        x: bb.x - pad, y: bb.y - pad, width: bb.width + 2*pad, height: bb.height + 2*pad,
        fill: 'white', stroke: 'none', opacity:'0.9'
      });
      g.insertBefore(r, t);
    }
    return g;
  }

  function arrowLeft(x,y,color){ create('path',{d:`M ${x} ${y} l 6 -4 v 8 z`,fill:color}); }
  function arrowRight(x,y,color){ create('path',{d:`M ${x} ${y} l -6 -4 v 8 z`,fill:color}); }
  function arrowUp(x,y,color){ create('path',{d:`M ${x} ${y} l -4 6 h 8 z`,fill:color}); }
  function arrowDown(x,y,color){ create('path',{d:`M ${x} ${y} l -4 -6 h 8 z`,fill:color}); }

  function hDim(x1,y,x2,label,ext=10,color='#0f172a',opts={}){
    if(x2<x1){ const t=x1; x1=x2; x2=t; }
    create('line',{x1,y1:y,x2,y2:y,stroke:color,'stroke-width':1});
    create('line',{x1,y1:y-ext,x2:x1,y2:y+ext,stroke:color,'stroke-width':1});
    create('line',{x1:x2,y1:y-ext,x2:x2,y2:y+ext,stroke:color,'stroke-width':1});
    arrowLeft(x1,y,color); arrowRight(x2,y,color);
    const lbl = pickLabel(label, Math.abs(x2 - x1));
    textWithBg(lbl,(x1+x2)/2,y + (opts.labelDy ?? -6),{color,bg:opts.bg !== false});
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
    function drawAirMark(cx,cy,type='1',size=6){
      const t = String(type || '1');
      if(t === '1'){
        create('line',{x1:cx-size,x2:cx+size,y1:cy-size,y2:cy+size,stroke:'#0f172a','stroke-width':1});
        create('line',{x1:cx-size,x2:cx+size,y1:cy+size,y2:cy-size,stroke:'#0f172a','stroke-width':1});
      return;
    }
    if(t === '2'){
      create('circle',{cx,cy,r:size*0.95,fill:'none',stroke:'#0f172a','stroke-width':1});
      create('line',{x1:cx-size,y1:cy-size,x2:cx,y2:cy,stroke:'#0f172a','stroke-width':1});
      create('line',{x1:cx-size,y1:cy+size,x2:cx,y2:cy,stroke:'#0f172a','stroke-width':1});
      create('line',{x1:cx,y1:cy,x2:cx+size,y2:cy,stroke:'#0f172a','stroke-width':1});
      return;
    }
    if(t === '3'){
      create('line',{x1:cx,x2:cx,y1:cy-size,y2:cy+size,stroke:'#0f172a','stroke-width':1});
      return;
    }
      create('line',{x1:cx-size,x2:cx+size,y1:cy,y2:cy,stroke:'#0f172a','stroke-width':1});
      create('line',{x1:cx,y1:cy-size,x2:cx,y2:cy+size,stroke:'#0f172a','stroke-width':1});
    }

    function drawSideClipSymbol(centerX, centerY, variant='zhora', fillMode='gray'){
      const viewW = 121.9;
      const viewH = 57.9;
      const targetH = 20;
      const scale = targetH / viewH;
      const drawW = viewW * scale;
      const drawH = viewH * scale;
      const left = centerX - drawW / 2;
      const top = centerY - drawH / 2;
      const rects = [
        {x:4.3,y:4.8,w:5.7,h:45.4},
        {x:101.8,y:4.8,w:5.7,h:45.4},
        {x:10,y:14,w:56.7,h:26.9},
        {x:73.4,y:14,w:28.3,h:26.9},
        {x:10,y:11.2,w:56.7,h:32.6}
      ];
      const mode = String(fillMode || 'gray').toLowerCase();
      const attrs = {stroke:'#0f172a','stroke-width':0.5};
      if (mode === 'none') {
        attrs.fill = 'none';
      } else if (mode === 'red') {
        attrs.fill = '#ff073a';
        attrs['fill-opacity'] = 0.28;
      } else {
        attrs.fill = '#000000';
        attrs['fill-opacity'] = 0.15;
      }
      const group = create('g', variant === 'zhora' ? {transform: `rotate(180 ${centerX} ${centerY})`} : {});
      rects.forEach(r=>{
        create('rect',{
          x:left + r.x * scale,
          y:top + r.y * scale,
          width:r.w * scale,
          height:r.h * scale,
          ...attrs
        }, group);
      });
      return {
        left,
        top,
        right:left + drawW,
        bottom:top + drawH
      };
    }

    function drawPeFoilBand(mode, bounds, handleHeight=50){
      const bandMode = String(mode || 'B').toUpperCase();
      if (bandMode === 'B') return null;
      const inset = 3;
      const endGap = 5;
      const inside = bandMode === 'D';
      const left = inside ? bounds.left + inset : bounds.left - inset;
      const right = inside ? bounds.right - inset : bounds.right + inset;
      const topY = bounds.bottom - handleHeight - endGap;
      const bottom = bounds.bottom + (inside ? -inset : inset);
      const color = inside ? '#2563eb' : '#16a34a';
      create('path',{
        d:`M ${left} ${topY} L ${left} ${bottom} L ${right} ${bottom} L ${right} ${topY}`,
        fill:'none',
        stroke:color,
        'stroke-width':1.4
      });
      return {left, right, top: topY, bottom, color};
    }

    function draw(){
    const W = num($('W'),400);
    const L = num($('L'),600);
    const G = num($('G'),50);
    const K = num($('K'),45);
    const bagWidthInput = $('BagWidth');
    const bagWidthRaw = num(bagWidthInput, NaN);
    const bagWidth = Number.isFinite(bagWidthRaw) && bagWidthRaw > 0 ? bagWidthRaw : W;
    if(bagWidthInput && (bagWidthInput.value==='' || !Number.isFinite(bagWidthRaw))){ bagWidthInput.value = fmtVal(bagWidth); }
    const C = Math.max(0,num($('Cpitch'),160));
    const axisInK = $('AxisInK').value==='' ? null : num($('AxisInK'), K/2);
    const showNotches = $('toggle-notches').checked;
    const notchLen = Math.max(1,num($('NotchLen'),7));
    const notchShiftEnabled = !!$('toggle-notch-shift')?.checked;
    const notchShiftRaw = num($('NotchShift'), 0);
    const airEdge = Math.max(0,num($('AirEdge'),30));
    const airXAbs = Math.max(0,num($('AirXAbs'),25));
    const displayCount = parseInt($('AirCount').value,10)||2;
    const airCount = clamp(Math.round(displayCount/2)||1,1,4);
    const airType = $('AirType')?.value || '1';
    const airPitch = Math.max(0,num($('AirPitch'),40));
    const perfShape = normalizePerfShape($('PerfShape').value);
    const perfSide = normalizePerfSide($('PerfSide').value);
    const techPerfSide = (printSide?.value === 'vrchna')
      ? (perfSide === 'prava' ? 'lava' : 'prava')
      : perfSide;
    const perfOffset = Math.max(0,num($('PerfOffset'),70));
    const perfHalfLen = Math.max(0,num($('PerfHalfLen'),250));
    const fingerHole = $('FingerHole').value;
    const sideClipView = $('SideClipView')?.value || 'zhora';
    const peFoilBand = $('peFoilBand')?.value || 'B';
    const sideClipFill = $('sideClipColor')?.value || 'gray';
    state.fontPx = parseInt($('fontPx').value,10)||14;
    $('fontPxVal').textContent = state.fontPx + ' px';

    const widths = [L,G,G,L,K];
    const totalWidth = widths.reduce((a,b)=>a+b,0);
    const offsetX = 50;
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
      if(bgState.flip){ transforms.push(`translate(0 ${2*cy}) scale(1 -1)`); }
      if(transforms.length){ img.setAttribute('transform', transforms.join(' ')); }
    }

    if ($('toggle-grid').checked){
      const defs = create('defs');
      const pattern = create('pattern',{id:'grid',width:50,height:50,patternUnits:'userSpaceOnUse'},defs);
      create('path',{d:'M 50 0 L 0 0 0 50',fill:'none',stroke:'#e2e8f0','stroke-width':1},pattern);
      create('rect',{x:0,y:0,width:2000,height:2000,fill:'url(#grid)'});
    }

    const xStart = offsetX + state.pan.x;
    const xLeftGStart = xStart + widths[0];
    const xRightGStart = xLeftGStart + widths[1];
    const xRightGEnd = xRightGStart + widths[2];
    const xKstart = xStart + widths[0]+widths[1]+widths[2]+widths[3];
    const xKend = xKstart + widths[4];
    const leftOuter = xStart;
    const rightOuter = xStart + totalWidth;

    const yMid = yTop + W/2;
    const y1 = yMid - C/2;
    const y2 = yMid + C/2;

    const topLimit = yTop + 7;
    const botLimit = yBottom - 7;
    $('warnC').style.display = (y1<topLimit || y2>botLimit) ? 'block' : 'none';

    const axisVal = (axisInK===null || Number.isNaN(axisInK)) ? K/2 : axisInK;
    $('warnAxis').style.display = (axisVal<0 || axisVal>K) ? 'block' : 'none';
    const xAxis = xKstart + axisVal;

    let ox = xStart;
    widths.forEach(w=>{
      create('rect',{x:ox,y:yTop,width:w,height:W,fill:'none',stroke:'#0f172a','stroke-width':1});
      ox += w;
    });

    const rHole = 7;
    create('circle',{cx:xAxis, cy:y1, r:rHole, fill:'none', stroke:'#0f172a','stroke-width':1});
    create('circle',{cx:xAxis, cy:y2, r:rHole, fill:'none', stroke:'#0f172a','stroke-width':1});
    textWithBg('⌀14', xAxis - rHole - 10, y1, {anchor:'end', baseline:'middle'});

    const yDimAxis = yBottom + 120;
    create('line',{x1:xAxis,x2:xAxis,y1:yDimAxis,y2:y2,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'4 4'});

    const xDim = xKend + 25;
    const xDimW = xDim + 30;
    const maxNotchShift = Math.max(0, (W - C) / 2);
    const minNotchShift = -Math.max(0, C / 2);
    const notchShift = notchShiftEnabled ? clamp(notchShiftRaw, minNotchShift, maxNotchShift) : 0;
    if (notchShiftEnabled && $('NotchShift') && $('NotchShift').value !== fmtVal(notchShift)) $('NotchShift').value = fmtVal(notchShift);
    const yNotchTop = y1 - notchShift;
    const yNotchBottom = y2 + notchShift;
    if (notchShiftEnabled && notchShift < 0){
      const xDimShift = xDimW + 30;
      vDim(xDim, yTop, y1, Math.round(W/2 - C/2));
      vDim(xDim, y1, y2, fmtVal(C), 10, '#dc2626');
      vDim(xDim, yBottom, y2, Math.round(W/2 - C/2));
      vDim(xDimShift, yNotchTop, y1, fmtVal(y1 - yNotchTop), 10, '#dc2626');
      vDim(xDimShift, y2, yNotchBottom, fmtVal(yNotchBottom - y2), 10, '#dc2626');
    } else if (notchShiftEnabled){
      vDim(xDim, yTop, yNotchTop, fmtVal(yNotchTop - yTop));
      vDim(xDim, yNotchTop, y1, fmtVal(y1 - yNotchTop), 10, '#dc2626');
      vDim(xDim, y1, y2, fmtVal(C), 10, '#dc2626');
      vDim(xDim, y2, yNotchBottom, fmtVal(yNotchBottom - y2), 10, '#dc2626');
      vDim(xDim, yNotchBottom, yBottom, fmtVal(yBottom - yNotchBottom));
    } else {
      vDim(xDim, yTop, y1, Math.round(W/2 - C/2));
      vDim(xDim, y1, y2, Math.round(C), 10, '#dc2626');
      vDim(xDim, yBottom, y2, Math.round(W/2 - C/2));
    }
    vDim(xDimW, yTop, yBottom, Math.round(W));

    const x1n = xKend - notchLen;
    const mostikRaw = Math.max(0, x1n - (xAxis + rHole));
    const mostikVal = Number(mostikRaw.toFixed(1));
    if ($('Mostik') && !notchShiftEnabled) $('Mostik').value = mostikVal.toFixed(1);

    if (showNotches){
      const x2n = xKend;
      create('line',{x1:x1n,y1:yNotchTop,x2:x2n,y2:yNotchTop,stroke:'#0f172a'});
      create('line',{x1:x1n,y1:yNotchBottom,x2:x2n,y2:yNotchBottom,stroke:'#0f172a'});
      const upY = y2 - Math.max(18, Math.round(state.fontPx*2.2));
      const downY = y2 + Math.max(18, Math.round(state.fontPx*2.2));
      hDim(x1n, upY, x2n, Math.round(notchLen), 10, '#dc2626');
      if (!notchShiftEnabled){
        hDim(xAxis + rHole, downY, x1n, mostikVal.toFixed(1), 10, '#dc2626');
      }
    }

    const slotW = 20, slotH = 90, slotR = 10;
    const cySlot = yMid;
    const cxLeftSlot = xLeftGStart + widths[1]/2;
    const cxRightSlot = xRightGStart + widths[2]/2;
    roundedRect(cxLeftSlot - slotW/2, cySlot - slotH/2, slotW, slotH, slotR);
    roundedRect(cxRightSlot - slotW/2, cySlot - slotH/2, slotW, slotH, slotR);
    hDim(cxRightSlot - slotW/2, cySlot - slotH/2 - 10, cxRightSlot + slotW/2, '20');
    vDim(cxRightSlot + slotW/2 + 16, cySlot - slotH/2, cySlot + slotH/2, '90');

    if (fingerHole === 'ano'){
      const rFinger = 10;
      const yFinger = (techPerfSide === 'prava') ? (yBottom - 30) : (yTop + 30);
      create('circle',{cx:cxLeftSlot, cy:yFinger, r:rFinger, fill:'#f5c2dd', 'fill-opacity':0.55, stroke:'#d0007a','stroke-width':1});
      create('circle',{cx:cxRightSlot, cy:yFinger, r:rFinger, fill:'#f5c2dd', 'fill-opacity':0.55, stroke:'#d0007a','stroke-width':1});
    }

    const X = clamp(airXAbs, 0, L);
    const cyTop = yTop + airEdge;
    const cyBot = yBottom - airEdge;
    const xFirstLeftL = xLeftGStart - X;
    const xFirstRightL = xRightGEnd + X;
    const leftL = Array.from({length:airCount},(_,i)=> xFirstLeftL - i*airPitch);
    const rightL = Array.from({length:airCount},(_,i)=> xFirstRightL + i*airPitch);
    leftL.forEach(x=>{ drawAirMark(x,cyTop,airType); drawAirMark(x,cyBot,airType); });
    rightL.forEach(x=>{ drawAirMark(x,cyTop,airType); drawAirMark(x,cyBot,airType); });

    if(!state.lineOnly){
      const magenta = '#d0007a';
      const greenStroke = '#166534';
      const greenFill = '#86efac';
      const topBandH = 5;
      const bottomBandH = 5;
      create('rect',{x:leftOuter,y:offsetY,width:totalWidth,height:topBandH,fill:magenta,'fill-opacity':0.25,stroke:'none'});
      create('rect',{x:leftOuter,y:offsetY + W - bottomBandH,width:totalWidth,height:bottomBandH,fill:magenta,'fill-opacity':0.25,stroke:'none'});
      const leftBandWidth = 5 + 8;
      const rightBandWidth = 5 + 8;
      create('rect',{x:xLeftGStart - 5, y:offsetY, width:leftBandWidth, height:W, fill:magenta,'fill-opacity':0.25,stroke:'none'});
      create('rect',{x:xRightGEnd - 8, y:offsetY, width:rightBandWidth, height:W, fill:magenta,'fill-opacity':0.25,stroke:'none'});

      const boxH = Math.max(16, Math.round(state.fontPx * 1.2));
      const padX = 6;
      const legendY = Math.round(offsetY - 26);

      const textLeft = 'ZONA BEZ TLACE';
      const textLeftW = Math.round(state.fontPx * 0.6 * textLeft.length);
      const boxLeftW = textLeftW + padX * 2;
      const legendX = leftOuter;
      create('rect',{x:legendX,y:legendY,width:boxLeftW,height:boxH,fill:magenta,'fill-opacity':0.25,stroke:magenta,'stroke-width':1});
      create('text',{x:legendX+padX,y:legendY+boxH/2,'text-anchor':'start','dominant-baseline':'middle','font-size':state.fontPx,fill:magenta}).textContent=textLeft;

      if (fingerHole === 'ano'){
        const fy = legendY + boxH/2;
        const fr = Math.max(4, Math.round(state.fontPx * 0.35));
        const fx = legendX + boxLeftW + 14;
        create('circle',{cx:fx + fr, cy:fy, r:fr, fill:'#f5c2dd', 'fill-opacity':0.55, stroke:magenta, 'stroke-width':1});
        create('text',{x:fx + fr*2 + 6, y:fy,'text-anchor':'start','dominant-baseline':'middle','font-size':state.fontPx,fill:magenta}).textContent='OTVOR NA PRST BEZ FARBY';
      }

      const textRight = 'BEZ KORONOVEJ UPRAVY';
      const textRightW = Math.round(state.fontPx * 0.6 * textRight.length);
      const boxRightW = textRightW + padX * 2;
      const rightLegendX = rightOuter - boxRightW;
      create('rect',{x:rightLegendX,y:legendY,width:boxRightW,height:boxH,fill:greenFill,'fill-opacity':0.25,stroke:greenStroke,'stroke-width':1});
      create('text',{x:rightLegendX+padX,y:legendY+boxH/2,'text-anchor':'start','dominant-baseline':'middle','font-size':state.fontPx,fill:greenStroke}).textContent=textRight;
    }

    const yAirBase = cyBot + Math.max(36, Math.round(state.fontPx*3.0));
    vDim(xLeftGStart - 25, yTop, cyTop, Math.round(airEdge), 10, '#dc2626');
    for(let i=0;i<leftL.length-1;i++){ hDim(leftL[i+1], yAirBase, leftL[i], Math.round(Math.abs(leftL[i]-leftL[i+1])),10,'#dc2626'); }
    for(let i=0;i<rightL.length-1;i++){ hDim(rightL[i], yAirBase, rightL[i+1], Math.round(Math.abs(rightL[i+1]-rightL[i])),10,'#dc2626'); }
    hDim(xFirstLeftL, yAirBase, xLeftGStart, Math.round(X),10,'#dc2626');
    hDim(xRightGEnd, yAirBase, xFirstRightL, Math.round(X),10,'#dc2626');

    const xBagDim = xStart - 25;
    const bagLabel = `sirka vrecka ${fmtVal(bagWidth)}`;
    let yBagStart = yTop + (W - bagWidth)/2;
    let yBagEnd = yBagStart + bagWidth;
    vDim(xBagDim, yBagStart, yBagEnd, bagLabel, 10, '#0f172a');
    create('line',{x1:xBagDim,x2:xStart,y1:yBagStart,y2:yBagStart,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'4 3'});
    create('line',{x1:xBagDim,x2:xStart,y1:yBagEnd,y2:yBagEnd,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'4 3'});
    if ($('PhotoMarkEnabled')?.checked){
      const photoW = 20;
      const photoH = 5;
      const photoOffsetX = 10;
      const photoOffsetBottom = 5;
      const photoX = leftOuter + photoOffsetX;
      const photoY = yBottom - photoOffsetBottom - photoH;
      const photoColor = '#0f172a';
      const photoDimY = yBottom + Math.max(36, Math.round(state.fontPx*3.0));
      create('rect',{x:photoX,y:photoY,width:photoW,height:photoH,fill:photoColor,stroke:photoColor,'stroke-width':1});
      hDim(leftOuter, photoDimY, photoX, photoOffsetX, 10, photoColor);
      vDim(leftOuter - 42, photoY + photoH, yBottom, photoOffsetBottom, 10, photoColor);
      textWithBg('20x5', photoX + photoW/2, photoY - 18, {anchor:'middle', baseline:'middle', color:photoColor});
    }
    const leftPad = 60;

    let maxRight = xStart + totalWidth + 40;
    const easyFoldPrims = [];
    if (perfShape === 'rovna' && perfOffset > 0){
      const off = perfOffset;
      const xPerfLeft = xLeftGStart - off;
      const xPerfRight = xRightGEnd + off;
      create('line',{x1:xPerfLeft,y1:yTop,x2:xPerfLeft,y2:yBottom,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4'});
      create('line',{x1:xPerfRight,y1:yTop,x2:xPerfRight,y2:yBottom,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4'});
      easyFoldPrims.push({kind:'line', x1:xPerfLeft, y1:yTop, x2:xPerfLeft, y2:yBottom});
      easyFoldPrims.push({kind:'line', x1:xPerfRight, y1:yTop, x2:xPerfRight, y2:yBottom});
      const yPerfDim = yBottom + Math.max(24, Math.round(state.fontPx*2.2));
      hDim(xPerfLeft, yPerfDim, xLeftGStart, Math.round(off), 10, '#dc2626');
      hDim(xRightGEnd, yPerfDim, xPerfRight, Math.round(off), 10, '#dc2626');
      maxRight = Math.max(maxRight, xPerfRight + 40);
    } else if (perfShape === 'vodorovna' && perfOffset > 0){
      const xMid = (xLeftGStart + xRightGEnd)/2;
      let yPerf = (techPerfSide === 'prava') ? (yBottom - perfOffset) : (yTop + perfOffset);
      const foldYPerf = (perfSide === 'prava') ? (yBottom - perfOffset) : (yTop + perfOffset);
      yPerf = clamp(yPerf, yTop, yBottom);
      const leftLimit = offsetX;
      const rightLimit = offsetX + totalWidth;
      const maxHalfGeom = Math.min(xMid - leftLimit, rightLimit - xMid);
      const halfSpan = Math.min(perfHalfLen, Math.max(0, maxHalfGeom));
      if (halfSpan > 0){
        const xLeftEnd = xMid - halfSpan;
        const xRightEnd = xMid + halfSpan;
        create('path',{d:`M ${xLeftEnd} ${yPerf} L ${xRightEnd} ${yPerf}`,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4',fill:'none'});
        easyFoldPrims.push({kind:'line', x1:xLeftEnd, y1:foldYPerf, x2:xRightEnd, y2:foldYPerf});
        const xDimPerf = xRightGEnd + 60;
        if (techPerfSide === 'prava'){ vDim(xDimPerf, yPerf, yBottom, Math.round(perfOffset), 10, '#dc2626'); }
        else { vDim(xDimPerf, yTop, yPerf, Math.round(perfOffset), 10, '#dc2626'); }
        const lenDimY = yPerf + (techPerfSide==='prava' ? Math.max(24, Math.round(state.fontPx*2.0)) : -Math.max(24, Math.round(state.fontPx*2.0)));
        hDim(xMid, lenDimY, xRightEnd, Math.round(halfSpan), 10, '#dc2626');
        maxRight = Math.max(maxRight, xRightEnd + 40);
      }
    } else if (perfShape === 'U' && perfOffset > 0){
      const xMid = (xLeftGStart + xRightGEnd)/2;
      let yPerf = (techPerfSide === 'prava') ? (yBottom - perfOffset) : (yTop + perfOffset);
      const foldYPerf = (perfSide === 'prava') ? (yBottom - perfOffset) : (yTop + perfOffset);
      yPerf = clamp(yPerf, yTop, yBottom);
      const leftLimit = offsetX;
      const rightLimit = offsetX + totalWidth;
      const maxHalfGeom = Math.min(xMid - leftLimit, rightLimit - xMid);
      const halfSpan = Math.min(perfHalfLen, Math.max(0, maxHalfGeom));
      if (halfSpan > 0){
        const bendHoriz = Math.min(30, halfSpan);
        const xLeftEnd = xMid - halfSpan;
        const xRightEnd = xMid + halfSpan;
        const xLeftJoint = xLeftEnd + bendHoriz;
        const xRightJoint = xRightEnd - bendHoriz;
        const dir = (techPerfSide === 'prava') ? 1 : -1;
        const foldDir = (perfSide === 'prava') ? 1 : -1;
        const arcR = 50;

        ['M '+xLeftJoint+' '+yPerf+' L '+xRightJoint+' '+yPerf,
         'M '+xLeftJoint+' '+yPerf+' Q '+xLeftEnd+' '+yPerf+' '+xLeftEnd+' '+(yPerf + dir*arcR),
         'M '+xRightJoint+' '+yPerf+' Q '+xRightEnd+' '+yPerf+' '+xRightEnd+' '+(yPerf + dir*arcR)
        ].forEach(d=> create('path',{d,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4',fill:'none'}));
        easyFoldPrims.push({kind:'line', x1:xLeftJoint, y1:foldYPerf, x2:xRightJoint, y2:foldYPerf});
        easyFoldPrims.push({kind:'quad', x1:xLeftJoint, y1:foldYPerf, cx:xLeftEnd, cy:foldYPerf, x2:xLeftEnd, y2:(foldYPerf + foldDir*arcR)});
        easyFoldPrims.push({kind:'quad', x1:xRightJoint, y1:foldYPerf, cx:xRightEnd, cy:foldYPerf, x2:xRightEnd, y2:(foldYPerf + foldDir*arcR)});

        const xDimPerf = xRightGEnd + 60;
        if (techPerfSide === 'prava'){ vDim(xDimPerf, yPerf, yBottom, Math.round(perfOffset), 10, '#dc2626'); }
        else { vDim(xDimPerf, yTop, yPerf, Math.round(perfOffset), 10, '#dc2626'); }
        const lenDimY = yPerf + (techPerfSide==='prava' ? Math.max(24, Math.round(state.fontPx*2.0)) : -Math.max(24, Math.round(state.fontPx*2.0)));
        hDim(xMid, lenDimY, xRightEnd, Math.round(halfSpan), 10, '#dc2626');
        maxRight = Math.max(maxRight, xRightEnd + 40);
      }
    } else if (perfShape === 'zahnut' && perfOffset > 0){
      const xMid = (xLeftGStart + xRightGEnd)/2;
      let yPerf = (techPerfSide === 'prava') ? (yBottom - perfOffset) : (yTop + perfOffset);
      const foldYPerf = (perfSide === 'prava') ? (yBottom - perfOffset) : (yTop + perfOffset);
      yPerf = clamp(yPerf, yTop, yBottom);
      const leftLimit = offsetX;
      const rightLimit = offsetX + totalWidth;
      const maxHalfGeom = Math.min(xMid - leftLimit, rightLimit - xMid);
      const halfSpan = Math.min(perfHalfLen, Math.max(0, maxHalfGeom));
      if (halfSpan > 0){
        const bendHoriz = Math.min(30, halfSpan);
        const xLeftEnd = xMid - halfSpan;
        const xRightEnd = xMid + halfSpan;
        const xLeftJoint = xLeftEnd + bendHoriz;
        const xRightJoint = xRightEnd - bendHoriz;
        const dir = (techPerfSide === 'prava') ? 1 : -1;
        const foldDir = (perfSide === 'prava') ? 1 : -1;
        const dy = bendHoriz * Math.tan(Math.PI/3);
        ['M '+xLeftJoint+' '+yPerf+' L '+xRightJoint+' '+yPerf,
         'M '+xLeftJoint+' '+yPerf+' L '+xLeftEnd+' '+(yPerf + dir*dy),
         'M '+xRightJoint+' '+yPerf+' L '+xRightEnd+' '+(yPerf + dir*dy)
        ].forEach(d=> create('path',{d,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4',fill:'none'}));
        easyFoldPrims.push({kind:'line', x1:xLeftJoint, y1:foldYPerf, x2:xRightJoint, y2:foldYPerf});
        easyFoldPrims.push({kind:'line', x1:xLeftJoint, y1:foldYPerf, x2:xLeftEnd, y2:(foldYPerf + foldDir*dy)});
        easyFoldPrims.push({kind:'line', x1:xRightJoint, y1:foldYPerf, x2:xRightEnd, y2:(foldYPerf + foldDir*dy)});
        const xDimPerf = xRightGEnd + 60;
        if (techPerfSide === 'prava'){ vDim(xDimPerf, yPerf, yBottom, Math.round(perfOffset), 10, '#dc2626'); }
        else { vDim(xDimPerf, yTop, yPerf, Math.round(perfOffset), 10, '#dc2626'); }
        const lenDimY = yPerf + (techPerfSide==='prava' ? Math.max(24, Math.round(state.fontPx*2.0)) : -Math.max(24, Math.round(state.fontPx*2.0)));
        hDim(xMid, lenDimY, xRightEnd, Math.round(halfSpan), 10, '#dc2626');
        maxRight = Math.max(maxRight, xRightEnd + 40);
      }
    }
    if (fingerHole === 'ano'){
      const rFinger = 10;
      const yFinger = (perfSide === 'prava') ? (yBottom - 30) : (yTop + 30);
      easyFoldPrims.push({kind:'circle', cx:cxLeftSlot, cy:yFinger, r:rFinger});
      easyFoldPrims.push({kind:'circle', cx:cxRightSlot, cy:yFinger, r:rFinger});
    }

    const foldSourceMinX = xRightGStart;
    const foldSourceMaxX = xKend;
    const foldedX = maxRight + 40;
    const foldedY = yTop + 10;
    const foldedW = W;
    const foldedH = foldSourceMaxX - foldSourceMinX;
    const foldClipId = 'vz31-fold-clip';
    const foldDefs = create('defs');
    const foldClip = create('clipPath',{id:foldClipId},foldDefs);
    create('rect',{x:foldedX,y:foldedY,width:foldedW,height:foldedH}, foldClip);
    const foldGroup = create('g', {'clip-path': `url(#${foldClipId})`});
    const mapFold = (xf, yf) => ({ x: foldedX + (yf - yTop), y: foldedY + (foldSourceMaxX - xf) });
    create('rect',{x:foldedX,y:foldedY,width:foldedW,height:foldedH,fill:'none',stroke:'#0f172a','stroke-width':1});
    textWithBg('ZLOZENY NAHLAD', foldedX + foldedW/2, foldedY - Math.max(12, Math.round(state.fontPx*1.3)), {anchor:'middle', baseline:'middle', color:'#334155', fontWeight:'700'});
    create('line',{x1:foldedX,y1:mapFold(xKstart, yTop).y,x2:foldedX+foldedW,y2:mapFold(xKstart, yTop).y,stroke:'#0f172a','stroke-width':1}, foldGroup);
    create('line',{x1:foldedX,y1:mapFold(xRightGEnd, yTop).y,x2:foldedX+foldedW,y2:mapFold(xRightGEnd, yTop).y,stroke:'#0f172a','stroke-width':1}, foldGroup);

    const rHoleFold = 7;
    create('circle',{cx:mapFold(xAxis, y1).x, cy:mapFold(xAxis, y1).y, r:rHoleFold, fill:'none', stroke:'#0f172a','stroke-width':1}, foldGroup);
    create('circle',{cx:mapFold(xAxis, y2).x, cy:mapFold(xAxis, y2).y, r:rHoleFold, fill:'none', stroke:'#0f172a','stroke-width':1}, foldGroup);
    textWithBg('⌀14', mapFold(xAxis, y1).x - rHoleFold - 8, mapFold(xAxis, y1).y, {anchor:'end', baseline:'middle'});

    const foldDimX = foldedX + foldedW + 24;
    vDim(foldDimX, foldedY, mapFold(xKstart, yTop).y, Math.round(K), 8, '#0f172a');
    vDim(foldDimX, mapFold(xKstart, yTop).y, mapFold(xRightGEnd, yTop).y, Math.round(L), 8, '#0f172a');
    vDim(foldDimX + 20, mapFold(xRightGEnd, yTop).y, foldedY + foldedH, Math.round(G), 8, '#64748b');
    hDim(foldedX, foldedY + foldedH + 28, foldedX + foldedW, `Pozadovana sirka vrecka ${fmtVal(bagWidth)}`, 8, '#0f172a', {bg:false, labelDy:-6});

    easyFoldPrims.forEach((primitive)=>{
      if (primitive.kind === 'line'){
        const p1 = mapFold(primitive.x1, primitive.y1);
        const p2 = mapFold(primitive.x2, primitive.y2);
        create('line',{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4'}, foldGroup);
      } else if (primitive.kind === 'quad'){
        const p1 = mapFold(primitive.x1, primitive.y1);
        const pc = mapFold(primitive.cx, primitive.cy);
        const p2 = mapFold(primitive.x2, primitive.y2);
        create('path',{d:`M ${p1.x} ${p1.y} Q ${pc.x} ${pc.y} ${p2.x} ${p2.y}`,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4',fill:'none'}, foldGroup);
      } else if (primitive.kind === 'circle'){
        const p = mapFold(primitive.cx, primitive.cy);
        create('circle',{cx:p.x, cy:p.y, r:primitive.r, fill:'none', stroke:'#0f172a','stroke-width':1}, foldGroup);
      }
    });

    const sideGap = 90;
    const sideXLeft = foldedX + foldedW + sideGap;
    const sideInnerW = 20;
    const sideXRight = sideXLeft + sideInnerW;
    const sideYTopLeft = foldedY + 6;
    const sideYTopRight = foldedY + K;
    const sideYBottom = foldedY + K + L + G;
    const sideClipCenterY = foldedY + axisVal;
    const foldAxisCenter = (xAxis >= foldSourceMinX && xAxis <= foldSourceMaxX) ? mapFold(xAxis, (y1 + y2) / 2) : null;
    create('line',{
      x1: foldAxisCenter ? foldAxisCenter.x : (sideXLeft - 14),
      y1: sideClipCenterY,
      x2: sideXRight + 14,
      y2: sideClipCenterY,
      stroke:'#2563eb',
      'stroke-width':0.45,
      'stroke-dasharray':'8 2 1.5 2'
    });
    const sideClipBounds = drawSideClipSymbol((sideXLeft + sideXRight) / 2, sideClipCenterY, sideClipView, sideClipFill);

    create('line',{x1:sideXLeft,y1:sideYTopLeft,x2:sideXLeft,y2:sideYBottom,stroke:'#0f172a','stroke-width':1.2});
    create('line',{x1:sideXRight,y1:sideYTopRight,x2:sideXRight,y2:sideYBottom,stroke:'#0f172a','stroke-width':1.2});
    create('line',{x1:sideXLeft,y1:sideYBottom,x2:sideXRight,y2:sideYBottom,stroke:'#0f172a','stroke-width':1.2});
    const handleTopY = sideYBottom - G;
    create('line',{
      x1:sideXLeft,
      y1:handleTopY,
      x2:sideClipBounds.right + 14,
      y2:handleTopY,
      stroke:'#64748b',
      'stroke-width':1,
      'stroke-dasharray':'6 4'
    });
    const handleSlotMain = {
      x1: cxRightSlot - slotW / 2,
      y1: cySlot - slotH / 2,
      x2: cxRightSlot + slotW / 2,
      y2: cySlot + slotH / 2
    };
    const handleSlotFoldA = mapFold(handleSlotMain.x1, handleSlotMain.y1);
    const handleSlotFoldB = mapFold(handleSlotMain.x2, handleSlotMain.y2);
    create('rect',{
      x: Math.min(handleSlotFoldA.x, handleSlotFoldB.x),
      y: Math.min(handleSlotFoldA.y, handleSlotFoldB.y),
      width: Math.abs(handleSlotFoldB.x - handleSlotFoldA.x),
      height: Math.abs(handleSlotFoldB.y - handleSlotFoldA.y),
      rx: slotR,
      ry: slotR,
      fill: 'none',
      stroke: '#0f172a',
      'stroke-width': 1
    });
    const peBandBounds = drawPeFoilBand(peFoilBand, {
      left: sideXLeft,
      right: sideXRight,
      topLeft: sideYTopLeft,
      topRight: sideYTopRight,
      bottom: sideYBottom
    }, G);

    const sideMinY = Math.min(sideYTopLeft, sideYTopRight, sideClipBounds.top, peBandBounds?.top ?? sideYTopLeft);
    const sideMaxY = Math.max(sideYBottom, sideYTopLeft, sideYTopRight, sideClipBounds.bottom, peBandBounds?.bottom ?? sideYBottom);
    textWithBg('BOKORYS', ((sideXLeft + sideXRight)/2) - 20, sideMinY - Math.max(12, Math.round(state.fontPx*1.3)), {anchor:'middle', baseline:'middle', color:'#334155', fontWeight:'700'});
    create('text',{
      x:((sideXLeft + sideXRight)/2) - 20,
      y:sideMinY - Math.max(2, Math.round(state.fontPx*0.2)),
      'text-anchor':'middle',
      'dominant-baseline':'middle',
      fill:'#475569',
      'font-size':Math.max(10, Math.round(state.fontPx*0.78)),
      'font-family':'Arial, Helvetica, sans-serif'
    }).textContent = `spona ${sideClipView}`;

    maxRight = Math.max(maxRight, foldDimX + 20, sideXRight, sideClipBounds.right) + 20;

    const segY = yBottom + Math.max(60, Math.round(state.fontPx*4.5));
    const totalY = segY + Math.max(28, Math.round(state.fontPx*2.4));
    let sx = xStart;
    widths.forEach(w=>{ hDim(sx, segY, sx+w, Math.round(w)); sx += w; });
    hDim(xStart, totalY, xStart + totalWidth, Math.round(totalWidth));

    const xKstart2 = xStart + widths[0]+widths[1]+widths[2]+widths[3];
    const xAxis2 = xKstart2 + axisVal;
    hDim(xKstart2, yDimAxis, xAxis2, Math.round(axisVal), 10, '#dc2626');

    drawUserMeasures();
    drawMeasurePreview();

    const bottomPad = Math.max(90, Math.round(state.fontPx * 5.5));
    const svgW = Math.max(maxRight, xDimW + 80) + leftPad;
    const svgH = Math.max(
      yDimAxis + bottomPad,
      foldedY + foldedH + 110,
      sideMaxY + Math.max(26, Math.round(state.fontPx*2.2))
    );
    state.bounds.width = svgW;
    state.bounds.height = svgH;
    svgRoot.setAttribute('width', svgW * state.zoom);
    svgRoot.setAttribute('height', svgH * state.zoom);
    const vw = svgW;
    const vh = svgH;
    svgRoot.setAttribute('viewBox', `${-state.pan.x - leftPad} ${-state.pan.y} ${vw} ${vh}`);
    updateStamp();
  }

  inputs.forEach(el=>{
    const ev = el && el.type==='range'?'input':'change';
    el && el.addEventListener(ev, draw);
  });
  $('toggle-notch-shift')?.addEventListener('change', updateNotchShiftUiState);
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
    $('W').value=400; $('L').value=600; $('G').value=50; $('K').value=45; if($('BagWidth')) $('BagWidth').value=400;
    $('Cpitch').value=160; $('AxisInK').value='';
    $('NotchLen').value=7; $('toggle-notches').checked=false; $('toggle-notch-shift').checked=false; $('NotchShift').value=0;
    $('AirEdge').value=30; $('AirXAbs').value=25; $('AirCount').value='2'; $('AirType').value='1'; $('AirPitch').value=40;
      $('PerfShape').value='U'; $('PerfSide').value='prava'; $('PerfOffset').value=70; $('PerfHalfLen').value=250;
      $('FingerHole').value='nie';
      if ($('SideClipView')) $('SideClipView').value='zhora';
      if($('PhotoMarkEnabled')) $('PhotoMarkEnabled').checked=false;
    if (refPartA) refPartA.value='';
    if (refPartB) refPartB.value='';
    if (porCislo) porCislo.value='';
    $('fontPx').value=14; $('toggle-grid').checked=false;
    if(finalNavinNumber) finalNavinNumber.value='1';
      if(finalNavinLetter) finalNavinLetter.value='A';
      if(printOps) printOps.value='0';
      if ($('peFoilBand')) $('peFoilBand').value='B';
      if (sideClipColor) sideClipColor.value='gray';
      if (bottomText1Size) bottomText1Size.value='14';
    if (bottomText1Bold) bottomText1Bold.checked=false;
    if (bottomText1Italic) bottomText1Italic.checked=false;
    if (bottomText1Color) bottomText1Color.value='#0f172a';
    if (bottomText2Size) bottomText2Size.value='14';
    if (bottomText2Bold) bottomText2Bold.checked=false;
    if (bottomText2Italic) bottomText2Italic.checked=false;
    if (bottomText2Color) bottomText2Color.value='#0f172a';
    if (motivInput) motivInput.value='';
    bgFile.value=''; bgWidthEl.value=''; bgHeightEl.value=''; bgState.data=null; bgState.natural={w:0,h:0}; bgState.offset={x:0,y:0}; bgState.rotation=0; bgState.flip=false;
    document.querySelectorAll('.epsfilled').forEach(el=> el.classList.remove('epsfilled'));
    try{
      localStorage.removeItem('selectedFirm');
      localStorage.removeItem('prefill_source');
      localStorage.removeItem('eps_payload');
    }catch(_){}
    updateRefDisplay();
    updatePorCisloDisplay();
    updateNavinTlac();
    updateMotivDisplay();
    updateNotchShiftUiState();
    applyBottomTextStyle(1);
    applyBottomTextStyle(2);
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
        bgState.natural = {w:imgEl.naturalWidth, h:imgEl.naturalHeight};
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
        bgState.natural={w:imgEl.naturalWidth,h:imgEl.naturalHeight};
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


  function collectStateForSave(){
    return {
      vz: 'vz31',
      inputs: {
        W:$('W').value, L:$('L').value, G:$('G').value, K:$('K').value, BagWidth:$('BagWidth')?.value || '',
        Cpitch:$('Cpitch').value, AxisInK:$('AxisInK').value,
        NotchLen:$('NotchLen').value, toggleNotches:$('toggle-notches').checked, toggleNotchShift:$('toggle-notch-shift').checked, NotchShift:$('NotchShift').value,
        AirEdge:$('AirEdge').value, AirXAbs:$('AirXAbs').value,
        AirCount:$('AirCount').value, AirType:$('AirType').value, AirPitch:$('AirPitch').value,
          PerfShape:$('PerfShape').value, PerfSide:$('PerfSide').value,
          PerfOffset:$('PerfOffset').value, PerfHalfLen:$('PerfHalfLen').value,
          FingerHole:$('FingerHole').value,
          SideClipView:$('SideClipView')?.value || 'zhora',
          peFoilBand:$('peFoilBand')?.value || 'B',
          sideClipColor: sideClipColor?.value || 'gray',
          PhotoMarkEnabled:$('PhotoMarkEnabled')?.checked || false,
        fontPx:$('fontPx').value, grid:$('toggle-grid').checked,
        printSide:printSide.value,
        finalNavinNumber:finalNavinNumber?.value || '',
        finalNavinLetter:finalNavinLetter?.value || '',
        printOps: printOps?.value || '0',
        porCislo:$('porCislo').value,
        motiv:motivInput?.value || '',
        bottomText1:bottomText1.value,
        bottomText2:bottomText2.value,
        bottomText1Style:getBottomTextStyle(1),
        bottomText2Style:getBottomTextStyle(2),
        measureMode:state.measureMode
      },
      measures: state.measures,
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
      if($('BagWidth')) $('BagWidth').value=i.BagWidth||'';
      $('L').value=i.L||'';
      $('G').value=i.G||'';
      $('K').value=i.K||'';
      $('Cpitch').value=i.Cpitch||'';
      $('AxisInK').value=i.AxisInK||'';
      $('NotchLen').value=i.NotchLen||'';
      $('toggle-notches').checked=!!i.toggleNotches;
      $('toggle-notch-shift').checked=!!i.toggleNotchShift;
      $('NotchShift').value=(i.NotchShift!==undefined && i.NotchShift!==null)?i.NotchShift:0;
      $('AirEdge').value=i.AirEdge||'';
      $('AirXAbs').value=i.AirXAbs||'';
      $('AirCount').value=i.AirCount||'1';
      $('AirType').value=i.AirType||'1';
      $('AirPitch').value=i.AirPitch||'';
      $('PerfShape').value=normalizePerfShape(i.PerfShape||'U');
      $('PerfSide').value=normalizePerfSide(i.PerfSide||'prava');
        $('PerfOffset').value=i.PerfOffset||'';
        $('PerfHalfLen').value=i.PerfHalfLen||'';
        $('FingerHole').value=i.FingerHole||'nie';
        if($('SideClipView')) $('SideClipView').value=i.SideClipView||'zhora';
        if($('peFoilBand')) $('peFoilBand').value=i.peFoilBand||'B';
        if (sideClipColor) sideClipColor.value = i.sideClipColor || 'gray';
        if($('PhotoMarkEnabled')) $('PhotoMarkEnabled').checked=!!i.PhotoMarkEnabled;
      $('fontPx').value=i.fontPx||14;
      $('toggle-grid').checked=!!i.grid;
      printSide.value=i.printSide||'vrchna';
      if(finalNavinNumber) finalNavinNumber.value=i.finalNavinNumber||'1';
      if(finalNavinLetter) finalNavinLetter.value=i.finalNavinLetter||'A';
      if(printOps) printOps.value = (i.printOps !== undefined && i.printOps !== null) ? String(i.printOps) : ((i.rezanie===true || i.rezanie==='ano') ? '1' : '0');
      $('porCislo').value=i.porCislo||'';
      if (motivInput) motivInput.value = i.motiv || i.otherNotes || '';
      bottomText1.value=i.bottomText1||'';
      bottomText2.value=i.bottomText2||'';
      const s1 = i.bottomText1Style || {};
      const s2 = i.bottomText2Style || {};
      if (bottomText1Size) bottomText1Size.value = String(s1.size || 14);
      if (bottomText1Bold) bottomText1Bold.checked = !!s1.bold;
      if (bottomText1Italic) bottomText1Italic.checked = !!s1.italic;
      if (bottomText1Color) bottomText1Color.value = s1.color || '#0f172a';
      if (bottomText2Size) bottomText2Size.value = String(s2.size || 14);
      if (bottomText2Bold) bottomText2Bold.checked = !!s2.bold;
      if (bottomText2Italic) bottomText2Italic.checked = !!s2.italic;
      if (bottomText2Color) bottomText2Color.value = s2.color || '#0f172a';
      state.measureMode = i.measureMode || 'off';
      updateNavinTlac();
      updateMotivDisplay();
      updateNotchShiftUiState();
      applyBottomTextStyle(1);
      applyBottomTextStyle(2);
    }
    state.measures = Array.isArray(data.measures)? data.measures : [];
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
        if (data.vz && data.vz !== 'vz31'){
          alert('Tento JSON je pre iny vzor: ' + data.vz);
          return;
        }
        applyLoadedState(data);
      }catch(err){
        alert('Neplatny JSON.');
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
    if(!win){ alert('Povolte vyskakovacie okno pre export.'); }
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
    const marginMM = 4;
    const pageW = mm2px(pw,dpi);
    const pageH = mm2px(ph,dpi);
    const margin = mm2px(marginMM,dpi);
    const gap = mm2px(4,dpi);
    const lineH = Math.round(pageW*0.02);
    const notesH = Math.max(lineH*4 + gap*2, mm2px(14,dpi));
    const bottomH = Math.max(lineH*4 + gap*2, mm2px(14,dpi));
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

    try{
      const svgImage = await loadImage(svgUrl);
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
      const {effectiveCode, effectiveVariant, finalCode, finalVariant} = getEffectiveNavin();
      const isSpodnaTla = printSide?.value === 'spodna';
      const navText = `${effectiveCode}${effectiveVariant} / ${isSpodnaTla ? 'S' : 'V'}${effectiveCode}`;
      const finalNavText = `${finalCode}${finalVariant}`;
      const sideTitles = {
        left: 'PREDNA STRANA / FOTOBUNKA NA STRANE OBSLUHY',
        right: 'CHLOPNA/ ZS NA STRANE POHONU'
      };
      ctx.fillText(`Nazov suboru: ${refLabel}`, leftX, y);
      ctx.fillText(`Finalny navin: ${finalNavText||'-'}`, leftX, y+=lineH);
      const opsLabel = (printOps?.value === '1') ? '1 - rezanie' : ((printOps?.value === '2') ? '2 - kasirka + rezanie' : '0 - vreckaren');
      ctx.fillText(`Pocet operacii: ${opsLabel}`, leftX, y+=lineH);
      ctx.fillText(`Navin tlac: ${navText}`, leftX, y+=lineH);
      ctx.fillStyle = '#dc2626';
      const baseLabel = 'ZADNA STRANA';
      const baseY = y += lineH;
      ctx.fillText(baseLabel, leftX, baseY);
      if (isSpodnaTla) {
        const baseWidth = ctx.measureText(baseLabel + ' ').width;
        ctx.fillStyle = '#2563eb';
      ctx.fillText('- POHLAD CEZ FOLIU (FARBU)', leftX + baseWidth, baseY);
      }
      ctx.fillStyle="#dc2626"; ctx.fillText(sideTitles.left, leftX, y+=lineH);

      ctx.fillStyle="#0f172a";
      y = margin + Math.round(lineH*0.8);
      ctx.fillText(`Casova peciatka: ${stampEl.textContent||"-"}`, rightX, y);
      ctx.fillText(`Vzor: ${vzCodeEl.textContent||"vz-31"}`, rightX, y+=lineH);
      ctx.fillText(`Por. cislo vyrobku: ${$("porCislo").value||"-"}`, rightX, y+=lineH);
      ctx.fillText(`Motiv: ${motivInput?.value || "-"}`, rightX, y+=lineH);
      ctx.fillStyle="#dc2626"; ctx.fillText(sideTitles.right, rightX, y+=lineH);

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
        if (isSpodnaTla) {
          ctx.save();
          ctx.translate(dx, dy + dh);
          ctx.scale(1, -1);
          ctx.drawImage(svgImage, 0, 0, dw, dh);
          ctx.restore();
        } else {
          ctx.drawImage(svgImage, dx, dy, dw, dh);
        }

      // bottom section
      const bottomY = drawingArea.y + drawingArea.h + gap;
      const bottomW = pageW - 2*margin;
      const colGap = gap;
      const colW = (bottomW - colGap)/2;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4,4]);

      function drawBox(x,y,w,h){
        ctx.strokeRect(x,y,w,h);
      }
      function wrapText(text, x, y, maxWidth, lineHeight, style={}){
        const fontSize = style.size || fontBase;
        const fontWeight = style.bold ? '700' : '400';
        const fontStyle = style.italic ? 'italic' : 'normal';
        const usedLineH = Math.max(lineHeight, Math.round(fontSize * 1.2));
        ctx.fillStyle = style.color || '#0f172a';
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Arial,Helvetica,sans-serif`;
        const words = text.split(/\s+/);
        let line='', yy=y+usedLineH;
        for(let n=0;n<words.length;n++){
          const test=line?line+' '+words[n]:words[n];
          const width=ctx.measureText(test).width;
          if(width>maxWidth && line){ ctx.fillText(line,x,yy); line=words[n]; yy+=usedLineH; }
          else { line=test; }
        }
        if(line) ctx.fillText(line,x,yy);
      }

      // box1 text1
      const b1x = margin, b1y = bottomY;
      drawBox(b1x, b1y, colW, bottomH);
      wrapText(bottomText1.value || '', b1x + gap, b1y + gap, colW - 2*gap, lineH, getBottomTextStyle(1));

      // box2 text2
      const b2x = b1x + colW + colGap, b2y = bottomY;
      drawBox(b2x, b2y, colW, bottomH);
      wrapText(bottomText2.value || '', b2x + gap, b2y + gap, colW - 2*gap, lineH, getBottomTextStyle(2));

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
    const base = (path[path.length-1] || 'vz-31').replace(/\.[^.]+$/,'');
    if(refPartA) refPartA.value = base.slice(0,10);
    if(refPartB) refPartB.value = '';
    vzCodeEl.textContent = 'vz-31';
    updateNavinTlac();
    updateStamp();
    bgOpacityVal.textContent = `${Math.round(bgState.opacity*100)} %`;
    applyBottomTextStyle(1);
    applyBottomTextStyle(2);
  })();

  prefillFromFirm();
  updatePorCisloDisplay();
  updateMotivDisplay();
  updateNotchShiftUiState();
  applyBottomTextStyle(1);
  applyBottomTextStyle(2);
  let epsSource = '';
  try { epsSource = localStorage.getItem('prefill_source') || ''; } catch (_) {}
  if (epsSource === 'eps' && window.applyEpsPayload) {
    const applied = window.applyEpsPayload('vz31');
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


