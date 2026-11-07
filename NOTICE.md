# Üçüncü taraf filtre listeleri

`rules/filters.json`, `src/generated/*` dosyaları aşağıdaki listelerden `npm run filters` ile üretilir:

| Liste / paket | Kaynak | Lisans |
|---|---|---|
| EasyList, EasyPrivacy, EasyList Cookie | https://easylist.to | GPLv3 veya CC BY-SA 3.0 |
| AdGuard Turkish | https://filters.adtidy.org | GPLv3 |
| uBlock filters / Badware / Unbreak / Privacy | https://github.com/uBlockOrigin/uAssets | GPLv3 |
| @adguard/scriptlets (scriptlet fonksiyonları, `redirects/`) | https://github.com/AdguardTeam/Scriptlets | GPLv3 |
| @adguard/extended-css (`src/vendor/extended-css.js`) | https://github.com/AdguardTeam/ExtendedCss | GPLv3 |
| @adguard/dnr-converter, @adguard/agtree (derleme aracı) | https://github.com/AdguardTeam/tsurlfilter | GPLv3 / MIT |
| @adguard/aglint (derleme aracı) | https://github.com/AdguardTeam/AGLint | MIT |

Sürüm ve dönüşüm istatistikleri: `filters/meta.json`.

Eklenti Chrome Web Mağazası'nda veya başka bir yolla **dağıtılırsa**, bu türetilmiş veriler nedeniyle GPLv3 koşulları (kaynak kodun açılması, lisans metni) geçerli olur. Kişisel kullanımda ek yükümlülük yoktur.
