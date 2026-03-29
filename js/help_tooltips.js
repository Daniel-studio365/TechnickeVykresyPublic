/* Simple inline help bubbles for form fields */
(function(){
  function isEnabled(v){
    const s = String(v || '').trim().toLowerCase();
    return s === 'yes' || s === 'ano' || s === 'true' || s === '1';
  }

  function closeAll(root){
    (root || document).querySelectorAll('.help-bubble.open').forEach((el)=> el.classList.remove('open'));
  }

  function ensureWrapper(el){
    const wrapper = document.createElement('span');
    wrapper.className = 'help-anchor';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    return wrapper;
  }

  function findHost(el){
    const label = el.closest('label');
    if (label && label.querySelector(`#${el.id}`)) return label;
    const field = el.closest('.field');
    if (field && field.querySelector(`#${el.id}`)) return field;
    return ensureWrapper(el);
  }

  function addHelpToField(def){
    if (!def || !isEnabled(def.help_enabled) || !def.field_id || !def.help_text) return;
    const el = document.getElementById(def.field_id);
    if (!el) return;
    const host = findHost(el);
    if (!host || host.querySelector('.help-corner')) return;
    host.classList.add('has-help');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'help-corner';
    trigger.setAttribute('aria-label', `Help: ${def.field_label || def.field_id}`);

    const bubble = document.createElement('div');
    bubble.className = 'help-bubble';
    bubble.textContent = def.help_text;

    function fitBubble(){
      bubble.classList.remove('align-left','align-right');
      const controls = document.getElementById('controls');
      if (!controls) return;
      const controlsRect = controls.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();
      if (bubbleRect.left < controlsRect.left + 8) {
        bubble.classList.add('align-left');
      }
      if (bubbleRect.right > controlsRect.right - 8) {
        bubble.classList.add('align-right');
      }
    }

    trigger.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !bubble.classList.contains('open');
      closeAll(document);
      if (willOpen) {
        bubble.classList.add('open');
        fitBubble();
      }
    });

    bubble.addEventListener('click', (e)=> e.stopPropagation());
    host.appendChild(trigger);
    host.appendChild(bubble);
  }

  window.initHelpTooltips = function(defs){
    closeAll(document);
    (defs || []).forEach(addHelpToField);
    document.addEventListener('click', ()=> closeAll(document), { once:false });
  };
})();
