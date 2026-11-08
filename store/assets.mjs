/*
 * Renders Chrome Web Store images into store/out/: three 1280x800 screenshots and a
 * 440x280 promo tile. Uses a local demo news page (no real site is shown).
 *
 *   CHROMIUM_PATH=... node store/assets.mjs
 */
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const CORE = process.env.PLAYWRIGHT_CORE ?? '/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(CORE);
const executablePath = process.env.CHROMIUM_PATH || undefined;
const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');
const OUT = path.join(ROOT, 'store/out');
await mkdir(OUT, { recursive: true });

const banner = (w, h, text, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="55%" font-family="Arial" font-size="${Math.min(h / 3, 34)}" font-weight="700" fill="#fff" text-anchor="middle">${text}</text></svg>`;

const demo = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Örnek Gazete</title><style>
body{margin:0;font-family:Georgia,serif;background:#fafafa;color:#222}header{background:#1d3557;color:#fff;padding:14px 28px;font:700 22px Arial}
main{display:grid;grid-template-columns:1fr 300px;gap:24px;max-width:1100px;margin:18px auto;padding:0 20px}
h1{font-size:30px;margin:8px 0}p{line-height:1.6;font-size:17px}.side img{display:block;margin-bottom:16px}
.bar{display:block;background:#e63946;color:#fff;text-align:center;padding:12px;font:700 18px Arial;text-decoration:none}
.cookie{position:fixed;left:0;right:0;bottom:0;background:#222;color:#fff;padding:18px 28px;font:16px Arial}</style></head><body>
<header>Örnek Gazete</header>
<a class="bar" href="http://ads-network.test/click/bar">🎰 %500 HOŞ GELDİN BONUSU — HEMEN ÜYE OL</a>
<div style="text-align:center;margin:14px 0"><a href="http://ads-network.test/click/top"><img src="http://ads-network.test/top.svg" width="728" height="90"></a></div>
<main><article><h1>Şehirde yeni bisiklet yolları hizmete açıldı</h1>
<p>Belediyenin iki yıldır sürdürdüğü çalışma tamamlandı ve 40 kilometrelik yeni bisiklet ağı bugün kullanıma açıldı. Yollar sahil hattını merkez mahallelere bağlıyor.</p>
<p>Yetkililer, ağın önümüzdeki yıl 25 kilometre daha uzatılacağını söyledi. Kullanıcılar özellikle gece aydınlatmasından memnun.</p>
<p>Projeye katkı veren gönüllü gruplar, güvenli park alanlarının da artırılmasını talep ediyor.</p></article>
<aside class="side"><a href="http://ads-network.test/click/s1"><img src="http://ads-network.test/side1.svg" width="300" height="250"></a>
<a href="http://ads-network.test/click/s2"><img src="http://ads-network.test/side2.svg" width="300" height="250"></a></aside></main>
<div class="cookie a-cookie" id="cookie-notice">Bu site çerez kullanır. <u>Kabul et</u></div>
</body></html>`;

const ADS = {
  '/top.svg': banner(728, 90, 'KAZANDIRAN ORANLAR — CANLI BAHİS', '#f4a261'),
  '/side1.svg': banner(300, 250, 'BEDAVA SPİN', '#2a9d8f'),
  '/side2.svg': banner(300, 250, '%90 İNDİRİM!!!', '#9d4edd'),
};

const server = createServer((req, res) => {
  const host = (req.headers.host ?? '').split(':')[0];
  if (host === 'ads-network.test' && ADS[req.url]) {
    res.writeHead(200, { 'content-type': 'image/svg+xml' });
    return res.end(ADS[req.url]);
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(host === 'gazete.test' ? demo : '<p>landing</p>');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();
const resolver = `--host-resolver-rules=MAP *.test 127.0.0.1:${port}`;

const shoot = async (withExt) => {
  const args = [resolver];
  if (withExt) args.push(`--disable-extensions-except=${ROOT}`, `--load-extension=${ROOT}`);
  const ctx = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, executablePath, args, viewport: { width: 1100, height: 760 }, deviceScaleFactor: 2 });
  let worker;
  if (withExt) {
    worker = ctx.serviceWorkers()[0] ?? (await ctx.waitForEvent('serviceworker'));
    await new Promise((r) => setTimeout(r, 1500));
  }
  const page = await ctx.newPage();
  await page.goto('http://gazete.test/');
  await page.waitForTimeout(4000);
  const site = await page.screenshot({ type: 'png' });
  let popup = null;
  if (withExt) {
    const extId = new URL(worker.url()).host;
    const tabId = await worker.evaluate(async () => (await chrome.tabs.query({ url: 'http://gazete.test/*' }))[0].id);
    const p = await ctx.newPage();
    await p.setViewportSize({ width: 360, height: 600 });
    await p.addInitScript((id) => {
      const real = chrome.tabs.query.bind(chrome.tabs);
      chrome.tabs.query = async (q) => (q?.active ? [{ id, url: 'http://gazete.test/' }] : real(q));
    }, tabId);
    await p.goto(`chrome-extension://${extId}/popup/popup.html`);
    await p.waitForTimeout(1200);
    popup = await p.locator('body').screenshot({ type: 'png' });
  }
  await ctx.close();
  return { site, popup };
};

const before = await shoot(false);
const after = await shoot(true);
server.close();

const data = (buf) => `data:image/png;base64,${buf.toString('base64')}`;
const icon = data(await readFile(path.join(ROOT, 'icons/128.png')));
const frame = (body) => `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1280px;height:800px;overflow:hidden;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;background:linear-gradient(135deg,#0f172a,#1e3a5f);color:#fff}
h1{font-size:46px;margin:0 0 14px;line-height:1.1}p.lead{font-size:21px;color:#cbd5e1;margin:0}
.shot{border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.45);display:block}.tag{display:inline-block;font:700 14px Arial;padding:6px 12px;border-radius:999px;margin-bottom:10px}
ul{list-style:none;padding:0;margin:26px 0 0;font-size:20px;line-height:2}li::before{content:"✓  ";color:#4ade80;font-weight:700}</style></head><body>${body}</body></html>`;

const screens = {
  '1-reklamsiz.png': frame(`<div style="display:flex;gap:40px;padding:60px 64px;align-items:center">
    <div style="flex:1"><img src="${icon}" width="72" style="margin-bottom:18px"><h1>Reklamsız, hızlı,<br>tamamen ücretsiz</h1>
    <p class="lead">Süzgeç reklamları, bahis bannerlarını ve izleyicileri sayfa yüklenmeden durdurur.</p>
    <ul><li>EasyList, AdGuard Türkçe ve uBlock listeleri</li><li>Pop-up ve görünmez tıklama tuzağı koruması</li><li>Hiçbir veri toplanmaz</li></ul></div>
    <img class="shot" src="${data(after.popup)}" style="width:360px"></div>`),
  '2-once-sonra.png': frame(`<div style="padding:44px 50px"><h1 style="font-size:38px;text-align:center">Aynı sayfa: önce ve sonra</h1>
    <div style="display:flex;gap:30px;margin-top:22px">
    <div style="flex:1"><span class="tag" style="background:#ef4444">Süzgeç kapalı</span><img class="shot" src="${data(before.site)}" style="width:100%"></div>
    <div style="flex:1"><span class="tag" style="background:#22c55e">Süzgeç açık</span><img class="shot" src="${data(after.site)}" style="width:100%"></div></div></div>`),
  '3-seffaf.png': frame(`<div style="display:flex;gap:50px;padding:60px 64px;align-items:center">
    <img class="shot" src="${data(after.popup)}" style="width:360px">
    <div style="flex:1"><h1>Neyin neden engellendiğini görün</h1>
    <p class="lead">Her engellemenin gerekçesi açıkça listelenir. Yanlış bir engel mi var? “Reklam değil” deyin, o sitede bir daha dokunulmaz.</p>
    <ul><li>Siteye özel duraklatma</li><li>Çerez bannerlarını gizleme</li><li>Yeni reklam ağlarını kendiliğinden öğrenme</li></ul></div></div>`),
};
const tile = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;width:440px;height:280px;display:flex;align-items:center;gap:22px;padding:0 34px;box-sizing:border-box;background:linear-gradient(135deg,#0f172a,#1e3a5f);color:#fff;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif}
h1{margin:0;font-size:40px}p{margin:6px 0 0;font-size:17px;color:#cbd5e1}</style></head><body><img src="${icon}" width="96"><div><h1>Süzgeç</h1><p>Akıllı ve ücretsiz<br>reklam engelleyici</p></div></body></html>`;

const browser = await chromium.launch({ channel: 'chromium', headless: true, executablePath });
const render = async (html, file, width, height) => {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html);
  await page.screenshot({ path: path.join(OUT, file), type: 'png' });
  await page.close();
};
for (const [file, html] of Object.entries(screens)) await render(html, file, 1280, 800);
await render(tile, 'promo-440x280.png', 440, 280);
await browser.close();
console.log(OUT);
