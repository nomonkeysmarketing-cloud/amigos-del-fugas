/* Mobile audit walkthrough for amigosdelfugas.vercel.app — iPhone 14 viewport */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'output', 'playwright');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'https://amigosdelfugas.vercel.app';

const iPhone14 = {
  ...devices['iPhone 13'], // closest preset; we override viewport explicitly
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
};

async function shot(page, name, opts = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: !!opts.fullPage });
  console.log('[shot]', name, opts.fullPage ? '(full)' : '(viewport)');
}

async function tryLogin(page, name, pin) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // Pick player
  const btn = page.locator(`button:has-text("${name}"), [role="button"]:has-text("${name}")`).first();
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(300);
  } else {
    // try select-like list
    const opt = page.getByText(name, { exact: false }).first();
    if (await opt.count()) await opt.click();
  }
  await page.waitForTimeout(300);
  // Type PIN — assume 4 single inputs OR one input
  const pinInputs = page.locator('input[type="password"], input[inputmode="numeric"], input[type="tel"], input[type="number"]');
  const cnt = await pinInputs.count();
  if (cnt === 4) {
    for (let i = 0; i < 4; i++) {
      await pinInputs.nth(i).fill(pin[i]);
    }
  } else if (cnt >= 1) {
    await pinInputs.first().fill(pin);
  }
  // Submit
  const submit = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Continuar")').first();
  if (await submit.count()) await submit.click();
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(800);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(iPhone14);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });

  // 1. Landing
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot(page, '01-landing-top');
  await shot(page, '01-landing-full', { fullPage: true });

  // 2. Login picker
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, '02-login-top');
  await shot(page, '02-login-full', { fullPage: true });

  // Try Wunshi/4184, fallback La Ciruela/4814
  let loggedIn = false;
  for (const cred of [['Wunshi', '4184'], ['La Ciruela', '4814']]) {
    try {
      await tryLogin(page, cred[0], cred[1]);
      const url = page.url();
      if (!url.includes('/login')) {
        loggedIn = true;
        console.log('[login] success as', cred[0], 'now at', url);
        break;
      }
      await shot(page, `02-login-fail-${cred[0].replace(/\s/g, '')}`);
    } catch (e) {
      console.log('[login] error', e.message);
    }
  }

  if (loggedIn) {
    // Might land on /cambiar-pin or /partidos
    const url = page.url();
    await shot(page, '03-postlogin-' + url.split('/').pop());

    if (url.includes('cambiar-pin')) {
      await shot(page, '03-cambiar-pin-top');
      await shot(page, '03-cambiar-pin-full', { fullPage: true });
      // Tap into first PIN field to see keyboard implications (no real kb)
      const firstPin = page.locator('input').first();
      if (await firstPin.count()) {
        await firstPin.focus();
        await shot(page, '03-cambiar-pin-focus');
      }
      // skip to direct nav
    }

    await page.goto(`${BASE}/partidos?filter=upcoming`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await shot(page, '04-partidos-top');
    await shot(page, '04-partidos-full', { fullPage: true });

    // Match detail M01
    await page.goto(`${BASE}/partidos/M01`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await shot(page, '05-match-M01-top');
    await shot(page, '05-match-M01-full', { fullPage: true });

    // Focus a score stepper / input to see touch target
    const incBtn = page.locator('button:has-text("+"), [aria-label*="+"]').first();
    if (await incBtn.count()) {
      await incBtn.click().catch(() => {});
      await page.waitForTimeout(200);
      await shot(page, '05-match-M01-after-inc');
    }

    // Tablero
    await page.goto(`${BASE}/tablero`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await shot(page, '06-tablero-top');
    await shot(page, '06-tablero-full', { fullPage: true });

    // Reglas
    await page.goto(`${BASE}/reglas`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await shot(page, '07-reglas-top');
    await shot(page, '07-reglas-full', { fullPage: true });
  }

  // Admin (independent of login)
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, '08-admin-gate');
  const adminPin = page.locator('input[type="password"], input[type="tel"], input[type="number"]').first();
  if (await adminPin.count()) {
    await adminPin.fill('2026');
    const submit = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Acceder")').first();
    if (await submit.count()) await submit.click();
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(800);
    await shot(page, '08-admin-top');
    await shot(page, '08-admin-full', { fullPage: true });
  }

  // DOM dump — grab small text & font-size info for top buttons / tab targets on partidos page
  await page.goto(`${BASE}/partidos?filter=upcoming`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const audit = await page.evaluate(() => {
    const items = [];
    const tappable = document.querySelectorAll('a, button, [role="button"], input, [role="tab"]');
    tappable.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const tag = el.tagName.toLowerCase();
      const label = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 40);
      items.push({ tag, label, w: Math.round(r.width), h: Math.round(r.height) });
    });
    return items.filter((i) => i.h < 44 || i.w < 44).slice(0, 30);
  });
  fs.writeFileSync(path.join(OUT, 'small-touch-targets.json'), JSON.stringify(audit, null, 2));

  fs.writeFileSync(path.join(OUT, 'errors.log'), errors.join('\n'));
  console.log('[done] errors:', errors.length);
  await browser.close();
})();
