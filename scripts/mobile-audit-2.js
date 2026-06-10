/* Pass 2: deeper visual audit of public + login + admin (no auth available) */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'output', 'playwright');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'https://amigosdelfugas.vercel.app';

const VP = { width: 390, height: 844 };

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: !!opts.fullPage });
  console.log('[shot]', name, opts.fullPage ? 'full' : 'vp');
}

async function tapAudit(page, label) {
  // Catalog all interactive elements with their bounding rect size + font size
  return await page.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll('a, button, [role="button"], input, [role="tab"], select, textarea, label');
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(el);
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        text: (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 50),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fontSize: cs.fontSize,
        inputMode: el.getAttribute('inputmode') || '',
        autocomplete: el.getAttribute('autocomplete') || '',
      });
    });
    return out;
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: VP,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });

  // 0. Landing — already captured but redo with scroll for ticker behavior
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await shot(page, 'A-landing-top');
  // scroll to "how it works"
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(300);
  await shot(page, 'A-landing-howitworks');
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(300);
  await shot(page, 'A-landing-rules');
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(300);
  await shot(page, 'A-landing-tablero-preview');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await shot(page, 'A-landing-footer');

  // 1. Login (no nav bar bottom tab here since logged out)
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await shot(page, 'B-login-default');

  // Tap on a player to see selected state
  const pBtn = page.locator('button:has-text("Wunshi")').first();
  await pBtn.click();
  await page.waitForTimeout(200);
  // Focus the PIN field to see what keyboard the browser thinks (computed)
  await page.locator('input[name="pin"]').focus();
  await page.waitForTimeout(300);
  await shot(page, 'B-login-pin-focused');
  // Type wrong PIN to trigger error
  await page.locator('input[name="pin"]').fill('9999');
  await page.locator('button:has-text("Entrar a la cancha")').click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(500);
  await shot(page, 'B-login-error-shown');
  await shot(page, 'B-login-error-full', { fullPage: true });

  // audit interactive elements on login
  fs.writeFileSync(path.join(OUT, 'login-targets.json'), JSON.stringify(await tapAudit(page, 'login'), null, 2));

  // 2. Reglas (public)
  await page.goto(`${BASE}/reglas`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'C-reglas-top');
  await shot(page, 'C-reglas-full', { fullPage: true });

  // 3. Admin (apparently unprotected by gate)
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await shot(page, 'D-admin-top');
  await shot(page, 'D-admin-full', { fullPage: true });
  // Scroll to first admin row to see what input controls look like
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  await shot(page, 'D-admin-first-row');
  // Try to expand / edit a match — find an input
  const homeInput = page.locator('input[name="home_score"]').first();
  if (await homeInput.count()) {
    await homeInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot(page, 'D-admin-row-open');
    await homeInput.focus();
    await homeInput.fill('2');
    await page.locator('input[name="away_score"]').first().fill('1');
    await page.waitForTimeout(300);
    await shot(page, 'D-admin-row-filled');
  }
  // Look at admin PIN field
  const adminPin = page.locator('input[name="admin_pin"]').first();
  if (await adminPin.count()) {
    await adminPin.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await shot(page, 'D-admin-pin-area');
  }

  fs.writeFileSync(path.join(OUT, 'admin-targets.json'), JSON.stringify(await tapAudit(page, 'admin'), null, 2));

  // Inspect home page tap targets (logged out so no tab bar)
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const home = await tapAudit(page, 'home');
  fs.writeFileSync(path.join(OUT, 'home-targets.json'), JSON.stringify(home, null, 2));

  // 4. Try a non-existent prediction route to see 404 design
  await page.goto(`${BASE}/partidos/M01`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'E-protected-redirect');

  // 5. Visit a fake page
  await page.goto(`${BASE}/no-existe-fake-404`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'F-404');

  fs.writeFileSync(path.join(OUT, 'errors2.log'), errors.join('\n'));
  console.log('[done] errors:', errors.length);
  await browser.close();
})();
