/* EPS payload import helper */
(function(){
  function toBool(v){
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.toLowerCase().trim();
      return s === '1' || s === 'true' || s === 'yes' || s === 'ano';
    }
    return false;
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
      const raw = localStorage.getItem('eps_payload');
      if(!raw) return false;
      const payload = JSON.parse(raw);
      if (payload.target_template && payload.target_template !== templateName) return false;
      const values = payload.values || payload;
      const map = window.EPS_MAP || {};
      const root = document.getElementById('controls') || document.body;
      clearEpsMarks(root);
      Object.keys(values || {}).forEach((ck)=>{
        const v = values[ck];
        if (v === null || v === undefined || v === '') return;
        const id = map[ck] && map[ck][templateName];
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        if ((ck === 'print_side_top' || ck === 'print_side_bottom') && el.tagName.toLowerCase() === 'select') {
          if (!toBool(v)) return;
          el.value = (ck === 'print_side_top') ? 'vrchna' : 'spodna';
          markEps(el);
          return;
        }
        applyValue(el, v);
        try {
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (_) {}
        markEps(el);
      });
      return true;
    }catch(_){
      return false;
    }
  };
})();
