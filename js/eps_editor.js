/* EPS editor for creating test payloads */
(function(){
  const $ = (id)=>document.getElementById(id);
  const fieldsWrap = $('fields');
  const preview = $('jsonPreview');
  const tmplSel = $('targetTemplate');

  function parseCSV(text){
    const lines = text.split(/\r?\n/).filter(l=>l.trim().length);
    const rows = [];
    for (let i=0;i<lines.length;i++){
      const line = lines[i];
      const parts = [];
      let cur = '';
      let inQuotes = false;
      for (let j=0;j<line.length;j++){
        const ch = line[j];
        if (ch === '"' ) {
          if (inQuotes && line[j+1] === '"'){ cur += '"'; j++; }
          else inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes){
          parts.push(cur);
          cur = '';
        } else {
          cur += ch;
        }
      }
      parts.push(cur);
      rows.push(parts);
    }
    return rows;
  }

  function buildFieldsFromList(list){
    fieldsWrap.innerHTML = '';
    const groups = new Map();
    (list || []).forEach(it=>{
      const key = (it.key || '').trim();
      if(!key) return;
      const group = it.group || 'Other';
      const desc = it.desc || '';
      if(!groups.has(group)) groups.set(group, []);
      groups.get(group).push({key, desc});
    });

    groups.forEach((items, groupName)=>{
      const g = document.createElement('div');
      g.className = 'group';
      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = groupName;
      g.appendChild(title);
      items.forEach(it=>{
        const lab = document.createElement('label');
        const span = document.createElement('span');
        span.textContent = it.desc ? `${it.key} - ${it.desc}` : `${it.key}`;
        lab.appendChild(span);
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.setAttribute('data-key', it.key);
        inp.placeholder = it.desc || '';
        inp.addEventListener('input', updatePreview);
        lab.appendChild(inp);
        g.appendChild(lab);
      });
      fieldsWrap.appendChild(g);
    });
  }

  function collectValues(){
    const values = {};
    fieldsWrap.querySelectorAll('input[data-key]').forEach(inp=>{
      const k = inp.getAttribute('data-key');
      const v = inp.value;
      if (v !== '') values[k] = v;
    });
    return values;
  }

  function updatePreview(){
    const payload = {
      target_template: tmplSel.value,
      values: collectValues()
    };
    preview.value = JSON.stringify(payload, null, 2);
  }
  function highlightFieldsForTemplate(){
    const tmpl = tmplSel.value;
    const map = window.EPS_MAP || {};
    fieldsWrap.querySelectorAll('label').forEach(lab => lab.classList.remove('active-vz'));
    fieldsWrap.querySelectorAll('input[data-key]').forEach(inp=>{
      const key = inp.getAttribute('data-key');
      const has = map[key] && map[key][tmpl];
      inp.classList.toggle('active-vz', !!has);
    });
  }

  function loadPayload(payload){
    tmplSel.value = payload.target_template || tmplSel.value;
    const values = payload.values || {};
    fieldsWrap.querySelectorAll('input[data-key]').forEach(inp=>{
      const k = inp.getAttribute('data-key');
      inp.value = (values[k] !== undefined && values[k] !== null) ? String(values[k]) : '';
    });
    updatePreview();
  }

  $('btn-save').addEventListener('click', ()=>{
    const payload = {
      target_template: tmplSel.value,
      values: collectValues()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const name = `eps_${tmplSel.value}_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  });

  $('btn-load').addEventListener('click', ()=> $('loadFile').click());
  $('loadFile').addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const r = new FileReader();
    r.onload = (ev)=>{
      try{
        const payload = JSON.parse(ev.target.result);
        loadPayload(payload);
      }catch(_){}
    };
    r.readAsText(file);
  });

  $('btn-clear').addEventListener('click', ()=>{
    fieldsWrap.querySelectorAll('input[data-key]').forEach(inp=> inp.value = '');
    updatePreview();
  });

  $('btn-open').addEventListener('click', ()=>{
    const payload = {
      target_template: tmplSel.value,
      values: collectValues()
    };
    try{ localStorage.setItem('eps_payload', JSON.stringify(payload)); }catch(_){}
    try{ localStorage.setItem('prefill_source', 'eps'); }catch(_){}
    window.location.href = `${tmplSel.value}.html`;
  });

  tmplSel.addEventListener('change', ()=>{ updatePreview(); highlightFieldsForTemplate(); });

  // init
  if (Array.isArray(window.EPS_FIELDS) && window.EPS_FIELDS.length) {
    buildFieldsFromList(window.EPS_FIELDS);
    updatePreview();
    highlightFieldsForTemplate();
  } else {
    fieldsWrap.textContent = 'Nepodarilo sa nacitat js/eps_fields.js';
  }
})();
