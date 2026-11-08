# Süzgeç Gizlilik Politikası

Son güncelleme: 8 Kasım 2026

Süzgeç, TeknoWeb Teknoloji tarafından geliştirilen ücretsiz ve açık kaynaklı bir reklam engelleyicidir.

## Toplanan veriler

**Süzgeç hiçbir kişisel veri toplamaz, kaydetmez, satmaz veya üçüncü taraflarla paylaşmaz.**

- Eklenti hiçbir sunucuya istek göndermez; analitik, telemetri veya hata raporlaması yoktur.
- Ziyaret ettiğiniz sayfalar yalnızca tarayıcınızın içinde, reklamları tanımak için yerel olarak incelenir.
- Ayarlarınız (duraklatılan siteler, "reklam değil" dedikleriniz, öğrenilen reklam alan adları, engelleme sayacı) yalnızca `chrome.storage.local` içinde, sizin cihazınızda tutulur ve eklentiyi kaldırdığınızda silinir.
- Filtre listeleri eklentiyle birlikte gelir; çalışırken internetten indirilmez.

## İzinler neden gerekli

| İzin | Neden |
|---|---|
| declarativeNetRequest | Reklam ve izleyici isteklerini tarayıcının kendi kural motoruyla engellemek |
| Tüm sitelere erişim | Reklamlar her sitede olabileceği için gizleme kurallarını ve pop-up korumasını her sayfada uygulamak |
| scripting | Siteye özel gizleme kurallarını ve sayfa yüklenmeden çalışması gereken koruma betiklerini eklemek |
| webNavigation | Reklam amaçlı açılan pop-up/pop-under sekmelerini tanıyıp kapatmak |
| storage | Ayarlarınızı cihazınızda saklamak |
| activeTab | Açık sekmede "öğe seç ve gizle" aracını çalıştırmak |

## Açık kaynak

Süzgeç GPLv3 lisanslıdır; kaynak kodu herkese açıktır: https://github.com/onurdilmen/suzgec

## İletişim

TeknoWeb Teknoloji — https://teknoweb.net · info@teknoweb.net
