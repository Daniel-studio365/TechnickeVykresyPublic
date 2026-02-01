### <span style="color:blue">2026-01-02 12:49</span>
#### Uzivatel:
som spat, over cestu a zapis do historie

#### AI:
Overil som cestu (C:\Users\nagyd\OneDrive - CHEMOSVIT GROUP\WebProjekty\MojaAplikacia), mam prava zapisovat; vykonal som kontrolny zapis (ASCII, bez diakritiky).

---
### <span style="color:blue">2026-01-02 13:09</span>
#### Uzivatel:
pridaj roletku A-E v navine, bez logiky, pripravene na dalsie podmienky

#### AI:
Do sekcie Navin som pridal novu roletku Varianta navinu (A-E); stav sa uklada v resete aj JSON (state.rollVariant). Funkcnost zatiaľ nemenena, pripravene na dalsie podmienky.

---
### <span style="color:blue">2026-01-02 13:14</span>
#### Uzivatel:
zobraz ABC v navine pri type 1 a variante D

#### AI:
Do kresby navinu som pridal label „ABC“ (pri type navinu 1 a variante D) umiestnený v obdlzniku navinu; ostatne typy/varianty nemenene.

---
### <span style="color:blue">2026-01-02 13:18</span>
#### Uzivatel:
umiestnit ABC dnu, vacsie (75% priemeru), bold

#### AI:
Label ABC v navine (type 1, varianta D) presunuty dnu pri sipke, font ~0.75*rollR, bold; textWithBg podporuje custom font-size/weight.

---
### <span style="color:blue">2026-01-02 13:20</span>
#### Uzivatel:
velkost 100%, os textu s osou kruhu

#### AI:
ABC ma velkost ~1.0*rollR a je centrovane na os kruhu (yRoll); ostatne typy navinu bez zmeny.

---
### <span style="color:blue">2026-01-02 13:22</span>
#### Uzivatel:
to iste pre 3D

#### AI:
Label ABC sa zobrazi aj pri navine typu 3 s variantom D (rovnaka pozicia a velkost ako pri type 1); ostatne naviny bez zmeny.

---
### <span style="color:blue">2026-01-02 13:24</span>
#### Uzivatel:
pri 3D nech je ABC pod osou kruhu, na sipke

#### AI:
Pre navin typu 3 a variant D som posunul ABC pod os kruhu (yRoll + 0.6*rollR); typ 1 ostava na osi. Ostatne naviny bez zmeny.

---
### <span style="color:blue">2026-01-02 13:27</span>
#### Uzivatel:
posun ABC pri 3D viac dolu (1.2*rollR)

#### AI:
ABC pri navine typu 3 a variante D je posunute na yRoll + 1.2*rollR; typ 1 ostava na osi. Ostatne naviny bez zmeny.

---
### <span style="color:blue">2026-01-02 13:34</span>
#### Uzivatel:
posun ABC pri 3D na 2.0*rollR

#### AI:
ABC pre navin 3D, varianta D je posunute na yRoll + 2.0*rollR; typ 1 ostava na osi. Ostatne naviny bez zmeny.

---
### <span style="color:blue">2026-01-02 13:57</span>
#### Uzivatel:
zvacsit priestor pod navinom pre 3/4/7/8 (yRoll -50)

#### AI:
Pri alt navine (typy 3/4/7/8) som posunul yRoll na baseYRoll - 50 (bol -30), cim sa zvacsi vzdialenost medzi kruhmi a obdlznikom; ostatne typy bez zmeny.

---
### <span style="color:blue">2026-01-02 14:06</span>
#### Uzivatel:
zvys minimum rollR na 40mm

#### AI:
Minimalny rollR zvyseny na 40 (predtym 4), inak dalej W/10; velkost ABC sa teda zvysi pri velmi malych W.

---
### <span style="color:blue">2026-01-02 14:16</span>
#### Uzivatel:
fix textu 40, Y = yTop + 30 (typ 1/3, varianta D)

#### AI:
ABC pre typ 1/3, varianta D ma fixnu velkost fontu 40 a Y poziciu yTop+30; X ostava na strede obdlznika navinu. Ostatne nezmenene.

---
### <span style="color:blue">2026-01-02 14:18</span>
#### Uzivatel:
posun textu hore (yTop - 30)

#### AI:
ABC (typ 1/3, varianta D) ma fix font 40 a Y = yTop - 30 (posun hore); X ostava na strede obdlznika. Ostatne bez zmeny.

---
### <span style="color:blue">2026-01-02 14:20</span>
#### Uzivatel:
posun textu hore (yTop - 40)

#### AI:
ABC (typ 1/3, varianta D) ma Y = yTop - 40, font 40; X ostava na strede obdlznika. Ostatne bez zmeny.

---
### <span style="color:blue">2026-01-02 14:25</span>
#### Uzivatel:
zmensit biely blok pod textom (o 2 mm)

#### AI:
Zmensil som podklad textu: mensi vertikalny padding (padY=1) v textWithBg, vodorovny ostava 3; ostatne bez zmeny.

---
### <span style="color:blue">2026-01-02 14:28</span>
#### Uzivatel:
pri 1/2/5/6 daj Y = yTop - 50, pri 3/4/7/8 nechaj -40

#### AI:
Pre navin typu 1/2/5/6 (varianta D) je ABC na yTop-50, pre 3/4/7/8 ostava na yTop-40; ostatne nezmenene.

---
### <span style="color:blue">2026-01-02 14:36</span>
#### Uzivatel:
text nech je pri 1 pre vsetky varianty a pri 3 pre vsetky varianty

#### AI:
Podmienku som uvolnil: ABC sa zobrazuje pre vsetky varianty typu 1 (yTop-50) a typu 3 (yTop-40); ostatne typy bez zmeny.

---
### <span style="color:blue">2026-01-02 14:38</span>
#### Uzivatel:
pridaj text (1) otoceny pre typ 2

#### AI:
Pre typ 2 zobrazuje ABC (pozicia ako typ 1) s rotaciou 180° okolo stredu textu; typy 1/3 ostali bez zmeny.
---
### <span style="color:blue">2026-01-02 14:41</span>
#### Uzivatel:
text pri 2 sa nezobrazuje

#### AI:
Rotaciu textu pre typ 2 som upravil (translate+rotate okolo stredu), aby sa zobrazil; ostatne naviny bez zmeny.
---
### <span style="color:blue">2026-01-02 14:47</span>
#### Uzivatel:
text pri 2 nevidno

#### AI:
Rotaciu textu pri type 2 som zjednodusil na rotate(180 cx cy) okolo stredu textu; pozicia/velkost ostava ako pri type 1.
---
### <span style="color:blue">2026-01-02 14:51</span>
#### Uzivatel:
text pri 2 stale nie je vidno

#### AI:
Pri type 2 som doplnil transform-box/fill-box a transform-origin=center a rotaciu 180stupnov okolo stredu textu; poloha a velkost ostavaju ako pri type 1.
---
### <span style="color:blue">2026-01-02 14:53</span>
#### Uzivatel:
text pri 2 stale nie je vidno, urob test rovnako ako pri 1

#### AI:
Pre typ 2 som zatial dal text rovnako ako typ 1 (bez rotacie), samostatna podmienka pripraveny na dalsiu logiku; poloha yTop-50, font 40.
---
### <span style="color:blue">2026-01-02 15:02</span>
#### Uzivatel:
text pri 2 stale nevidiet

#### AI:
Pridal som fallback kreslenie ABC pre typ 2 (yTop-50, font 40) mimo navin vetvu, aby sa urcite zobrazil; ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:06</span>
#### Uzivatel:
rotovat fallback text pre typ 2 o 180

#### AI:
Fallback ABC pre typ 2 som otocil 180 stupnov okolo stredu textu; ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:14</span>
#### Uzivatel:
v1 text pri 2 nevidiet, oprav bez duplicity

#### AI:
Vymazal som predchadzajuce duplikaty a pridana jednotna cast po navine: typ 1 (yTop-50), typ 3 (yTop-40), typ 2 (yTop-50, rotacia 180 stupnov), s mensim paddingom pozadia. Malo by sa zobrazit bez duplicit.
---
### <span style="color:blue">2026-01-02 15:18</span>
#### Uzivatel:
zmensi padding na 30 vysky a 70 sirky

#### AI:
Pridal som do textWithBg volitelne boxWidth/boxHeight a pre ABC (typy 1/2/3) nastavujem fixny box 70x30; default pad ostal minimalny. Text pri type 2 sa kresli s rotaciou 180 stupnov ako typ 1.
---
### <span style="color:blue">2026-01-02 15:30</span>
#### Uzivatel:
text z 3 aplikuj na 4, otoc 180

#### AI:
Pre typ 4 sa zobrazuje ABC na yTop-40 s rotaciou 180 stupnov (rovnaky box 70x30 a font 40 ako typ 3); ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:34</span>
#### Uzivatel:
fixna velkost sipky navinu

#### AI:
Sipku navinu som nastavil fixnejsiu: marker zmenseny (width/height 12), pouzite na start/end oboch sipiek, aby nebol zavisly od hrubky ciary. Ostatne bez zmeny.
---
### <span style="color:blue">2026-01-02 15:39</span>
#### Uzivatel:
sipka sa meni a je dvojita

#### AI:
Sjednotil som sipku: marker s markerUnits=userSpaceOnUse (12x12), len na konci ciar (odstraneny marker-start), aby sa nemnila s hrubkou a nebola dvojita.
---
### <span style="color:blue">2026-01-02 15:41</span>
#### Uzivatel:
sipka stabilna, zvacsit na 15x15

#### AI:
Marker sipky som zvacsil na 15x15 (userSpaceOnUse), dalej ostava len na konci ciar.
---
### <span style="color:blue">2026-01-02 15:44</span>
#### Uzivatel:
otoc textu z 1 o 90 doprava pre typ 5

#### AI:
Pre typ 5 zobrazujem ABC (yTop-40, box 70x30, font 40) otocene o 90 okolo stredu; ostatne typy ostali nezmenene.
---
### <span style="color:blue">2026-01-02 15:45</span>
#### Uzivatel:
typ 5 je v skupine 1/2/5/6

#### AI:
Pre typ 5 som posunul ABC na yTop-50 (ako skupina 1/2/5/6) s rotaciou 90; ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:48</span>
#### Uzivatel:
posun textu 5 nech nekryje sipku

#### AI:
Typ 5 som posunul o +25 mm (yTop-50+25) pred rotaciou 90, aby nekryl sipku; ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:50</span>
#### Uzivatel:
posun text 5 horizontalne, vertikalne naspat

#### AI:
Typ 5 ma opat yTop-50, ale horizontalny posun +25 mm, rotacia 90 okolo noveho stredu; ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:52</span>
#### Uzivatel:
podobne pre 6, text z 1 otoc -90

#### AI:
Pre typ 6: Y = yTop-50, horizontalny posun -25, rotacia -90� (text z 1), box 70x30 a font 40; ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:54</span>
#### Uzivatel:
text z 3 pre 7, otoc 90 doprava, posun horizontalne

#### AI:
Pre typ 7: text (ako 3) na yTop-40, posun +25 mm a rotacia 90� okolo stredu; box 70x30, font 40. Ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:56</span>
#### Uzivatel:
zmen baseYRoll-alt na -60

#### AI:
Pre alt naviny (3/4/7/8) som posunul yRoll na baseYRoll - 60 (predtym -50); standardne typy ostavaju na baseYRoll.
---
### <span style="color:blue">2026-01-02 15:57</span>
#### Uzivatel:
posun alt navinu na -65

#### AI:
Pre alt naviny (3/4/7/8) som posunul yRoll na baseYRoll - 65 (predtym -60); standardne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 15:59</span>
#### Uzivatel:
posun text 7 na yTop-45

#### AI:
Typ 7 posunuty na yTop-45 (posun +25 mm horizontalne, rotacia 90), ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 16:01</span>
#### Uzivatel:
posun textu 7 funguje; pre 8 otoc -90 a posun ako 7

#### AI:
Typ 8: text (ako 3) na yTop-45, horizontalny posun -25 mm, rotacia -90; box 70x30, font 40. Ostatne typy bez zmeny.
---
### <span style="color:blue">2026-01-02 16:11</span>
#### Uzivatel:
variant A: fotoznak 7x15mm, 5mm pod vrchom, vlavo/vpravo, vypln cierna

#### AI:
Pre variant A kreslim dva fotoznaky: 15x7 mm, 5 mm pod vrchom vykresu, lavy zarovnany na offsetX, pravy na offsetX+L-15, vypnene ciernou. Ostatne varianty bez zmeny.
---
### <span style="color:blue">2026-01-02 16:14</span>
#### Uzivatel:
posun fotoznaky variant A na -5 mm od vrchu

#### AI:
Fotoznaky variantu A (15x7 mm) som posunul na yTop-5 mm; lavy na offsetX, pravy na offsetX+L-15. Ostatne bez zmeny.
---
### <span style="color:blue">2026-01-02 16:15</span>
#### Uzivatel:
posun fotoznaky variant A na yTop-12

#### AI:
Variant A fotoznaky posunute na yTop-12 (15x7 mm, lavy offsetX, pravy offsetX+L-15). Ostatne varianty bez zmeny.
---
### <span style="color:blue">2026-01-02 16:24</span>
#### Uzivatel:
dynamicka velkost fotobunky (4% W, 3% L), umiestnenie -5+vyska

#### AI:
Variant A fotoznaky maju velkost vypocitanu: sirka = 3% z L (limit 10..30 mm), vyska = 4% z W (limit 5..20 mm); Y = yTop - 5 - vyska. Ostatne varianty bez zmeny.
---
### <span style="color:blue">2026-01-02 16:26</span>
#### Uzivatel:
varianta B fotoznak len vlavo

#### AI:
Varianta B kresli len lavy fotoznak (dynamicka velkost 3%L/4%W s limitmi, yTop-5-vyska); varianta A ostava s oboma. Ostatne varianty bez zmeny.
---
### <span style="color:blue">2026-01-02 16:31</span>
#### Uzivatel:
variant C pravy, D bez fotoznaku

#### AI:
Fotoznaky: A = obidva, B = len lavy, C = len pravy (dynamicka velkost 3%L/4%W, yTop-5-vyska), D = ziadny. Ostatne varianty bez zmeny.
---
### <span style="color:blue">2026-01-02 16:35</span>
#### Uzivatel:
variant E fotoznak v strede, posuny podla typu

#### AI:
Variant E: stredovy fotoznak (3%L/4%W, limity) s posunom: pre typy 1/2/3/4 je X = stred + (markW/2 + 5), pre 5/7 X = stred+25, pre 6/8 X = stred-25, Y = yTop-5-vyska. Ostatne varianty bez zmeny.
---
### <span style="color:blue">2026-01-02 16:39</span>
#### Uzivatel:
E: posuny podla textov 6/8 vs 5/7

#### AI:
Variant E: pre 5/7 pouziva X posun -25 (ako text 6/8), pre 6/8 X +25 (ako text 5/7); typy 1/2/3/4 ostavaju stred+(markW/2+5). Y = yTop-5-vyska, dynamicka velkost zachovana.
---
### <span style="color:blue">2026-01-02 16:48</span>
#### Uzivatel:
manualny rozmer fotoznaku (pod navin)

#### AI:
Pod navin som pridal vstupy sirka/vyska fotoznaku (default 15x7). Dynamicky vypocet som nahradil pouzitim tychto hodnot; reset/save/load ich berie. Fotoznaky A/B/C/E teraz beru markW/H z tychto vstupov; Y = yTop-5-vyska. Ostatne bez zmeny.

---
### <span style="color:blue">2026-01-02 17:04</span>
#### Uzivatel:
super. zatial OK. idem testovat ostatne funkcie, ci sa nieco neporuchalo. urob analyzu vsetkych suborov a zisti, ci nie su nejake duplicitne premenne (alebo zbytocne) a nefunkcne funcie. "ocisti kod" od nepotrebnyhc veci. ponechaj bez zmeny "folia_lito_docasny". zaloha urobena. k tomuto stavu sa vieme vratit

#### AI:
Refaktoroval som blok ABC v navine do jedinej mapy (zachovane posuny/rotacie pre typy 1-8) a fotoznaky beru rozmery priamo zo state (jednotne volanie, bez opakovaneho citania DOM). Logika a umiestnenia ostali nezmenene, folia_lito_docasny som nechal tak.

---
### <span style="color:blue">2026-01-02 17:14</span>
#### Uzivatel:
vyzera, ze vsetko funguje. nateraz staci. este sa sem vratim

#### AI:
Rozumiem, zatial nic dalsie nemenim. Kedykolvek sa vratis, mozem pokracovat.

---
### <span style="color:blue">2026-01-02 20:56</span>
#### Uzivatel:
vyska je sek. rozdelit na dve polia kriz je spodny rozmer a zvysok je horny. cize rozdelenie bude prve pole sek-kriz. sirka je sirka celkovo. rozdelit je treba podla stlpcov K az S.X pomocny kod nie je potrebne riesit, je to "link na hotove pdf". skus nieco vytvorit. ak by to bolo celkom zle, skusime odznova a podmienky upravim

#### AI:
Vytvoril som novy modul vz108 (vz108_pdf.html/css/js). Vstupy B..G prepoctu polia K–S podla excel logiky, sek (B+E) sa deli na hornu cast a kriz (E). Vykres zobrazi delenie sirky (K..S), vysku (sek), horizontalnu ciaru kriza a koty; export PDF/PNG/JSON a reset su priamo na stranke. Pomocny kod X som neriesil. Ak treba upravit vzorce alebo layout, viem to doladit.

---
### <span style="color:blue">2026-01-02 21:05</span>
#### Uzivatel:
na uvod celkom fajn. bude potrebne urobit "roletky" zacneme dlzka B. bude roletka. od 155 do 410 s krokom po 5

#### AI:
Pre dlzku B som zmenil vstup na roletku (select) s hodnotami 155..410 po 5, default 165. Ostatne polia a vypocty ostali bez zmeny.

---
### <span style="color:blue">2026-01-02 21:12</span>
#### Uzivatel:
lava a horna sipka na kotach su opacne. orpav to

#### AI:
Opravil som koty v js/vz108_pdf.js: pouzivam oddelene markery pre start/koniec (arrow-start, arrow-end), aby sipky smerovali spravne na oboch stranach (horizontalne aj vertikalne). Vykres aj export by mali mat korektnu orientaciu sipiek.

---
### <span style="color:blue">2026-01-02 21:50</span>
#### Uzivatel:
ok. na dnes staci. pokracujeme zajtra

#### AI:
Rozumiem, na dnes koncime. Ked budes pokracovat, som pripraveny.

---
### <span style="color:blue">2026-01-03 21:27</span>
#### Uzivatel:
OK. skúsim to. ak to budem mať, dám ti tu svg, alebo ai. dal by sa potom (ak sa to podarí) zobrazovať aj obrázok na 3d modeli, ktorý importujem do technického výkresu? (samozrejme deformovyný ako 3D model) Aby to bolo jasnejsie, technický výkres je pre vrecko z folie a chcel by som nejaké 3D zobrazenie technického výkresu a umiestnenie grafiky na ňom. Dalo by sa to potom aj ako ďalšia strana technického výkresu, alebo volitelne zobrazenie?

#### AI:
Viem to spravit: 1) pseudo-3D v SVG/Canvas s polygónmi pre plochy (id pre kazdu), obrazok sa priradi cez clip/transform (uv mapovanie roh->roh), alebo 2) jednoduche 2D rozlozenie s texturou. Mozeme to mat ako volitelne zobrazenie alebo druhu stranu. Ak prinesies SVG s polygónmi a poradím rohov, pripravim mapovanie a vz108_test, ktore pouzije importovany obrazok ako texturu.

---
### <span style="color:blue">2026-01-03 21:27</span>
#### Uzivatel:
OK. tak na dnes staci. idem skúsit pripraviť podklad pre test. Ďakujem

#### AI:
Rozumiem, na dnes koncime. Ked budes pokracovat, som pripraveny.

---
### <span style="color:blue">2026-01-04 15:07</span>
#### Uzivatel:
nateraz necham vz108 tak. vratim sa k folia. chcem sa opytat, ci by bolo mozne vytvorit kopiu vsetkych folia suborov potrebnych na chod aplikacie folia a urobit folia_test. chcel by som otacat technicky vykres o 180 stupnov a myslim si, ze to bude velky zasah do kodu. tak by som radsej urobil folia_test a ak by to fungovalo, premenovali by sme ho na folia. je to dobry postup? alebo radsej zasahovat do tejto varianty? momentalna zaloha je vytvorena. co je lepsie?

#### AI:
Rozumny postup je spravit paralelnu kopiu folia -> folia_test (HTML/CSS/JS) a tam skusat rotaciu o 180; po odladeni to preklopime. Skopiroval som folia.html/css/js do folia_test.* a v folia_test.html som upravil odkazy na nove css/js. Index sme nemenili.

---
### <span style="color:blue">2026-01-04 15:20</span>
#### Uzivatel:
super. chcel by som, vykonat nasledovne: potrebujem, aby pribudli zaciarkavacie policka prepinac - ako je zobrazit navin, tak by bolo finalny navin (to je funkcne to co je teraz, takze iba premenovat nazov), navin pri tlaci, navin pri montazi. moze byt zaciarknute iba jedno z nich, alebo ziadne. funknosti by sme pridali potom. bude to trochu zamotane, ale pojdeme postupne zatial iba pridaj tie dve polica navin pri tlaci a navin pri montazi (bez funkcii) a to co je teraz premeuj na finalny navin. nazov sekcie bude namiesto Navin folie - Zobrazit navin. skus to. ak mas nejasnosti, tak najskor sa dotazuj az potom preved

#### AI:
Vo folia_test som premenoval sekciu na Zobrazit navin, checkbox „Zobrazit navin“ na „Finalny navin“ a pridal dva nove checkboxy „Navin pri tlaci“ a „Navin pri montazi“. Su navzajom vylucne (max. jeden alebo ziadny), ukladam ich do JSON/reset. Funkcnost kreslenia ostava nezmenena (navin riadi finalny navin).

---
### <span style="color:blue">2026-01-04 15:45</span>
#### Uzivatel:
OK. tak teraz skusme pridat funkcie. navin pri tlaci, by mal urobit, ze otoci navin na spodok technickeho vykresu otoci sa o 180 stupnov oproti osi technickeho vykresu. (aj text, aj sipka) Cize pozicia "navinu" by bola identicky, ibaze z dola technickeho vykresu. Tym padom by bolo fajn, aby sa koty "premiestnili" hore (zmena v roletke koty sirky na hore). Vies co pozadujem? Ak mas nejasnosti poloz mi doplnujuce otazky

#### AI:
Do folia_test som pridal logiku pre “Navin pri tlaci”: navin sa zobrazi zospodu a je zrkadleny vertikalne (text aj sipka otocene o 180), pri tomto rezime sa vodorovne koty zobrazia hore (bez zmeny nastavenia v UI). Navin sa kresli, ak je zaskrtnuty finalny/navin pri tlaci/navin pri montazi; pre montaz zatial bez specialnej logiky. Upravil som aj ukladanie/reset novych prepinacov.

---
### <span style="color:blue">2026-01-04 16:05</span>
#### Uzivatel:
Nie celkom takto. Jednak je "návin" ďaleko od technickeho vykresu (mal by byt 5mm) a je zrkadleny, nie otoceny. Ja ho potrebujem otocit. aj umiestnenie fotobunky

#### AI:
Navin pri tlaci som prerobil: teraz sa otaca o 180 stupnov okolo stredu vykresu a po rotacii sa posunie tak, aby zacinal 5 mm pod vykresom. Pouzivam bbox navinu namiesto zrkadlenia; text, sipka aj fotobunky sa otacaju spolu. Horizontalne koty sa pri tomto rezime stale kreslia hore.

---
### <span style="color:blue">2026-01-04 16:18</span>
#### Uzivatel:
pozicia sa nezmenila. navin by mal mat poziciu "vyska + 5mm" aby zacinala fotobunka (cize cast, ktora bola -5. Premyslam spravne?

#### AI:
Upravil som transform pre „Navin pri tlaci“: rotujem o 180 okolo stredu vykresu a potom translaciu pocitam z bbox po rotacii tak, aby minY navinu bol yBottom+5. Transformy su v poradi translate -> rotate (rotate sa aplikuje ako prve), takze by mal byt navin prilepeny 5 mm pod vykresom.

---
### <span style="color:blue">2026-01-04 16:28</span>
#### Uzivatel:
neviem, kde je chyba vo vypocte, ale navin sa umiestni vyska + 110 (cize fotobunka a koniec navinu je vyka + 110 od spodnej hrany technickeho vykresu). neviem, s cim to suvisi. urcenie stredu technickehov vykresu? A pri 3/4/7/8/ je to este viac (tam je inac pocitana pozicia navinu)

#### AI:
Zmenil som transformaciu: pouzivam bbox navinu bez transformacie, rotujem o 180 okolo stredu navinu a az potom posuvam o dy = (yBottom+5 - bb.y). Teda flip okolo vlastneho stredu a posun tak, aby horny okraj navinu sedel 5 mm pod vykresom (aj pre alt typy). RollBounds sa pocita z noveho bboxu.

---
### <span style="color:blue">2026-01-04 16:36</span>
#### Uzivatel:
OK. teraz to je skoro bobre. pri rotacii sa nam posunie "navin" o velkost vacsieho kruhu. pri 1/2/5/6 do lava, pri 3/4/7/8 doprava. skus to upravit

#### AI:
Otacanie pri „Navin pri tlaci“ som upravil: rotujem o 180° okolo stredu vykresu (pivot X=L/2, Y=W/2), potom posuvam tak, aby horny okraj navinu bol 5 mm pod vykresom. Tým by sa mala odstranit bocna odchylka aj pri typoch 3/4/7/8; rollBounds sa pocita z noveho bboxu.

---
### <span style="color:blue">2026-01-04 16:45</span>
#### Uzivatel:
posun horizontalne spravne, ale vertikalne to nesedi... ostalo to na mieste (cize hore). predposledny spravny vypocet  dy = yBottom + 5 - bb.y sa nevykonal. navin ostal hore

#### AI:
Vratil som vertikalny posun na bb navinu: po rotacii o 180 okolo stredu vlastneho bboxu pocitam dy = (yBottom+5 - bb.y) a aplikujem translate po rotacii, aby horny okraj navinu sedel 5 mm pod vykresom. Horizontalny pivot ostava v strede bbox.

---
### <span style="color:blue">2026-01-04 16:55</span>
#### Uzivatel:
posuva sa to opacne, cize hore a dalej od vykresu a aj horizontalne to je teraz zase zle. krok dozadu bol dobre horizontalne, dva kroky dozadu vertikalne

#### AI:
Znovu som upravil transform: pivotujem okolo stredu vykresu (offsetX+L/2, yTop+W/2) pre spravne horizontalne zarovnanie, potom po rotacii ratam bbox a dy = yBottom+5 - bb.y a pridavam translate za rotaciou (`rotate(...) translate(...)`). TYM by mal ostat horizontalne ok a vertikalne sediet 5 mm pod vykresom.

---
### <span style="color:blue">2026-01-04 17:05</span>
#### Uzivatel:
horizontalne to je spravne. ostalo to hore. tu je tvoj zapis, co si urobil, aby to bolo spravne vertikalne: "Transform pri „Navin pri tlači“ som zmenil: navin sa rotuje o 180° okolo svojho stredu (bbox bez transformácie) a až potom posúva o dy = yBottom + 5 - bb.y, takže horný okraj navinu by mal sedieť 5 mm pod výkresom aj pri typoch 3/4/7/8. RollBounds sa počíta z nového bboxu. Ak stále nesedí, daj vedieť, posuniem o presnú hodnotu."

#### AI:
Nasadil som rotaciu okolo stredu vlastneho bboxu a potom translate o dy = yBottom+5 - bb.y (`translate(...) rotate(...)`), aby horny okraj navinu sedel 5 mm pod vykresom; horizontalna pozicia zostava, rollBounds pocitam z noveho bboxu.

---
### <span style="color:blue">2026-01-04 13:33</span>
#### Uzivatel:
tak. teraz to je vertikalne spravne. 

#### AI:
Super, vertikalne sedi. Ak bude treba este doladit „navin pri montazi“ alebo ine odchylky, daj vediet.

---
### <span style="color:blue">2026-01-04 17:14</span>
#### Uzivatel:
skus este doladit umiestenie horizontalne. momentalne umiestnenie 1/2/5/6 posun o priemer vacsieho kruhu doprava, a pri 3/4/7/8 o priemer vacsieho kruhu dolava (zalohu mam urobenu, ak by sa to znova zamotalo) 

#### Uzivatel:
skus este doladit umiestenie horizontalne. momentalne umiestnenie 1/2/5/6 posun o priemer vacsieho kruhu doprava, a pri 3/4/7/8 o priemer vacsieho kruhu dolava (zalohu mam urobenu, ak by sa to znova zamotalo)samozrejme bavime sa o navin pri tlaci. finaln y navin nechaj tak

#### AI:
Pri navine pri tlaci pridavam po rotacii horizontalny posun: pre typy 1/2/5/6 +rollR, pre 3/4/7/8 -rollR, transform `rotate(...) translate(...)`, vertikalne ostava 5 mm pod vykresom. Overenie v praxi, ci 1/2/5/6 sa uz posunu.

---
### <span style="color:blue">2026-01-04 17:23</span>
#### Uzivatel:
teraz je to zle. uteká to na druhú stranu  - dohora a posun horizontalne je opacne 

#### AI:
Upravil som poradie: najprv rotujem okolo stredu vykresu, zmeriam bbox, potom translate dx/dy (dx = +rollR pre 1/2/5/6, -rollR pre 3/4/7/8; dy = yBottom+5 - bb.y) pouzity ako `translate(...) rotate(...)`. Malo by to drzat navin 5 mm pod vykresom a spravne horizontalne. Skus prosim, ci to uz sedi.

---
### <span style="color:blue">2026-01-04 17:33</span>
#### Uzivatel:
1/2/5/6 podun prebehne, ale iba o priemer maleho kruhu. ostatne je OK. nic ine nemen, iba posun podla vekleho kruhu (nie maleho)

#### AI:
Pri navine pri tlaci posuvam 1/2/5/6 o dvojnasobok rollR (velky kruh) a 3/4/7/8 o -2*rollR, aby sa horizont vyrovnal; ostatne zostava nezmenene.

---
### <span style="color:blue">2026-01-04 17:38</span>
#### Uzivatel:
ale teraz si zrušil horizontalny posun pri 3/4/7/8. ten mal ostat bez zmeny. ten bol OK

#### AI:
Vratil som 3/4/7/8 na povodny posun (-rollR) a pre 1/2/5/6 nechavam +2*rollR, vertikalne 5 mm pod vykresom. Ostatne bez zmeny.

---
### <span style="color:blue">2026-01-04 13:52</span>
#### Uzivatel:
OK. nateraz staci. musim odist. vsetko funguje, ako som chcel

#### AI:
Rozumiem, vsetko aktualne funguje podla poziadaviek. Ked budes pokracovat, som pripraveny.

---
### <span style="color:blue">2026-01-06 15:27</span>
#### Uzivatel:
aha. jasne. Nateraz staci. este sa sem vratim

#### AI:
Rozumiem, davam pauzu. Ked sa vratis, mozem pokracovat.

---
### <span style="color:blue">2026-01-06 18:24</span>
#### Uzivatel:
co to znamena?  skeleton fetch/save do Supabase. 

#### AI:
Skeleton fetch/save do Supabase = pripravit zakladny JS kod na pripojenie k Supabase (URL, API key), funkcie na nacitanie/ulozenie (firmy, JSON vykresu), bez dalsich UI zmien. Teda minimalny “kostrový” kod, aby sme uz mali drôty do DB a mohli to neskôr rozšíriť.
---
### <span style="color:blue">2026-01-06 18:35</span>
#### Uzivatel:
ak by som ostal na netlify, tak ako je, bolo by lepsie preskocit vyber firmy a pri vybere vzoru (resp folia) by sa dalo rovno prejst na technicky vykres, bez citania predvolenych udajov. cize momentalny index by ostal ako je pre PC (premenovali by sme ho na indexPC) a novy index by preskakoval veci s nacitavanim a opravovanim a udajmi o firme. Premyslam dobre?

#### AI:
Pripravil som webovy index (index.html) s jednoduchou volbou: Vrecko (Vz22/31/34) a Folia/Folia_test, plus odkaz na PC verziu. Povodny index som skopiroval do indexPC.html, nemenil som jeho funkcnost. Web verzia nema vyber firiem ani upravy, len otvara vykresy.
---
### <span style="color:blue">2026-01-06 18:35</span>
#### Uzivatel:
ak by som ostal na netlify, tak ako je, bolo by lepsie preskocit vyber firmy a pri vybere vzoru (resp folia) by sa dalo rovno prejst na technicky vykres, bez citania predvolenych udajov. cize momentalny index by ostal ako je pre PC (premenovali by sme ho na indexPC) a novy index by preskakoval veci s nacitavanim a opravovanim a udajmi o firme. Premyslam dobre?

#### AI:
Pripravil som webovy index (index.html) s jednoduchou volbou: Vrecko (Vz22/31/34) a Folia/Folia_test, plus odkaz na PC verziu. Povodny index som skopiroval do indexPC.html, nemenil som jeho funkcnost. Web verzia nema vyber firiem ani upravy, len otvara vykresy.
---
### <span style="color:blue">2026-01-06 18:24</span>
#### Uzivatel:
co to znamena?  skeleton fetch/save do Supabase. 

#### AI:
Skeleton fetch/save do Supabase = pripravit zakladny JS kod na pripojenie k Supabase (URL, API key), funkcie na nacitanie/ulozenie (firmy, JSON vykresu), bez dalsich UI zmien. Teda minimalny �kostrovy� kod, aby sme uz mali droty do DB a mohli to neskor rozsirit.
---
### <span style="color:blue">2026-01-06 15:27</span>
#### Uzivatel:
aha. jasne. Nateraz staci. este sa sem vratim

#### AI:
Rozumiem, davam pauzu. Ked sa vratis, mozem pokracovat.
---
### <span style="color:blue">2026-01-06 18:56</span>
#### Uzivatel:
perfektne. funguje to na webe bez moznosti ukladat firmy, ale s moznostou nahliadnut do buducej verzie s databazou. takto som si to nejako predstavoal. predpoklad�m, ze import firiem funguje iba v lokalnej pamati pc a ked vypnem prehliadac, tak sa to zmaze. je tak?... dakujem

#### AI:
�no, na webe sa firmy drzia len v pamati prehliadaca (po zatvoreni sa stratia). PC verzia ma export/import JSON, tam si ich mozes ulozit a znova nacitat. Trvale ulozenie vieme doplnit neskor (localStorage alebo DB), ale teraz je to docasne.
---
### <span style="color:blue">2026-01-06 18:59</span>
#### Uzivatel:
no. asi zdielane data zatial nechame tak. ukladanie hotovych vytvorenych vykresov by sa sali ako cez nitlify? budu sa dat lokalne ukladat na plochu a potom odtial nacitat?

#### AI:
Netlify staticky hosting nijako neblokuje lokalne ulozenie: PDF/PNG export aj JSON save/download funguju rovnako, pouzivatel si subory stiahne na plochu a neskor ich cez �Nacitat� otvori (lokalny file input). Ziadna serverova DB nie je nutna; problem by bol len pri fetch z neexistujucich ciest/file://, ale pri hostingu cez HTTPS to funguje.
---
### <span style="color:blue">2026-01-06 19:10</span>
#### Uzivatel:
co odporucas?

#### AI:
Odporucam postup po etapach: 1) teraz len staticky web (Netlify/GitHub Pages) na demo bez DB (exporty/JSON zostavaju lokalne); 2) ked budete chciet zdielane data, pridat externu DB (Supabase/Firebase), cez ktoru ulozite firmy a JSON vykresov + jednoduche prihlasenie. Tak r�chlo ukazete UI a neskor doplnime zdielanie.
---
### <span style="color:blue">2026-01-06 18:52</span>
#### Uzivatel:
co to znamena?  skeleton fetch/save do Supabase. 

#### AI:
Skeleton fetch/save do Supabase = pripravit zakladny JS kod na pripojenie k Supabase (URL, API key), funkcie na nacitanie/ulozenie (firmy, JSON vykresu), bez dalsich UI zmien. Teda minimalny �kostrovy� kod, aby sme uz mali droty do DB a mohli to neskor rozsirit.
---
### <span style="color:blue">2026-01-06 19:12</span>
#### Uzivatel:
ske mame netlify verzia, mozme pokracovat v upravach folia_test?

#### AI:
�no, mozeme pokracovat na folia_test. Firmy na webe sa drzia len v pamati prehliadaca; na PC verzii ostava export/import JSON.
---
### 2026-01-06 19:01
#### Uzivatel:
OK. ut to mam. ideme pokracovat. vo folia_test potrebujem urobit dalsi blok. tlac. bol by este pred "zobrazit navin" budu v nej jedna rozbalovacia roletka - pocet operacii 1, 2, 3, 4, 5, 6,- druhy riadok bude prepinacie policko tlac: spodna - vrchna. zatial pridaj toto, potom pridame funkcie, ktoro budu ovplivnovat navin.

#### AI:
Pridal som do folia_test.html novy blok "Tlac" nad sekciu Zobrazit navin: roletku Pocet operacii (1-6) a prepina�e Tla� Spodna/Vrchna. Zatial bez logiky v JS, len UI priprava.
---
### 2026-01-06 19:10
#### Uzivatel:
vyborne.chel by som: Pod vairantu navinu pridat dva riadky: Navin pri tlaci (podmienka - ak je pocet operacii parne, Navin pri tlaci sa rovna Finalneny navin). Ak je neparny, tak sa bude menit podla viacerych podmienok. Podmienky pripravim v textovom subore. Najskor odpovedz, ci to tak moze byt

#### AI:
Ano, moze to byt tak: doplnim do UI dva riadky pod Varianta navinu a logiku neskor podla textoveho suboru (parny pocet operacii = zhodne s Finalnym navinom, neparny = podla podmienok). Nateraz pripravim len UI a zaklad pre podmienku par/nepar, potom aplikujem detaily.
---
### 2026-01-06 19:15
#### Uzivatel:
Druhy riadok by bol Navin pri montazi. podmienky tiez potom doplnime. zatial priprav layout, ja pripravujem podmienky otacania navinu pri tlaci pri neparnyh operaciach

#### AI:
Do folia_test som pod Varianta navinu pridal dva nove riadky (Navin pri tlaci, Navin pri montazi) ako text/info placeholdery; logiku doplnime podla podmienok, ked ich das. UI blok je pripraveny.
---
### 2026-01-06 19:25
#### Uzivatel:
logika funguje. do "navin pri tlaci" zatial pise logika podla poctu operacie. oprav to prosim,

#### AI:
V folia_test som odstranil placeholder texty a do JS doplnil dynamicky popis: pri zapnutom navine pri tlaci sa zobrazi efektivny kod/varianta (pri parnom pocet = finalny, pri neparnom podla mapy), pri montazi zatial len kod/varianta, inak prazdne. UI je ciste.
---
### 2026-01-06 19:28
#### Uzivatel:
odstran popis v zatvorke, a daj text vacsim fontom a boldom

#### AI:
Zmazal som zatvorky v info navinu pri tlaci a zvacsil/boldol text pre navin pri tlaci a montazi (v HTML). Info sa teraz zobrazuje len ako kod+varianta, zvyseny font/tu�n� pismo.
---
### 2026-01-06 19:40
#### Uzivatel:
ked prepnem na navin pri montazi, info navin pri tlaci zostava zobrazeny. pri zmene navinu sa ale neupravi, ked je vybrany navin pri montazi. nech sa zobrazuje iba vybrany navin. ak je vybrany navin pri montazi, tak nech sa nezobrazuje navin pri tlaci a opacne

#### AI:
V folia_test som oddelil info texty: ak je zapnuty navin pri tlaci, zobrazi sa len print info (a montaz sa vycisti); ak je zapnuty navin pri montazi, zobrazi sa len montazne info (print sa vycisti); inak oba prazdne. Mapovanie a posuny navinu ostavaju.
---
### 2026-01-06 19:50
#### Uzivatel:
OK. fajn. este nastac, aby default umiesnenia Koty sirky bol pri navin pri montazi - hore

#### AI:
DimPos pri navine tlac/montaz ide automaticky hore (dimPosEff = top), inak podla roletky. Navin pri montazi ostava dole.
---
### 2026-01-06 19:55
#### Uzivatel:
Ano. super. Uprav este umiestnenie informacie o navine v technickom vykrese. Daj ho do laveho horneho rohu, boldom a cervenym

#### AI:
Info o navine v technickom vykrese som presunul do laveho horneho rohu, bold a cervene (`Navin: <kod><variant> (rezim)`).
---
### 2026-01-06 20:00
#### Uzivatel:
Nie do navinu. Do horneho laveho rohu platna, mimo technicky vykres. Mozes vytvorit podobne textove pole, ako pri napr. vz22, ktor� bude viditelne pri tlaci

#### AI:
Presunul som popis navinu do laveho horneho rohu platna (x=10,y=20), cervenym bold textom, mimo vykres; zobrazi sa aj pri tlaci.
---
### 2026-01-06 20:05
#### Uzivatel:
pri montaz a tlac by to mohlo ostat, ale pri zobrazeni finalneho navinu sa text zobrazi v "navine". potrebujem, aby bol text vacsi a celkom mimo technickeho vykresu

#### AI:
Upravil som popis navinu: zostava v lavom hornom rohu platna, zvacsil som pismo na 20, bold, cervenu. Mimo vykres, nemal by prekr�va� navin ani pri finalnom zobrazen�.
---
### 2026-01-06 20:10
#### Uzivatel:
musis vypocet zmenit, lebo pri zmene vysky sa dostanu textove polia do technickeho vykresu. ale iba pri finalnom navine. ostatne su v poriadku y= by mal byt dinamicky podla priemeru kruhu a ostatnych premennych. + este pri export pdf by nemalo exportovat tieto polia, ale iba technicky vykres. tak ako na napr vz31. (iba pri finalnom navine)

#### AI:
Hlavicku s popisom navinu som presunul do samostatnej skupiny nad navinom, jej Y sa pocita z rollBounds (bbox navinu) tak, aby bola nad navinom; font ostava velky/cerveny. Pri exporte PDF sa header-ui skupiny odstranuju, aby sli von len vykresy. To plati pre vsetky rezimy, finalny navin uz nevstupuje do vykresu.
---
### 2026-01-06 20:15
#### Uzivatel:
urob mi zoznam suborov a pocet riadkov v nich

#### AI:
Riadky (html/js/css):
- css/folia.css 19
- css/folia_test.css 19
- css/main.css 311
- css/vz108_pdf.css 17
- css/vz22_pdf.css 42
- css/vz31_pdf.css 45
- css/vz34_pdf.css 81
- folia_lito_docasny/folia_lito.html 646
- js/folia.js 766
- js/folia_test.js 903
- js/index.js 533
- js/vz108_pdf.js 360
- js/vz22_pdf.js 1042
- js/vz31_pdf.js 1090
- js/vz34_pdf.js 890
- folia.html 174
- folia_test.html 200
- index.html 87
- indexPC.html 176
- vz108_pdf.html 114
- vz22_pdf.html 225
- vz31_pdf.html 202
- vz34_pdf.html 184
---
### 2026-01-06 20:30
#### Uzivatel:
ok. teraz uz vsetko. dakujem. zajtra pokracujem

#### AI:
Rozumiem, na dnes koncime. Zajtra mozeme pokracovat.
---
### 2026-01-07 09:10
#### Uzivatel:
pri teste este jeden problem. zrkadlenie textu ABC v navine musi byt vzdy horizontalne, aj ked je text otoceny o 90 stupnov pri navinoch typu 5/6/7/8/. tzn, najskor ich musi ulozit podla navinu pri montazi a az potom zrkadlit horizontalne. da sa to ?

#### AI:
Upravil som poradie transformacii pre text ABC: zrkadlenie (translate+scale) sa teraz aplikuje az po rotacii, takze je vzdy horizontalne aj pri rotacii o 90 stupnov (typy 5/6/7/8). Poradie je mirror -> rotate v zozname transformov (rotate sa vykona prve).
---
### 2026-01-07 09:15
#### Uzivatel:
super. dakujem. na dnes koncime. teraz uz naozaj.

#### AI:
Rozumiem, na dnes koncime. Ked budes pokracovat, som pripraveny.
---
### 2026-01-07 10:05
#### Uzivatel:
som spat. prestuduj historia.md, ukaz mi v ktorom priecinku pracujes, preved kontrolny zapis v historia.md bez diakritiky. Prever, ci mas opravnenie pisat, vytvarat a mazat subory

#### AI:
Cesta projektu: C:\Users\nagyd\OneDrive - CHEMOSVIT GROUP\WebProjekty\MojaAplikacia. Historia precitana. Kontrolny zapis pridan bez diakritiky. Na zapis/vytvaranie/mazanie suborov potrebujem povolenie na zapis (sandbox je read-only), viem pracovat po udeleni opravnenia.
---
### 2026-01-07 10:20
#### Uzivatel:
prvu zmenu prevedieme na vz22 vo funkcnosti "pervoracia". Prava meria spravne od lavej strany praveho G. Lava meria tiez od lavej strany laveho G. Potrebujem, aby pri nastaveni lava = meralo a zobrazovalo perforaciu od pravej strany laveho G (cize zrkadlovo, ako prava).

#### AI:
Vo vz22 (js/vz22_pdf.js) som upravil lavu perforaciu: teraz sa pocita od pravej strany laveho G (xRightGStart - off) a kota sa kresli medzi xPerf a xRightGStart. Prava strana ostala bez zmeny.
---
### 2026-01-07 10:40
#### Uzivatel:
vyborne. Este potrebujem upravit meranie v dierovanie v K. Potrebujem, aby sa to meralo z lavej strany K. Teraz to meria z pravej. Funkcnost, ze ak nie je zadana ostava 1/2 rozmeru K ostava.

#### AI:
Vo vz22 som zmenil meranie dierovania v K na lavu stranu: xAxis sa teraz pocita ako xKstart + axisVal a kota sa kresli od xKstart po xAxis. Predvolena hodnota (K/2) ostava.
---
### 2026-01-07 11:05
#### Uzivatel:
fajn. dakujem. teraz tieto dve veci funguju spravne. Potreboval by som este pridat funkciu pri: vzduchove otvory. pridaj zaskrtovacie policko do sekcie vdzuchove otvory s  nazvom " Vzduchove otvory len v zalozke" - funkcionalita: ak bude zaskrtnute, budu vzduchove otvory iba v G. ak nie, tak funkcnost ostava

#### AI:
Do vz22 som pridal checkbox "Vzduchove otvory len v zalozke" (vz22_pdf.html). V js/vz22_pdf.js to pri zapnuti kresli otvory len v G (xRefLeftG a xRefRightG) a vynecha otvory mimo G; kotu z lavej strany G nechava, kota pre vonkajsi otvor sa kresli len ak nie je zapnute. Stav sa uklada v JSON, resetuje a nacita.
---
### 2026-01-07 11:15
#### Uzivatel:
dobre. teraz potrebujem vylepsit funkciu merania. chcem, aby pri horizontalnom merani, dalo kotovacie ciary na cely W. popr. aby vytvorilo stvorec, ktroy by mal rozmey: sirka je namerana, vyska podla W . vyfarbenie vzniknuteho stvorca svetla zelena. skus to. zaloha urobena

#### AI:
Vo vz22 som upravil horizontalne meranie: pri merani kresli dve zvisle pomocne ciary cez celu vysku W a vyplni vzniknuty obdlznik svetlo zelenou (sirka = namerana, vyska = W). Pouziva yTop/yBottom zo stavu, takze sa viaze na aktualny vykres. Vertikalne meranie ostalo bez zmeny.
---
### 2026-01-07 11:30
#### Uzivatel:
OK. urobime kopiu vz22 pod nazvom vz22test. do nej zapracujes pracu s podkladom a ine potrebne zmeny podla folia_test. samozrejme urob aj kopiu js a css s nazvami vz22test. pust sa do toho. zaloha je pre istotu vytvorena

#### AI:
Vytvoril som kopie vz22test (vz22test.html/css/js) a upravil odkazy v HTML na nove subory. Do vz22test som doplnil zrkadlenie podkladu ako vo folia_test (tlacidlo Zrkadlit horiz., stav bgState.flip, ulozenie/nacitanie a transform pri vykresleni). Ostatna logika podkladu ostala zachovana.
HISTORIA
2026-01-18 13:55 - PRACA
Kontrolny zapis, historia precitana.
Overeny zapis/vytvaranie/mazanie suborov (temp subor vytvoreny a zmazany).
vz22test: prekopirovane z vz22_pdf a upravena praca s podkladom podla folia_test (flip, kalibracia v mm, bez auto-nastavenia rozmerov, paste bez auto rozmerov, reset/clear resetuje rotaciu/flip, ulozenie/nacitanie flip).
HISTORIA
2026-01-18 15:11 - PRACA
vz22test: zblizene horne/dolne koty k vykresu (mensie odsadenia), znizeny spodny pad pre vacsi obraz pri PNG.
Prava kota pre sirku upravena (sirka vrecka) a priblizena k vykresu.
HISTORIA
2026-01-18 15:19 - PRACA
vz22test: zmenseny spodny pad pre vacsi vyuzity priestor pri PNG (bez zmeny kot).
HISTORIA
2026-01-18 15:26 - PRACA
vz22test: legenda NO PRINT AREA ma dynamicky box podla textu; pridana prava legenda "BEZ KORONOVEJ UPRAVY" (tmavozeleny obrys, svetlozeleny vypln) na pravej strane vykresu.
HISTORIA
2026-01-18 15:30 - PRACA
vz22test: prava legenda "BEZ KORONOVEJ UPRAVY" zarovnana pravym okrajom na pravu hranu technickeho vykresu.
HISTORIA
2026-01-18 15:33 - PRACA
vz22test: vypln legendy "BEZ KORONOVEJ UPRAVY" zmeneny na rovnaku farbu ako pri horizontalnom merani.
HISTORIA
2026-01-18 15:38 - PRACA
vz22test: legenda "BEZ KORONOVEJ UPRAVY" ma rovnaku priehladnost vyplne ako obdlznik pri horizontalnom merani.
HISTORIA
2026-01-18 15:53 - PRACA
vz22test premenovane na vz22 (vz22.html/css/vz22.css/js/vz22.js). vz22_pdf subory zmazane.
Index a JS odkazy upravene na vz22.html, title upraveny na vz22.
Pridany nativny horizontalny scroll: SVG ma pevnu sirku/vysku a kontajner ma overflow.
HISTORIA
2026-01-18 16:05 - PRACA
vz22: upraveny layout workarea na 3 riadky (auto/1fr/auto) a svg kontajner s nativnym scrollom (overflow auto, vyska 100%).
HISTORIA
2026-01-18 16:14 - PRACA
vz22: nativny scroll pre zoom - SVG ma width/height skalovane podla zoomu, viewBox bez delenia zoomom.
HISTORIA
2026-01-18 16:21 - PRACA
vz22: v lavom hornom bloku prehodeny poriadok (Finalny navin nad Navin tlac) a pridane pole Rezanie (ano/nie). Uprava aj v PNG exporte a ulozeni/nacitani.
HISTORIA
2026-01-18 16:30 - PRACA
vz22: premenovany "Navin tlac" na "Navin montaz" (UI aj PNG). Rezanie zmenene na checkbox (ano/nie) s ulozenim/nacitanim.
HISTORIA
2026-01-18 16:39 - PRACA
vz22: Rezanie je teraz radio ano/nie (jedna volba musi byt zaskrtnuta). Upravene ulozenie/nacitanie/reset aj PNG text.
HISTORIA
2026-01-18 16:46 - PRACA
vz22: Finalny navin / Sposob tlace / Rezanie zjednotene do jedneho riadku v lavom hornom bloku.
HISTORIA
2026-01-18 16:52 - PRACA
vz22: popis pri roletkach navinu zmeneny na "Navin tlac" (UI aj PNG). Druhy popis "Navin montaz" ponechany pri vypocte.
HISTORIA
2026-01-18 17:00 - PRACA
vz22: navin tlac/montaz su vypoctove texty (bez roletiek) podla Finalny navin + Rezanie ano mapovania z folia_test.
Aktualizovane UI, ulozenie/nacitanie a PNG texty.
HISTORIA
2026-01-18 17:18 - PRACA
Index web: pridany Netlify Identity widget a login gate (skryje obsah kym nie je prihlaseny). Uprava v index.html.
HISTORIA
2026-01-18 17:28 - PRACA
vz22: precisteny kod po zmenach (odstraneny nepouzity exportBtn, zbytocne bgState width/height a duplicitny rotate(90deg) pri nacitani obrazka).
HISTORIA
2026-01-18 17:33 - PRACA
vz22: odstraneny debug console.log pri tlaci PNG.
HISTORIA
2026-01-18 17:40 - PRACA
vz22: odstraneny nepouzity odkaz na bg-rot-right (tlacidlo neexistuje).
HISTORIA
2026-01-18 17:47 - PRACA
vz22: css audit - nenasli sa nepouzite selektory, bez zmien.
HISTORIA
2026-01-18 17:54 - PRACA
index + indexPC: logo presunute do img, upravene cesty na img/logo.svg.
HISTORIA
2026-01-18 18:05 - PRACA
vz31: vytvorena kopia vz31_pdf -> vz31 (vz31.html/css/vz31.css/js/vz31.js). Pridany bg flip, upravena praca s podkladom podla folia_test (bez auto rozmerov, kalibracia v mm, paste bez auto rozmerov). Pridane nativne scrollbary pri zoome (SVG width/height * zoom, viewBox bez deleni). Pridany zeleny popis BEZ KORONOVEJ UPRAVY k NO PRINT legende. Opraveny blok export/PNG a navrat bgFile handlera.
HISTORIA
2026-01-18 18:34 - PRACA
vz31: pridane ovladanie navinov ako vo vz22 (Finalny navin, Rezanie ano/nie, Navin tlac/montaz text). Upravene ukladanie/nacitavanie a PNG header.
Opraveny export PNG/PDF (doplneny exportPNGTables/exportPDF1 blok), pridany horizontalny meraci obdlznik, a nativny scroll + flip podkladu ostava.
HISTORIA
2026-01-18 18:41 - PRACA
vz31_pdf subory zmazane (html/css/js). index a js/index odkazuju na vz31.html.
HISTORIA
2026-01-18 18:55 - PRACA
index: pri otvoreni webu vynuteny logout Netlify Identity, aby sa vzdy vyzadoval login.
HISTORIA
2026-01-18 19:11 - PRACA
index: upravena logika Identity - ak je user prihlaseny, logout a potom otvor login; inak otvor login priamo.
HISTORIA
2026-01-18 19:20 - PRACA
index: Identity init presunuty do initAuth s fallback na window.load, aby sa widget nacital pred spustenim login logiky.
HISTORIA
2026-01-18 19:08 - PRACA
Kontrolny zapis. Historia precitana. Pokus o zapis do historia.md.

HISTORIA
2026-01-18 19:17 - PRACA
vz34: opravena a doplnena funkcnost ako vo vz31 (navin/rezanie v save/load, export PDF/PNG, bg flip a kalibracia v mm, paste bez auto rozmerov, meranie s obdlznikom, fix scroll/zoom, opravy export bloku).

HISTORIA
2026-01-18 19:48 - PRACA
vz34: opravene zobrazenie vykresu - doplneny offsetX v draw (chyba ReferenceError offsetX).

HISTORIA
2026-01-22 17:41 - PRACA
Kontrolny zapis. Historia precitana.

HISTORIA
2026-01-22 17:49 - PRACA
vz34: pridany rozmer SEK (W+60) pod W a pouzity pre podklad (vyska W+60, obrazok zarovnany od rucky); W ostava pre vykres.

HISTORIA
2026-01-22 19:02 - PRACA
vz34: legenda NO PRINT AREA upravena ako vz31 a pridany popis BEZ KORONOVEJ UPRAVY.

HISTORIA
2026-01-22 19:08 - PRACA
vz34: pridane tlacidlo Zrkadlit horiz. pri otacani podkladu (ako vo vz31).

HISTORIA
2026-01-22 19:28 - PRACA
Pridany identifikator vz do JSON ulozenia (vz22/vz31/vz34/vz108) a kontrola pri nacitani s upozornenim na iny vzor. Odstranene folia subory a odkazy na folia z indexov.

HISTORIA
2026-01-22 19:33 - PRACA
Folia_test obnovene a premenovane na folia (folia.html, css/folia.css, js/folia.js).

HISTORIA
2026-01-22 19:41 - PRACA
Index (web) upraveny: odstranena PC verzia, vratena volba Folia a opravena struktura zoznamu. Folia JSON nacitanie teraz kontroluje vz (ochrana pred inym vzorom).

HISTORIA
2026-01-22 19:53 - PRACA
Index obnovene z indexPC (jedna verzia). js/index.js upraveny pre prechod na vz22/vz31/vz34 s korektnou cestou (basePath) a vz34.html.

HISTORIA
2026-01-22 20:07 - PRACA
Index: pridana volba Folia a preklik na folia.html v js/index.js.

HISTORIA
2026-01-22 20:12 - PRACA
Index: zmazanie firiem funguje aj pre predvolene (uklada sa do deletedFirms v localStorage); custom firmy sa mazat daju ako doteraz.

HISTORIA
2026-01-23 17:15 - PRACA
Kontrolny zapis. Historia precitana.

HISTORIA
2026-01-23 17:17 - PRACA
Kontrolny zapis. Historia precitana.
