# Süzgeç — Akıllı Reklam Engelleyici (Chrome MV3)

Katmanlar:

1. **Ağ engeli (DNR)** — 4 statik kural seti, toplam ~29.500 kural (Chrome'un 30k garantisi içinde):
   - `filters`: EasyList, AdGuard Turkish, uBlock filters/Badware/Unbreak, `filters/custom.txt`
   - `privacy`: EasyPrivacy, uBlock Privacy (popup'taki "İzleyiciler" anahtarına bağlı)
   - `annoyances`: EasyList Cookie ("Çerez bannerları" anahtarı)
   - `trackers`: temel izleyici listesi
   - Düz `||host^` kuralları gruplanır (~88k alan adı); diğerleri **@adguard/dnr-converter** ile çevrilir ($redirect, $removeparam, $csp dahil). `$redirect` kaynakları `redirects/`.
2. **Gizleme** — genel CSS (grup başına kayıtlı içerik CSS'i) + site-özel seçiciler (worker `insertCSS`).
3. **Scriptlet'ler** — uBO/AdGuard `+js()` kuralları, **@adguard/scriptlets** fonksiyonları; uBO Lite modeliyle her scriptlet yalnız ilgili sitelerde `document_start`'ta MAIN world içerik betiği olarak çalışır (YouTube reklam verisi temizleme dahil). Genel (alan adsız) scriptlet'ler uBO gibi uygulanmaz.
4. **Gelişmiş gizleme** — `:has-text`/`:contains`, `:upward`, `:style` vb. **@adguard/extended-css** ile.
5. **Popup/popunder** — MAIN world `window.open` koruması + listedeki popup hedeflerine açılan sekmeyi kapatma.
6. **Sezgisel katman + öğrenme** — reklam boyutu/bahis/medya puanlaması, bağımsız sitelerden öğrenme, "Reklam değil" güven listesi, görünmez tıklama tuzağı, boş reklam alanı kapatma.
7. **Öğe seçici** — popup → "Öğe seç ve gizle".

## Kurulum

```bash
npm run build          # src/heuristics.main.js kopyasını üretir (Chrome aynı dosyayı iki dünyaya enjekte etmez)
```

`chrome://extensions` → Geliştirici modu → **Paketlenmemiş öğe yükle** → bu klasör.

## Filtre listelerini güncelleme

```bash
npm run filters            # AGLint (custom.txt) → indir → dönüştür → paketle
npm run filters -- --offline   # filters/cache'teki son indirilenle yeniden dönüştürür
```

Sonra `chrome://extensions` → Süzgeç → ↻. Lisanslar: `NOTICE.md`.

## Test

```bash
npm test                                   # birim testleri (node:test)
CHROMIUM_PATH=... npm run test:e2e         # eklenti yüklü Chromium'da sahte reklam sitesi
```
