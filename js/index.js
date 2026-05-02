(() => {
  const radios = Array.from(document.querySelectorAll('input[name="workType"]'));
  const vreckoSelect = document.getElementById('vreckoSelect');
  const vreckoRow = document.getElementById('vreckoRow');
  const btnGo = document.getElementById('btnGo');
  const btnLoadEps = document.getElementById('btnLoadEpsFromIndex');
  const loadEpsFile = document.getElementById('loadEpsFileFromIndex');
  const epsFileInfo = document.getElementById('epsFileInfo');
  const epsRecentSelect = document.getElementById('epsRecentSelect');

  if (!radios.length || !vreckoSelect || !vreckoRow || !btnGo) return;

  const EPS_RECENT_KEY = 'eps_recent_history_v1';
  const EPS_LAST_KEY = 'eps_last_file_name_v1';

  function basePath() {
    const p = window.location.pathname;
    return p.endsWith('/') ? p : p.replace(/\/[^/]*$/, '/');
  }

  function toUrl(file) {
    return window.location.origin + basePath() + file;
  }

  function loadRecent() {
    try {
      const raw = localStorage.getItem(EPS_RECENT_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function saveRecent(arr) {
    try {
      localStorage.setItem(EPS_RECENT_KEY, JSON.stringify(arr));
    } catch (_) {}
  }

  function templateToFile(template) {
    const t = String(template || '').toLowerCase().trim();
    if (t === 'folia') return 'patterns/folia/index.html';
    if (t === 'montaz') return 'patterns/montaz/index.html';
    if (t === 'vz22') return 'patterns/vz22/index.html';
    if (t === 'vz22_test') return 'patterns/vz22/index.html';
    if (t === 'vz31') return 'patterns/vz31/index.html';
    if (t === 'vz34') return 'patterns/vz34/index.html';
    if (t === 'vz108') return 'patterns/vz108/index.html';
    return '';
  }

  function openTemplateFromEps(template) {
    const file = templateToFile(template);
    if (!file) {
      alert('V EPS JSON chyba alebo je neplatny target_template.');
      return;
    }
    window.location.href = toUrl(file);
  }

  function openPayload(payload, fileName) {
    try {
      localStorage.setItem('eps_payload', JSON.stringify(payload));
      localStorage.setItem('prefill_source', 'eps');
      localStorage.setItem(EPS_LAST_KEY, fileName || '');
    } catch (_) {}
    if (epsFileInfo) epsFileInfo.textContent = `Nacitane: ${fileName || 'EPS JSON'}`;
    openTemplateFromEps(payload.target_template);
  }

  function renderRecent() {
    if (!epsRecentSelect) return;
    const recent = loadRecent();
    epsRecentSelect.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = recent.length ? 'Vyber zoznam naposledy nacitanych EPS' : 'Historia nacitanych EPS (max 10)';
    epsRecentSelect.appendChild(ph);
    recent.forEach((item, idx) => {
      const opt = document.createElement('option');
      opt.value = String(idx);
      opt.textContent = `${item.name || 'EPS JSON'} - ${item.template || '-'}`;
      epsRecentSelect.appendChild(opt);
    });
  }

  function pushRecent(fileName, payload) {
    const template = String(payload?.target_template || '').trim();
    if (!template) return;
    const signature = `${fileName || ''}|${template}|${JSON.stringify(payload?.values || {})}`;
    const next = loadRecent().filter((x) => x.signature !== signature);
    next.unshift({
      name: fileName || 'EPS JSON',
      template,
      payload,
      signature,
      ts: Date.now()
    });
    saveRecent(next.slice(0, 10));
    renderRecent();
  }

  function syncWorkType() {
    const selected = radios.find((r) => r.checked)?.value;
    const isVrecko = selected === 'vrecko';
    vreckoSelect.disabled = !isVrecko;
    vreckoRow.classList.toggle('disabled', !isVrecko);
  }

  function getSelectedVz() {
    const selectedType = radios.find((r) => r.checked)?.value;
    if (selectedType !== 'vrecko') return '';
    return (vreckoSelect.value || '').replace('vz-', 'vz');
  }

  radios.forEach((radio) => radio.addEventListener('change', syncWorkType));
  vreckoSelect.addEventListener('change', syncWorkType);
  syncWorkType();

  if (btnLoadEps && loadEpsFile) {
    btnLoadEps.addEventListener('click', () => loadEpsFile.click());
    loadEpsFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const payload = JSON.parse(ev.target.result);
          if (!payload || typeof payload !== 'object' || !payload.target_template) throw new Error('invalid');
          pushRecent(file.name || 'EPS JSON', payload);
          openPayload(payload, file.name || 'EPS JSON');
        } catch (_) {
          alert('Nepodarilo sa nacitat EPS JSON.');
        }
      };
      reader.readAsText(file);
    });
    try {
      const lastName = localStorage.getItem(EPS_LAST_KEY) || '';
      if (epsFileInfo && lastName) epsFileInfo.textContent = `Naposledy: ${lastName}`;
    } catch (_) {}
  }

  renderRecent();
  if (epsRecentSelect) {
    epsRecentSelect.addEventListener('change', () => {
      const idx = parseInt(epsRecentSelect.value, 10);
      if (!Number.isInteger(idx) || idx < 0) return;
      const recent = loadRecent();
      const item = recent[idx];
      if (!item || !item.payload || !item.payload.target_template) {
        alert('Polozka historie nema validny payload.');
        return;
      }
      openPayload(item.payload, item.name || 'EPS JSON');
    });
  }

  btnGo.addEventListener('click', () => {
    const selected = radios.find((r) => r.checked)?.value;
    if (selected === 'folia') {
      window.location.href = toUrl('patterns/folia/index.html');
      return;
    }
    if (selected === 'montaz') {
      window.location.href = toUrl('patterns/montaz/index.html');
      return;
    }

    const vz = getSelectedVz();
    const file = templateToFile(vz);
    if (!file) {
      alert('Pre vybrany vzor zatial nie je preklik.');
      return;
    }
    window.location.href = toUrl(file);
  });
})();
