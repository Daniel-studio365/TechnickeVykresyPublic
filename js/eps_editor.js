/* EPS editor for creating test payloads */
(function(){
  const $ = (id)=>document.getElementById(id);
  const fieldsWrap = $('fields');
  const preview = $('jsonPreview');
  const tmplSel = $('targetTemplate');

  function syncDuplicateInputs(sourceInput){
    const key = sourceInput && sourceInput.getAttribute('data-key');
    if (!key) return;
    const value = sourceInput.value;
    fieldsWrap.querySelectorAll(`input[data-key="${key}"]`).forEach((inp)=>{
      if (inp !== sourceInput) inp.value = value;
    });
  }

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
    const topFormKeys = new Set([
      'order_serial','ref_code_a','ref_code_b',
      'order_notes',
      'dim_bag_width','dim_L','dim_G','dim_K','dim_SEK',
      'seg_bzp','perf_enabled','air_enabled','hole_pitch_C','air_count',
      'easy_open',
      'side_handle','photo_note','photo_width','photo_height',
      'roll_final_code','roll_final_variant',
      'print_side_bottom','print_side_top','print_ops',
      'lacquer_next_yes','lacquer_next_no'
    ]);
    // Riadky sa budu pridavat v poradi podla papieroveho tlaciva.
    // Zaciatok: Poradove cislo vyrobku -> order_serial.
    const formGroup = document.createElement('div');
    formGroup.className = 'group';
    const formTitle = document.createElement('div');
    formTitle.className = 'group-title';
    formTitle.textContent = 'Formular (podla tlaciva)';
    formGroup.appendChild(formTitle);

    const formLabel0 = document.createElement('label');
    const formSpan0 = document.createElement('span');
    formSpan0.textContent = 'Motiv';
    formLabel0.appendChild(formSpan0);
    const formInp0 = document.createElement('input');
    formInp0.type = 'text';
    formInp0.setAttribute('data-key', 'order_notes');
    formInp0.placeholder = 'Motiv';
    formInp0.addEventListener('input', updatePreview);
    formLabel0.appendChild(formInp0);
    const formMap0 = document.createElement('span');
    formMap0.className = 'kv';
    formMap0.style.flex = '1 1 auto';
    formMap0.style.maxWidth = 'none';
    formMap0.textContent = 'order_notes - Motiv / Ostatne poznamky';
    formLabel0.appendChild(formMap0);
    formGroup.appendChild(formLabel0);

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
    formSpan4.textContent = 'Sirka (pozadovana sirka vrecka)';
    formLabel4.appendChild(formSpan4);
    const formInp4 = document.createElement('input');
    formInp4.type = 'text';
    formInp4.setAttribute('data-key', 'dim_bag_width');
    formInp4.placeholder = 'Sirka (pozadovana sirka vrecka)';
    formInp4.addEventListener('input', updatePreview);
    formLabel4.appendChild(formInp4);
    const formMap4 = document.createElement('span');
    formMap4.className = 'kv';
    formMap4.style.flex = '1 1 auto';
    formMap4.style.maxWidth = 'none';
    formMap4.textContent = 'dim_bag_width - Pozadovana sirka vrecka';
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

    const formLabel9 = document.createElement('label');
    const formSpan9 = document.createElement('span');
    formSpan9.textContent = 'dutinka';
    formLabel9.appendChild(formSpan9);
    const formInp9 = document.createElement('input');
    formInp9.type = 'text';
    formInp9.placeholder = '';
    formLabel9.appendChild(formInp9);
    const formMap9 = document.createElement('span');
    formMap9.className = 'kv';
    formMap9.style.flex = '1 1 auto';
    formMap9.style.maxWidth = 'none';
    formMap9.textContent = '';
    formLabel9.appendChild(formMap9);
    formGroup.appendChild(formLabel9);

    const formLabel10 = document.createElement('label');
    const formSpan10 = document.createElement('span');
    formSpan10.textContent = 'Spodna zalozka';
    formLabel10.appendChild(formSpan10);
    const formInp10 = document.createElement('input');
    formInp10.type = 'text';
    formInp10.setAttribute('data-key', 'dim_G');
    formInp10.placeholder = 'Spodna zalozka';
    formInp10.addEventListener('input', updatePreview);
    formLabel10.appendChild(formInp10);
    const formMap10 = document.createElement('span');
    formMap10.className = 'kv';
    formMap10.style.flex = '1 1 auto';
    formMap10.style.maxWidth = 'none';
    formMap10.textContent = 'dim_G - Spodna zalozka';
    formLabel10.appendChild(formMap10);
    formGroup.appendChild(formLabel10);

    const formLabel11 = document.createElement('label');
    const formSpan11 = document.createElement('span');
    formSpan11.textContent = 'vrchna zalozka';
    formLabel11.appendChild(formSpan11);
    const formInp11 = document.createElement('input');
    formInp11.type = 'text';
    formInp11.placeholder = '';
    formLabel11.appendChild(formInp11);
    const formMap11 = document.createElement('span');
    formMap11.className = 'kv';
    formMap11.style.flex = '1 1 auto';
    formMap11.style.maxWidth = 'none';
    formMap11.textContent = '';
    formLabel11.appendChild(formMap11);
    formGroup.appendChild(formLabel11);

    const formLabel12 = document.createElement('label');
    const formSpan12 = document.createElement('span');
    formSpan12.textContent = 'Chlopna';
    formLabel12.appendChild(formSpan12);
    const formInp12 = document.createElement('input');
    formInp12.type = 'text';
    formInp12.setAttribute('data-key', 'dim_K');
    formInp12.placeholder = 'Chlopna';
    formInp12.addEventListener('input', updatePreview);
    formLabel12.appendChild(formInp12);
    const formMap12 = document.createElement('span');
    formMap12.className = 'kv';
    formMap12.style.flex = '1 1 auto';
    formMap12.style.maxWidth = 'none';
    formMap12.textContent = 'dim_K - Chlopna';
    formLabel12.appendChild(formMap12);
    formGroup.appendChild(formLabel12);

    const formLabel13 = document.createElement('label');
    const formSpan13 = document.createElement('span');
    formSpan13.textContent = 'Farba rucky';
    formLabel13.appendChild(formSpan13);
    const formInp13 = document.createElement('input');
    formInp13.type = 'text';
    formInp13.placeholder = '';
    formLabel13.appendChild(formInp13);
    const formMap13 = document.createElement('span');
    formMap13.className = 'kv';
    formMap13.style.flex = '1 1 auto';
    formMap13.style.maxWidth = 'none';
    formMap13.textContent = '';
    formLabel13.appendChild(formMap13);
    formGroup.appendChild(formLabel13);

    const formLabel14 = document.createElement('label');
    const formSpan14 = document.createElement('span');
    formSpan14.textContent = 'Farba tasky';
    formLabel14.appendChild(formSpan14);
    const formInp14 = document.createElement('input');
    formInp14.type = 'text';
    formInp14.placeholder = '';
    formLabel14.appendChild(formInp14);
    const formMap14 = document.createElement('span');
    formMap14.className = 'kv';
    formMap14.style.flex = '1 1 auto';
    formMap14.style.maxWidth = 'none';
    formMap14.textContent = '';
    formLabel14.appendChild(formMap14);
    formGroup.appendChild(formLabel14);

    const formLabel15 = document.createElement('label');
    const formSpan15 = document.createElement('span');
    formSpan15.textContent = 'Perforacia dna';
    formLabel15.appendChild(formSpan15);
    const formInp15 = document.createElement('input');
    formInp15.type = 'text';
    formInp15.setAttribute('data-key', 'perf_enabled');
    formInp15.placeholder = 'Perforacia dna';
    formInp15.addEventListener('input', updatePreview);
    formLabel15.appendChild(formInp15);
    const formMap15 = document.createElement('span');
    formMap15.className = 'kv';
    formMap15.style.flex = '1 1 auto';
    formMap15.style.maxWidth = 'none';
    formMap15.textContent = 'perf_enabled - Perforacia (ano/nie)';
    formLabel15.appendChild(formMap15);
    formGroup.appendChild(formLabel15);

    const formLabel16 = document.createElement('label');
    const formSpan16 = document.createElement('span');
    formSpan16.textContent = 'vzduchove otvory';
    formLabel16.appendChild(formSpan16);
    const formInp16 = document.createElement('input');
    formInp16.type = 'text';
    formInp16.setAttribute('data-key', 'air_enabled');
    formInp16.placeholder = 'vzduchove otvory';
    formInp16.addEventListener('input', updatePreview);
    formLabel16.appendChild(formInp16);
    const formMap16 = document.createElement('span');
    formMap16.className = 'kv';
    formMap16.style.flex = '1 1 auto';
    formMap16.style.maxWidth = 'none';
    formMap16.textContent = 'air_enabled - Vzduchove otvory (ano/nie)';
    formLabel16.appendChild(formMap16);
    formGroup.appendChild(formLabel16);

    const formLabel17 = document.createElement('label');
    const formSpan17 = document.createElement('span');
    formSpan17.textContent = 'vzdialonost otvoro zaves';
    formLabel17.appendChild(formSpan17);
    const formInp17 = document.createElement('input');
    formInp17.type = 'text';
    formInp17.setAttribute('data-key', 'hole_pitch_C');
    formInp17.placeholder = 'vzdialonost otvoro zaves';
    formInp17.addEventListener('input', updatePreview);
    formLabel17.appendChild(formInp17);
    const formMap17 = document.createElement('span');
    formMap17.className = 'kv';
    formMap17.style.flex = '1 1 auto';
    formMap17.style.maxWidth = 'none';
    formMap17.textContent = 'hole_pitch_C - Vzdialenost zavesnych otvorov';
    formLabel17.appendChild(formMap17);
    formGroup.appendChild(formLabel17);

    const formLabel18 = document.createElement('label');
    const formSpan18 = document.createElement('span');
    formSpan18.textContent = 'sterilizacia';
    formLabel18.appendChild(formSpan18);
    const formInp18 = document.createElement('input');
    formInp18.type = 'text';
    formInp18.placeholder = '';
    formLabel18.appendChild(formInp18);
    const formMap18 = document.createElement('span');
    formMap18.className = 'kv';
    formMap18.style.flex = '1 1 auto';
    formMap18.style.maxWidth = 'none';
    formMap18.textContent = '';
    formLabel18.appendChild(formMap18);
    formGroup.appendChild(formLabel18);

    const formLabel19 = document.createElement('label');
    const formSpan19 = document.createElement('span');
    formSpan19.textContent = 'Typ pl zvar';
    formLabel19.appendChild(formSpan19);
    const formInp19 = document.createElement('input');
    formInp19.type = 'text';
    formInp19.placeholder = '';
    formLabel19.appendChild(formInp19);
    const formMap19 = document.createElement('span');
    formMap19.className = 'kv';
    formMap19.style.flex = '1 1 auto';
    formMap19.style.maxWidth = 'none';
    formMap19.textContent = '';
    formLabel19.appendChild(formMap19);
    formGroup.appendChild(formLabel19);

    const formLabel20 = document.createElement('label');
    const formSpan20 = document.createElement('span');
    formSpan20.textContent = 'Typ chlopna';
    formLabel20.appendChild(formSpan20);
    const formInp20 = document.createElement('input');
    formInp20.type = 'text';
    formInp20.placeholder = '';
    formLabel20.appendChild(formInp20);
    const formMap20 = document.createElement('span');
    formMap20.className = 'kv';
    formMap20.style.flex = '1 1 auto';
    formMap20.style.maxWidth = 'none';
    formMap20.textContent = '';
    formLabel20.appendChild(formMap20);
    formGroup.appendChild(formLabel20);

    const formLabel21 = document.createElement('label');
    const formSpan21 = document.createElement('span');
    formSpan21.textContent = 'Easy open';
    formLabel21.appendChild(formSpan21);
    const formInp21 = document.createElement('input');
    formInp21.type = 'text';
    formInp21.setAttribute('data-key', 'easy_open');
    formInp21.placeholder = 'P/L';
    formInp21.addEventListener('input', updatePreview);
    formLabel21.appendChild(formInp21);
    const formMap21 = document.createElement('span');
    formMap21.className = 'kv';
    formMap21.style.flex = '1 1 auto';
    formMap21.style.maxWidth = 'none';
    formMap21.textContent = 'easy_open - Easy open (P/L/prazdne)';
    formLabel21.appendChild(formMap21);
    formGroup.appendChild(formLabel21);

    const formLabel22 = document.createElement('label');
    const formSpan22 = document.createElement('span');
    formSpan22.textContent = 'Vzduchove otvory pocet';
    formLabel22.appendChild(formSpan22);
    const formInp22 = document.createElement('input');
    formInp22.type = 'text';
    formInp22.setAttribute('data-key', 'air_count');
    formInp22.placeholder = 'Vzduchove otvory pocet';
    formInp22.addEventListener('input', updatePreview);
    formLabel22.appendChild(formInp22);
    const formMap22 = document.createElement('span');
    formMap22.className = 'kv';
    formMap22.style.flex = '1 1 auto';
    formMap22.style.maxWidth = 'none';
    formMap22.textContent = 'air_count - VzduchOtvPocet';
    formLabel22.appendChild(formMap22);
    formGroup.appendChild(formLabel22);

    const formLabel23 = document.createElement('label');
    const formSpan23 = document.createElement('span');
    formSpan23.textContent = 'Rucka';
    formLabel23.appendChild(formSpan23);
    const formInp23 = document.createElement('input');
    formInp23.type = 'text';
    formInp23.id = 'formRucka';
    formInp23.placeholder = '';
    formInp23.addEventListener('input', updatePreview);
    formLabel23.appendChild(formInp23);
    const formMap23 = document.createElement('span');
    formMap23.className = 'kv';
    formMap23.style.flex = '1 1 auto';
    formMap23.style.maxWidth = 'none';
    formMap23.textContent = '';
    formLabel23.appendChild(formMap23);
    formGroup.appendChild(formLabel23);

    const formLabel24 = document.createElement('label');
    const formSpan24 = document.createElement('span');
    formSpan24.textContent = 'Bocna rucka';
    formLabel24.appendChild(formSpan24);
    const formInp24 = document.createElement('input');
    formInp24.type = 'text';
    formInp24.setAttribute('data-key', 'side_handle');
    formInp24.placeholder = 'Bocna rucka';
    formInp24.addEventListener('input', updatePreview);
    formLabel24.appendChild(formInp24);
    const formMap24 = document.createElement('span');
    formMap24.className = 'kv';
    formMap24.style.flex = '1 1 auto';
    formMap24.style.maxWidth = 'none';
    formMap24.textContent = 'side_handle - Bocna rucka';
    formLabel24.appendChild(formMap24);
    formGroup.appendChild(formLabel24);

    const formLabel25 = document.createElement('label');
    const formSpan25 = document.createElement('span');
    formSpan25.textContent = 'Dlzka bocna rucky';
    formLabel25.appendChild(formSpan25);
    const formInp25 = document.createElement('input');
    formInp25.type = 'text';
    formInp25.placeholder = '';
    formLabel25.appendChild(formInp25);
    const formMap25 = document.createElement('span');
    formMap25.className = 'kv';
    formMap25.style.flex = '1 1 auto';
    formMap25.style.maxWidth = 'none';
    formMap25.textContent = '';
    formLabel25.appendChild(formMap25);
    formGroup.appendChild(formLabel25);

    const formLabel26 = document.createElement('label');
    const formSpan26 = document.createElement('span');
    formSpan26.textContent = 'fotobunka';
    formLabel26.appendChild(formSpan26);
    const formInp26 = document.createElement('input');
    formInp26.type = 'text';
    formInp26.setAttribute('data-key', 'photo_note');
    formInp26.placeholder = 'fotobunka';
    formInp26.addEventListener('input', updatePreview);
    formLabel26.appendChild(formInp26);
    const formMap26 = document.createElement('span');
    formMap26.className = 'kv';
    formMap26.style.flex = '1 1 auto';
    formMap26.style.maxWidth = 'none';
    formMap26.textContent = 'photo_note - Poznamka pod vykresom';
    formLabel26.appendChild(formMap26);
    formGroup.appendChild(formLabel26);

    const formLabel27 = document.createElement('label');
    const formSpan27 = document.createElement('span');
    formSpan27.textContent = 'rozmer fotoznaku';
    formLabel27.appendChild(formSpan27);
    const formInp27 = document.createElement('input');
    formInp27.type = 'text';
    formInp27.setAttribute('data-key', 'photo_width');
    formInp27.placeholder = 'sirka';
    formInp27.addEventListener('input', updatePreview);
    formLabel27.appendChild(formInp27);
    const formMap27 = document.createElement('span');
    formMap27.className = 'kv';
    formMap27.style.flex = '1 1 auto';
    formMap27.style.maxWidth = 'none';
    formMap27.textContent = 'photo_width - Sirka fotoznaku';
    formLabel27.appendChild(formMap27);
    formGroup.appendChild(formLabel27);

    const formLabel28 = document.createElement('label');
    const formSpan28 = document.createElement('span');
    formSpan28.textContent = 'rozmer fotoznaku (vyska)';
    formLabel28.appendChild(formSpan28);
    const formInp28 = document.createElement('input');
    formInp28.type = 'text';
    formInp28.setAttribute('data-key', 'photo_height');
    formInp28.placeholder = 'vyska';
    formInp28.addEventListener('input', updatePreview);
    formLabel28.appendChild(formInp28);
    const formMap28 = document.createElement('span');
    formMap28.className = 'kv';
    formMap28.style.flex = '1 1 auto';
    formMap28.style.maxWidth = 'none';
    formMap28.textContent = 'photo_height - Vyska fotoznaku';
    formLabel28.appendChild(formMap28);
    formGroup.appendChild(formLabel28);

    const formLabel29 = document.createElement('label');
    const formSpan29 = document.createElement('span');
    formSpan29.textContent = 'Finalny navin';
    formLabel29.appendChild(formSpan29);
    const formInp29 = document.createElement('input');
    formInp29.type = 'text';
    formInp29.setAttribute('data-key', 'roll_final_code');
    formInp29.placeholder = 'Finalny navin';
    formInp29.addEventListener('input', updatePreview);
    formLabel29.appendChild(formInp29);
    const formMap29 = document.createElement('span');
    formMap29.className = 'kv';
    formMap29.style.flex = '1 1 auto';
    formMap29.style.maxWidth = 'none';
    formMap29.textContent = 'roll_final_code - Finalny navin - cislo';
    formLabel29.appendChild(formMap29);
    formGroup.appendChild(formLabel29);

    const formLabel30 = document.createElement('label');
    const formSpan30 = document.createElement('span');
    formSpan30.textContent = 'variant';
    formLabel30.appendChild(formSpan30);
    const formInp30 = document.createElement('input');
    formInp30.type = 'text';
    formInp30.setAttribute('data-key', 'roll_final_variant');
    formInp30.placeholder = 'variant';
    formInp30.addEventListener('input', updatePreview);
    formLabel30.appendChild(formInp30);
    const formMap30 = document.createElement('span');
    formMap30.className = 'kv';
    formMap30.style.flex = '1 1 auto';
    formMap30.style.maxWidth = 'none';
    formMap30.textContent = 'roll_final_variant - Finalny navin - varianta';
    formLabel30.appendChild(formMap30);
    formGroup.appendChild(formLabel30);

    const formLabel31 = document.createElement('label');
    const formSpan31 = document.createElement('span');
    formSpan31.textContent = 'Sposob tlace - spodna';
    formLabel31.appendChild(formSpan31);
    const formInp31 = document.createElement('input');
    formInp31.type = 'text';
    formInp31.setAttribute('data-key', 'print_side_bottom');
    formInp31.placeholder = 'Sposob tlace = spodna';
    formInp31.addEventListener('input', updatePreview);
    formLabel31.appendChild(formInp31);
    const formMap31 = document.createElement('span');
    formMap31.className = 'kv';
    formMap31.style.flex = '1 1 auto';
    formMap31.style.maxWidth = 'none';
    formMap31.textContent = 'print_side_bottom - Sposob tlace = spodna';
    formLabel31.appendChild(formMap31);
    formGroup.appendChild(formLabel31);

    const formLabel32 = document.createElement('label');
    const formSpan32 = document.createElement('span');
    formSpan32.textContent = 'Sposob tlace - vrchna';
    formLabel32.appendChild(formSpan32);
    const formInp32 = document.createElement('input');
    formInp32.type = 'text';
    formInp32.setAttribute('data-key', 'print_side_top');
    formInp32.placeholder = 'Sposob tlace = vrchna';
    formInp32.addEventListener('input', updatePreview);
    formLabel32.appendChild(formInp32);
    const formMap32 = document.createElement('span');
    formMap32.className = 'kv';
    formMap32.style.flex = '1 1 auto';
    formMap32.style.maxWidth = 'none';
    formMap32.textContent = 'print_side_top - Sposob tlace = vrchna';
    formLabel32.appendChild(formMap32);
    formGroup.appendChild(formLabel32);

    const formLabel33 = document.createElement('label');
    const formSpan33 = document.createElement('span');
    formSpan33.textContent = 'Pocet operacii';
    formLabel33.appendChild(formSpan33);
    const formInp33 = document.createElement('input');
    formInp33.type = 'text';
    formInp33.setAttribute('data-key', 'print_ops');
    formInp33.placeholder = 'Pocet operacii tlace';
    formInp33.addEventListener('input', updatePreview);
    formLabel33.appendChild(formInp33);
    const formMap33 = document.createElement('span');
    formMap33.className = 'kv';
    formMap33.style.flex = '1 1 auto';
    formMap33.style.maxWidth = 'none';
    formMap33.textContent = 'print_ops - Pocet operacii tlace';
    formLabel33.appendChild(formMap33);
    formGroup.appendChild(formLabel33);

    const formLabel34 = document.createElement('label');
    const formSpan34 = document.createElement('span');
    formSpan34.textContent = 'Lak v dalsom kroku - ano';
    formLabel34.appendChild(formSpan34);
    const formInp34 = document.createElement('input');
    formInp34.type = 'text';
    formInp34.setAttribute('data-key', 'lacquer_next_yes');
    formInp34.placeholder = 'Lak v dalsom kroku = ano';
    formInp34.addEventListener('input', updatePreview);
    formLabel34.appendChild(formInp34);
    const formMap34 = document.createElement('span');
    formMap34.className = 'kv';
    formMap34.style.flex = '1 1 auto';
    formMap34.style.maxWidth = 'none';
    formMap34.textContent = 'lacquer_next_yes - Lak v dalsom kroku = ano';
    formLabel34.appendChild(formMap34);
    formGroup.appendChild(formLabel34);

    const formLabel35 = document.createElement('label');
    const formSpan35 = document.createElement('span');
    formSpan35.textContent = 'Lak v dalsom kroku - nie';
    formLabel35.appendChild(formSpan35);
    const formInp35 = document.createElement('input');
    formInp35.type = 'text';
    formInp35.setAttribute('data-key', 'lacquer_next_no');
    formInp35.placeholder = 'Lak v dalsom kroku = nie';
    formInp35.addEventListener('input', updatePreview);
    formLabel35.appendChild(formInp35);
    const formMap35 = document.createElement('span');
    formMap35.className = 'kv';
    formMap35.style.flex = '1 1 auto';
    formMap35.style.maxWidth = 'none';
    formMap35.textContent = 'lacquer_next_no - Lak v dalsom kroku = nie';
    formLabel35.appendChild(formMap35);
    formGroup.appendChild(formLabel35);

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
        const isDup = topFormKeys.has(it.key);
        span.textContent = it.desc ? `${it.key} - ${it.desc}` : `${it.key}`;
        if (isDup){
          span.textContent += ' [DUPLIKAT HORE]';
          span.style.color = '#b45309';
          span.style.fontWeight = '700';
        }
        lab.appendChild(span);
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.setAttribute('data-key', it.key);
        inp.placeholder = it.desc || '';
        if (isDup){
          inp.style.borderColor = '#f59e0b';
          inp.style.background = '#fffbeb';
          inp.title = 'Tato premenna je uz v hornej casti formulara.';
        }
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
      if (k === 'easy_open') {
        values[k] = v;
        return;
      }
      if (v !== '') values[k] = v;
    });
    // Specialita pre vz31: v papierovom formulari je G vedene ako "Rucka".
    if ((tmplSel?.value || '') === 'vz31'){
      const rucka = $('formRucka');
      if (rucka && rucka.value !== '') values.dim_G = rucka.value;
    }
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

  // Pri duplicitnych canonical key poliach drzi vsetky hodnoty rovnake.
  fieldsWrap.addEventListener('input', (e)=>{
    const inp = e.target && e.target.closest ? e.target.closest('input[data-key]') : null;
    if (!inp) return;
    syncDuplicateInputs(inp);
    updatePreview();
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
