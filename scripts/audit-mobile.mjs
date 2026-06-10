// Mobile Lighthouse audit (iPhone 14, 4G, CPU 4x) for amigosdelfugas.vercel.app
// Outputs: output/lighthouse-mobile-<slug>.json (full LHR) + output/audit-summary.json
import fs from 'node:fs/promises';
import path from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const BASE = 'https://amigosdelfugas.vercel.app';
const OUT = path.resolve('output');
await fs.mkdir(OUT, { recursive: true });

// iPhone 14 viewport, Lighthouse mobile preset already does Moto G4 emulation,
// but we override viewport + UA via Chrome launch + LH settings.
const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
    emulatedUserAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    throttling: {
      // "Slow 4G" preset - regular 4G with realistic latency
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.56,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4,
    },
    onlyCategories: ['performance', 'best-practices'],
    skipAudits: ['uses-http2', 'redirects-http'],
  },
};

const pages = [
  { slug: 'landing', url: `${BASE}/`, auth: false },
  { slug: 'login', url: `${BASE}/login`, auth: false },
  { slug: 'reglas', url: `${BASE}/reglas`, auth: false },
  { slug: 'tablero', url: `${BASE}/tablero`, auth: false },
  // partidos/M01 may require auth; we'll try anonymous and see what happens
  { slug: 'partidos-M01', url: `${BASE}/partidos/M01`, auth: false },
];

function pickMetrics(lhr) {
  const a = lhr.audits;
  const m = lhr.audits.metrics?.details?.items?.[0] || {};
  const cwv = {
    LCP_ms: a['largest-contentful-paint']?.numericValue ?? null,
    FCP_ms: a['first-contentful-paint']?.numericValue ?? null,
    TBT_ms: a['total-blocking-time']?.numericValue ?? null,
    CLS: a['cumulative-layout-shift']?.numericValue ?? null,
    SpeedIndex_ms: a['speed-index']?.numericValue ?? null,
    TTI_ms: a['interactive']?.numericValue ?? null,
    INP_ms_est: a['interaction-to-next-paint']?.numericValue ?? null, // synthetic; INP needs RUM
    TTFB_ms: a['server-response-time']?.numericValue ?? null,
  };
  // bytes
  const totalBytes = a['total-byte-weight']?.numericValue ?? null;
  const jsBytes = a['network-requests']?.details?.items
    ?.filter(i => i.resourceType === 'Script')
    .reduce((s, i) => s + (i.transferSize || 0), 0) ?? null;
  const imgBytes = a['network-requests']?.details?.items
    ?.filter(i => i.resourceType === 'Image')
    .reduce((s, i) => s + (i.transferSize || 0), 0) ?? null;
  const fontBytes = a['network-requests']?.details?.items
    ?.filter(i => i.resourceType === 'Font')
    .reduce((s, i) => s + (i.transferSize || 0), 0) ?? null;
  return {
    score: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    cwv,
    bytes: { totalBytes, jsBytes, imgBytes, fontBytes },
    lcp_element: a['largest-contentful-paint-element']?.details?.items?.[0]?.node?.snippet || null,
    cls_culprits: (a['layout-shift-elements']?.details?.items || []).slice(0, 5).map(i => ({
      node: i.node?.snippet, score: i.score,
    })),
    render_blocking: (a['render-blocking-resources']?.details?.items || []).map(i => ({
      url: i.url, totalBytes: i.totalBytes, wastedMs: i.wastedMs,
    })),
    unused_js_kb: a['unused-javascript']?.details?.overallSavingsBytes
      ? Math.round(a['unused-javascript'].details.overallSavingsBytes / 1024) : 0,
    third_party_summary: (a['third-party-summary']?.details?.items || []).slice(0, 5),
    main_thread_work_ms: a['mainthread-work-breakdown']?.numericValue ?? null,
    bootup_time_ms: a['bootup-time']?.numericValue ?? null,
  };
}

async function auditPage({ slug, url }) {
  console.log(`\n=== Auditing ${slug} ${url} ===`);
  // Launch Chrome via Playwright so we keep one consistent binary; LH wants a CDP port.
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const result = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error' }, mobileConfig);
    const lhr = result.lhr;
    await fs.writeFile(
      path.join(OUT, `lighthouse-mobile-${slug}.json`),
      JSON.stringify(lhr, null, 2),
    );
    const summary = pickMetrics(lhr);
    console.log(`  perf=${summary.score} LCP=${Math.round(summary.cwv.LCP_ms)}ms TBT=${Math.round(summary.cwv.TBT_ms)}ms CLS=${summary.cwv.CLS?.toFixed(3)} FCP=${Math.round(summary.cwv.FCP_ms)}ms`);
    return { slug, url, ...summary, finalUrl: lhr.finalDisplayedUrl };
  } catch (e) {
    console.error(`  FAILED: ${e.message}`);
    return { slug, url, error: e.message };
  } finally {
    try { await chrome.kill(); } catch (e) { /* Windows tmp cleanup race */ }
  }
}

const results = [];
for (const p of pages) {
  const r = await auditPage(p);
  results.push(r);
}

await fs.writeFile(path.join(OUT, 'audit-summary.json'), JSON.stringify(results, null, 2));
console.log('\nDone. Summary at output/audit-summary.json');
