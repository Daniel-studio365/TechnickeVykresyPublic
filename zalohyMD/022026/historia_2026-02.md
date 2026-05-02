HISTORIA
2026-02-01 18:22 - PRACA
folia_lito: pridane dynamicke vektory (zoznam s Pridat vektor), kazdy vektor ma vlastne SVG, mierku, otocenie, zamknutie, reset a vymazat. Vyber/drag/resize funguje per vektor, vyber je cez klik do platna, zvyrazneny ramec a rohy. Stav vektorov sa uklada do JSON a nacita (legacy jedneho vektora ostava kompatibilny).

HISTORIA
2026-02-01 18:50 - PRACA
folia_lito: dokoncene UI pre vektory (dynamicke bloky, vyber tlacitkom aj klikom do platna, zamknutie, reset, vymazat), stabilne ovladanie a ukladanie do JSON. Poznamky s vynasacou maju biely podklad (75%), ciara konci na okraji textu a bod je viditelny na konci.
folia_lito povazovane za uzavrete; uzivatel premiestni subor mimo koren a nasadi do praxe.

HISTORIA
2026-02-01 19:32 - PRACA
folia: badge pre lak nanasany v dalsom kroku s hrubym cervenym lemom; header text nad vykresom upraveny (nebijes sa s navinom) a doplneny sposob tlace + info o laku (cervene).
folia: PNG export pre A3 s pribitymi textami hore/dole a vycentrovanym technickym vykresom; opravene prazdne PNG (bbox z live SVG). PDF export ponechava aj navin (viewBox z content-bbox), header/footer sa odstranuju.

HISTORIA
2026-02-02 20:20 - PRACA
EPS test rezim: pridany eps_editor (tvorba EPS JSON, ulozit/nacitat/otvorit vykres) a eps_index (nacitat EPS JSON a otvorit vybrany vzor). Index prihlasenie: test123 -> normalny index, 2026_EPS -> eps_index.
Pridany eps_map.js (canonical->ID), eps_import.js (automaticke naplnenie a zlte oznacenie poli z EPS). Vz22/vz31/vz34/folia doplnene o EPS import a zlte zvyraznenie (epsfilled).
Poznamka: EPS JSON sa ulozi do localStorage a po otvoreni vykresu sa aplikuje bez narusenia aktualnej funkcnosti.

HISTORIA
2026-02-03 20:30 - PRACA
folia_lito: opraveny zoom koleckom mysi a posuvniky. Pricina bola CSS svg width/height 100% (prepisovalo zoom). Nastavene na width/height auto ako vo vz31. Doplneny wheel listener a scroll pre svgHolder.

HISTORIA
2026-02-03 21:04 - PRACA
folia: opraveny zoom koleckom mysi. Pridany wheel listener (aj globalny fallback), a pre zoom sa nastavuje width/height SVG aj cez inline style v px. Tym sa zoom realne prejavi a scrollbary funguju. css/folia.css uz ma svg width/height auto + svgHolder overflow auto.


2026-02-04 20:48 - EPS/firmy workflow a vz22 upravy: pridany index2 (sprava firiem pre jeden vzor), tlacidlo Firmy (sprava) vo vz22 otvara index2 v novom tabe. Prefill z EPS/firiem funguje len pri flagu prefill_source (eps/firm), po aplikacii sa flagy aj data cistia; priamy otvor vz22 uz nenechava zlte/zelene polia. EPS import pri vz22 aktualizuje texty (rezanie/print side/finalny navin) cez eventy. Vz22 left-notes uz len zobrazuje texty, ovladanie je hore. Kombinovane zlte+zelene polia maju split background. Doplneny storage listener vo vz22 pre prefill firiem bez reloadu, index2 sa po vybere firmy zavrie. Opravena eps_fields chyba s extra } a upraveny layout EPS editora (uzsie stlpce, popis pri poli).

2026-02-05 20:19 - Vz31/Vz34 upravy ako vz22 (eps-header, texty v left-notes, Firmy sprava). Vo vz31/vz34 odstranene tlacidlo Otocit +90 aj eventy. Vz34: oprava diakritiky/ASCII rucne, potom dosadeny komplet eps-header + textovy blok. EPS editor: pridane zvyraznenie poloziek pre vybrany vzor len na inputoch, pridany eps_map.js. Index2: odstraneny bezny Export, ponechany Export s datumom/casom + pridany Import firiem. 

HISTORIA
2026-02-08 19:00 - PRACA
vz108: vytvoreny z folia (vz108.html/js/css) a upraveny na novy model: zlep stred/kraj, vyska SEK = L + C, rozdelenie vysky len L+C, rozdelenie sirky fixne segmenty (ZSP/BZP/PS/BZL/ZSL/zlep/pridanie) s auto-vypoctami, BZP/PS roletky podla tabuliek a C podla PS+BZP. Vypoctove polia zlte a preskakovane tabulatorom. Koty zobrazuju skratky segmentov nad ciarou, DNO pri kote C a DLZKA bez popisu; celkova sirka odsadena dalej. Opravene zobrazenie kot pri navine (bez 180 stup. rotacie), lac. pole oranzove, L roletka 155-410/5.

HISTORIA
2026-02-08 19:35 - PRACA
EPS test mode: pridany vz108 do eps_index a eps_editor; eps_map doplneny o mapovania vz108 (L/W/H/C, seamMode, PS, BZP); eps_fields doplnene o dim_C + vz108 kluce. vz108 inputy dostali id=key, aby EPS import fungoval.
Canonical keys: vygenerovany novy CSV so stlpcom vz108 a premiestneny do priecinka "canonical key".

HISTORIA
2026-02-08 21:10 - PRACA
vz108: doladene karty a koty (DLZKA hore, DNO dole), preklapanie kot pri navine pri tlaci vratene ako vo folii. PDF export 1:1 opraveny (odstranene zoom style, pevne mm rozmerovanie).
EPS: pridany vz108 do eps_index/eps_editor; eps_map doplneny o mapovania vz108 (L/W/H/C, seamMode, PS, BZP); eps_fields doplnene o dim_C + vz108 kluce. vz108 inputy dostali id=key pre EPS import. CSV kanonyan keys vygenerovany a ulozeny v "canonical key/canonyan_keys2_vz108.csv".
vz34: pridana sirka vrecka (BagWidth) v ovladani aj JSON, koty sirky vrecka na lavej strane a minX rozsireny, text VYSEK opraveny, koty roztece otvorov len raz a cervene. Reset a load cistia epsfilled/prefilled, poznamky aj obrazok; prefill z firmy iba ak prefill_source=firm. eps_map doplneny o dim_bag_width pre vz34.
vz31: pridana sirka vrecka (BagWidth) v ovladani aj JSON, koty sirky vrecka na lavej strane, viewBox posunut vpravo (leftPad) aby sa koty nerezali. reset/prefill podporuje BagWidth. eps_map doplneny o dim_bag_width pre vz31.
CRV/PCV: refPartA/refPartB (CRV) a porCislo (PCV) doplnene do vsetkych vzorov (vz22/vz31/vz34/folia/vz108). vo vz22/vz31/vz34 presunute do hornej hlavicky a zobrazenie v left-notes. vo folia/vz108 odstranene polia cislo zakazky/poznamka; v hlavicke vykresu je CRV a PCV.
Canonical keys: ref_code_a, ref_code_b, order_serial nastavene na vsetky vzory v canonyan_keys2_vz108.csv.
HISTORIA
2026-02-12 18:04 - PRACA
vz22: upravene ovladanie podla postrehov obsluhy. V sekcii Perforacia pridany prepinac ano/nie (PerfEnabled); pri volbe nie sa vypne strana/perf offset a perforacia sa nekresli. Text pre perf offset premenovany na "Vzdialenost od stredu".
vz22: v sekcii Vzduchove otvory pridany prepinac ano/nie (AirEnabled); pri volbe nie sa vypnu suvisiace volby a vzduchove otvory ani ich koty sa nekreslia.
vz22: premenovane nazvy sekcii a poli: "Zavesne otvory v chlopni", "Vzialenost zavesnych otvorov", "Umiestnenie stredu otvorov (z lavej strany chlopne)", "Pozadovana sirka vrecka".
vz22: upravene poradie v Zakladne rozmery na: Pozadovana sirka vrecka, Dlzka (L), Sek (W), Spodna zalozka (G), Chlopna (K).
vz22: sekcia "Zaseky v K" premenovana na "Zaseky pri zavesnych otvoroch"; pole "Dlzka zaseku v K" na "Dlzka zaseku". Pridane readonly pole "Mostik" s automatickym vypoctom z logiky vykresu (medzera medzi zasekom a zavesnym otvorom). Do JSON sa neuklada, dopocitava sa po nacitani.
HISTORIA
2026-02-12 19:26 - PRACA
vz22/vz31/vz34: UX upravy ovladania a nazvov podla postrehov obsluhy. Zjednotene nazvy v Zakladne rozmery (Pozadovana sirka vrecka, Dlzka (L), Sek (W), Spodna zalozka (G), Chlopna (K)).
vz22: pridane prepinace ano/nie pre Perforacia (PerfEnabled) a Vzduchove otvory (AirEnabled); pri volbe nie sa suvisiace polia vypnu a prvky sa nekreslia. Upraveny text "Vzdialenost od stredu" pre perforaciu a "Vzduchovy otvor od zalozky".
vz31/vz34: premenovane sekcie na "Zavesne otvory v chlopni" a "Zaseky pri zavesnych otvoroch"; texty C/Axis zjednotene ako vo vz34. Pridane readonly pole Mostik (automaticky vypocet z logiky koty medzi zasekom a otvorom).
vz22/vz31/vz34: Mostik sa zobrazuje s 1 desatinnym miestom a rovnako sa pouziva v kote vykresu. Do JSON sa Mostik neuklada (dopocitava sa).
vz31: otvor na prst uz neprekriva znacky textom. Kruh otvoru je farebne ako zona bez tlace a legenda "OTVOR NA PRST BEZ FARBY" je vedla legendy "ZONA BEZ TLACE".
vz22/vz31/vz34: text "NO PRINT AREA" zmeneny na "ZONA BEZ TLACE".
vz31/vz34: tlacidlo Nacitat presunute na vrch panelu ako "Nacitat ulozeny TV"; "Ulozit (JSON)" premenovane na "Ulozit TV". Na vz34 odstranene duplicitne tlacidlo "Firmy (sprava)".
vz22/vz31/vz34: pridane Undo/Redo (tlacidla Spat/Dopredu + Ctrl+Z, Ctrl+Y/Ctrl+Shift+Z) s historiou zmien formulara, vratane reset/load/prefill snapshotov.
HISTORIA
2026-02-15 19:08 - PRACA
vz34: upravena logika SEK. Sek (W) je vstupna hodnota, Bocna rucka je vstup (default 60) a Rozmer folia sa dopocitava ako Sek - Bocna rucka (readonly). Opraveny bug nezobrazenia vykresu (chybajuca premenna sekEl).
vz34: odstranena zbytocna kota 50 vo vyseku rucky. Kota vysky rucky je naviazana na Bocna rucka a zarovnana do praveho stlpca kot (k Rozmer folia / zavesnym otvorom).
EPS/canonical ujednotenie SEK: rozhodnute pouzivat jeden globalny key dim_SEK ako hlavny udaj "Sek" z tlaciva. dim_SEK mapovanie nastavene na vz22->W, vz31->W, vz34->W, folia->W, vz108->H.
EPS test editor: odstraneny duplicitny riadok "Sek (vz22/vz31/vz34) -> dim_W". V tlacive ostava jeden riadok SEK cez dim_SEK. dim_W zostava ako legacy/fallback, nie ako primarny vstup z tlaciva.
Poucenie do buducna: nevypisovat viac riadkov pre SEK. Externy program ma posielat jednu hodnotu SEK do dim_SEK; preklad na konkretne pole vzoru riesi EPS_MAP. 
HISTORIA
2026-02-15 20:40 - PRACA
index2 (Nova firma): doplneny riadok pre perforaciu (Perforacia A/N, Strana perforacie, Vzdialenost od stredu). Do nazvu modalu doplneny aktivny vzor (vz22/vz31/vz34), aby bolo jasne pre ktory vzor sa firma upravuje.
index2: opravene ukladanie pri editacii firmy - nezmazu sa starsie hodnoty mimo aktualneho formulara (W/L/G, clip, air, atd.). Pri submit sa zachovaju predchadzajuce data a prepise sa len to, co sa realne upravuje.
prefill z firmy: dorobene mapovanie perforacie do vykresov. vz22 cita perforation.enabled/side/offset do PerfEnabled/PerfSide/PerfOffset (a farbi nazeleno). vz31 mapuje perforation.enabled na PerfShape (yes->rovna, no->none) a cita side/offset. vz34 mapuje perforation.offset do P.
vz22/vz31/vz34 (Obrazok): pridana volba spon bez firmy - roletka clipPreset (Bez obrazka, Spona zhora, Spona zdola, Vybrat vlastny subor). Ak je firma so clipImages, preset sa nastavi automaticky. Volba sa uklada/nacitava v TV JSON ako clipPreset.
vz22: pridana roletka "Typ textov hore" (hygiena/chlieb). Hygiena ponecha texty ZADNA STRANA + PREDNA STRANA. Chlieb prepne texty na PREDNA STRANA / FOTOBUNKA NA STRANE POHONU a CHLOPNA/ZS NA STRANE OBSLUHY. Plati pre live vykres aj PNG export.
Poznamka pre dalsi postup: pri zmenach formulara firmy vzdy kontrolovat prefill do vz22/vz31/vz34 a zelene oznacenie prefilled poli, aby sa neopakoval problem s nepasujucimi klucmi po refaktore formulara.
HISTORIA
2026-02-15 21:05 - PRACA
index2: firm list nastaveny na cisty start (prazdny zoznam). Nacitanie zakladnych firiem z js/firms.json je vypnute a localStorage key pre custom firmy je zmeneny na novy namespace, aby sa nevracali stare zaznamy z prehliadaca.
schema: aktualizovany js/firms-schema.json na verziu 0.2 podla realne pouzivanej struktury v index2 (firmName, typ, vz, notes, techNotes, dimensions, air, perforation, clipImages + legacy polia pre kompatibilitu). Odstranene zastarale casti schema (zyp/assets/cut/fingerHole/warnings).
Poznamka pre dalsi postup: pri cistom starte firiem vytvarat zaznamy uz len cez index2 formular; firms-schema 0.2 pouzit ako referenciu pre ITC/export.
HISTORIA
2026-02-18 20:xx - PRACA
EPS editor: zrusene naviazanie na eps_editor_test. eps_editor.html teraz nacitava iba js/eps_editor.js a titulok je "EPS Editor".
EPS editor: opravena anomalia pri duplicitnych canonical key poliach. Pri pisani do jedneho pola sa hodnota synchronizuje do vsetkych duplicit. Pri nacitani JSON sa hodnota nastavi do vsetkych duplicit. Pri ulozeni JSON ma prioritu prve (horne) vyplnene pole pre dany key.
Kontrola projektu: eps_editor_test subory uz nie su pritomne v koreni ani v js priecinku.
folia + EPS mapovanie: opravene mapovanie sirky pre foliu. dim_W je mapovane na pole L (Sirka) a mapovanie dim_L pre foliu je odstranene, aby nevznikal konflikt.
Aktualny stav mapovania pre folia: dim_bag_width -> L, dim_W -> L, dim_SEK -> W.
HISTORIA
2026-02-19 21:45 - PRACA
EPS editor: obnovene subory z eps_editor_test na eps_editor (vytvoreny eps_editor.html + js/eps_editor.js, linky nastavene na eps_editor).
EPS editor: opravena synchronizacia duplicitnych poli (Formular vs Canonical keys). Zmena v jednom poli s rovnakym data-key sa hned prepise do ostatnych duplicit a JSON preview sa aktualizuje.
EPS editor: potvrdene spravanie nacitania JSON cez file dialog. Spolahlive nacitanie je vyber suboru + tlacidlo Otvorit (browser/OS spravanie).
Poznamka: eps_editor_test zostava zatial v projekte len docasne; odstranenie vykona uzivatel po testoch.
HISTORIA
2026-02-21 22:59 - PRACA
EPS editor konsolidacia: obnovene pouzivanie eps_editor (bez zalezitosti na eps_editor_test), opravena synchronizacia duplicitnych data-key poli medzi hornym formularom a spodnym canonical zoznamom. Pri zmene hodnoty sa duplikaty okamzite prepisu a JSON preview je konzistentny.
EPS import stabilizacia: opravene nacitanie sposobu tlace z EPS pre folia/vz22/vz31/vz34 (A/ano/1/true aj textove varianty vrchna/spodna). Doplneny event dispatch po nastaveni selectov, aby sa prepisali aj naviazane texty v technickom vykrese.
Folia: opravene mapovanie sirky z EPS (dim_W/dim_bag_width -> pole L = Sirka). Pri reset tlacidle sa cisti EPS source/payload a epsfilled, ale nie pri inicialnom starte (aby sa EPS data pri otvoreni nevymazali pred importom).
Folia fotobunka: ak EPS neposiela photo_width/photo_height, polia ostanu prazdne, fotobunka sa nekresli a text Rozmer fotobunky sa nezobrazi. Zruseny fallback 15x7 pre prazdny EPS vstup.
Canonical/EPS kluce: doplnene mapovanie print_ops aj pre vz22/vz31/vz34 (okrem folia). Legacy kluce rezanie_yes/rezanie_no zostali ako fallback kompatibilita.
Vz22/vz31/vz34 - navin a operacie: UI aj logika prechod z Rezanie ano/nie na Pocet operacii (0 vreckaren, 1 rezanie, 2 kasirka + rezanie). Logika navinu pri tlaci: zmena iba pri operacii 1, pri 0 a 2 navin nezmeneny. V textovom bloku odstraneny Navin montaz a navin tlac spojeny do formatu napr. 1A / V1 alebo 1A / S1.
Vz22: prazdne perf_enabled a air_enabled sa beru ako NIE. Pri EPS importe je robustne mapovanie hodnot pre perforaciu a vzduchove otvory (A/ano/yes/1 -> ano, N/nie/no/0 -> nie, prazdne -> nie). Opravena logika, aby prazdne polia neviedli k kresleniu perforacie/otvorov.
Vz31 easy_open: do canonical keys workflow pridany kluc easy_open (P/L/prazdne). Import do vz31: P/L nastavuje Strana perforacie a Tvar perforacie, prazdne nastavuje bez perforacie. Doplnena stabilna zolta signalizacia EPS pre PerfShape a PerfSide (mark po dispatch udalostiach).
Vz31 default perforacia: Tvar perforacie nastaveny na default U (v HTML aj reset/load fallback).
Vz34 sposob tlace: opravene, aby pri print_side_bottom = A bola vo vykrese aj v hornom bloku skutocne spodna.
Poznamka ku kompatibilite: starsie TV JSON so starym klucom rezanie sa pri nacitani mapuju na printOps (ano->1, nie->0), aby sa zachovala spatna kompatibilita bez rozbitia starych suborov.
HISTORIA
2026-02-22 19:32 - PRACA
Index: pridane tlacidlo "Nacitat udaje EPS" priamo na hlavny index. Tlacidlo nacita EPS JSON z disku, ulozi payload do localStorage a automaticky otvori cielovy vykres podla target_template.
Index: pridana historia naposledy nacitanych EPS suborov (max 10) v roletke pod textom "Naposledy". Historia je ulozena v localStorage, teda pretrva aj po zavreti prehliadaca a vypnuti PC (na tom istom zariadeni/browseri).
Index: doladene umiestnenie a dizajn akcie "Nacitat udaje EPS" - v jednej vodorovnej osi s logom, zvacsena velkost tlacidla, lepsia citatelnost pre obsluhu.
Vz108: oddelena logika "zlep" a "stroj". Zlep (stred/kraj) urcuje usporiadanie segmentov vykresu; stroj (stary/novy) urcuje obmedzenia PS/BZP a vypocet C (dno/kriz).
Vz108: pridana nova volba "Stroj" v ovladani. Pri zmene stroja sa prepoctu dostupne volby PS/BZP, C a vyska SEK bez resetu celeho vykresu.
Vz108: zachovana kompatibilita so starsimi JSON. Ak stary JSON nema machineMode, pouzije sa fallback zo starej logiky (seamMode=edge -> new, inak old).
Vz108: vizualne odlisene vypoctove polia (.calc) zo zltej na svetlo modru, aby sa neplietli so zlutym EPS prefill.
Vz108: default velkost textu zmenena z 14 px na 10 px (HTML slider, stav, reset aj load fallback).
Vz108 + EPS import: doplnene mapovanie dim_bag_width -> PS pre vz108. Dorobena post-import logika, aby sa pri EPS najprv nastavil/odhadol vhodny stroj podla PS/BZP a az potom aplikovali hodnoty PS a BZP (riesenie prazdnych selectov pri nekompatibilnej tabulke).
Vz31 + EPS import: easy_open (P/L/prazdne) napojeny na perforaciu. P/L nastavuje PerfSide + PerfShape, prazdne nastavuje bez perforacie. Doriesene stabilne zlte oznacenie pre PerfShape a PerfSide aj po dispatch udalostiach.
Vz31: default Tvar perforacie zmeneny na U (UI, reset, load fallback).
Vz22 + EPS import: prazdne perf_enabled a air_enabled sa interpretuju ako NIE. Doplneny robustny prevod A/ano/yes/1 a N/nie/no/0 pre perforaciu a vzduchove otvory.
Vz22/Vz31/Vz34: prechod z rezanie ano/nie na pocet operacii (0/1/2) v UI aj logike navinu; navin sa prepocitava iba pri operacii 1. V textovom bloku odstranene Navin montaz a navin tlac je v tvare "X? / Vn" alebo "X? / Sn".
Dokumentacia: vytvoreny tahak mapovania canonical keys pre vsetky vzory do suboru canonical key/tahak_mapovanie_keys.md (1 strana pre orientaciu pri novych vzoroch a namingu).
Priprava test vetvy: vytvorena kopia vz22 pre experimentalne upravy -vz22_test.html, css/vz22_test.css, js/vz22_test.js.
HISTORIA
2026-02-22 23:10 - PRACA
Vz22_test - zlozeny pohlad: doladena logika zobrazenia podla testovacich poziadaviek. Viditelna cast je K+L, G je skryta pomocna ciara. Zobrazenie vzduchovych otvorov v zlozenom pohlade je upravene na 2 otvory (lava+prava), s vazbou na polia "Vzduchovy otvor od zalozky" (zdola) a "Vzduch. otvor od okraja" (zlava). Pri volbe "otvory len v zalozke" sa znacky kreslia ciarkovane.
Vz22_test - kotovanie: opravene smery kot pre vzduchove otvory (od zalozky zdola, od okraja zlava), dorobene umiestnenie kot pri otvoroch. Odstranena kota umiestnenia zavesneho otvoru od okraja iba v bocnom/zlozenom vykrese, ponechana kota roztece C.
Vz22_test - bokorys: implementovany jednoduchy bocny tvar podla dodaneho SVG (zvisle hrany + spodne V). Rozostup zvislych hran nastaveny na 10 mm. Popis upraveny na "BOKORYS" a posunuty dolava, aby nebol mimo platna.
Vz22_test - texty a pravidla: nazov volby "Typ textov hore" premenovany na "Druh vrecka". Pri volbe "chlieb" sa perforacia automaticky prepne na "nie" a zamkne sa; pravidlo sa aplikuje pri zmene volby, reset, load JSON aj inicializacii stranky.
Vz22_test - export PNG: opravena chyba "Nepodarilo sa vygenerovat PNG". V exporte sa inline-uju odkazy na obrazky zhora/zdola do data URI pred renderom SVG do canvas; doplneny console error pre diagnostiku.
Index/EPS: zruseny eps_index workflow. Zmazany subor eps_index.html, odstranene presmerovanie z hesla 2026_EPS v index.html, odstraneny suvisiaci riadok v canonical key/line_counts.csv.
Kontrola historie suboru: historia.md ma cca 95.5 KB a 1692 riadkov, velkost je aktualne v poriadku.
HISTORIA
