/* EPS payload import helper */
(function(){
  function toBool(v){
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.toLowerCase().trim();
      return s === '1' || s === 'true' || s === 'yes' || s === 'ano' || s === 'a';
    }
    return false;
  }

  function normalizedValues(rawValues, templateName){
    templateName = templateName === 'vz22_test' ? 'vz22' : templateName;
    const values = { ...(rawValues || {}) };
    const copy = (fromKey, toKey) => {
      if ((values[toKey] === undefined || values[toKey] === null || values[toKey] === '') &&
          values[fromKey] !== undefined && values[fromKey] !== null && values[fromKey] !== '') {
        values[toKey] = values[fromKey];
      }
    };

    // legacy -> new separated keys
    copy('perf_enabled', 'perf_bottom_enabled');
    copy('perf_side', 'perf_bottom_side');
    copy('perf_offset', 'perf_bottom_offset');

    copy('easy_open', 'easy_open_side');
    copy('perf_shape', 'easy_open_shape');
    copy('perf_side', 'easy_open_side');
    copy('perf_offset', 'easy_open_offset');
    copy('perf_half_len', 'easy_open_half_len');
    copy('perf_finger_hole', 'easy_open_finger_hole');
    copy('perf_offset_P', 'easy_open_bottom_offset');
    copy('perf_height', 'easy_open_height');

    // template-specific cleanup
    if (templateName === 'vz22') {
      delete values.easy_open_side;
      delete values.easy_open_shape;
      delete values.easy_open_offset;
      delete values.easy_open_half_len;
      delete values.easy_open_finger_hole;
    }
    return values;
  }

  function clearEpsMarks(root){
    if (!root) return;
    root.querySelectorAll('.epsfilled').forEach(el=> el.classList.remove('epsfilled'));
  }

  function markEps(el){
    if (!el) return;
    el.classList.add('epsfilled');
    if (el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')) {
      const label = el.closest('label');
      if (label) label.classList.add('epsfilled');
    }
    const handler = ()=>{ el.classList.remove('epsfilled'); const label = el.closest('label'); if(label) label.classList.remove('epsfilled'); };
    el.addEventListener('input', handler, {once:true});
    el.addEventListener('change', handler, {once:true});
  }

  function applyValue(el, val){
    if (!el) return;
    const tag = el.tagName.toLowerCase();
    if (tag === 'select') {
      el.value = String(val);
      return;
    }
    if (tag === 'textarea' || tag === 'input') {
      const type = (el.type || '').toLowerCase();
      if (type === 'checkbox') {
        el.checked = toBool(val);
        return;
      }
      if (type === 'radio') {
        // set checked when value matches or val is true
        if (String(el.value) === String(val) || toBool(val)) el.checked = true;
        return;
      }
      el.value = String(val);
    }
  }

  window.applyEpsPayload = function(templateName){
    try{
      templateName = templateName === 'vz22_test' ? 'vz22' : templateName;
      const raw = localStorage.getItem('eps_payload');
      if(!raw) return false;
      const payload = JSON.parse(raw);
      if (payload.target_template && payload.target_template !== templateName) return false;
      const values = normalizedValues(payload.values || payload, templateName);
      const hasPhotoWidth = Object.prototype.hasOwnProperty.call(values || {}, 'photo_width');
      const hasPhotoHeight = Object.prototype.hasOwnProperty.call(values || {}, 'photo_height');
      const map = window.EPS_MAP || {};
      const root = document.getElementById('controls') || document.body;
      clearEpsMarks(root);
      Object.keys(values || {}).forEach((ck)=>{
        const v = values[ck];
        if (ck === 'easy_open_side' && templateName === 'vz31') {
          const sideEl = document.getElementById('PerfSide');
          const shapeEl = document.getElementById('PerfShape');
          const sv = String(v ?? '').toLowerCase().trim();
            if (sv === '') {
              if (shapeEl) {
                shapeEl.value = 'none';
                try {
                  shapeEl.dispatchEvent(new Event('input', { bubbles: true }));
                  shapeEl.dispatchEvent(new Event('change', { bubbles: true }));
                } catch (_) {}
                markEps(shapeEl);
              }
              return;
            }
          let targetSide = null;
          if (sv === 'p' || sv === 'prava' || sv === 'right') targetSide = 'prava';
          if (sv === 'l' || sv === 'lava' || sv === 'left') targetSide = 'lava';
          if (sideEl && targetSide) {
            sideEl.value = targetSide;
            try {
              sideEl.dispatchEvent(new Event('input', { bubbles: true }));
              sideEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
            markEps(sideEl);
          }
          if (shapeEl && targetSide) {
            shapeEl.value = 'U';
            try {
              shapeEl.dispatchEvent(new Event('input', { bubbles: true }));
              shapeEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
            markEps(shapeEl);
          }
          return;
        }
        if ((ck === 'perf_bottom_enabled' || ck === 'air_enabled') && templateName === 'vz22') {
          const id = map[ck] && map[ck][templateName];
          const el = id ? document.getElementById(id) : null;
          if (el && el.tagName.toLowerCase() === 'select') {
            const sv = String(v ?? '').toLowerCase().trim();
            if (sv === 'a' || sv === 'ano' || sv === 'yes' || sv === 'true' || sv === '1') {
              el.value = 'ano';
              try {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
              } catch (_) {}
              markEps(el);
              return;
            }
            if (sv === 'n' || sv === 'nie' || sv === 'no' || sv === 'false' || sv === '0') {
              el.value = 'nie';
              try {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
              } catch (_) {}
              markEps(el);
              return;
            }
          }
        }
        if ((ck === 'perf_bottom_enabled' || ck === 'air_enabled') && templateName === 'vz22' && (v === '' || v === null || v === undefined)) {
          const id = map[ck] && map[ck][templateName];
          const el = id ? document.getElementById(id) : null;
          if (el && el.tagName.toLowerCase() === 'select') {
            el.value = 'nie';
            try {
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
          }
          return;
        }
        if (ck === 'easy_open_shape' && templateName === 'vz31') {
          const shapeEl = document.getElementById('PerfShape');
          if (shapeEl) {
            shapeEl.value = String(v);
            try {
              shapeEl.dispatchEvent(new Event('input', { bubbles: true }));
              shapeEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
            markEps(shapeEl);
          }
          return;
        }
        if (v === null || v === undefined || v === '') return;
        const id = map[ck] && map[ck][templateName];
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        if ((ck === 'print_side_top' || ck === 'print_side_bottom') && el.tagName.toLowerCase() === 'select') {
          const sv = String(v).toLowerCase().trim();
          const setTop = ck === 'print_side_top' && (toBool(v) || sv === 'vrchna' || sv === 'top' || sv === 'v');
          const setBottom = ck === 'print_side_bottom' && (toBool(v) || sv === 'spodna' || sv === 'bottom' || sv === 's');
          if (!setTop && !setBottom) return;
          el.value = setTop ? 'vrchna' : 'spodna';
          try {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } catch (_) {}
          markEps(el);
          return;
        }
        if ((ck === 'rezanie_yes' || ck === 'rezanie_no') && (templateName === 'vz22' || templateName === 'vz31' || templateName === 'vz34')) {
          const opsEl = document.getElementById('printOps');
          if (opsEl && toBool(v)) {
            opsEl.value = (ck === 'rezanie_yes') ? '1' : '0';
            markEps(opsEl);
            try {
              opsEl.dispatchEvent(new Event('input', { bubbles: true }));
              opsEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
          }
          return;
        }
        if (ck === 'print_ops' && (templateName === 'vz22' || templateName === 'vz31' || templateName === 'vz34')) {
          const ops = Number(String(v).replace(',', '.'));
          const hasOps = Number.isFinite(ops);
          const opsEl = document.getElementById('printOps');
          if (opsEl && hasOps) {
            if (ops <= 0) opsEl.value = '0';
            else if (ops >= 2) opsEl.value = '2';
            else opsEl.value = '1';
            markEps(opsEl);
            try {
              opsEl.dispatchEvent(new Event('input', { bubbles: true }));
              opsEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
          }
          // legacy fallback for older UI with rezanie ano/nie radios
          const rezYes = document.getElementById('rezanie-ano');
          const rezNo = document.getElementById('rezanie-nie');
          if (rezYes && rezNo && hasOps) {
            if (ops > 0) {
              rezYes.checked = true;
              markEps(rezYes);
            } else {
              rezNo.checked = true;
              markEps(rezNo);
            }
            try {
              rezYes.dispatchEvent(new Event('change', { bubbles: true }));
              rezNo.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
          }
        }
        applyValue(el, v);
        try {
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (_) {}
        markEps(el);
      });
      // vz22: ak VzduchOtvPocet = 2, zapni pravidlo "Vzduchove otvory len v zalozke".
      if (templateName === 'vz22') {
        const rawCount = values.air_count;
        const cnt = Number(String(rawCount ?? '').replace(',', '.'));
        if (Number.isFinite(cnt) && cnt === 2) {
          const inGOnlyEl = document.getElementById('AirInGOnly');
          if (inGOnlyEl) {
            inGOnlyEl.checked = true;
            try {
              inGOnlyEl.dispatchEvent(new Event('input', { bubbles: true }));
              inGOnlyEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
            markEps(inGOnlyEl);
          }
        }
      }
      // vz108: PS musi byt nastavene skor ako BZP, inak BZP select nema spravne volby.
      if (templateName === 'vz108') {
        const psRaw = (values.seg_ps !== undefined && values.seg_ps !== null && values.seg_ps !== '')
          ? values.seg_ps
          : values.dim_bag_width;
        const bzRaw = values.seg_bzp;
        const machineEl = document.getElementById('machineMode');
        const psEl = document.getElementById('PS');
        const bzEl = document.getElementById('BZP');
        const toNum = (x) => {
          const n = Number(String(x).replace(',', '.'));
          return Number.isFinite(n) ? n : null;
        };
        const psNum = toNum(psRaw);
        const bzNum = toNum(bzRaw);
        // Auto-prepnutie stroja podla kombinacie PS/BZP z EPS.
        if (machineEl) {
          const oldPairs = new Set([
            '60|40','70|40','70|45','75|40','75|45','80|40','80|45','80|50','90|50','100|50','100|60','120|60','120|65'
          ]);
          const newPairs = new Set([
            '70|40','70|45','75|45','80|40','80|50','90|50','90|55','90|60','100|50','100|60','100|70','105|55','105|60',
            '110|55','110|60','110|65','120|60','120|65','120|70','130|65','130|70','130|75','140|70','140|75','140|80',
            '140|85','150|75','150|80','150|85','160|80','160|85','160|90','170|85','170|90','180|90','180|100','180|110'
          ]);
          let desired = null;
          if (psNum !== null && bzNum !== null) {
            const key = `${psNum}|${bzNum}`;
            if (newPairs.has(key) && !oldPairs.has(key)) desired = 'new';
            if (oldPairs.has(key) && !newPairs.has(key)) desired = 'old';
          } else if (psNum !== null) {
            const oldPS = new Set([60,70,75,80,90,100,120]);
            const newPS = new Set([70,75,80,90,100,105,110,120,130,140,150,160,170,180]);
            if (newPS.has(psNum) && !oldPS.has(psNum)) desired = 'new';
            if (oldPS.has(psNum) && !newPS.has(psNum)) desired = 'old';
          }
          if (desired && machineEl.value !== desired) {
            machineEl.value = desired;
            try {
              machineEl.dispatchEvent(new Event('input', { bubbles: true }));
              machineEl.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
            markEps(machineEl);
          }
        }
        if (psEl && psRaw !== undefined && psRaw !== null && psRaw !== '') {
          psEl.value = String(psRaw);
          try {
            psEl.dispatchEvent(new Event('input', { bubbles: true }));
            psEl.dispatchEvent(new Event('change', { bubbles: true }));
          } catch (_) {}
          markEps(psEl);
        }
        if (bzEl && bzRaw !== undefined && bzRaw !== null && bzRaw !== '') {
          bzEl.value = String(bzRaw);
          try {
            bzEl.dispatchEvent(new Event('input', { bubbles: true }));
            bzEl.dispatchEvent(new Event('change', { bubbles: true }));
          } catch (_) {}
          markEps(bzEl);
        }
      }
      // folia: ak sa vyska nastavi z EPS (SEK/raport fallback), zvrazni aj pole W.
      if (templateName === 'folia') {
        const wEl = document.getElementById('W');
        const hasSekLike = Object.prototype.hasOwnProperty.call(values || {}, 'dim_SEK')
          || Object.prototype.hasOwnProperty.call(values || {}, 'raport');
        if (wEl && hasSekLike && String(wEl.value || '').trim() !== '') {
          markEps(wEl);
        }
      }
      // folia: ak EPS neposiela rozmery fotobunky, nechaj polia prazdne (bez default 15x7)
      if (templateName === 'folia' && !hasPhotoWidth && !hasPhotoHeight) {
        const wEl = document.getElementById('photoW');
        const hEl = document.getElementById('photoH');
        if (wEl) {
          wEl.value = '';
          try {
            wEl.dispatchEvent(new Event('input', { bubbles: true }));
            wEl.dispatchEvent(new Event('change', { bubbles: true }));
          } catch (_) {}
        }
        if (hEl) {
          hEl.value = '';
          try {
            hEl.dispatchEvent(new Event('input', { bubbles: true }));
            hEl.dispatchEvent(new Event('change', { bubbles: true }));
          } catch (_) {}
        }
      }
      return true;
    }catch(_){
      return false;
    }
  };
})();
