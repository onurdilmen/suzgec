# Chrome Web Mağazası kaydı — Süzgeç 1.0.0

Yükleme dosyası: `dist/suzgec-1.0.0.zip` (`npm run package` ile üretilir)
Görseller: `store/out/` (`node store/assets.mjs`)

## Mağaza bilgileri

- **Ad:** Süzgeç — Akıllı Reklam Engelleyici
- **Kategori:** Araçlar (Tools)
- **Dil:** Türkçe (ek: İngilizce)
- **Ana sayfa:** https://teknoweb.net/?utm_source=chrome-web-store&utm_medium=listing&utm_campaign=suzgec
- **Destek:** info@teknoweb.net

### Kısa açıklama (≤132 karakter)

TR: Reklamları, bahis bannerlarını, pop-up'ları ve izleyicileri engelleyen ücretsiz, hızlı ve veri toplamayan reklam engelleyici.

EN: Free, fast ad blocker that stops ads, betting banners, pop-ups and trackers — and collects no data at all.

### Ayrıntılı açıklama (TR)

Süzgeç, sayfaları reklamlardan arındıran ücretsiz ve açık kaynaklı bir reklam engelleyicidir. Türkiye'deki sitelerde sık görülen bahis bannerları, pop-under sekmeleri ve görünmez tıklama tuzakları için özel olarak geliştirildi.

NELER YAPAR
• Reklam ve izleyici isteklerini sayfa yüklenmeden durdurur (EasyList, EasyPrivacy, AdGuard Türkçe, uBlock listeleri).
• Pop-up ve pop-under reklam sekmelerini kapatır, sayfanın üstüne gizlenmiş tıklama tuzaklarını etkisizleştirir.
• Çerez bannerlarını gizler (isteğe bağlı).
• Listede olmayan yeni reklam ağlarını, birden fazla sitede görüldüğünde kendiliğinden öğrenir.
• Reklamdan kalan boş alanları kapatır, sayfa düzeni temiz kalır.

ŞEFFAF VE KONTROL SİZDE
• "Bu sayfada neden engellendi?" listesi her engellemenin gerekçesini gösterir.
• Yanlış bir engelleme mi var? "Reklam değil" deyin, o sitede bir daha dokunulmaz.
• Tek tıkla siteye özel duraklatma.
• "Öğe seç ve gizle" ile istediğiniz öğeyi kalıcı olarak kaldırın.

GİZLİLİK
Süzgeç hiçbir veri toplamaz ve hiçbir sunucuya bağlanmaz. Tüm ayarlarınız yalnızca kendi tarayıcınızda tutulur.

Ücretsizdir, reklam içermez, "kabul edilebilir reklam" programı yoktur. GPLv3 lisanslı açık kaynak yazılımdır.

Geliştiren: TeknoWeb Teknoloji — teknoweb.net

### Detailed description (EN)

Süzgeç is a free, open-source ad blocker. It blocks ads and trackers before the page loads (EasyList, EasyPrivacy, AdGuard Turkish and uBlock lists), closes pop-up/pop-under ad tabs, neutralises invisible click traps, hides cookie banners and learns new ad networks on its own. Every block is explained in the popup, and one click on "Not an ad" restores anything blocked by mistake. Süzgeç collects no data and never contacts any server. Made by TeknoWeb — teknoweb.net

## Gizlilik sekmesi (Privacy practices)

**Tek amaç (single purpose):**
Süzgeç'in tek amacı web sayfalarındaki reklamları, reklam amaçlı pop-up'ları ve izleyicileri engellemektir.

**İzin gerekçeleri:**
- declarativeNetRequest: Reklam ve izleyici ağlarına giden istekleri, filtre listelerinden üretilen statik kurallarla engellemek için.
- host permissions (http/https tüm siteler): Reklamlar herhangi bir sitede bulunabilir; gizleme CSS'i, pop-up koruması ve siteye özel filtre kuralları her sayfaya uygulanmalıdır. Sayfa içeriği hiçbir yere gönderilmez.
- scripting: Filtre listelerindeki siteye özel gizleme kurallarını (insertCSS) ve sayfa kodundan önce çalışması gereken, eklentiyle birlikte gelen koruma betiklerini (registerContentScripts) uygulamak için. Uzaktan kod yüklenmez.
- webNavigation: Bir sayfanın açtığı yeni sekmenin bilinen bir reklam/pop-under adresine gidip gitmediğini tespit edip kapatmak ve gelişmiş gizleme kurallarını sayfa açılırken uygulamak için.
- storage: Kullanıcı ayarlarını (duraklatılan siteler, güvenilen alan adları, öğrenilen reklam alan adları, sayaç) yerel olarak saklamak için.
- activeTab: Kullanıcı "Öğe seç ve gizle" düğmesine bastığında açık sekmede seçim aracını çalıştırmak için.

**Uzaktan kod:** Hayır. Tüm JavaScript paketin içindedir.

**Veri kullanımı:** Hiçbir kategori işaretlenmez (kişisel bilgi, sağlık, finans, kimlik doğrulama, kişisel iletişim, konum, web geçmişi, kullanıcı etkinliği, web sitesi içeriği — hiçbiri toplanmaz). Üç onay kutusu da işaretlenir (veri satılmaz, amaç dışı kullanılmaz, kredi değerliliği için kullanılmaz).

**Gizlilik politikası URL'si:** https://github.com/onurdilmen/suzgec/blob/main/store/privacy.md

## Yayın öncesi kontrol listesi

- [x] GPLv3 `LICENSE` ve `NOTICE.md` paket içinde
- [x] Paketlenmiş zip uçtan uca testlerden geçti (20/20)
- [x] eval/uzaktan kod yok (yalnızca eval'i *engelleyen* scriptlet'ler var)
- [x] Gizlilik politikası herkese açık: https://github.com/onurdilmen/suzgec/blob/main/store/privacy.md
- [x] Kaynak kodu herkese açık (GPLv3): https://github.com/onurdilmen/suzgec
- [ ] Geliştirici hesabı ($5, bir defalık) — Onur
