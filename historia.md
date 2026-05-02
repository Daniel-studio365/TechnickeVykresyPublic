# HISTORIA KONVERZACIE (ASCII)

PRAVIDLA:
- zapisuj len do historia.md (aktualny mesiacny vyrez)
- archiv je v zalohyMD (po mesiacoch)
- pri preklopeni mesiaca:
  - najskor upozorni uzivatela, aby spravil zalohu
  - potom presun minuly mesiac do zalohyMD
- ak chyba kontext alebo je historia kratka:
  - upozorni uzivatela
  - poziadaj o nacitanie zalohyMD
- na vyziadanie "nacitaj celu historiu":
  - precitaj historia.md + vsetky subory v zalohyMD
- zapisuj bez diakritiky (ASCII)
POZNAMKA:
- Starsie zaznamy su archivovane v zalohyMD (napr. 2025, 012026).
HISTORIA
2026-03-01 21:30 - PRACA
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
### <span style="color:blue">2026-04-04 00:00</span>
#### Uzivatel:
prechadzam na GitHub Copilot Chat, prosim zapis to do historie.

#### AI:
Kontrolny zapis: prechod na GitHub Copilot Chat zaznamenany. Budem pokracovat v historii bez diakritiky.
---
### <span style="color:blue">2026-04-04 00:01</span>
#### Uzivatel:
chcem zapis, co sa zmenilo po chate z 3.4.2026.

#### AI:
Zapisal som, co sa zmenilo: kontrolny zapis bol presunuty z vnutorneho bullet zoznamu na spravny koniec suboru `historia.md`, cely subor bol overeny a aktualny priebeh sa zaznamenal ako novy blok. Prechod na GitHub Copilot Chat je dokumentovany v historii.
---
### <span style="color:blue">2026-04-04 00:02</span>
#### Uzivatel:
prechadzajuci chat z 3.4.2026 prestuduj a zapis do `historia.md`, co sa v priebehu 3.4. urobilo.

#### AI:
Prestudoval som `historia chatu 3.4.2026.txt` a doplnil som do `historia.md` zapis o zmenach:
- overenie pracovnej cesty a zapisovacich prav v projekte
- plan a rozhodnutie zosynchronizovat `vz22_test` s aktualnym `vz22` namiesto vytvarania novej vetvy
- uprava typov vzduchovych otvorov vo `vz22`, `vz31`, `vz34` a `index2` na nove poradie 1=X, 2=Y v kruzku, 3=rovny zarez
- do `vz22_test` prenesene aktualne funkcie `vz22` plus testovacia nadstavba `ZLOZENY NAHLAD` a `BOKORYS`
- v `vz22_test` implementovane automaticke vlozenie vyrezu obrazka do `BOKORYS` z oblasti `K + lave L`
- overenie syntaxe `js/vz22.js`, `js/vz31.js`, `js/vz34.js` a `js/vz22_test.js` pomocou `node --check`
---
### <span style="color:blue">2026-04-04 00:03</span>
#### Uzivatel:
skus urobit zalohu historia podla pokynov, aby bola kratsi
#### AI:
Archivoval som marec 2026 do `zalohyMD/032026/historia_2026-03.md` a odstranil ho z aktualneho `historia.md`, aby bol subor kratky a zodpovedal aktualnemu mesiacu.
2026-04-04 10:00 - PRACA
Folia - kotovanie pri tlaci/navine: upravena logika, aby pri "spodna tlac" + navin pri tlaci kótovanie nasledovalo transformacie vykresu (zrkadlenie/rotacia). Delenie sirky sa pri tomto mode kresli v opacnom poradi, zvisle koty sa prehadzuju lava/pravá strana. Pri 180° rotacii vykresu je doplnena korekcia orientacie textov kot, aby neboli dole hlavou.

Vz22_test, vz22, vz31, vz34: opravene zobrazenie dimensioning pre dlzku zaseky. Ked je zapnute "Zaseky posunute", dimensioning pre dlzku zaseky sa teraz zobrazuje stale, nie len ked je posun vypnuty.
Vz22_test: zvacsene font-size v textovych poliach poznamok z 14px na 18px. Zmenene farby na neonove: zelena #16a34a na #00ff00, cervena #dc2626 na #ff073a.

2026-04-06 15:50 - PRACA
Montaz (kopija folia) rozsirovana pre S&R:
- template sa zarovnava k platnu (vlavo/vpravo), nie ku kotucu; medzera je kladna vzdialenost okraja template od platna
- pridane orezove ciary a koty: lava/prava medzera orez, celkova sirka materialu (S&R + 2*orez), default orez 3 mm, nastavitelny
- ulozenie/nacitanie doplnene o repeat/gap/mode/template/orez; reset doplneny o repeat a orez; eventy pre repeat/gap/mode/orez
- fixy totalW/totalH v montaz: koty, navin, hlavicka, mirror markerov

2026-04-06 20:10 - KONTROLA A UPRATANIE 1. VLNA
Kontrola celej aplikacie so zamerom hlavne na `vz22_test` a `montaz`:
- prebehla kontrola struktury projektu, vstupnych bodov a hlavnych JS suborov
- syntakticka kontrola `node --check` pre `js/montaz.js`, `js/vz22_test.js` a `js/index.js` prebehla bez chyby
- identifikovane rizika: duplicitne priradenia state v `montaz.js`, duplicitne listenery, reset bez druheho textu pri template a mrtvy legacy kod v `index.js`

Montaz - upratanie bez zmeny funkcnej logiky:
- v `js/montaz.js` odstranene duplicitne citanie `photoEnabled`, `photoOffsetTop`, `photoOffsetRight` v `draw()`
- odstraneny duplicitny listener pre `markText`
- reset montaze doplneny o `markText2` aj `state.markText2`, aby po resete nezostaval druhy text template z predchadzajuceho vykresu
- `loadData()` zjednodusene: `markText` a `markText2` sa nacitavaju len raz na jednom mieste, nie duplicitne
- legenda `BEZ KORONOVEJ UPRAVY` zjednotena medzi live SVG a exportom PNG:
  - vytiahnute spolocne konstanty pre text a farby
  - pridany helper `drawCoronaLegendSvg(...)`
  - PNG export dostal rovnaky zeleny text a svetlozeleny podklad ako live nahlad

Index - odstranenie mrtveho kodu:
- povodny `js/index.js` obsahoval velky legacy blok pre spravu firiem, ktory sa pri aktualnom `index.html` vobec nespustal
- subor bol prepisany na jednoduchu aktualnu verziu zodpovedajucu dnesnemu indexu:
  - prepnutie medzi `vrecko`, `folia`, `montaz`
  - vyber vzorov `vz22`, `vz22_test`, `vz31`, `vz34`, `vz108`
  - EPS import s historiou naposledy nacitanych suborov
  - preklady `target_template` -> spravny HTML subor
- vysledok: mensi a prehladnejsi vstupny bod aplikacie bez neaktivnej vetvy pre firmy

Poznamka k `vz22_test`:
- pocas kontroly nebola menena logika easy open/perforacie
- zaznamenane ostava, ze je tam vela duplicitnej geometrickej logiky medzi hlavnym vykresom a zlozenym nahladom; vhodne az pre dalsiu samostatnu vlnu refactoringu

2026-04-06 20:35 - UPRATANIE 2. VLNA PRE `vz22_test`
Refactoring `js/vz22_test.js` s cielom pripravit cistejsi zaklad pre buduci prenos logiky do `vz31` a `vz34`:
- zduplikovane vypocty easy-open medzi hlavnym technickym vykresom a `ZLOZENY NAHLAD` boli rozdelene na spolocnu geometriu a samostatne renderovanie
- pridane helpery:
  - `computeEasyGeometry(...)` pre vypocet polohy a parametrov easy-open
  - `buildEasyPrimitives(...)` pre vytvorenie spolocnych primitiv (`line`, `quad`) pouzitych v oboch pohladoch
- hlavny vykres aj zlozeny nahlad teraz cerpaju z tych istych vypoctov:
  - `xMid`
  - `halfSpan`
  - `bendHoriz`
  - `dir`
  - `dy`
  - `arcR`
  - polohy krajnich bodov easy-open
- vo fold casti bol odstraneny lokalny duplicitny vypocet vetiev `rovna`, `vodorovna`, `U`, `zahnut`; zlozeny nahlad uz renderuje tie iste primitiva po mapovani bodov
- ciel refactoringu:
  - nezmenit funkcny rozsah
  - zmensit riziko, ze sa hlavny vykres a zlozeny nahlad pri dalsich upravach rozidu
  - pripravit cistejsi podklad pre buduce pouzitie vo `vz31` a `vz34`
- perforacia v tejto vlne nebola menena, upravovala sa iba easy-open cast
- syntakticka kontrola `node --check js/vz22_test.js` prebehla bez chyby

2026-04-07 09:05 - MONTÁŽ: LEGENDY A LIMITY
- `montaz`: legenda „BEZ KORONOVEJ UPRAVY“ je volitelna (checkbox `showCoronaLegend`), stav sa uklada/načítava/resetuje, vypnutie/ zapnutie funguje rovnako v SVG aj exporte PNG.
- `montaz`: druhý textový riadok pri template obmedzený na 20 znakov (UI aj placeholder).

2026-04-07 10:20 - MONTÁŽ: ODSTRÁNENÝ NAVIN PRI MONTAZI
- z UI odstranene checkbox „Navin pri montazi“ a info label, zostava len finalny navin a navin pri tlaci
- v `js/montaz.js` odstranena podpora `rollAssemblyEnabled` a vsetka logika/rotacie/labely navin pri montazi
- kolekcia/load/reset/export osetruju uz len `rollEnabled` a `rollPrintEnabled`
- syntax `node --check js/montaz.js` prebehla bez chyby

2026-04-07 10:35 - MONTÁŽ: POZNAMKA POD VYKRESOM
- `montaz`: pole „Poznamka pod vykres“ zvacsene na max 50 znakov, text sa v exporte kresli vacsim bold fontom (16px) a wrapuje sa rovnako ako predtym

2026-04-07 10:50 - MONTÁŽ: MIKROBODy
- pridane volitelne zobrazenie dvoch mikrobodov (checkbox `microEnabled`) s nastavenim odsadenia:
  - lavy: odhora / zlava
  - pravy: odhora / sprava
- mikrobody: cierna bodka priemer 0.5 mm a zlty kruzok priemer ~4 mm pre zvyraznenie
- stav sa uklada/nacita/resetuje; umiestnenie sa meni v ovladacom paneli
## 2026-04-28

- `js/vz22_test.js`: Zlozeny nahlad - odstraneny podkladovy obrazok (ostali len koty).
- `js/vz22_test.js`: Kotu stredu zavesnych otvorov presunuta z dolnej casti nad horny otvor + prerusovana pomocna ciara do stredu.
- `js/vz22_test.js`: Vzduchove otvory - upravy kotovania a pomocnych ciar (horizontalne), odstranena spodna pomocna prerusovana ciara.
- `js/vz22_test.js`: Zlozeny nahlad - perforacia sa pocita od prerusovanej ciary spodnej zalozky (`gHiddenTop`), nie od spodku.
- `vz22_test.html` + `css/vz22_test.css`: Hint „Koliesko = zoom...“ je fixne vpravo dole (overlay mimo scrollu); scroll je v `#svgScroll`.
- `js/vz22_test.js`: Poistne zaseky v zlozenom nahlade - opravene mapovanie (patria do K+L, mapuju sa cez `mapFold`), vykreslia sa len ak su v zlozenom nahlade; koty doladene (dlzka + vzdialenost) a odsadenia.
- `js/vz22_test.js`: Zlozeny nahlad - pri lavom vzduchovom otvore doplneny popis „od okraja / od perforacie“ ako vynasacia ciara (len ked je perforacia).
- `vz22_test.html` + `js/vz22_test.js`: Pridana roletka „Farba spony“ v Poznamkach technologa (siva/cervena/transparentna) + aplikovana na vykreslovanie zavesnej spony; cervena upravena na sytejsiu.
- 2026-05-02 00:00 - KONTROLA
- Prestudovana `historia.md`; rozumiem, ze projekt je sada HTML/JS editorov pre technicke vykresy a exporty, s vetvami `vz22`, `vz22_test`, `vz31`, `vz34`, `vz108`, `folia`, `montaz`, `index2` a `eps_editor`.
- Kluce a mapovania sa maju drzat konzistentne cez canonical keys a `eps_map`, nove varianty sa maju odvadzat z existujucich sablon bez zbytocneho rozbijania starych struktur.
- Archivacia historie sa riadi pravidlami v `historia.md` a mesacne presuny patria do `zalohyMD`.
2026-05-02 01:00 - PRACA
- `vz22_test` bol premenovany na `vz22`: html, css, js aj help zdroje su teraz v produkcnom nazve.
- Stare test subory boli odstranene a vstupne body `index`, `index2` a `eps_import` boli prepojene na novy `vz22`.
- Pre stare JSON so `vz22_test` ostala len ticha kompatibilita v loaderoch.
2026-05-02 01:30 - PRACA
- `vz22` je pilotne presunuty do `patterns/vz22/` ako samostatny priecinok s vlastnym `index.html`, `css`, `js`, `help` a `img`.
- Root `vz22.html` ostal len ako prechodovy redirect na `patterns/vz22/index.html`.
- Spolocne JS ostalo v root `js/` a vz22 teraz berie len lokalne pattern specificke suciastky.
2026-05-02 02:00 - ROZHODNUTIE
- Pre dalsiu strukturu sa ma pouzit model `shared/` + `patterns/<vzor>/`.
- Do `shared` maju ist len skutozne spolocne veci: EPS import/mapovanie/fields, help tooltips, routing a male datove helpery.
- Vo vzoroch maju ostat geometria, kreslenie, koty, exportne texty a vlastne UI pravidla.
- Presun spolocnych casti sa ma robit postupne a po kazdom kroku sa ma overit funkcia konkretneho vzoru.
2026-05-02 02:30 - PRACA
- Obrazky `zhora` a `zdola` boli centralizovane do `shared/assets/`.
- `vz22`, `vz31`, `vz34` aj `index2` teraz pouzivaju jednotnu cestu na tie iste assety.
- Lokalna kopia PNG bola odstranena z root `img/` aj z `patterns/vz22/img/`, aby zostal len jeden zdroj pravdy.
2026-05-02 03:00 - PRACA
- EPS helpery boli presunute do `shared/eps/` (`eps_fields.js`, `eps_map.js`, `eps_import.js`) a help tooltips do `shared/ui/help_tooltips.js`.
- `vz22`, `vz31`, `vz34`, `vz108`, `folia` a `eps_editor` teraz nacitavaju tieto moduly zo shared vrstvy.
- Root kopie EPS/help helperov boli odstranene, aby ostal len jeden zdroj pravdy.
2026-05-02 03:30 - PRACA
- `index2` bol presunuty do `shared/entry/` ako hlavny zdroj a root `index2.html` ostal len ako redirect.
- `vz22`, `vz31` a `vz34` teraz otvaraju spravu firiem cez `shared/entry/index2.html`.
- Root `js/index2.js` bol odstraneny, aby ostala len jedna verzia spravcu firiem.
2026-05-02 15:55 - PRACA
- `vz31` bol presunuty do `patterns/vz31/` ako pilot dalsieho vzoru.
- Root `vz31.html` je teraz len redirect na `patterns/vz31/index.html`.
- Stare root kopie `css/vz31.css`, `js/vz31.js` a `help/help_vz31.*` boli odstranene; vzor pouziva lokalne subory v `patterns/vz31/` a shared EPS/help vrstvy.
2026-05-02 16:00 - PRACA
- `vz34` bol presunuty do `patterns/vz34/` v rovnakej strukture ako `vz31`.
- Root `vz34.html` je teraz len redirect na `patterns/vz34/index.html`.
- Stare root kopie `css/vz34.css` a `js/vz34.js` boli odstranene; `vz34` ostal na shared EPS vrstve a vlastnom pattern priecinku.
2026-05-02 16:02 - PRACA
- `vz108` bol presunuty do `patterns/vz108/` ako dalsi vzor v novej strukture.
- Root `vz108.html` je teraz len redirect na `patterns/vz108/index.html`.
- Stare root kopie `css/vz108.css` a `js/vz108.js` boli odstranene; `vz108` ostal na shared EPS vrstve a vlastnom pattern priecinku.
2026-05-02 16:09 - PRACA
- `folia` a `montaz` boli presunute do `patterns/` ako samostatne moduly.
- Root `folia.html` a `montaz.html` su teraz len redirecty na `patterns/folia/index.html` a `patterns/montaz/index.html`.
- Stare root kopie `css/folia.css`, `js/folia.js`, `css/montaz.css` a `js/montaz.js` boli odstranene; `folia` dalej nacitava shared EPS vrstvy, `montaz` ostava bez EPS napojenia.
2026-05-02 16:48 - PRACA
- Zo `vz31` bol odstraneny spodny obrazkovy panel s importom spony; ostali len dva textove boxy.
- `vz31` help data boli vycistene od pol `clipPreset` a `bottomImgInput`, aby sa image import nikde neponukal.
- Export PNG vo `vz31` teraz pracuje len s dvoma spodnymi textovymi poliami.
2026-05-02 19:26 - PRACA
- Vo `vz31` bol pridany bokorys v tvare U, doplneny podlozny pas PE folie (B/D/E) a presunuty ovladac do pravho spodneho textoveho pola.
- `vz31` dostal zlozeny nahlad s otvorom v rucke, predlzenou kotou rucky a korektnym vykreslenim easy open aj vo folded view.
- Easy open bolo premenovane z perforacie v UI aj helpu; logika `PerfSide` bola vo `vz31` prehodena na spravne vyznamy `prava = dole`, `lava = hore` bez zasahu do `vz22`.
- Text v `vz31` bol upraveny z `Spodna zalozka (G)` na `Rucka (G)` bez zmeny canonical key `G`.
2026-05-02 19:59 - PRACA
- `vz31` bol po dokoncení uprav skontrolovany auditom; zostal len zameraný minimalny rozdiel v `easy open` UI a zrkadleni podkladu cez tlacidlo.
- Ovladanie `bg-flip` bolo premenovane na `Zrkadlit vertikal.` a help metadáta pre `vz31` boli zosuladené.
- Do pravého spodného pola bol doplneny prepínac `Farba spony` a spona sa teraz kresli v troch variantoch `gray/red/none` podobne ako vo `vz22`.
- `ZADNA STRANA` v hornom paneli zostala cervena, doplnok pre spodnu tlac je modry a vypisuje sa len pri `printSide = spodna`.
2026-05-02 20:59 - PRACA
- Vo `vz31` sa rozdelila logika `easy open` pre technicky vykres a zlozeny nahlad; technicky vykres sa riadi `printSide`, folded view ostal podla povodnej `PerfSide`.
- `vz31` dostal opraveny banner vpravo dole, aby sa pri posune vykresu/podkladu nehýbal spolu s obsahom.
- Text `POHLAD CEZ FOLIU (FARBU)` bol prepnuty na ASCII verziu bez diakritiky, aby sa neopakoval problem s kodovanim.
- `vz31` bol doplneny o `Farba spony` aj s prenosom do kresby a helpu; `vz22` ostal nedotknuty.
- `bg-flip` je v `vz31` uz `Zrkadlit vertikal.` a prepina len podklad, nie logiku `easy open`.
