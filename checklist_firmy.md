CHECKLIST - UPDATE FIRIEM

Tento postup sluzi na bezpecnu aktualizaciu databazy firiem bez straty existujucich zaznamov.

POSTUP

1. Otvor lokalnu aplikaciu a `index2`.
2. Skontroluj, ze v zozname vidis existujuce firmy.
3. Ak zoznam nie je kompletny, neexportuj.
4. Pridaj, uprav alebo zmaz firmy.
5. Znova skontroluj, ze v zozname su stare aj nove firmy.
6. Daj `Export firiem`.
7. Uloz export na disk.
8. Urob zalohu povodneho `js/firms.json`.
9. Exportovany subor premenuj na `firms.json`.
10. Nahrad nim `js/firms.json`.
11. Otvor aplikaciu znova a over, ze firmy sa zobrazuju spravne.
12. Az potom kopiruj do git/web verzie a publikuj.

HLAVNE PRAVIDLO

Nikdy neprepisuj `js/firms.json` exportom z prazdneho alebo neuplneho zoznamu.

ODPORUCANY NAVYK

- Pred kazdym prepisom si urob zalohu:
  - napr. `firms_backup_YYYY-MM-DD.json`
- Najprv skontroluj lokalne
- Az potom publikuj na web
