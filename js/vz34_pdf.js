"use strict";
(function(){
  const $ = (id)=>document.getElementById(id);
  const svgRoot = $('svgRoot');
  const refPartA = $('refPartA');
  const refPartB = $('refPartB');
  function buildRefLabel(){
    const a = (refPartA && refPartA.value ? refPartA.value.trim() : '') || 'vz-34';
    const b = (refPartB && refPartB.value ? refPartB.value.trim() : '');
    return b ? `${a}/${b}` : a;
  }
  function buildRefSlug(){
    return buildRefLabel().replace(/[^a-zA-Z0-9_-]+/g, '-');
  }
  const stampEl = $('stamp');
  const printSide = $('printSide');
  const lblNavinTlac = $('lblNavinTlac');
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
  const bgRotRightBtn = $('bg-rot-right');
  const bgRot180Btn = $('bg-rot-180');
  const svgHolder = $('svgHolder');
  const measureModeEl = $('measureMode');
  const measureCancelBtn = $('measure-cancel');
  const measureClearBtn = $('measure-clear');
  const exportSizeEl = $('exportSize');
  const exportOrientEl = $('exportOrient');
  const exportDPIEl = $('exportDPI');
  const exportBtn = $('btn-export');
  const printBtn = $('btn-print');
  const bottomImgInput = $('bottomImgInput');
  const bottomImgPreview = $('bottomImgPreview');
  const bottomText1 = $('bottomText1');
  const bottomText2 = $('bottomText2');
  const saveBtn = $('btn-save');
  const loadBtn = $('btn-load');
  const loadFile = $('loadFile');
  const lineOnlyEl = $('lineOnly');

  const state = {
    fontPx:14,
    bounds:{width:800,height:800},
    zoom:1,
    pan:{x:0,y:0},
    measureMode:'off',
    measurePick:null,
    measures:[],
    measurePreview:null,
    lineOnly:false
  };

  const bgState = {
    data:null,
    natural:{w:0,h:0},
    width:null,
    height:null,
    opacity:0.6,
    offset:{x:0,y:0},
    rotation:0,
    calib:{active:false, points:[]}
  };

  const inputs = [
    'W','L','G','K','P','Ph','Cpitch','AxisInK','NotchLen','AirEdge','AirXAbs','AirXAuto','AirCount','AirPitch','fontPx','toggle-grid','toggle-notches'
  ].map(id => $(id));

  function num(el, fallback=0){ const v=parseFloat(el.value); return Number.isFinite(v)?v:fallback; }
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

  function updateStamp(){
    const now = new Intl.DateTimeFormat('sk-SK',{
      year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit'
    }).format(new Date());
    stampEl.textContent = now;
  }
  function fmtVal(n){
    if(!Number.isFinite(n)) return '';
    return Number.isInteger(n) ? `${n}` : n.toFixed(1);
  }

  const mm2px = (mm,dpi)=> (mm/25.4)*dpi;
  const INLINE_ASSETS = {
    zhora: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAFNCAYAAAAKI+HUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAk3SURBVHhe7ZFBigQ3FMXm/pdOqE0wtfHXNKjliQXeNK+M1P7553IcP+8fLn3uox3IfbQDuY92IPfRDuQ+2oHcRzuQ+2gHch/tQO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH23Iz8/Pf+fbfN/gEO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH+1Apo+27sghbNfvy6fnrzFte/8P00PYrt+XT89fY9r2/h+mh7Bdvy+fnr/GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRtunsg25XtmlxMtqcxbZvuHsh2ZbsmF5PtaUzbprsHsl3ZrsnFZHsa07bp7oFsV7ZrcjHZnsa0bbp7INuV7ZpcvG7L5zdMv5/uHsh2ZbsmF7//nOr5DdPvp7sHsl3ZrsnF7z+nen7D9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7Jxeu2fH7D9Pvp7oFsV7ZrcvH7z6me3zD9frp7INuV7Zpc/P5zquc3TL+f7h7IdmW7JheT7WlM26a7B7Jd2a7JxWR7GtO26e6BbFe2a3Ix2Z7GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRt3ZFD2K7fl0/PX2Pa9v4fpoewXb8vn56/xrTt/T9MD2G7fl8+PX+NUtv3DQ7hPtqB3Ec7kPtoB3If7UDuox3IfbQDuY92IP/rRyvFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt26wxp96vo1u8P4DTjzfRjd4/wEnnm/zfYML5j7agdxHO5D7aAdyH+1A7qMdyH20A7mPdiD30Q7kPtqB3Ec7kPtoB3If7UDuox3Ivzo+yocvaAYcAAAAAElFTkSuQmCC',
    zdola: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAFNCAYAAAAKI+HUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAk3SURBVHhe7ZFBigQ3FMXm/pdOqE0wtfHXNKjliQXeNK+M1P7553IcP+8fLn3uox3IfbQDuY92IPfRDuQ+2oHcRzuQ+2gHch/tQO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH23Iz8/Pf+fbfN/gEO6jHch9tAO5j3Yg99EO5D7agdxHO5D7aAdyH+1Apo+27sghbNfvy6fnrzFte/8P00PYrt+XT89fY9r2/h+mh7Bdvy+fnr/GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRtunsg25XtmlxMtqcxbZvuHsh2ZbsmF5PtaUzbprsHsl3ZrsnFZHsa07bp7oFsV7ZrcjHZnsa0bbp7INuV7ZpcvG7L5zdMv5/uHsh2ZbsmF7//nOr5DdPvp7sHsl3ZrsnF7z+nen7D9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7JxWRr86nb9Pvp7oFsV7ZrcjHZ2nzqNv1+unsg25XtmlxMtjafuk2/n+4eyHZluyYXk63Np27T76e7B7Jd2a7Jxeu2fH7D9Pvp7oFsV7ZrcvH7z6me3zD9frp7INuV7Zpc/P5zquc3TL+f7h7IdmW7JheT7WlM26a7B7Jd2a7JxWR7GtO26e6BbFe2a3Ix2Z7GtG26eyDble2aXEy2pzFtm+4eyHZluyYXk+1pTNumuweyXdmuycVkexrTtunugWxXtmtyMdmexrRt3ZFD2K7fl0/PX2Pa9v4fpoewXb8vn56/xrTt/T9MD2G7fl8+PX+NUtv3DQ7hPtqB3Ec7kPtoB3If7UDuox3IfbQDuY92IP/rRyvFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt25QiieUvHWDUjyh5K0blOIJJW/doBRPKHnrBqV4QslbNyjFE0reukEpnlDy1g1K8YSSt26wxp96vo1u8P4DTjzfRjd4/wEnnm/zfYML5j7agdxHO5D7aAdyH+1A7qMdyH20A7mPdiD30Q7kPtqB3Ec7kPtoB3If7UDuox3Ivzo+yocvaAYcAAAAAElFTkSuQmCC'
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
    let data = null;
    try {
      const raw = localStorage.getItem('selectedFirm');
      if (raw) data = JSON.parse(raw);
    } catch(_) { /* ignore */ }
    if (!data || data.vz !== 'vz34') return;
    const dims = data.dimensions || {};
    const air = data.air || {};
    const clip = data.clip || {};
    const map = { W:'W', L:'L', G:'G', K:'K', notchLen:'NotchLen', Cpitch:'Cpitch', AxisInK:'AxisInK', AirEdge:'AirEdge', AirCount:'AirCount', AirPitch:'AirPitch' };
    Object.values(map).forEach(id=>{
      const el=$(id);
      if (el) el.classList.remove('prefilled');
    });
    Object.entries(map).forEach(([key,id])=>{
      const el=$(id);
      let val=null;
      if (key === 'notchLen') val = dims.notchLen;
      else if (key === 'AirEdge') val = air.offsetFromEdge;
      else if (key === 'AirCount') {
        const hasAir = air.count !== null && air.count !== undefined;
        const half = hasAir ? Math.max(1, Math.min(4, Math.round(air.count / 2))) : null;
        val = half ? Math.min(8, Math.max(2, half * 2)) : null; // dropdown zobrazuje celkovy pocet (2,4,6,8)
      }
      else if (key === 'AirPitch') val = air.pitch;
      else if (key === 'AxisInK') val = (dims.AxisInK != null) ? dims.AxisInK : (dims.K != null ? dims.K/2 : null);
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
    if (air.diameter) lines.push(`PRIEMER OTVOROV TYP: ${air.diameter}`);
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
          bottomImgPreview.src = '';
          bottomImgPreview.style.display='none';
          bottomImgPreview.style.transform='';
        }
      });
    } else {
      bottomImgPreview.src = '';
      bottomImgPreview.style.display = 'none';
      bottomImgPreview.style.transform = '';
    }
  }

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

  function clearSvg(){ while(svgRoot.firstChild) svgRoot.removeChild(svgRoot.firstChild); }

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
  function arrowLeft(x,y,color){ create('path',{d:`M ${x} ${y} l 6 -4 v 8 z`,fill:color}); }
  function arrowRight(x,y,color){ create('path',{d:`M ${x} ${y} l -6 -4 v 8 z`,fill:color}); }
  function arrowUp(x,y,color){ create('path',{d:`M ${x} ${y} l -4 6 h 8 z`,fill:color}); }
  function arrowDown(x,y,color){ create('path',{d:`M ${x} ${y} l -4 -6 h 8 z`,fill:color}); }

  function hDim(x1,y,x2,label,ext=10,color='#0f172a'){
    if(typeof label==='number') label = fmtVal(label);
    if(x2<x1){ const t=x1; x1=x2; x2=t; }
    create('line',{x1,y1:y,x2,y2:y,stroke:color,'stroke-width':1});
    create('line',{x1,y1:y-ext,x2:x1,y2:y+ext,stroke:color,'stroke-width':1});
    create('line',{x1:x2,y1:y-ext,x2:x2,y2:y+ext,stroke:color,'stroke-width':1});
    arrowLeft(x1,y,color); arrowRight(x2,y,color);
    textWithBg(label,(x1+x2)/2,y-6,{color});
  }

  function vDim(x,y1,y2,label,ext=10,color='#0f172a'){
    if(typeof label==='number') label = fmtVal(label);
    if(y2<y1){ const t=y1; y1=y2; y2=t; }
    create('line',{x1:x,x2:x,y1,y2,stroke:color,'stroke-width':1});
    create('line',{x1:x-ext,x2:x+ext,y1:y1,y2:y1,stroke:color,'stroke-width':1});
    create('line',{x1:x-ext,x2:x+ext,y1:y2,y2:y2,stroke:color,'stroke-width':1});
    arrowUp(x,y1,color); arrowDown(x,y2,color);
    const offset = ext + Math.max(4, Math.round(state.fontPx*0.35));
    const g = create('g',{transform:`translate(${x - offset} ${(y1+y2)/2}) rotate(-90)`});
    const t = create('text',{'text-anchor':'middle','dominant-baseline':'middle','font-size':state.fontPx,fill:color},g);
    t.textContent = label;
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
    const P = Math.max(10,num($('P'),55));
    const Ph = Math.max(0,num($('Ph'),240));
    const C = Math.max(0,num($('Cpitch'),160));
    const axisInK = $('AxisInK').value==='' ? null : num($('AxisInK'), K/2);
    const showNotches = $('toggle-notches').checked;
    const notchLen = Math.max(1,num($('NotchLen'),7));
    const airEdge = Math.max(0,num($('AirEdge'),30));
    const airXAuto = $('AirXAuto').checked;
    const airXAbs = airXAuto ? (G/2) : Math.max(0,num($('AirXAbs'),25));
    const displayCount = parseInt($('AirCount').value,10)||2;
    const airCount = clamp(Math.round(displayCount/2)||1,1,4);
    const airPitch = Math.max(0,num($('AirPitch'),40));
    state.fontPx = parseInt($('fontPx').value,10)||14;
    state.lineOnly = !!lineOnlyEl?.checked;
    $('fontPxVal').textContent = state.fontPx + ' px';
    if(airXAuto){ $('AirXAbs').value = airXAbs.toFixed(1); }

    const widths = [L,G,G,L,K];
    const totalWidth = widths.reduce((a,b)=>a+b,0);
    const handleH = 60;
    const rightCut=185, leftCut=(185-K);
    const leftOuter=50, rightOuter=50+totalWidth;
    const handleOffsetX=leftOuter+leftCut;
    const handleEndX=leftOuter+totalWidth-rightCut;
    const handleW=handleEndX-handleOffsetX;
    const offsetYTop=120, offsetY=offsetYTop+handleH;
    const yTopBody=offsetY, yBottomBody=offsetY+W;

    clearSvg();

    if(bgState.data){
      const bw = num(bgWidthEl) || bgState.width || bgState.natural.w;
      const bh = num(bgHeightEl) || bgState.height || bgState.natural.h;
      const cx = bw/2, cy = bh/2;
      const tx = bgState.offset.x + state.pan.x;
      const ty = bgState.offset.y + state.pan.y;
      const g = create('g',{transform:`translate(${tx} ${ty}) translate(${cx} ${cy}) rotate(${bgState.rotation||0}) translate(${-cx} ${-cy})`});
      create('image',{href:bgState.data,x:0,y:0,width:bw,height:bh,opacity:bgState.opacity}, g);
    }

    if ($('toggle-grid').checked){
      const defs = create('defs');
      const pattern = create('pattern',{id:'grid',width:50,height:50,patternUnits:'userSpaceOnUse'},defs);
      create('path',{d:'M 50 0 L 0 0 0 50',fill:'none',stroke:'#e2e8f0','stroke-width':1},pattern);
      create('rect',{x:0,y:0,width:2000,height:2000,fill:'url(#grid)'});
    }

    const xLeftGStart = leftOuter + widths[0];
    const xRightGEnd  = xLeftGStart + widths[1] + widths[2];
    const xKstart=leftOuter+widths[0]+widths[1]+widths[2]+widths[3];
    const xKend=xKstart+widths[4];
    const axisVal = (axisInK===null || Number.isNaN(axisInK)) ? K/2 : axisInK;
    $('warnAxis').style.display=(axisVal<0||axisVal>K)?'block':'none';
    const xAxis=xKstart+axisVal;

    const rHole=7;
    const yMid=offsetY+(W)/2;
    const y1=yMid-(C/2), y2=yMid+(C/2);
    const topLimit=yTopBody+rHole, botLimit=yBottomBody-rHole;
    $('warnC').style.display = (y1<topLimit)||(y2>botLimit) ? 'block' : 'none';

    if(!state.lineOnly){
      const cyan='#00AEEF';
      const wasteY=offsetYTop;
      const wasteH=handleH;
      const wasteLeftX=leftOuter;
      const wasteLeftW=Math.max(0, handleOffsetX - leftOuter);
      if(wasteLeftW>0){
        create('rect',{x:wasteLeftX,y:wasteY,width:wasteLeftW,height:wasteH,fill:cyan,'fill-opacity':0.2,stroke:'none'});
        textWithBg('VÝSEK', wasteLeftX + wasteLeftW/2, wasteY + wasteH/2, {anchor:'middle',baseline:'middle',color:cyan});
      }
      const wasteRightX=handleEndX;
      const wasteRightW=Math.max(0, rightOuter - handleEndX);
      if(wasteRightW>0){
        create('rect',{x:wasteRightX,y:wasteY,width:wasteRightW,height:wasteH,fill:cyan,'fill-opacity':0.2,stroke:'none'});
        textWithBg('VÝSEK', wasteRightX + wasteRightW/2, wasteY + wasteH/2, {anchor:'middle',baseline:'middle',color:cyan});
      }
    }

    let ox=leftOuter;
    widths.forEach((w,i)=>{
      const isG=(i===1||i===2);
      const h=isG ? (W+handleH) : (W);
      create('rect',{x:ox, y:offsetY-(isG?handleH:0), width:w, height:h, fill:'none', stroke:'#0f172a','stroke-width':1});
      ox+=w;
    });
    create('rect',{x:handleOffsetX,y:offsetYTop,width:handleW,height:handleH,fill:'none',stroke:'#0f172a','stroke-width':1});

    const xLeft = xLeftGStart - P;
    const xRight = xRightGEnd + P;
    const pTop = offsetYTop;
    const pBot = offsetYTop + Ph;
    const r=50;
    const halfW=(xRight-xLeft)/2;
    const rEff=Math.max(0,Math.min(r,halfW,(pBot-pTop)-1));
    const dU = [
      `M ${xLeft} ${pTop}`,
      `L ${xLeft} ${pBot-rEff}`,
      `A ${rEff} ${rEff} 0 0 0 ${xLeft+rEff} ${pBot}`,
      `L ${xRight-rEff} ${pBot}`,
      `A ${rEff} ${rEff} 0 0 0 ${xRight} ${pBot-rEff}`,
      `L ${xRight} ${pTop}`
    ].join(' ');
    create('path',{d:dU,stroke:'#0f172a','stroke-width':1,'stroke-dasharray':'6 4',fill:'none'});

    create('circle',{cx:xAxis, cy:y1, r:rHole, fill:'none', stroke:'#0f172a','stroke-width':1});
    create('circle',{cx:xAxis, cy:y2, r:rHole, fill:'none', stroke:'#0f172a','stroke-width':1});
    if(!state.lineOnly){
      textWithBg('O14', xAxis-rHole-6, y1, {anchor:'end', baseline:'middle'});
    }

    const slotW=90, slotH=20, slotR=10;
    const slotBottomY=offsetYTop+50;
    const slotTopY=slotBottomY-slotH;
    const slotCenterY=(slotTopY+slotBottomY)/2;
    const leftSegStart=handleOffsetX, leftSegEnd=leftOuter+widths[0];
    const rightSegStart=leftOuter+widths[0]+widths[1]+widths[2], rightSegEnd=handleEndX;
    const slotCenterX_L=(leftSegStart+leftSegEnd)/2;
    const slotCenterX_R=(rightSegStart+rightSegEnd)/2;
    function roundedRectPath(x,y,w,h,r){
      const x2=x+w, y2=y+h;
      return `M ${x+r} ${y} H ${x2-r} A ${r} ${r} 0 0 1 ${x2} ${y+r}
              V ${y2-r} A ${r} ${r} 0 0 1 ${x2-r} ${y2}
              H ${x+r} A ${r} ${r} 0 0 1 ${x} ${y2-r}
              V ${y+r} A ${r} ${r} 0 0 1 ${x+r} ${y} Z`;
    }
    function drawSlot(cx,cy){
      const sx = cx - slotW/2, sy = cy - slotH/2;
      create('path',{d:roundedRectPath(sx,sy,slotW,slotH,slotR), fill:'none', stroke:'#0f172a','stroke-width':1});
      return {x:sx, y:sy, w:slotW, h:slotH, cx, cy};
    }
    const rightSlot = drawSlot(slotCenterX_R,slotCenterY);
    const leftSlot  = drawSlot(slotCenterX_L,slotCenterY);

    if(!state.lineOnly){
      const magenta='#d0007a';
      const topBandH = 5;
      const bottomBandH = 10;
      const sideBandW = 5;
      create('rect',{x:handleOffsetX,y:offsetYTop,width:handleW,height:topBandH,fill:magenta,'fill-opacity':0.2,stroke:'none'});
      create('rect',{x:handleOffsetX,y:offsetYTop + handleH - bottomBandH,width:handleW,height:bottomBandH,fill:magenta,'fill-opacity':0.2,stroke:'none'});
      create('rect',{x:handleOffsetX,y:offsetYTop + topBandH,width:sideBandW,height:Math.max(0, handleH - topBandH - bottomBandH),fill:magenta,'fill-opacity':0.2,stroke:'none'});
      create('rect',{x:handleOffsetX + handleW - sideBandW,y:offsetYTop + topBandH,width:sideBandW,height:Math.max(0, handleH - topBandH - bottomBandH),fill:magenta,'fill-opacity':0.2,stroke:'none'});
      const bodyTopBandH = 5;
      const bodyBotBandH = 5;
      create('rect',{x:leftOuter,y:offsetY,width:totalWidth,height:bodyTopBandH,fill:magenta,'fill-opacity':0.2,stroke:'none'});
      const bodyBotY = offsetY + W - bodyBotBandH;
      create('rect',{x:leftOuter,y:bodyBotY,width:totalWidth,height:bodyBotBandH,fill:magenta,'fill-opacity':0.2,stroke:'none'});
    }

    const legendX = leftOuter;
    const legendY = offsetYTop - 30;
    create('rect',{x:legendX,y:legendY,width:16,height:16,fill:'#d0007a','fill-opacity':0.25,stroke:'#d0007a','stroke-width':1});
    create('text',{x:legendX+22,y:legendY+8,'text-anchor':'start','dominant-baseline':'middle','font-size':state.fontPx,fill:'#d0007a'}).textContent='NO PRINT AREA';

    if(showNotches){
      const notchLenPx = notchLen;
      const x1=xKend-notchLenPx, x2=xKend;
      create('line',{x1,y1:y1,x2,y2:y1,stroke:'#0f172a'});
      create('line',{x1,y1:y2,x2,y2:y2,stroke:'#0f172a'});
      if(!state.lineOnly){
        const upY   = y2 - Math.max(14, Math.round(state.fontPx*2.0));
        const downY = y2 + Math.max(18, Math.round(state.fontPx*2.2));
        hDim(x1, upY, x2, notchLenPx, 10, '#dc2626');
        const xHoleRight = xAxis + rHole;
        const dist = Math.max(0, x1 - xHoleRight);
        hDim(xHoleRight, downY, x1, dist, 10, '#dc2626');
      }
    }

    const X = clamp(airXAbs, 0, G);
    const edge = airEdge;
    const cyTop = offsetY + edge;
    const cyBot = yBottomBody - edge;
    const xRefLeftG = xLeftGStart + X;
    const xFirstLeftL = xLeftGStart - X;
    cross(xRefLeftG, cyTop); cross(xRefLeftG, cyBot);
    const leftL = Array.from({length: airCount}, (_,i)=> xFirstLeftL - i*airPitch);
    leftL.forEach(xi => { cross(xi, cyTop); cross(xi, cyBot); });
    const xRefRightG = xRightGEnd - X;
    const xFirstRightL = xRightGEnd + X;
    cross(xRefRightG, cyTop); cross(xRefRightG, cyBot);
    const rightL = Array.from({length: airCount}, (_,i)=> xFirstRightL + i*airPitch);
    rightL.forEach(xi => { cross(xi, cyTop); cross(xi, cyBot); });

    const edgeDimX = xFirstLeftL - 20;
    vDim(edgeDimX, offsetY, cyTop, edge, 10, '#dc2626');

    let minX=leftOuter-20, maxX=rightOuter+220;
    let minY=30, maxY=yBottomBody+220;
    if(!state.lineOnly){
      const topGap1=28, topStep=20;
      const yHandleTotal=offsetYTop-topGap1-2*topStep;
      hDim(handleOffsetX, yHandleTotal, handleEndX, handleW);
      hDim(leftOuter, yHandleTotal, handleOffsetX, handleOffsetX-leftOuter);
      hDim(handleEndX, yHandleTotal, rightOuter, rightOuter-handleEndX);
      const leftSegStart=handleOffsetX, leftSegEnd=leftOuter+widths[0];
      const rightSegStart=leftOuter+widths[0]+widths[1]+widths[2], rightSegEnd=handleEndX;
      hDim(leftSegStart, offsetYTop-topGap1-topStep, leftSegEnd, leftSegEnd-leftSegStart);
      hDim(rightSegStart, offsetYTop-topGap1-topStep, rightSegEnd, rightSegEnd-rightSegStart);
      const leftMid=(leftSegStart+leftSegEnd)/2;
      hDim(leftSegStart, offsetYTop-topGap1, leftMid, leftMid-leftSegStart);
      hDim(leftMid, offsetYTop-topGap1, leftSegEnd, leftSegEnd-leftMid);
      vDim(handleEndX+22, offsetYTop, offsetYTop+handleH, 60);
      vDim(xRight+35, pTop, pBot, Ph, 10, '#dc2626');
      const yDimPInside=pTop+Math.min(Ph-5,160);
      hDim(xLeft, yDimPInside, xLeftGStart, P, 10, '#dc2626');
      hDim(xLeft, pBot+20, xRight, 2*G + 2*P);
      const xDim=xKend+25, xDimW=xDim+30;
      vDim(xDim, yTopBody, y1, W/2 - C/2);
      vDim(xDim, y1, y2, C, 10, '#dc2626');
      vDim(xDim, yBottomBody, y2, W/2 - C/2);
      vDim(xDimW, yTopBody, yBottomBody, W);
      hDim(rightSlot.x, rightSlot.y-10, rightSlot.x+rightSlot.w, 90);
      vDim(rightSlot.x+rightSlot.w+16, rightSlot.y, rightSlot.y+rightSlot.h, 20);
      vDim(rightSlot.x+rightSlot.w+36, offsetYTop, rightSlot.y+rightSlot.h, 50);
      const yAirBase = cyBot + Math.max(36, Math.round(state.fontPx*3.0));
      leftL.slice(1).forEach((xVal,i)=>{ hDim(xVal, yAirBase, leftL[i], Math.abs(leftL[i]-xVal), '#dc2626'); });
      rightL.slice(1).forEach((xVal,i)=>{ hDim(rightL[i], yAirBase, xVal, Math.abs(xVal-rightL[i]), '#dc2626'); });
      hDim(xFirstLeftL, yAirBase, xLeftGStart, X, '#dc2626');
      hDim(xRightGEnd,  yAirBase, xFirstRightL, X, '#dc2626');
      const segY   = yBottomBody + Math.max(60, Math.round(state.fontPx * 4.5));
      const totalY = segY + Math.max(28, Math.round(state.fontPx * 2.4));
      let segX=leftOuter;
      widths.forEach((w,i)=>{ const s=segX, e=segX+w; const colorSeg = (i===4)?'#dc2626':'#0f172a'; hDim(s, segY, e, w, 10, colorSeg); segX=e; });
      hDim(leftOuter, totalY, leftOuter+totalWidth, totalWidth);
      const yDimAxis = yBottomBody + 145;
      hDim(xKstart, yDimAxis, xAxis, axisVal, 10, '#dc2626');
      create('path',{d:`M ${xAxis} ${y2} V ${yDimAxis}`, stroke:'#0f172a','stroke-dasharray':'4 3','fill':'none'});
      const magenta='#d0007a';
    const xDimTotal = xDimW + 35;
      vDim(xDimTotal, offsetYTop, yBottomBody, W + handleH);
      maxX = Math.max(maxX, xDimTotal + 40);
      const bottomPad = Math.max(90, Math.round(state.fontPx*5.5));
      const yDimAxisMax = yDimAxis + bottomPad;
      maxY = Math.max(yDimAxisMax, yBottomBody + 180);
    }

    drawUserMeasures();
    drawMeasurePreview();

    state.bounds.width = Math.max(maxX, rightOuter+40);
    state.bounds.height = Math.max(maxY, yBottomBody+120);
    const vw = state.bounds.width / state.zoom;
    const vh = state.bounds.height / state.zoom;
    svgRoot.setAttribute('viewBox', `${(-state.pan.x)/state.zoom} ${(-state.pan.y)/state.zoom} ${vw} ${vh}`);
    updateStamp();
  }

  inputs.forEach(el=>{
    const ev = el && el.type==='range'?'input':'change';
    el && el.addEventListener(ev, draw);
  });
  if(lineOnlyEl){ lineOnlyEl.addEventListener('change', draw); }
  bgOpacityEl.addEventListener('input', ()=>{
    bgState.opacity = parseFloat(bgOpacityEl.value)||0;
    bgOpacityVal.textContent = `${Math.round(bgState.opacity*100)} %`;
    draw();
  });
  function rotateBg(delta){ bgState.rotation = ((bgState.rotation || 0) + delta + 360) % 360; draw(); }
  if(bgRotLeftBtn) bgRotLeftBtn.addEventListener('click', ()=> rotateBg(-90));
  if(bgRotRightBtn) bgRotRightBtn.addEventListener('click', ()=> rotateBg(90));
  if(bgRot180Btn) bgRot180Btn.addEventListener('click', ()=> rotateBg(180));

  $('btn-reset').addEventListener('click', ()=>{
    $('W').value=400; $('L').value=600; $('G').value=50; $('K').value=45;
    $('P').value=55; $('Ph').value=240;
    $('Cpitch').value=160; $('AxisInK').value='';
    $('NotchLen').value=7; $('toggle-notches').checked=true;
    $('AirEdge').value=30; $('AirXAbs').value=25; $('AirXAuto').checked=true;
    $('AirCount').value='2'; $('AirPitch').value=40;
    $('fontPx').value=14; $('toggle-grid').checked=false; if(lineOnlyEl) lineOnlyEl.checked=false;
    bgFile.value=''; bgWidthEl.value=''; bgHeightEl.value=''; bgState.data=null; bgState.natural={w:0,h:0}; bgState.offset={x:0,y:0}; bgState.rotation=0;
    draw();
  });

  exportBtn.addEventListener('click', ()=>{ try{ exportPDF1(); } catch(err){ console.error(err); alert('Export PDF zlyhal. Detaily v konzole.'); }});
  if(printBtn){ printBtn.addEventListener('click', ()=>{ try{ exportPNGTables(); } catch(err){ console.error(err); alert('Export PNG zlyhal. Detaily v konzole.'); }}); }

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
      vz: 'vz34',
      inputs: {
        W:$('W').value, L:$('L').value, G:$('G').value, K:$('K').value,
        P:$('P').value, Ph:$('Ph').value,
        Cpitch:$('Cpitch').value, AxisInK:$('AxisInK').value,
        NotchLen:$('NotchLen').value, toggleNotches:$('toggle-notches').checked,
        AirEdge:$('AirEdge').value, AirXAbs:$('AirXAbs').value, AirXAuto:$('AirXAuto').checked,
        AirCount:$('AirCount').value, AirPitch:$('AirPitch').value,
        fontPx:$('fontPx').value, grid:$('toggle-grid').checked,
        printSide:printSide.value,
        porCislo:$('porCislo').value,
        otherNotes:$('otherNotes').value,
        bottomText1:bottomText1.value,
        bottomText2:bottomText2.value,
        measureMode:state.measureMode,
        lineOnly:lineOnlyEl?.checked || false
      },
      measures: state.measures,
      bottomImage: (bottomImgPreview && bottomImgPreview.style.display!=='none') ? bottomImgPreview.src : null,
      bg: {
        data: bgState.data,
        width: bgWidthEl.value,
        height: bgHeightEl.value,
        opacity: bgOpacityEl.value,
        offset: bgState.offset,
        rotation: bgState.rotation
      }
    };
  }
  function applyLoadedState(data){
    if(data.inputs){
      const i=data.inputs;
      $("W").value=i.W||""; $("L").value=i.L||""; $("G").value=i.G||""; $("K").value=i.K||"";
      $("P").value=i.P||""; $("Ph").value=i.Ph||"";
      $("Cpitch").value=i.Cpitch||""; $("AxisInK").value=i.AxisInK||"";
      $("NotchLen").value=i.NotchLen||""; $("toggle-notches").checked=!!i.toggleNotches;
      $("AirEdge").value=i.AirEdge||""; $("AirXAbs").value=i.AirXAbs||""; $("AirXAuto").checked=!!i.AirXAuto;
      $("AirCount").value=i.AirCount||"1"; $("AirPitch").value=i.AirPitch||"";
      $("fontPx").value=i.fontPx||14; $("toggle-grid").checked=!!i.grid;
      printSide.value=i.printSide||"vrchna";
      $("porCislo").value=i.porCislo||""; $("otherNotes").value=i.otherNotes||"";
      bottomText1.value=i.bottomText1||""; bottomText2.value=i.bottomText2||"";
      state.measureMode = i.measureMode || "off";
      if(lineOnlyEl) lineOnlyEl.checked = !!i.lineOnly;
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
    }
    draw();
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
      try{ const data = JSON.parse(ev.target.result); if (data.vz && data.vz !== 'vz34'){ alert('Tento JSON je pre iny vzor: ' + data.vz); return; } applyLoadedState(data); }
      catch(err){ alert('Neplatny JSON.'); }
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
  <title>VZ34 PDF</title>
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
        im.crossOrigin='anonymous';
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

      ctx.fillStyle = '#0f172a';
      const fontBase = Math.round(pageW*0.014);
      ctx.font = `600 ${fontBase}px Arial,Helvetica,sans-serif`;
      let y = margin + Math.round(lineH*0.8);
      const leftX = margin;
      const rightX = pageW/2 + margin/2;
      const refLabel = buildRefLabel();
      ctx.fillText(`Názov súboru: ${refLabel}`, leftX, y);
      ctx.fillText(`Návin: 1B`, leftX, y+=lineH);
      ctx.fillText(`Spôsob tlače: ${printSide.value==='vrchna'?'vrchná':'spodná'}`, leftX, y+=lineH);
      ctx.fillText(`Návin tlače: ${lblNavinTlac.textContent||'V1'}`, leftX, y+=lineH);
      ctx.fillStyle='#dc2626'; ctx.fillText('PREDNÁ STRANA / FOTOBUNKA NA STRANE OBSLUHY', leftX, y+=lineH);

      ctx.fillStyle='#0f172a';
      y = margin + Math.round(lineH*0.8);
      ctx.fillText(`Časová pečiatka: ${stampEl.textContent||'-'}`, rightX, y);
      ctx.fillText(`Vzor: ${vzCodeEl.textContent||'vz-34'}`, rightX, y+=lineH);
      ctx.fillText(`Por. číslo výrobku: ${$('porCislo').value||'-'}`, rightX, y+=lineH);
      ctx.fillText(`Ostatné poznámky: ${$('otherNotes').value||'-'}`, rightX, y+=lineH);
      ctx.fillStyle='#dc2626'; ctx.fillText('CHLOPŇA / ZS NA STRANE POHONU', rightX, y+=lineH);

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

      const bottomY = drawingArea.y + drawingArea.h + gap;
      const bottomW = pageW - 2*margin;
      const colGap = gap;
      const colW = (bottomW - colGap*2)/3;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4,4]);
      function drawBox(x,y,w,h){ ctx.strokeRect(x,y,w,h); }
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
      const b2x = b1x + colW + colGap, b2y = bottomY;
      drawBox(b2x, b2y, colW, bottomH);
      wrapText(bottomText1.value || '', b2x + gap, b2y + gap, colW - 2*gap, lineH);
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
    const base = (path[path.length-1] || 'vz-34').replace(/\\.[^.]+$/,'');
    if(refPartA) refPartA.value = base.slice(0,10);
    if(refPartB) refPartB.value = '';
    vzCodeEl.textContent = 'vz-34';
    lblNavinTlac.textContent = (printSide.value==='vrchna') ? 'V1' : 'S1';
    updateStamp();
    bgOpacityVal.textContent = `${Math.round(bgState.opacity*100)} %`;
  })();
  printSide.addEventListener('change', ()=>{ lblNavinTlac.textContent = (printSide.value==='vrchna') ? 'V1' : 'S1'; });

  bgFile.addEventListener('change',(e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file){ return; }
    if(file.type === 'application/pdf'){ alert('Priamy import PDF nie je podporovany. Uloz PDF ako obrazok (PNG/JPG) 1:1 a nacitaj tento obrazok.'); bgFile.value=''; return; }
    if(!file.type.startsWith('image/')){ alert('Podporovane su PNG/JPG/WebP/GIF.'); bgFile.value=''; return; }
    const r = new FileReader();
    r.onload = (ev)=>{
      const imgEl = new Image();
      imgEl.onload = ()=>{
        bgState.natural = {w:imgEl.naturalWidth, h:imgEl.naturalHeight};
        bgState.data = ev.target.result;
        if(!num(bgWidthEl)){ bgWidthEl.value = bgState.natural.w; }
        if(!num(bgHeightEl)){ bgHeightEl.value = bgState.natural.h; }
        draw();
      };
      imgEl.src = ev.target.result;
    };
    r.readAsDataURL(file);
  });

  bgClearBtn.addEventListener('click', ()=>{
    bgState.data=null; bgState.width=null; bgState.height=null; bgFile.value=''; bgState.offset={x:0,y:0}; bgState.calib={active:false,points:[]}; bgCalibCancelBtn.style.display='none'; bgCalibBtn.style.display='inline-block'; draw();
  });

  function svgPoint(evt){ const pt = svgRoot.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY; const ctm = svgRoot.getScreenCTM(); if(!ctm) return {x:0,y:0}; const inv = ctm.inverse(); const sp = pt.matrixTransform(inv); return {x:sp.x, y:sp.y}; }
  function pointToImagePx(p){ const bw = num(bgWidthEl) || bgState.width || bgState.natural.w || 1; const bh = num(bgHeightEl) || bgState.height || bgState.natural.h || 1; const pxPerMmX = bgState.natural.w / bw; const pxPerMmY = bgState.natural.h / bh; return { x: (p.x - state.pan.x - bgState.offset.x) * pxPerMmX, y: (p.y - state.pan.y - bgState.offset.y) * pxPerMmY }; }
  function cancelCalib(){ bgState.calib={active:false, points:[]}; bgCalibCancelBtn.style.display='none'; bgCalibBtn.style.display='inline-block'; svgRoot.style.cursor=''; }
  bgCalibBtn.addEventListener('click', ()=>{ if(!bgState.data){ alert('Najprv nacitaj podkladovy obrazok.'); return; } bgState.calib={active:true, points:[]}; bgCalibBtn.style.display='none'; bgCalibCancelBtn.style.display='inline-block'; svgRoot.style.cursor='crosshair'; });
  bgCalibCancelBtn.addEventListener('click', cancelCalib);

  svgRoot.addEventListener('click', (e)=>{
    const p = svgPoint(e);
    if(bgState.calib.active){
      const imgP = pointToImagePx(p);
      bgState.calib.points.push(imgP);
      if(bgState.calib.points.length===2){
        const [p1,p2]=bgState.calib.points;
        const pxDist = Math.hypot(p2.x-p1.x, p2.y-p1.y);
        const mmStr = prompt('Zadaj skutocnu vzdialenost medzi bodmi (mm):','100');
        const mm = parseFloat(mmStr||'0');
        if(mm>0 && pxDist>0){
          const pxPerMm = pxDist / mm;
          const newW = bgState.natural.w / pxPerMm;
          const newH = bgState.natural.h / pxPerMm;
          bgWidthEl.value = newW.toFixed(2);
          bgHeightEl.value = newH.toFixed(2);
          draw();
          alert(`Kalibracia OK`);
        } else { alert('Neplatna vzdialenost.'); }
        cancelCalib();
      }
      return;
    }
    if(state.measureMode!=='off'){
      if(!state.measurePick){ state.measurePick = p; }
      else { state.measures.push({type:state.measureMode,x1:state.measurePick.x,y1:state.measurePick.y,x2:p.x,y2:p.y}); state.measurePick = null; state.measurePreview = null; draw(); }
      return;
    }
  });

  let draggingBg=false, lastPt=null;
  svgRoot.addEventListener('mousedown',(e)=>{ if(bgState.calib.active) return; if(state.measureMode!=='off') return; draggingBg=true; lastPt={x:e.clientX,y:e.clientY}; });
  window.addEventListener('mousemove',(e)=>{ if(!draggingBg) return; const dx=e.clientX-(lastPt?.x||e.clientX); const dy=e.clientY-(lastPt?.y||e.clientY); lastPt={x:e.clientX,y:e.clientY}; const ctm = svgRoot.getScreenCTM(); const scaleX = ctm ? ctm.a : 1; const scaleY = ctm ? ctm.d : 1; bgState.offset.x += dx / scaleX; bgState.offset.y += dy / scaleY; draw(); });
  window.addEventListener('mouseup',()=>{ draggingBg=false; });

  svgRoot.addEventListener('mousemove',(e)=>{ if(state.measureMode==='off') return; if(!state.measurePick) return; const p = svgPoint(e); state.measurePreview = { type: state.measureMode, x1: state.measurePick.x, y1: state.measurePick.y, x2: p.x, y2: p.y }; draw(); });
  svgRoot.addEventListener('mouseleave', ()=>{ if(state.measureMode!=='off'){ state.measurePreview=null; draw(); }});

  window.addEventListener('paste',(e)=>{
    const items = Array.from(e.clipboardData?.items||[]);
    const it = items.find(i=> i.type && i.type.startsWith('image/'));
    if(!it) return;
    const file = it.getAsFile(); if(!file) return;
    const r=new FileReader();
    r.onload=(ev)=>{ const imgEl=new Image(); imgEl.onload=()=>{ bgState.natural={w:imgEl.naturalWidth,h:imgEl.naturalHeight}; bgState.data=ev.target.result; bgWidthEl.value = bgState.natural.w; bgHeightEl.value = bgState.natural.h; bgState.offset={x:0,y:0}; draw(); }; imgEl.src=ev.target.result; };
    r.readAsDataURL(file);
  });

  measureModeEl.addEventListener('change', ()=>{ state.measureMode = measureModeEl.value; state.measurePick=null; state.measurePreview=null; draw(); });
  measureCancelBtn.addEventListener('click', ()=>{ state.measurePick=null; state.measurePreview=null; draw(); });
  measureClearBtn.addEventListener('click', ()=>{ state.measures=[]; state.measurePick=null; state.measurePreview=null; draw(); });

  svgHolder.addEventListener('wheel',(e)=>{ e.preventDefault(); const factor = Math.exp(-e.deltaY * 0.0015); const newZoom = clamp(state.zoom * factor, 0.25, 6); state.zoom = newZoom; draw(); }, {passive:false});

  function drawUserMeasures(){ const color = '#16a34a'; for(const m of state.measures){ if(m.type==='h'){ const x1=Math.min(m.x1,m.x2), x2=Math.max(m.x1,m.x2); hDim(x1, m.y1, x2, `${Math.round(Math.abs(x2-x1))}`, 10, color); } else if(m.type==='v'){ const y1=Math.min(m.y1,m.y2), y2=Math.max(m.y1,m.y2); vDim(m.x1, y1, y2, `${Math.round(Math.abs(y2-y1))}`, 10, color); } } }
  function drawMeasurePreview(){ if(!state.measurePreview) return; const m = state.measurePreview; if(m.type==='h'){ const x1=Math.min(m.x1,m.x2), x2=Math.max(m.x1,m.x2); hDim(x1, m.y1, x2, `${Math.round(Math.abs(x2-x1))}`, 10, '#16a34a'); }else if(m.type==='v'){ const y1=Math.min(m.y1,m.y2), y2=Math.max(m.y1,m.y2); vDim(m.x1, y1, y2, `${Math.round(Math.abs(y2-y1))}`, 10, '#16a34a'); } }

    prefillFromFirm();
  draw();
})();


