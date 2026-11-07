# Süzgeç — Akıllı Reklam Engelleyici (Chrome MV3)

Katmanlar:

1. **Ağ engeli (DNR):** `rules/filters.json` (EasyList + AdGuard Turkish'ten dönüştürülmüş ~7.700 kural, ~44.500 alan adı), `rules/ads.json` (site-özel), `rules/trackers.json` (açılıp kapatılabilir).
   - Listelerden ayrıca ~39.000 gizleme seçicisi (genel CSS + site-özel) ve ~2.900 popup hedefi gelir; popup hedefine açılan sekme arka planda kapatılır.
2. **Sezgisel gizleme:** Dış siteye giden link/iframe'leri puanlar (IAB reklam boyutu, medya, bahis kelimeleri, `ad/banner/money/promo` sınıfları). Eşik ≥6 gizler. Bir alan adı ancak **birbirinden bağımsız siteler** raporladığında öğrenilir (≥8 puanla 2 site ya da gizleme puanıyla 4 site) ve yalnızca alt kaynaklar (script, görsel, iframe…) için engellenir; tek bir site global kural oluşturamaz, popup raporları öğrenmeye katılmaz. Aynı sayfada reklam olduğu kanıtlanan alan adına giden zayıf linkler de gizlenir.
3. **Popup/popunder koruması (MAIN world):** `window.open`, sentetik `a.click()` ve `dispatchEvent(click)` kullanıcı hareketine göre değerlendirilir.
4. **Tıklama tuzağı koruması:** Sayfayı kaplayan görünmez katmanlara yapılan ilk tıklama yutulur ve katman kaldırılır.
5. **Öğe seçici:** Popup → "Öğe seç ve gizle"; seçiciler site bazında saklanır.

## Kurulum

```bash
npm run build          # src/heuristics.main.js kopyasını üretir (Chrome aynı dosyayı iki dünyaya enjekte etmez)
```

`chrome://extensions` → Geliştirici modu → **Paketlenmemiş öğe yükle** → bu klasör.

## Filtre listelerini güncelleme

```bash
npm run filters            # listeleri indirir, dönüştürür (rules/filters.json, src/generated/*)
npm run filters -- --offline   # filters/cache'teki son indirilenle yeniden dönüştürür
```

Sonra `chrome://extensions` → Süzgeç → ↻. Lisanslar: `NOTICE.md`.

## Test

```bash
npm test                                   # birim testleri (node:test)
CHROMIUM_PATH=... npm run test:e2e         # eklenti yüklü Chromium'da sahte reklam sitesi
```
