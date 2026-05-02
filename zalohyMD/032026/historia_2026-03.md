HISTORIA
2026-03-01 21:30 - PRACA
Folia - kotovanie pri tlaci/navine: upravena logika, aby pri "spodna tlac" + navin pri tlaci kótovanie nasledovalo transformacie vykresu (zrkadlenie/rotacia). Delenie sirky sa pri tomto mode kresli v opacnom poradi, zvisle koty sa prehadzuju lava/pravá strana. Pri 180° rotacii vykresu je doplnena korekcia orientacie textov kot, aby neboli dole hlavou.
EPS editor/vz31: pridana specialna logika pre testy - pri target_template = vz31 sa hodnota z riadku "Rucka" zapisuje do canonical key dim_G (spodna zalozka). Mapovanie v eps_map sa nemenilo.
EPS editor + EPS import (vz22): upresneny popis air_count na "VzduchOtvPocet". Doplnena podmienka: ak air_count = 2, pri importe do vz22 sa automaticky zapne AirInGOnly (Vzduchove otvory len v zalozke).
Vz22/Vz31/Vz34 (+ vz22_test): opravene zobrazenie desatinnych hodnot pre "Pozadovana sirka vrecka". V textoch kot sa pouziva format s desatinou (fmtVal), nie Math.round. Input BagWidth ma step=0.1.
Riadiaca podmienka pre dalsie vzory: drzat sa aktualneho EPS formulara a canonical keys. Nove vzory tvorit ako kopie existujucich, zachovat rovnake id/premenne tam, kde je rovnaky vyznam. Vynimky robit len cielene cez eps_map bez rozbitia existujuceho kluca.
HISTORIA
2026-03-15 20:xx - PRACA
Archivacia historie: subor historia_2026-02.md presunuty z korena projektu do zalohyMD/022026 podla pravidiel v zalohyMD/postup archivacie historia.md.txt. Potvrdene, ze historia.md ostava aktualny pracovny vyrez a mesacne archivy patria do zalohyMD.
Folia PNG export: opravena chyba exportu po predchadzajucej uprave layoutu. exportPNG po novom pocita navinMode/navinLabelText lokalne, aby nebol zavisly od scope funkcie draw.
Folia PNG export: prerobeny layout hlavy/paty len pre PNG. Texty sa nekreslia zo SVG header/footer bounding boxov, ale priamo na canvas po riadkoch pod seba. Dovod: dlhy nazov motivu a dalsie texty rozsirili header do sirky a technicky vykres bol v PNG zbytocne maly.
Folia PNG export: opravene meranie kresliacej plochy. Bounding box pre PNG sa po novom pocita len z content-core + roll-group (technicky vykres + navin), nie z content-bbox s hlaviackou/patou. Dovod: pri uzkej a vysokej folii (napr. 140 x 170) bol vykres v strede velmi maly a nevyuzival vysku A3 portrait.
Folia PNG export: doplnene minimalne fyzicke velkosti fontov pre citatelnost pri tlaci PNG aj po zmenseni na A4. Dovod: po zvislom zalomeni textov bol vykres vacsi, ale texty uz boli prilis male.
Folia exporty: nazov PNG/PDF suboru je po novom prednostne skladany z cisla referencneho vzoru a kodu zmeny (refPartA_refPartB), s fallbackom na orderNo. Dovod: pri odkladani exportov je potrebny jednoznacny nazov bez manualneho prepisovania.
Folia - pocet operacii: doplnena volba 0 - bez operacie. V logike sa sprava rovnako ako 2 - duplex, teda bez specialneho prepocitania navinu pre monofiliu/rezanie.
Vz31 + Vz34 - fotobunka: doplnena jednoducha volitelna fotobunka do technickeho vykresu. Je len na zap/vyp, bez editacie parametrov. Fixne nastavenie: 20 x 5 mm, 10 mm zlava, 5 mm odspodu.
Vz31 + Vz34 - fotobunka vykres: fotobunka sa kresli v lavom dolnom rohu ako cierna vyplnena plocha. Dovod: obsluha potrebuje rychlo vizualizovat pritomnost fotobunky bez dalsich nastavovani.
Vz31 + Vz34 - fotobunka koty: ponechane len dve cierne koty polohy (10 mm zlava a 5 mm odspodu). Rozmer 20 x 5 sa nezobrazuje ako samostatne dve koty, ale len ako text "20x5" nad fotobunkou. Dovod: povodne 4 koty boli neprehladne a prekryvali sa s vykresom.
Vz31 + Vz34 - fotobunka umiestnenie koty 10: vodorovna kota 10 mm zlava bola presunuta pod technicky vykres na uroven kot vzduchovych otvorov. Dovod: v povodnej polohe ju prekryval text 20x5.
Vz31 + Vz34 - JSON/reset: stav fotobunky je doplneny do save/load JSON a reset ho vracia na vypnute. Tym ostava funkcnost stabilna pri ukladani, nacitani a testovani variantov.
HISTORIA
2026-03-28 21:xx - PRACA
EPS analyza: preskumane subory 150065.csv a 150065.xml. Zaver: report obsahuje len minimum pouzitelnych dat pre technicky vykres. Pouzitelne je najma itemcode -> order_serial (len ciselna cast), itemshortdesc -> motiv/order_notes a itemdesc ako pomoc pri rozpoznani vzoru (napr. VZ.022 -> vz22). Vytvoreny pomocny subor eps_report_150065_mapovanie.md ako podklad pre dalsie rokovanie s IT.
Databaza firiem / vz22: opravene mapovanie vzduchovych otvorov pri nacitani firmy. Pole "Vzduchovy otvor od zalozky" sa vo vz22 po prefill z firmy uz neprepisuje automatickou hodnotou 25, ale zachova hodnotu z firmy. Dovod: chybalo oznacenie userSet pri AirXAbs.
Databaza firiem / index2: doplnene pole "Vzduchovy otvor od zalozky" do formulara firmy. Hodnota sa uklada do air.fromBottom a zobrazuje sa aj v nahliade firmy. Tym sa zladila logika firmy a vz22.
Databaza firiem / vz22: pri vz22 sa pole "Roztec vzduchovych otvorov" vo firme schova do prazdnej hodnoty a pri ulozeni sa pitch uklada ako null. Dovod: vo vykrese vz22 sa tato hodnota aktualne nepouziva a matuci udaj ostaval vo firme zbytocne vyplneny.
Vz22 export PNG: opravena chyba "Nepodarilo sa vygenerovat PNG". Problem bol v neinlinovanom nacitani obrazkov zhora/zdola pri exporte. inlineAsset vo vz22 po novom vracia priamo data URI z INLINE_ASSETS, nie relativnu cestu na img/*.png.
Typy vzduchovych otvorov: doplnena nova volba do firiem aj do vykresov vz22/vz31/vz34. Pouziva sa existujuce pole air.diameter ako typ otvoru, aby sa nerozbijala schema dat. Volby: 1 - pomlcka, 2 - krizik v kruhu, 3 - X.
Index2 / schema: formular firmy uz namiesto "Priemer otvorov" pouziva "Typ vzduchovych otvorov". firms-schema je upravena tak, aby air.diameter znamenalo typ otvoru 1/2/3. V nahliade firmy sa zobrazuje text "typ otvoru".
Vz22/Vz31/Vz34: do UI doplnene roletky "Typ vzduchovych otvorov". Do vykresov bola doplnena funkcia drawAirMark, ktora podla volby kresli pomlcku, krizik v kruhu alebo X. Typ sa uklada do JSON, nacitava z JSON, resetuje sa a prefilluje sa z firmy.
Vz31/Vz34: text v generovanych poznamkach z firmy upraveny z "PRIEMER OTVOROV TYP" na "TYP VZDUCHOVYCH OTVOROV", aby zodpovedal novej logike.

## 2026-03-29 - vz108, EPS kluce, resety a mapovanie
- Dokoncene rozdelenie EPS klucov na `perforacia dna` vs `easy open`.
- `js/eps_fields.js`: pridane nove canonical keys pre `perf_bottom_*` a `easy_open_*`.
- `js/eps_map.js`: upravene mapovanie tak, aby `vz22` pouzival `perf_bottom_*`, `vz31` a `vz34` pouzivali `easy_open_*`.
- `js/eps_import.js`: pridana kompatibilitna normalizacia starych klucov do novych klucov pri importe EPS payloadu.
- `js/eps_editor.js`: formular upraveny na nove kluce - `Perforacia dna`, `Easy open strana`, `Easy open tvar`.
- Aktualizovane CSV tahaky v priecinku `canonical key` pre nove kluce a poradie podla EPS editora.
- Overena syntax: `js/eps_fields.js`, `js/eps_map.js`, `js/eps_editor.js`, `js/eps_import.js`.

- `vz108`: upravena logika prepinania `zlep` a `stroj`.
- Pri zmene sa uz neresetuje cely formular na default.
- System sa pokusa zachovat aktualne `PS` a `BZP`.
- Ak kombinacia po zmene nie je povolena, opravi sa len konkretne pole a pole sa oznaci cervenou (`autofixed`).
- Cervene oznacenie sa zrusi po manualnej zmene pouzivatela.
- Pridana CSS trieda `.autofixed` do `css/vz108.css`.
- Overena syntax `js/vz108.js`.

- `vz108`: opravene kotovanie pri `navin pri tlaci` pre `spodna tlac`.
- Kresba sa zrkadli/otaca spolu s kotami, nielen samotny vykres.
- Doplnena logika `mirrorDims`, `dimPosHEff`, `partsEff` a `keepDimTextReadable()` podobne ako vo `folia`.
- Opravene aj mapovanie popisov segmentov, aby cisla a skratky patrili ku spravnym kotam po zrkadleni.

- `vz108`: upraveny nazov ukladanych suborov.
- `Export PDF`, `Tlac dokumentu (PNG)` a `Ulozit TV` teraz pouzivaju nazov `refPartA_refPartB`.
- Fallback ostava na `orderNo`, potom `vz108`.

- `vz108`: opravene miesanie EPS importu a lokalneho TV JSON.
- Problem: pri otvoreni sa automaticky aplikoval stary `eps_payload` z `localStorage`, co nechavalo zlte polia a miesalo data pri `Nacitat TV`.
- Oprava: EPS payload sa aplikuje len ked `prefill_source === 'eps'`.
- Po uspesnom nacitani sa `eps_payload` a `prefill_source` odstrania z `localStorage`.
- `reset(clearPrefill)` rozlisuje start stranky vs manualny reset.

- `vz108`: opravene dalsie mapovanie z EPS editora.
- Doplneny `finalny navin` pre `vz108`:
  - `roll_final_code -> rollType`
  - `roll_final_variant -> rollVariant`
- Doplnena fotobunka pre `vz108`:
  - `photo_width -> photoW`
  - `photo_height -> photoH`
  - `photo_note -> photoNote`
- `reset()` vo `vz108` teraz odstra nuje aj triedu `.epsfilled`, aby po resete nezostavali zlte polia.

- Prakticky zaver po dnesnom ladeni:
  - stare TV JSON pre `vz108`, vytvorene pocas chybneho mie sa nia EPS payloadu, sa nemaju brat ako referencne.
  - pre dalsie testy je vhodne vytvarat nove TV JSON a nove EPS JSON podla aktualneho stavu editoru a mapovania.
- Pripravena nova vetva pre budu ciu funkciu `help` vo vykresoch.
- Dohodnuty smer: help texty sa nebudu najprv pisat natvrdo do kodu, ale budu sa spravovat cez samostatne datove subory.
- Zvoleny workflow:
  - pre kazdy vzor samostatny CSV subor v priecinku `help`
  - uzivatel bude CSV upravovat pohodlne v Exceli
  - po doplneni textov sa CSV prevedie na JSON, ktory bude pouzivat aplikacia
- Vytvoreny priecinok `help`.
- Vytvorena sablona `help/help_vz31.csv`.
- Stlpce v CSV:
  - `section`
  - `field_id`
  - `field_label`
  - `control_type`
  - `help_enabled`
  - `help_text`
  - `poznamka`
- `field_id` zodpoveda nazvu pola v HTML/JS, aby sa dalo pole jednoznacne napojit na help text.
- `field_label` je ludsky citatelny nazov pola.
- Tento subor ma sluzit ako prvy test organizacie help textov pre `vz31`.
- Dalsi krok po doplneni CSV: prevod na JSON a navrh napojenia help bublin do aplikacie.
- Spusteny prvy funkcny test inline `help` bublin vo `vz31`.
- Z CSV sablony pre help bol vytvoreny JSON/JS zdroj:
  - `help/help_vz31.csv`
  - `help/help_vz31.json`
  - `help/help_vz31.js`
- Pridana nova pomocna logika `js/help_tooltips.js`.
- Do `vz31.html` bolo doplnene nacitanie `help/help_vz31.js` a `js/help_tooltips.js`.
- Do `css/vz31.css` bol doplneny styl pre help bubliny a maly oranzovy trojuholnik v pravom hornom rohu pola.
- Funkcia `help` sa zobrazuje len pre polia, kde je v CSV nastavene:
  - `help_enabled = yes`
  - a je vyplneny `help_text`
- Spravanie:
  - klik na trojuholnik otvori bublinu
  - klik mimo bubliny ju zavrie
- Nasledne bola opravena poloha help bublin pri poliach blizko lavej strany panelu.
- Problem: niektore bubliny vypadavali z layoutu (`Zrusit meranie`, `Kalibracia podkladu`).
- Oprava v `js/help_tooltips.js` a `css/vz31.css`:
  - po otvoreni sa bublina skontroluje voci panelu `#controls`
  - ak by vypadla vlavo alebo vpravo, prepne sa na vhodne zarovnanie dovnutra panelu
- Vysledok: prvy funkcny prototyp inline help je vo `vz31` pouzitelny na test s obsluhou.
- Dalsi mozny krok v buducnosti:
  - rozsirit rovnaku logiku na dalsie vzory
  - alebo doladit vizual trojuholnika a bublin podla spatnej vazby od obsluhy