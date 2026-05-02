(() => {
  const firmSelect = document.getElementById('firmSelect');
  const typeSelect = document.getElementById('typeSelect');
  const vzSelect = document.getElementById('vzSelect');
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
  const currentVzLabel = document.getElementById('currentVz');
  const modalVzLabel = document.getElementById('modalVzLabel');
  const newFirmVz = document.getElementById('newFirmVz');

  if (!firmSelect || !typeSelect || !firmModal || !formAdd) return;

  const numVal = (el) => {
    if (!el) return null;
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

  const state = { firms: [], custom: [] };
  const LS_KEY = 'customFirms_v2';
  const LS_VZ = 'index2_vz';
  let baseFirms = [];
  let editingKey = null;

  const getVz = () => {
    const params = new URLSearchParams(window.location.search || '');
    const fromParam = (params.get('vz') || '').trim();
    const fromStorage = (localStorage.getItem(LS_VZ) || '').trim();
    const val = (fromParam || fromStorage || 'vz22').replace('vz-', 'vz');
    if (val === 'vz22_test') return 'vz22';
    return val;
  };
  let currentVz = getVz();
  if (currentVzLabel) currentVzLabel.textContent = currentVz;
  if (modalVzLabel) modalVzLabel.textContent = currentVz;
  if (newFirmVz) newFirmVz.value = currentVz;
  if (vzSelect) vzSelect.value = currentVz;
  try { localStorage.setItem(LS_VZ, currentVz); } catch (_) {}

  const normName = (v) => String(v || '').trim();
  const firmIdentity = (f) => normName(f.firmName || f.name || f.firmId);
  const firmKey = (f) => `${firmIdentity(f).toLowerCase()}__${f.vz || ''}__${f.typ || ''}`;

  const normalizeFirm = (f) => {
    if (!f) return null;
    const typVal = f.typ || f.zyp || 'default';
    const vzVal = (f.vz || '').toLowerCase().replace('vz-', 'vz');
    return {
      firmName: firmIdentity(f),
      vz: vzVal,
      typ: typVal,
      notes: f.notes || [],
      techNotes: f.techNotes || [],
      dimensions: {
        W: f.dimensions?.W ?? null,
        L: f.dimensions?.L ?? null,
        G: f.dimensions?.G ?? null,
        K: f.dimensions?.K ?? null,
        notchLen: f.dimensions?.notchLen ?? null,
        notchShiftEnabled: !!f.dimensions?.notchShiftEnabled,
        notchShift: f.dimensions?.notchShift ?? null,
        Cpitch: f.dimensions?.Cpitch ?? null,
        AxisInK: f.dimensions?.AxisInK ?? null
      },
      clip: f.clip || { count: null, offsetX: null, offsetY: null, packageCount: null, type: null },
      air: {
        count: f.air?.count ?? null,
        diameter: f.air?.diameter ?? null,
        offsetFromEdge: f.air?.offsetFromEdge ?? null,
        fromBottom: f.air?.fromBottom ?? f.air?.offsetFromBottom ?? null,
        pitch: f.air?.pitch ?? null,
        onlyInG: !!(f.air?.onlyInG ?? f.air?.inGOnly)
      },
      perforation: {
        enabled: f.perforation?.enabled || '',
        side: f.perforation?.side || '',
        shape: f.perforation?.shape || '',
        offset: f.perforation?.offset ?? null
      },
      clipImages: f.clipImages || []
    };
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

  const saveCustom = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state.custom));
    } catch (_) {
      /* ignore */
    }
  };

  const fetchBase = async () => {
    // User requested clean start: firm list must be empty.
    return [];
  };

  const renderFirmOptions = () => {
    const list = (state.firms || []).filter(f => f.vz === currentVz);
    const unique = [];
    const byId = new Set();
    list.forEach(f => {
      const id = firmIdentity(f);
      if (!id || byId.has(id)) return;
      if (!byId.has(id)) {
        byId.add(id);
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
      opt.value = firmIdentity(f);
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
    const firmName = firmSelect.value;
    typeSelect.innerHTML = '';
    if (!firmName) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Bez variantu';
      opt.selected = true;
      typeSelect.appendChild(opt);
      return;
    }
    const items = (state.firms || []).filter(f => f.vz === currentVz && firmIdentity(f) === firmName);
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
    if (modalVzLabel) modalVzLabel.textContent = currentVz;
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
    if (newFirmVz) newFirmVz.value = currentVz;
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
      if (f && firmIdentity(f) && f.vz && f.typ) {
        map.set(firmKey(f), f);
      }
    });
    return Array.from(map.values());
  };

  const rebuild = () => {
    state.firms = mergeFirms([...(baseFirms || []), ...(state.custom || [])]);
    renderFirmOptions();
  };

  const upsertCustom = (firm, replaceKey) => {
    const targetKey = replaceKey || firmKey(firm);
    state.custom = (state.custom || []).filter(f => firmKey(f) !== targetKey);
    state.custom.push(firm);
    saveCustom();
    rebuild();
  };

  const init = async () => {
    state.custom = loadCustom();
    baseFirms = await fetchBase();
    rebuild();
  };

  firmSelect.addEventListener('change', renderTypeOptions);
  if (vzSelect) {
    vzSelect.addEventListener('change', () => {
      currentVz = vzSelect.value;
      if (currentVzLabel) currentVzLabel.textContent = currentVz;
      if (modalVzLabel) modalVzLabel.textContent = currentVz;
      if (newFirmVz) newFirmVz.value = currentVz;
      try { localStorage.setItem(LS_VZ, currentVz); } catch (_) {}
      renderFirmOptions();
    });
  }

  if (btnAddFirm) btnAddFirm.addEventListener('click', () => {
    editingKey = null;
    formAdd.reset();
    if (newFirmVz) newFirmVz.value = currentVz;
    openPanel();
  });

  const fillForm = (found) => {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    };
    formAdd.reset();
    setVal('newFirmName', found.firmName);
    setVal('newFirmVz', found.vz);
    setVal('newFirmTyp', found.typ);
    setVal('newFirmW', found.dimensions?.W);
    setVal('newFirmL', found.dimensions?.L);
    setVal('newFirmG', found.dimensions?.G);
    setVal('newFirmK', found.dimensions?.K);
    setVal('newNotchLen', found.dimensions?.notchLen);
    setVal('newNotchShift', found.dimensions?.notchShift);
    const notchShiftEnabledEl = document.getElementById('newNotchShiftEnabled');
    if (notchShiftEnabledEl) notchShiftEnabledEl.checked = !!found.dimensions?.notchShiftEnabled;
    setVal('newFirmCpitch', found.dimensions?.Cpitch);
    setVal('newFirmAxisInK', found.dimensions?.AxisInK);
    setVal('newPerfEnabled', found.perforation?.enabled);
    setVal('newPerfSide', found.perforation?.side);
    setVal('newPerfShape', found.perforation?.shape);
    setVal('newPerfOffset', found.perforation?.offset);
    setVal('newAirCount', found.air?.count);
    setVal('newAirDiameter', found.air?.diameter);
    setVal('newAirOffsetEdge', found.air?.offsetFromEdge);
    setVal('newAirFromBottom', found.air?.fromBottom ?? found.air?.offsetFromBottom);
    setVal('newAirPitch', found.vz === 'vz22' ? '' : found.air?.pitch);
    const airOnlyInG = document.getElementById('newAirOnlyInG');
    if (airOnlyInG) airOnlyInG.checked = !!(found.air?.onlyInG ?? found.air?.inGOnly);
    const imgVal = found.clipImages?.[0] || '';
    const radio = document.querySelector(`input[name="clipImage"][value="${imgVal}"]`);
    const radioNone = document.getElementById('clipImgNone');
    if (radio) radio.checked = true;
    else if (radioNone) radioNone.checked = true;
    document.getElementById('newNotes').value = (found.notes || []).join('\n');
    document.getElementById('newTechNotes').value = (found.techNotes || []).join('\n');
  };

  if (btnEditFirm) {
    btnEditFirm.addEventListener('click', () => {
      const firmName = firmSelect.value;
      const typVal = typeSelect.value;
      if (!firmName || !typVal) {
        alert('Vyber firmu a specifikaciu, potom mozes upravit.');
        return;
      }
      const found = (state.firms || []).find(f => firmIdentity(f) === firmName && f.vz === currentVz && f.typ === typVal);
      if (!found) {
        alert('Zaznam sa nenasiel pre zvolenu firmu/specifikaciu.');
        return;
      }
      fillForm(found);
      editingKey = firmKey(found);
      openPanel();
    });
  }

  if (btnViewFirm) {
    btnViewFirm.addEventListener('click', () => {
      const firmName = firmSelect.value;
      const typVal = typeSelect.value;
      if (!firmName || !typVal) {
        alert('Vyber firmu a specifikaciu.');
        return;
      }
      const found = (state.firms || []).find(f => firmIdentity(f) === firmName && f.vz === currentVz && f.typ === typVal);
      if (!found) {
        alert('Zaznam sa nenasiel pre zvolenu firmu/specifikaciu.');
        return;
      }
      if (firmPreview && firmPreviewMeta && firmPreviewBody) {
        firmPreviewMeta.textContent = `${found.firmName || firmName} (${currentVz} / ${typVal})`;
        const parts = [];
        const dims = found.dimensions || {};
        const clip = found.clip || {};
        const air = found.air || {};
        const perf = found.perforation || {};
        if (dims.W || dims.L || dims.G || dims.K) {
          parts.push(`Rozmery W/L/G/K: ${dims.W ?? '-'} / ${dims.L ?? '-'} / ${dims.G ?? '-'} / ${dims.K ?? '-'}`);
        }
        if (dims.notchLen) parts.push(`Dlzka zaseku v K: ${dims.notchLen}`);
        if (dims.notchShiftEnabled) parts.push(`Posun zasekov: ${dims.notchShift ?? 0}`);
        if (dims.Cpitch || dims.AxisInK) parts.push(`C-roztec / Os C: ${dims.Cpitch ?? '-'} / ${dims.AxisInK ?? '-'}`);
        if (clip.count || clip.type) parts.push(`Spony: ${clip.count ?? '-'} ks, typ ${clip.type ?? '-'}`);
        if (air.count || air.diameter || air.offsetFromEdge || air.fromBottom || air.pitch || air.onlyInG) {
          const pitchText = currentVz === 'vz22' ? '-' : (air.pitch ?? '-');
          parts.push(`Vzduch. otvory: ks ${air.count ?? '-'}, typ otvoru ${air.diameter ?? '-'}, od okraja ${air.offsetFromEdge ?? '-'}, od zalozky ${air.fromBottom ?? '-'}, roztec ${pitchText}, len v zalozke ${air.onlyInG ? 'ano' : 'nie'}`);
        }
        if (perf.enabled || perf.side || perf.shape || perf.offset !== null) {
          const perfEnabledText = perf.enabled === 'yes' ? 'ano' : perf.enabled === 'no' ? 'nie' : '-';
          parts.push(`Perforacia: ${perfEnabledText}, tvar ${perf.shape || '-'}, strana ${perf.side || '-'}, vzdialenost od stredu ${perf.offset ?? '-'}`);
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
      const firmName = document.getElementById('newFirmName').value.trim() || 'nova firma';
      const typ = document.getElementById('newFirmTyp').value.trim() || 'default';
      const prev = editingKey ? (state.firms || []).find(f => firmKey(f) === editingKey) : null;
      const prevDims = prev?.dimensions || {};
      const prevClip = prev?.clip || {};
      const prevAir = prev?.air || {};
      const prevPerf = prev?.perforation || {};
      const firm = {
        firmName,
        firmId: firmName, // backward compatibility for older tools/data
        vz: currentVz,
        typ,
        notes: lines(document.getElementById('newNotes')),
        techNotes: lines(document.getElementById('newTechNotes')),
        dimensions: {
          W: prevDims.W ?? null,
          L: prevDims.L ?? null,
          G: prevDims.G ?? null,
          K: numVal(document.getElementById('newFirmK')) ?? prevDims.K ?? null,
          notchLen: numVal(document.getElementById('newNotchLen')) ?? prevDims.notchLen ?? null,
          notchShiftEnabled: !!document.getElementById('newNotchShiftEnabled')?.checked,
          notchShift: numVal(document.getElementById('newNotchShift')) ?? prevDims.notchShift ?? null,
          Cpitch: numVal(document.getElementById('newFirmCpitch')) ?? prevDims.Cpitch ?? null,
          AxisInK: numVal(document.getElementById('newFirmAxisInK')) ?? prevDims.AxisInK ?? null
        },
        clip: {
          count: prevClip.count ?? null,
          offsetX: prevClip.offsetX ?? null,
          offsetY: prevClip.offsetY ?? null,
          packageCount: prevClip.packageCount ?? null,
          type: prevClip.type ?? null
        },
        clipImages: [
          document.querySelector('input[name="clipImage"]:checked')?.value || ''
        ].filter(Boolean),
        air: {
          count: numVal(document.getElementById('newAirCount')) ?? prevAir.count ?? null,
          diameter: (() => {
            const v = (document.getElementById('newAirDiameter')?.value || '').trim();
            return v !== '' ? v : (prevAir.diameter ?? null);
          })(),
          offsetFromEdge: numVal(document.getElementById('newAirOffsetEdge')) ?? prevAir.offsetFromEdge ?? null,
          fromBottom: numVal(document.getElementById('newAirFromBottom')) ?? prevAir.fromBottom ?? prevAir.offsetFromBottom ?? null,
          pitch: currentVz === 'vz22' ? null : (numVal(document.getElementById('newAirPitch')) ?? prevAir.pitch ?? null),
          onlyInG: !!(document.getElementById('newAirOnlyInG')?.checked || prevAir.onlyInG || prevAir.inGOnly)
        },
        perforation: {
          enabled: (document.getElementById('newPerfEnabled')?.value || '').trim() || prevPerf.enabled || '',
          side: (document.getElementById('newPerfSide')?.value || '').trim() || prevPerf.side || '',
          shape: (document.getElementById('newPerfShape')?.value || '').trim() || prevPerf.shape || '',
          offset: numVal(document.getElementById('newPerfOffset')) ?? prevPerf.offset ?? null
        },
      };
      upsertCustom(firm, editingKey || undefined);
      editingKey = null;
      closePanel();
    });
  }

  const exportFirms = () => {
    const stamp = new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
    const blob = new Blob([JSON.stringify(state.firms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firms_${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (btnExport) {
    btnExport.addEventListener('click', exportFirms);
  }

  if (btnGo) {
    btnGo.addEventListener('click', () => {
      const appRoot = new URL('../../', window.location.href);
      const toUrl = (file) => new URL(file, appRoot).href;
      const firmName = firmSelect.value;
      const typVal = typeSelect.value;
      const chosen = (state.firms || []).find(f => firmIdentity(f) === firmName && f.vz === currentVz && f.typ === typVal);
      if (chosen) {
        try {
          localStorage.setItem('selectedFirm', JSON.stringify(chosen));
          localStorage.setItem('prefill_source', 'firm');
        } catch (_) { /* ignore */ }
      } else {
        try {
          localStorage.removeItem('selectedFirm');
          localStorage.removeItem('prefill_source');
        } catch (_) { /* ignore */ }
      }

      if (window.opener && !window.opener.closed) {
        window.close();
        return;
      }
      if (currentVz === 'vz31') {
        window.location.href = toUrl('../../patterns/vz31/index.html');
      } else if (currentVz === 'vz34') {
        window.location.href = toUrl('../../patterns/vz34/index.html');
      } else if (currentVz === 'vz22') {
        window.location.href = toUrl('patterns/vz22/index.html');
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
        alert('Zakladnu firmu z firms.json nie je mozne zmazat.');
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
