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
    // Riadky sa budu pridavat v poradi podla papieroveho tlaciva.
    // Zaciatok: Poradove cislo vyrobku -> order_serial.
    const formGroup = document.createElement('div');
    formGroup.className = 'group';
    const formTitle = document.createElement('div');
    formTitle.className = 'group-title';
    formTitle.textContent = 'Formular (podla tlaciva)';
    formGroup.appendChild(formTitle);
    const formLabel = document.createElement('label');
    const formSpan = document.createElement('span');
    formSpan.textContent = 'Nazov Por.c.vyrobku';
    formLabel.appendChild(formSpan);
    const formInp = document.createElement('input');
    formInp.type = 'text';
    formInp.setAttribute('data-key', 'order_serial');
    formInp.placeholder = 'Poradove cislo vyrobku';
    formInp.addEventListener('input', updatePreview);
    formLabel.appendChild(formInp);
    const formMap = document.createElement('span');
    formMap.className = 'kv';
    formMap.style.flex = '1 1 auto';
    formMap.style.maxWidth = 'none';
    formMap.textContent = 'order_serial - Poradove cislo vyrobku';
    formLabel.appendChild(formMap);
    formGroup.appendChild(formLabel);

    const formLabel2 = document.createElement('label');
    const formSpan2 = document.createElement('span');
    formSpan2.textContent = 'Cislo referencneho vzoru';
    formLabel2.appendChild(formSpan2);
    const formInp2 = document.createElement('input');
    formInp2.type = 'text';
    formInp2.setAttribute('data-key', 'ref_code_a');
    formInp2.placeholder = 'Cislo referencneho vzoru';
    formInp2.addEventListener('input', updatePreview);
    formLabel2.appendChild(formInp2);
    const formMap2 = document.createElement('span');
    formMap2.className = 'kv';
    formMap2.style.flex = '1 1 auto';
    formMap2.style.maxWidth = 'none';
    formMap2.textContent = 'ref_code_a - Cislo referencneho vzoru (cast A)';
    formLabel2.appendChild(formMap2);
    formGroup.appendChild(formLabel2);

    const formLabel3 = document.createElement('label');
    const formSpan3 = document.createElement('span');
    formSpan3.textContent = 'Cislo zmeny';
    formLabel3.appendChild(formSpan3);
    const formInp3 = document.createElement('input');
    formInp3.type = 'text';
    formInp3.setAttribute('data-key', 'ref_code_b');
    formInp3.placeholder = 'Cislo zmeny';
    formInp3.addEventListener('input', updatePreview);
    formLabel3.appendChild(formInp3);
    const formMap3 = document.createElement('span');
    formMap3.className = 'kv';
    formMap3.style.flex = '1 1 auto';
    formMap3.style.maxWidth = 'none';
    formMap3.textContent = 'ref_code_b - Cislo zmeny';
    formLabel3.appendChild(formMap3);
    formGroup.appendChild(formLabel3);

    const formLabel4 = document.createElement('label');
    const formSpan4 = document.createElement('span');
    formSpan4.textContent = 'Sirka (W)';
    formLabel4.appendChild(formSpan4);
    const formInp4 = document.createElement('input');
    formInp4.type = 'text';
    formInp4.setAttribute('data-key', 'dim_W');
    formInp4.placeholder = 'Sirka (W)';
    formInp4.addEventListener('input', updatePreview);
    formLabel4.appendChild(formInp4);
    const formMap4 = document.createElement('span');
    formMap4.className = 'kv';
    formMap4.style.flex = '1 1 auto';
    formMap4.style.maxWidth = 'none';
    formMap4.textContent = 'dim_W - Zakladny rozmer W (sirka/vyska podla vzoru)';
    formLabel4.appendChild(formMap4);
    formGroup.appendChild(formLabel4);

    const formLabel5 = document.createElement('label');
    const formSpan5 = document.createElement('span');
    formSpan5.textContent = 'Dlzka (L)';
    formLabel5.appendChild(formSpan5);
    const formInp5 = document.createElement('input');
    formInp5.type = 'text';
    formInp5.setAttribute('data-key', 'dim_L');
    formInp5.placeholder = 'Dlzka (L)';
    formInp5.addEventListener('input', updatePreview);
    formLabel5.appendChild(formInp5);
    const formMap5 = document.createElement('span');
    formMap5.className = 'kv';
    formMap5.style.flex = '1 1 auto';
    formMap5.style.maxWidth = 'none';
    formMap5.textContent = 'dim_L - Zakladny rozmer L (dlzka/sirka podla vzoru)';
    formLabel5.appendChild(formMap5);
    formGroup.appendChild(formLabel5);

    const formLabel6 = document.createElement('label');
    const formSpan6 = document.createElement('span');
    formSpan6.textContent = 'BocZalozka';
    formLabel6.appendChild(formSpan6);
    const formInp6 = document.createElement('input');
    formInp6.type = 'text';
    formInp6.setAttribute('data-key', 'seg_bzp');
    formInp6.placeholder = 'BocZalozka';
    formInp6.addEventListener('input', updatePreview);
    formLabel6.appendChild(formInp6);
    const formMap6 = document.createElement('span');
    formMap6.className = 'kv';
    formMap6.style.flex = '1 1 auto';
    formMap6.style.maxWidth = 'none';
    formMap6.textContent = 'seg_bzp - BZP (bocna zalozka prava)';
    formLabel6.appendChild(formMap6);
    formGroup.appendChild(formLabel6);

    const formLabel7 = document.createElement('label');
    const formSpan7 = document.createElement('span');
    formSpan7.textContent = 'raport';
    formLabel7.appendChild(formSpan7);
    const formInp7 = document.createElement('input');
    formInp7.type = 'text';
    formInp7.placeholder = '';
    formLabel7.appendChild(formInp7);
    const formMap7 = document.createElement('span');
    formMap7.className = 'kv';
    formMap7.style.flex = '1 1 auto';
    formMap7.style.maxWidth = 'none';
    formMap7.textContent = '';
    formLabel7.appendChild(formMap7);
    formGroup.appendChild(formLabel7);

    const formLabel8 = document.createElement('label');
    const formSpan8 = document.createElement('span');
    formSpan8.textContent = 'Sek';
    formLabel8.appendChild(formSpan8);
    const formInp8 = document.createElement('input');
    formInp8.type = 'text';
    formInp8.setAttribute('data-key', 'dim_SEK');
    formInp8.placeholder = 'Sek';
    formInp8.addEventListener('input', updatePreview);
    formLabel8.appendChild(formInp8);
    const formMap8 = document.createElement('span');
    formMap8.className = 'kv';
    formMap8.style.flex = '1 1 auto';
    formMap8.style.maxWidth = 'none';
    formMap8.textContent = 'dim_SEK - SEK (W + 60)';
    formLabel8.appendChild(formMap8);
    formGroup.appendChild(formLabel8);

    fieldsWrap.appendChild(formGroup);

    const groups = new Map();
    (list || []).forEach(it=>{
      const key = (it.key || '').trim();
      if(!key) return;
      if (key === 'order_serial') return; // uz je v prvom riadku formulára
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
