/*
 * End-to-end check: loads the unpacked extension in Chromium and visits a fixture
 * site that mimics the hdfilmcehennemi ad layout with an *unknown* ad network.
 *
 *   PLAYWRIGHT_CORE=/path/to/playwright-core/index.mjs npm run test:e2e
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const CORE = process.env.PLAYWRIGHT_CORE ?? '/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(CORE);
// Optional: reuse an already-downloaded Chromium instead of the one playwright-core expects.
const executablePath = process.env.CHROMIUM_PATH || undefined;

const EXT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

const hits = [];
const pages = {
  '/': `<!doctype html><html><head><title>fixture</title></head><body>
    <div class="video-ust-banner"><div class="promo-box">
      <a id="ad1" href="http://ads-network.test/click/1"><img src="http://ads-network.test/banner.png" width="728" height="90"></a>
    </div></div>
    <a id="bar" href="http://ads-network.test/click/2" class="cta-strip">Çevrimsiz deneme bonusu burada</a>
    <div class="money-wrapper" id="slot"><div class="money-item" style="height:90px;width:728px"></div></div>
    <div class="content-box" id="layout" style="height:90px;width:728px"></div>
    <p>Kaynak: <a id="normal" href="http://example-news.test/article">haber</a></p>
    <div id="play" style="width:640px;height:360px;background:#333">PLAY</div>
    <script>
      document.addEventListener('click', () => { window.__opened = window.open('http://popunder.test/landing'); });
    </script>
  </body></html>`,
  '/lists': `<!doctype html><html><body>
    <img id="listimg" src="http://vtkfotftpbd.com/x.png" width="300" height="250">
    <div class="a-ad" id="generic">liste reklamı</div>
    <button id="open" type="button">aç</button>
    <script>document.getElementById('open').addEventListener('click', () => window.open('http://11x11.com/landing'));</script>
  </body></html>`,
  '/overlay': `<!doctype html><html><body>
    <p id="content">içerik</p>
    <a id="trap" href="http://ads-network.test/trap" target="_blank" style="position:fixed;inset:0;z-index:99999;opacity:0"></a>
  </body></html>`,
};

// Real list entries (picked from the generated data) served from a local server.
const listPages = {
  'promy.pro': `<!doctype html><html><body><p id="out">?</p>
    <script>window.canRunAds = false; document.getElementById('out').textContent = String(window.canRunAds);</script>
  </body></html>`,
  'www.theregister.com': `<!doctype html><html><body>
    <article class="large-12" id="sponsored">SPONSORED FEATURE: buy now</article>
    <article class="large-12" id="story">Normal haber</article>
    <div id="a-cookie">Bu site çerez kullanır</div>
    <img id="tracker" src="http://trkbc.com/pixel.png" width="1" height="1">
  </body></html>`,
};

const server = createServer((req, res) => {
  const host = (req.headers.host ?? '').split(':')[0];
  hits.push(`${host}${req.url}`);
  if (listPages[host] && req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(listPages[host]);
    return;
  }
  if ((host === 'site.test' || host === 'another.test') && pages[req.url]) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(pages[req.url]);
    return;
  }
  if (req.url.endsWith('.png')) {
    res.writeHead(200, { 'content-type': 'image/png' });
    res.end(PNG);
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<p>landing</p>');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const context = await chromium.launchPersistentContext('', {
  channel: 'chromium',
  headless: true,
  executablePath,
  args: [
    `--disable-extensions-except=${EXT}`,
    `--load-extension=${EXT}`,
    `--host-resolver-rules=MAP *.test 127.0.0.1:${port}, MAP vtkfotftpbd.com 127.0.0.1:${port}, MAP 11x11.com 127.0.0.1:${port}, MAP promy.pro 127.0.0.1:${port}, MAP www.theregister.com 127.0.0.1:${port}, MAP trkbc.com 127.0.0.1:${port}`,
  ],
});

const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push(`ok   ${name}`);
  } catch (error) {
    results.push(`FAIL ${name}: ${error.message}`);
  }
};

try {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  await new Promise((r) => setTimeout(r, 1500)); // let onInstalled register scripts/rules

  await check('all static rulesets are enabled by Chrome', async () => {
    const enabled = await worker.evaluate(() => chrome.declarativeNetRequest.getEnabledRulesets());
    assert.deepEqual([...enabled].sort(), ['annoyances', 'filters', 'privacy', 'trackers']);
  });

  const page = await context.newPage();
  await page.goto('http://site.test/');
  await page.waitForTimeout(1200);

  await check('banner container hidden by heuristics', async () => {
    assert.equal(await page.locator('#ad1').isVisible(), false);
  });
  await check('betting text bar hidden', async () => {
    assert.equal(await page.locator('#bar').isVisible(), false);
  });
  await check('empty ad slot collapsed, empty layout box kept', async () => {
    await page.waitForTimeout(2500);
    assert.equal(await page.locator('#slot').getAttribute('data-suzgec-hidden'), 'empty-slot');
    assert.equal(await page.locator('#layout').getAttribute('data-suzgec-hidden'), null);
  });
  await check('ordinary outbound link stays visible', async () => {
    assert.equal(await page.locator('#normal').isVisible(), true);
  });

  const popupCountBefore = context.pages().length;
  await page.locator('#play').click();
  await page.waitForTimeout(800);
  await check('popunder on player click blocked', async () => {
    assert.equal(context.pages().length, popupCountBefore);
    assert.equal(hits.some((h) => h.startsWith('popunder.test')), false);
  });

  await check('one site alone cannot create a global rule', async () => {
    await page.waitForTimeout(800);
    const rules = await worker.evaluate(() => chrome.declarativeNetRequest.getDynamicRules());
    assert.equal(rules.flatMap((r) => r.condition.requestDomains ?? []).includes('ads-network.test'), false);
  });

  const second = await context.newPage();
  await second.goto('http://another.test/');
  await second.waitForTimeout(1200);
  await second.close();

  await check('ad domain learned after a second independent site', async () => {
    await page.waitForTimeout(1000);
    const rules = await worker.evaluate(() => chrome.declarativeNetRequest.getDynamicRules());
    const domains = rules.flatMap((r) => r.condition.requestDomains ?? []);
    assert.ok(domains.includes('ads-network.test'), `learned: ${JSON.stringify(domains)}`);
  });

  hits.length = 0;
  await page.reload();
  await page.waitForTimeout(1000);
  await check('learned domain blocked at network level on reload', async () => {
    assert.equal(hits.some((h) => h === 'ads-network.test/banner.png'), false, hits.join(', '));
  });

  const overlay = await context.newPage();
  await overlay.goto('http://site.test/overlay');
  await overlay.waitForTimeout(500);
  const before = context.pages().length;
  await overlay.mouse.click(200, 200);
  await overlay.waitForTimeout(800);
  await check('invisible fullscreen click trap neutralised', async () => {
    assert.equal(context.pages().length, before);
    assert.equal(await overlay.locator('#trap').getAttribute('data-suzgec-hidden'), 'overlay');
  });

  hits.length = 0;
  const lists = await context.newPage();
  await lists.goto('http://site.test/lists');
  await lists.waitForTimeout(1000);
  await check('EasyList host blocked at network level', async () => {
    assert.equal(hits.some((h) => h.startsWith('vtkfotftpbd.com')), false, hits.join(', '));
  });
  await check('EasyList generic selector hides element', async () => {
    assert.equal(await lists.locator('#generic').isVisible(), false);
  });
  await check('popup to a listed destination is closed', async () => {
    const before = context.pages().length;
    await lists.locator('#open').click();
    await lists.waitForTimeout(1500);
    assert.equal(context.pages().length, before, context.pages().map((x) => x.url()).join(', '));
  });
  await lists.close();

  hits.length = 0;
  const scripted = await context.newPage();
  await scripted.goto('http://promy.pro/');
  await scripted.waitForTimeout(1200);
  await check('uBlock scriptlet (set-constant) runs before the page\'s own code', async () => {
    assert.equal(await scripted.locator('#out').textContent(), 'true');
  });
  await scripted.close();

  const reg = await context.newPage();
  await reg.goto('http://www.theregister.com/');
  await reg.waitForTimeout(1500);
  await check('ExtendedCss :contains() hides sponsored article only', async () => {
    assert.equal(await reg.locator('#sponsored').isVisible(), false);
    assert.equal(await reg.locator('#story').isVisible(), true);
  });
  await check('cookie banner hidden by EasyList Cookie', async () => {
    assert.equal(await reg.locator('#a-cookie').isVisible(), false);
  });
  await check('EasyPrivacy tracker blocked at network level', async () => {
    assert.equal(hits.some((h) => h.startsWith('trkbc.com')), false, hits.join(', '));
  });
  await reg.close();

  await check('popup explains why each item was blocked', async () => {
    await page.reload();
    await page.waitForTimeout(1200);
    const popup = await context.newPage();
    const extId = new URL(worker.url()).host;
    await popup.goto(`chrome-extension://${extId}/popup/popup.html`);
    const tabId = await worker.evaluate(async () => (await chrome.tabs.query({ url: 'http://site.test/*' }))[0].id);
    const state = await popup.evaluate((id) => chrome.runtime.sendMessage({ type: 'popup:getState', tabId: id, host: 'site.test' }), tabId);
    await popup.close();
    const entry = state.tab.log.find((e) => e.domain === 'ads-network.test');
    assert.ok(entry, JSON.stringify(state.tab.log));
    assert.ok(entry.reasons.includes('ad-size') && entry.reasons.includes('gambling') === false, JSON.stringify(entry));
  });

  await check('"not an ad" unhides the domain and wins over learning', async () => {
    const popup = await context.newPage();
    const extId = new URL(worker.url()).host;
    await popup.goto(`chrome-extension://${extId}/popup/popup.html`);
    const tabId = await worker.evaluate(async () => (await chrome.tabs.query({ url: 'http://site.test/*' }))[0].id);
    const forged = await popup.evaluate((id) => chrome.runtime.sendMessage({ type: 'popup:trust', tabId: id, host: 'site.test', domain: 'popunder.test' }), tabId);
    assert.equal(forged.ok, false, 'popup-only domain must not be trustable');
    const ok = await popup.evaluate((id) => chrome.runtime.sendMessage({ type: 'popup:trust', tabId: id, host: 'site.test', domain: 'ads-network.test' }), tabId);
    assert.equal(ok.ok, true);
    await popup.close();
    hits.length = 0;
    await page.reload();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('#ad1').isVisible(), true);
    assert.ok(hits.includes('ads-network.test/banner.png'), hits.join(', '));
    const rules = await worker.evaluate(() => chrome.declarativeNetRequest.getDynamicRules());
    assert.ok(!rules.some((r) => r.action.type === 'block' && (r.condition.requestDomains ?? []).includes('ads-network.test')));
    const allow = rules.find((r) => r.action.type === 'allow');
    assert.deepEqual(allow.condition.initiatorDomains, ['site.test'], 'trust must be scoped to the site');
    await worker.evaluate(async () => {
      const { state } = await chrome.storage.local.get('state');
      await chrome.storage.local.set({ state: { ...state, trusted: [] } });
    });
  });

  await check('pausing a site disables protection there', async () => {
    const popup = await context.newPage();
    const extId = new URL(worker.url()).host;
    await popup.goto(`chrome-extension://${extId}/popup/popup.html`);
    await popup.evaluate(async () => {
      await chrome.runtime.sendMessage({ type: 'popup:forget', domain: 'ads-network.test' });
      await chrome.runtime.sendMessage({ type: 'popup:togglePause', host: 'site.test' });
    });
    await popup.close();
    await page.reload();
    await page.waitForTimeout(1000);
    const debug = {
      attr: await page.evaluate(() => document.querySelector('.promo-box')?.outerHTML.slice(0, 200)),
      scripts: await worker.evaluate(() => chrome.scripting.getRegisteredContentScripts().then((s) => s.map((x) => x.excludeMatches))),
    };
    assert.equal(await page.locator('#ad1').isVisible(), true, JSON.stringify(debug));
  });
} finally {
  await context.close();
  server.close();
}

process.stdout.write(`${results.join('\n')}\n`);
process.exitCode = results.some((r) => r.startsWith('FAIL')) ? 1 : 0;
