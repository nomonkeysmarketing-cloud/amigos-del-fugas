// Mapping de códigos FIFA/IOC (3 letras) → ISO 3166-1 alpha-2 (2 letras) para flagcdn.com
const CODE_TO_ISO2: Record<string, string> = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct',
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
  ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
  ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
};

export function flagUrl(code: string, size: 'w40' | 'w80' | 'w160' | 'w320' = 'w80'): string | null {
  const iso = CODE_TO_ISO2[code];
  if (!iso) return null;
  return `https://flagcdn.com/${size}/${iso}.png`;
}

export function flagUrl2x(code: string, size: 'w40' | 'w80' | 'w160' | 'w320' = 'w80'): string | null {
  const iso = CODE_TO_ISO2[code];
  if (!iso) return null;
  return `https://flagcdn.com/${size}/${iso}.png 1x, https://flagcdn.com/${size === 'w40' ? 'w80' : size === 'w80' ? 'w160' : 'w320'}/${iso}.png 2x`;
}
