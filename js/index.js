(() => {
  const radios = Array.from(document.querySelectorAll('input[name="workType"]'));
  const vreckoSelect = document.getElementById('vreckoSelect');
  const vreckoRow = document.getElementById('vreckoRow');
  const firmSelect = document.getElementById('firmSelect');
  const typeSelect = document.getElementById('typeSelect');
  const btnAddFirm = document.getElementById('btnAddFirm');
  const btnEditFirm = document.getElementById('btnEditFirm');
  const btnViewFirm = document.getElementById('btnViewFirm');
  const btnExport = document.getElementById('btnExportFirms');
  const btnExportModal = document.getElementById('btnExportFirmsModal');
  const btnGo = document.getElementById('btnGo');
  const firmPreview = document.getElementById('firmPreview');
  const firmPreviewMeta = document.getElementById('firmPreviewMeta');
  const firmPreviewBody = document.getElementById('firmPreviewBody');
  const btnClosePreview = document.getElementById('btnClosePreview');
  const firmModal = document.getElementById('firmModal');
  const btnClosePanel = document.getElementById('btnClosePanel');
  const btnCancelPanel = document.getElementById('btnCancelPanel');
  const formAdd = document.getElementById('formAddFirm');
  const btnDeleteFirm = document.getElementById('btnDeleteFirm');

  if (!radios.length || !vreckoSelect || !vreckoRow || !btnGo) return;

  const simpleMode = !firmSelect || !typeSelect || !firmModal || !formAdd;
  if (simpleMode) {
    const syncWorkType = () => {
      const selected = radios.find(r => r.checked)?.value;
      const isVrecko = selected === 'vrecko';
      vreckoSelect.disabled = !isVrecko;
      vreckoRow.classList.toggle('disabled', !isVrecko);
    };
    const getSelectedVz = () => {
      const selectedType = radios.find(r => r.checked)?.value;
      if (selectedType !== 'vrecko') return null;
      const val = vreckoSelect.value;
      if (!val) return null;
      return val.replace('vz-', 'vz');
    };
    radios.forEach(r => r.addEventListener('change', syncWorkType));
    vreckoSelect.addEventListener('change', syncWorkType);
    syncWorkType();

    btnGo.addEventListener('click', () => {
      const basePath = () => {
        const p = window.location.pathname;
        return p.endsWith('/') ? p : p.replace(/\/[^/]*$/, '/');
      };
      const toUrl = (file) => window.location.origin + basePath() + file;
      const selected = radios.find(r => r.checked)?.value;
      if (selected === 'folia') {
        window.location.href = toUrl('folia.html');
        return;
      }
      const vz = getSelectedVz();
      if (vz === 'vz31') {
        window.location.href = toUrl('vz31.html');
      } else if (vz === 'vz34') {
        window.location.href = toUrl('vz34.html');
      } else if (vz === 'vz22') {
        window.location.href = toUrl('vz22.html');
      } else {
        alert('Pre vybrany vzor zatial nie je preklik.');
      }
    });
    return;
  }

  const numVal = (el) => {
    const v = parseFloat(el.value);
    return Number.isFinite(v) ? v : null;
  };
  const lines = (el) => el.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  const defaultFirms = [
    {
      firmId: 'epicom-sp', firmName: 'EPICOM SP', vz: 'vz31', typ: 'default',
      notes: ['Plastove spony 150 ks/blok'],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: 6, offsetX: null, offsetY: null, packageCount: 150, type: 'plast' },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    },
    {
      firmId: 'epicom-sp', firmName: 'EPICOM SP', vz: 'vz34', typ: 'default',
      notes: ['Plastove spony 150 ks/blok'],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: 6, offsetX: null, offsetY: null, packageCount: 150, type: 'plast' },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    },
    {
      firmId: 'shp', firmName: 'SHP', vz: 'vz31', typ: 'default',
      notes: [],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    },
    {
      firmId: 'metsa', firmName: 'METSA', vz: 'vz31', typ: 'default',
      notes: [],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    },
    {
      firmId: 'metsa', firmName: 'METSA', vz: 'vz34', typ: 'default',
      notes: [],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    },
    {
      firmId: 'velvet', firmName: 'VELVET', vz: 'vz31', typ: 'default',
      notes: [],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    },
    {
      firmId: 'velvet', firmName: 'VELVET', vz: 'vz34', typ: 'default',
      notes: [],
      dimensions: { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: []
    }
  ];

  const state = { firms: [], custom: [], deleted: [] };
  const LS_KEY = 'customFirms';
  const LS_DELETED = 'deletedFirms';
  let baseFirms = [];
  let editingKey = null;

  const firmKey = (f) => `${f.firmId || ''}__${f.vz || ''}__${f.typ || ''}`;

  const normalizeFirm = (f) => {
    if (!f) return null;
    const typVal = f.typ || f.zyp || 'default';
    const vzVal = (f.vz || '').replace('vz-', 'vz');
    return {
      firmId: f.firmId,
      firmName: f.firmName || f.name || f.firmId,
      vz: vzVal,
      typ: typVal,
      notes: f.notes || [],
      techNotes: f.techNotes || [],
      dimensions: f.dimensions || { W: null, L: null, G: null, K: null, Cpitch: null, AxisInK: null },
      clip: f.clip || { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: f.air || { count: null, diameter: null, offsetFromEdge: null, pitch: null },
      clipImages: f.clipImages || []
    };
  };

  const getSelectedVz = () => {
    const selectedType = radios.find(r => r.checked)?.value;
    if (selectedType !== 'vrecko') return null;
    const val = vreckoSelect.value;
    if (!val) return null;
    return val.replace('vz-', 'vz');
  };

  const syncWorkType = () => {
    const selected = radios.find(r => r.checked)?.value;
    const isVrecko = selected === 'vrecko';
    vreckoSelect.disabled = !isVrecko;
    vreckoRow.classList.toggle('disabled', !isVrecko);
    renderFirmOptions();
  };

  const loadCustom = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const loadDeleted = () => {
    try {
      const raw = localStorage.getItem(LS_DELETED);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const saveCustom = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state.custom));
    } catch (_) {
      /* ignore */
    }
  };

  const saveDeleted = () => {
    try {
      localStorage.setItem(LS_DELETED, JSON.stringify(state.deleted));
    } catch (_) {
      /* ignore */
    }
  };

  const fetchBase = async () => {
    // Lokalny fallback bez fetchu (file:// v prehliadaci moze blokovat fetch)
    try {
      const res = await fetch('js/firms.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (_) {
      /* ignore fetch errors */
    }
    return defaultFirms;
  };

  const renderFirmOptions = () => {
    const vz = getSelectedVz();
    const list = (state.firms || []).filter(f => !vz || f.vz === vz);
    const unique = [];
    const byId = new Set();
    list.forEach(f => {
      if (!byId.has(f.firmId)) {
        byId.add(f.firmId);
        unique.push(f);
      }
    });
    firmSelect.innerHTML = '';
    const optEmpty = document.createElement('option');
    optEmpty.value = '';
    optEmpty.textContent = 'Bez vyberu firmy';
    optEmpty.selected = true;
    firmSelect.appendChild(optEmpty);
    unique.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.firmId;
      opt.textContent = `${f.firmName} (${f.vz})`;
      firmSelect.appendChild(opt);
    });
    if (!unique.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Ziadne firmy pre tento vzor';
      firmSelect.appendChild(opt);
    }
    renderTypeOptions();
  };

  const renderTypeOptions = () => {
    const vz = getSelectedVz();
    const firmId = firmSelect.value;
    typeSelect.innerHTML = '';
    if (!firmId) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Bez variantu';
      opt.selected = true;
      typeSelect.appendChild(opt);
      return;
    }
    const items = (state.firms || []).filter(f => (!vz || f.vz === vz) && f.firmId === firmId);
    items.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.typ;
      opt.textContent = f.typ.toUpperCase();
      typeSelect.appendChild(opt);
    });
    if (!items.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Bez variantu';
      typeSelect.appendChild(opt);
    }
  };

  const openPanel = () => {
    firmModal.hidden = false;
    firmModal.classList.add('show');
    firmModal.setAttribute('aria-hidden', 'false');
    if (btnDeleteFirm) btnDeleteFirm.style.display = editingKey ? 'inline-flex' : 'none';
  };
  const closePanel = () => {
    firmModal.hidden = true;
    firmModal.classList.remove('show');
    firmModal.setAttribute('aria-hidden', 'true');
    formAdd.reset();
    editingKey = null;
  };

  const closePreview = () => {
    if (firmPreview) {
      firmPreview.hidden = true;
      firmPreview.setAttribute('aria-hidden', 'true');
      if (firmPreviewBody) firmPreviewBody.textContent = '';
      if (firmPreviewMeta) firmPreviewMeta.textContent = '';
    }
  };

  const mergeFirms = (arr) => {
    const map = new Map();
    arr.forEach(item => {
      const f = normalizeFirm(item);
      if (f && f.firmId && f.vz && f.typ) {
        map.set(firmKey(f), f);
      }
    });
    return Array.from(map.values());
  };

  const rebuild = () => {
    const deletedSet = new Set(state.deleted || []);
    state.firms = mergeFirms([...(baseFirms || []), ...(state.custom || [])])
      .filter(f => !deletedSet.has(firmKey(f)));
    renderFirmOptions();
  };

  const upsertCustom = (firm, replaceKey) => {
    const targetKey = replaceKey || firmKey(firm);
    state.custom = (state.custom || []).filter(f => firmKey(f) !== targetKey);
    state.custom.push(firm);
    if (state.deleted && state.deleted.includes(targetKey)) {
      state.deleted = state.deleted.filter(k => k !== targetKey);
      saveDeleted();
    }
    saveCustom();
    rebuild();
  };

  const init = async () => {
    state.custom = loadCustom();
    state.deleted = loadDeleted();
    baseFirms = await fetchBase();
    rebuild();
    syncWorkType();
  };

  firmSelect.addEventListener('change', renderTypeOptions);
  vreckoSelect.addEventListener('change', syncWorkType);
  radios.forEach(r => r.addEventListener('change', syncWorkType));

  if (btnAddFirm) btnAddFirm.addEventListener('click', () => {
    editingKey = null;
    formAdd.reset();
    openPanel();
  });

  if (btnEditFirm) {
    btnEditFirm.addEventListener('click', () => {
      const vz = getSelectedVz();
      const firmId = firmSelect.value;
      const typVal = typeSelect.value;
      if (!vz || !firmId || !typVal) {
        alert('Vyber firmu a typ, potom mozes upravit.');
        return;
      }
      const found = (state.firms || []).find(f => f.firmId === firmId && f.vz === vz && f.typ === typVal);
      if (!found) {
        alert('Zaznam sa nenasiel pre zvolenu firmu/typ.');
        return;
      }
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val ?? '';
      };
      formAdd.reset();
      setVal('newFirmId', found.firmId);
      setVal('newFirmName', found.firmName);
      setVal('newFirmVz', found.vz);
      setVal('newFirmTyp', found.typ);
      setVal('newFirmW', found.dimensions?.W);
      setVal('newFirmL', found.dimensions?.L);
      setVal('newFirmG', found.dimensions?.G);
      setVal('newFirmK', found.dimensions?.K);
      setVal('newNotchLen', found.dimensions?.notchLen);
      setVal('newFirmCpitch', found.dimensions?.Cpitch);
      setVal('newFirmAxisInK', found.dimensions?.AxisInK);
      setVal('newClipCount', found.clip?.count);
      setVal('newClipType', found.clip?.type);
      setVal('newAirCount', found.air?.count);
      setVal('newAirDiameter', found.air?.diameter);
      setVal('newAirOffsetEdge', found.air?.offsetFromEdge);
      setVal('newAirPitch', found.air?.pitch);
      const imgVal = found.clipImages?.[0] || '';
      const radio = document.querySelector(`input[name="clipImage"][value="${imgVal}"]`);
      const radioNone = document.getElementById('clipImgNone');
      if (radio) radio.checked = true;
      else if (radioNone) radioNone.checked = true;
      document.getElementById('newNotes').value = (found.notes || []).join('\n');
      document.getElementById('newTechNotes').value = (found.techNotes || []).join('\n');

      editingKey = firmKey(found);
      openPanel();
    });
  }

  const loadFirmIntoModal = () => {
    const vz = getSelectedVz();
    const firmId = firmSelect.value;
    const typVal = typeSelect.value;
    if (!vz || !firmId || !typVal) {
      alert('Vyber firmu a typ.');
      return false;
    }
    const found = (state.firms || []).find(f => f.firmId === firmId && f.vz === vz && f.typ === typVal);
    if (!found) {
      alert('Zaznam sa nenasiel pre zvolenu firmu/typ.');
      return false;
    }
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    };
    formAdd.reset();
    setVal('newFirmId', found.firmId);
    setVal('newFirmName', found.firmName);
    setVal('newFirmVz', found.vz);
    setVal('newFirmTyp', found.typ);
    setVal('newFirmW', found.dimensions?.W);
    setVal('newFirmL', found.dimensions?.L);
    setVal('newFirmG', found.dimensions?.G);
    setVal('newFirmK', found.dimensions?.K);
    setVal('newNotchLen', found.dimensions?.notchLen);
    setVal('newFirmCpitch', found.dimensions?.Cpitch);
    setVal('newFirmAxisInK', found.dimensions?.AxisInK);
    setVal('newClipCount', found.clip?.count);
    setVal('newClipType', found.clip?.type);
    setVal('newAirCount', found.air?.count);
    setVal('newAirDiameter', found.air?.diameter);
    setVal('newAirOffsetEdge', found.air?.offsetFromEdge);
    setVal('newAirPitch', found.air?.pitch);
    const imgVal = found.clipImages?.[0] || '';
    const radio = document.querySelector(`input[name="clipImage"][value="${imgVal}"]`);
    const radioNone = document.getElementById('clipImgNone');
    if (radio) radio.checked = true;
    else if (radioNone) radioNone.checked = true;
    document.getElementById('newNotes').value = (found.notes || []).join('\n');
    document.getElementById('newTechNotes').value = (found.techNotes || []).join('\n');

    editingKey = firmKey(found);
    openPanel();
    return true;
  };

  if (btnViewFirm) {
    btnViewFirm.addEventListener('click', () => {
      const vz = getSelectedVz();
      const firmId = firmSelect.value;
      const typVal = typeSelect.value;
      if (!vz || !firmId || !typVal) {
        alert('Vyber firmu a typ.');
        return;
      }
      const found = (state.firms || []).find(f => f.firmId === firmId && f.vz === vz && f.typ === typVal);
      if (!found) {
        alert('Zaznam sa nenasiel pre zvolenu firmu/typ.');
        return;
      }
      if (firmPreview && firmPreviewMeta && firmPreviewBody) {
        firmPreviewMeta.textContent = `${found.firmName || firmId} (${vz} / ${typVal})`;
        const parts = [];
        const dims = found.dimensions || {};
        const clip = found.clip || {};
        const air = found.air || {};
        if (dims.W || dims.L || dims.G || dims.K) {
          parts.push(`Rozmery W/L/G/K: ${dims.W ?? '-'} / ${dims.L ?? '-'} / ${dims.G ?? '-'} / ${dims.K ?? '-'}`);
        }
        if (dims.notchLen) parts.push(`Dlzka zaseku v K: ${dims.notchLen}`);
        if (dims.Cpitch || dims.AxisInK) parts.push(`C-roztec / Os C: ${dims.Cpitch ?? '-'} / ${dims.AxisInK ?? '-'}`);
        if (clip.count || clip.type) parts.push(`Spony: ${clip.count ?? '-'} ks, typ ${clip.type ?? '-'}`);
        if (air.count || air.diameter || air.offsetFromEdge || air.pitch) {
          parts.push(`Vzduch. otvory: ks ${air.count ?? '-'}, priemer ${air.diameter ?? '-'}, od okraja ${air.offsetFromEdge ?? '-'}, roztec ${air.pitch ?? '-'}`);
        }
        (found.notes || []).forEach(n => parts.push(`Poznamka: ${n}`));
        firmPreviewBody.innerHTML = parts.length ? parts.map(p => `<div>${p}</div>`).join('') : 'Ziadne detaily.';
        firmPreview.hidden = false;
        firmPreview.setAttribute('aria-hidden', 'false');
      }
    });
  }
  if (btnClosePanel) btnClosePanel.addEventListener('click', closePanel);
  if (btnCancelPanel) btnCancelPanel.addEventListener('click', closePanel);
  firmModal.addEventListener('click', (e) => {
    if (e.target.dataset && e.target.dataset.close === 'modal') closePanel();
  });
  if (btnClosePreview) btnClosePreview.addEventListener('click', closePreview);

  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const firmId = document.getElementById('newFirmId').value.trim() || 'nova-firma';
      const firmName = document.getElementById('newFirmName').value.trim() || firmId;
      const vz = document.getElementById('newFirmVz').value;
      const typ = document.getElementById('newFirmTyp').value.trim() || 'default';
      const firm = {
        firmId,
        firmName,
        vz,
        typ,
        notes: lines(document.getElementById('newNotes')),
        techNotes: lines(document.getElementById('newTechNotes')),
        dimensions: {
          W: numVal(document.getElementById('newFirmW')),
          L: numVal(document.getElementById('newFirmL')),
          G: numVal(document.getElementById('newFirmG')),
          K: numVal(document.getElementById('newFirmK')),
          notchLen: numVal(document.getElementById('newNotchLen')),
          Cpitch: numVal(document.getElementById('newFirmCpitch')),
          AxisInK: numVal(document.getElementById('newFirmAxisInK'))
        },
        clip: {
          count: numVal(document.getElementById('newClipCount')),
          offsetX: null,
          offsetY: null,
          packageCount: null,
          type: document.getElementById('newClipType').value.trim() || null
        },
        clipImages: [
          document.querySelector('input[name="clipImage"]:checked')?.value || ''
        ].filter(Boolean),
        air: {
          count: numVal(document.getElementById('newAirCount')),
          diameter: numVal(document.getElementById('newAirDiameter')),
          offsetFromEdge: numVal(document.getElementById('newAirOffsetEdge')),
          pitch: numVal(document.getElementById('newAirPitch'))
        },
      };
      upsertCustom(firm, editingKey || undefined);
      editingKey = null;
      closePanel();
    });
  }

  const exportFirms = () => {
    const blob = new Blob([JSON.stringify(state.firms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'firms-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (btnExport) {
    btnExport.addEventListener('click', exportFirms);
  }

  if (btnGo) {
    btnGo.addEventListener('click', () => {
      const basePath = () => {
        const p = window.location.pathname;
        return p.endsWith('/') ? p : p.replace(/\/[^/]*$/, '/');
      };
      const toUrl = (file) => window.location.origin + basePath() + file;
      const selected = radios.find(r => r.checked)?.value;
      const vz = getSelectedVz();
      const firmId = firmSelect.value;
      const typVal = typeSelect.value;
      const chosen = (state.firms || []).find(f => f.firmId === firmId && f.vz === vz && f.typ === typVal);
      if (chosen) {
        try {
          localStorage.setItem('selectedFirm', JSON.stringify(chosen));
        } catch (_) { /* ignore */ }
      } else {
        try { localStorage.removeItem('selectedFirm'); } catch (_) { /* ignore */ }
      }

      if (selected === 'folia') {
        window.location.href = toUrl('folia.html');
        return;
      }
      if (vz === 'vz31') {
        window.location.href = toUrl('vz31.html');
      } else if (vz === 'vz34') {
        window.location.href = toUrl('vz34.html');
      } else if (vz === 'vz22') {
        window.location.href = toUrl('vz22.html');
      } else {
        alert('Pre vybrany vzor zatial nie je preklik.');
      }
    });
  }

  if (btnExportModal) {
    btnExportModal.addEventListener('click', exportFirms);
  }

  if (btnDeleteFirm) {
    btnDeleteFirm.addEventListener('click', () => {
      if (!editingKey) {
        alert('Vyber firmu na upravu, potom ju mozes zmazat.');
        return;
      }
      const ok = window.confirm('Chces zmazat ulozenu firmu?');
      if (!ok) return;
      const before = state.custom.length;
      state.custom = state.custom.filter(f => firmKey(f) !== editingKey);
      if (before === state.custom.length) {
        state.deleted = Array.from(new Set([...(state.deleted || []), editingKey]));
        saveDeleted();
      } else {
        saveCustom();
      }
      rebuild();
      editingKey = null;
      closePanel();
    });
  }
init();
})();



