EPS REPORT 150065 - PREDBEZNE MAPOVANIE

Ucel:
Tento dokument sumarizuje, co sa da a neda pouzit z dodaneho EPS reportu
(`150065.csv`, `150065.xml`) pre technicke vykresy.

==================================================
1. ZAVER
==================================================

Z tohto reportu sa da pre technicky vykres pouzit len velmi malo poli.

Pouzitelne:
- urcenie vzoru
- poradove cislo vyrobku
- motiv / nazov motivu

Nepouzitelne alebo zatial nepotvrdene:
- rozmery
- technologicke udaje
- naviny
- perforacia
- vzduchove otvory
- fotobunka
- dalsie vyrobne parametre

==================================================
2. TABULKA MAPOVANIA
==================================================

| EPS pole | Hodnota v reporte | Vyznam | Canonical key | Pouzit | Poznamka |
|---|---|---|---|---|---|
| itemcode | 150065 -Miriam | poradove cislo vyrobku + dodatok | order_serial | ANO | pouzit len ciselnu cast `150065` |
| itemdesc | POLYTEN HPW-VR.VZ.022 FT | popis polozky, obsahuje typ vzoru | - | ANO, pomocne | z textu sa da odvodit `vz22` |
| itemshortdesc | BATIST ULTRA FLOWER 20 | obchodny nazov / motiv | order_notes | ANO | v aplikacii sa moze pouzit ako motiv |
| custitemref | 00006 | cislo vyrobku zakaznika | - | NIE | nepouziva sa v technickych vykresoch |
| dima | 0.00 | rozmer A | ? | NIE | v tomto reporte nema pouzitelnu hodnotu |
| dimb | 0.00 | rozmer B | ? | NIE | v tomto reporte nema pouzitelnu hodnotu |
| dimc | 0.00 | rozmer C | ? | NIE | v tomto reporte nema pouzitelnu hodnotu |
| insertdim | 0.00 | dodatocny rozmer | ? | NIE | zatial bez vyznamu pre vykres |
| width | 0.00 | sirka | ? | NIE | hodnota je nulova, nepouzitelne |
| caliper | 0.00 | hrubka / kaliper | - | NIE | zatial nepouziva sa vo vykresoch |
| absorption | 1.00 | absorpcia | - | NIE | nesuvisi s technickym vykresom |
| itemgroupcode | 75520 | skupina polozky | - | NIE | katalogovy udaj |
| itemstatuscode | Active | stav polozky | - | NIE | katalogovy udaj |
| sold | Pravda | predajnost | - | NIE | katalogovy udaj |
| unitcode | PCS | jednotka | - | NIE | katalogovy udaj |

==================================================
3. CO SA DA Z TOHTO REPORTU POUZIT HNED
==================================================

Zatial sa da pouzit:

1. `itemcode`
   - rozdelit na:
     - `150065` -> `order_serial`
     - `Miriam` -> zatial nepouzivat

2. `itemshortdesc`
   - pouzit ako motiv / nazov motivu

3. `itemdesc`
   - pouzit na rozpoznanie vzoru
   - napr. `VZ.022` -> `vz22`

==================================================
4. CO V REPORTE CHYBA
==================================================

Pre automaticke plnenie technickych vykresov v reporte chyba:

- zakladne rozmery
- rozmery chlopne
- rozmery spodnej zalozky
- rozmery zavesnych otvorov
- perforacia
- vzduchove otvory
- finalny navin
- sposob tlace
- pocet operacii
- fotobunka
- dalsie technologicke udaje

==================================================
5. PRAKTICKY ZAVER PRE IT
==================================================

Tento typ reportu nestaci na automaticke naplnenie technickeho vykresu.

Aktualne z neho vieme ziskat len:
- vzor
- poradove cislo vyrobku
- motiv / nazov

Na plnohodnotny import do technickych vykresov bude potrebny rozsireny EPS vystup,
ktory bude obsahovat aj rozmery a technologicke parametre.
