// Mundial FIFA 2026 — calendario oficial post-sorteo (5 dic 2025)
// 104 partidos. Fase de grupos con equipos confirmados; knockout con placeholders.
// Horarios en UTC.

export type Stage = 'group' | 'round_of_32' | 'round_of_16' | 'quarter' | 'semi' | 'third_place' | 'final';

export type MatchSeed = {
  id: string;
  stage: Stage;
  group: string | null;
  home_team: string;
  home_code: string;
  away_team: string;
  away_code: string;
  venue: string;
  kickoff_utc: string;
};

export const GROUPS: Record<string, string[]> = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COD', 'UZB', 'COL'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
};

export const MATCHES: MatchSeed[] = [
  { id: 'M01', stage: 'group', group: 'A', home_team: 'México', home_code: 'MEX', away_team: 'Sudáfrica', away_code: 'RSA', venue: 'Estadio Azteca, CDMX', kickoff_utc: '2026-06-11T19:00:00Z' },
  { id: 'M02', stage: 'group', group: 'A', home_team: 'Corea del Sur', home_code: 'KOR', away_team: 'Chequia', away_code: 'CZE', venue: 'Estadio Akron, Zapopan', kickoff_utc: '2026-06-12T02:00:00Z' },
  { id: 'M03', stage: 'group', group: 'B', home_team: 'Canadá', home_code: 'CAN', away_team: 'Bosnia y Herzegovina', away_code: 'BIH', venue: 'BMO Field, Toronto', kickoff_utc: '2026-06-12T19:00:00Z' },
  { id: 'M04', stage: 'group', group: 'D', home_team: 'Estados Unidos', home_code: 'USA', away_team: 'Paraguay', away_code: 'PAR', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-06-13T01:00:00Z' },
  { id: 'M05', stage: 'group', group: 'B', home_team: 'Qatar', home_code: 'QAT', away_team: 'Suiza', away_code: 'SUI', venue: "Levi's Stadium, Santa Clara", kickoff_utc: '2026-06-13T19:00:00Z' },
  { id: 'M06', stage: 'group', group: 'C', home_team: 'Brasil', home_code: 'BRA', away_team: 'Marruecos', away_code: 'MAR', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-06-13T22:00:00Z' },
  { id: 'M07', stage: 'group', group: 'C', home_team: 'Haití', home_code: 'HAI', away_team: 'Escocia', away_code: 'SCO', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-06-14T01:00:00Z' },
  { id: 'M08', stage: 'group', group: 'D', home_team: 'Australia', home_code: 'AUS', away_team: 'Turquía', away_code: 'TUR', venue: 'BC Place, Vancouver', kickoff_utc: '2026-06-14T04:00:00Z' },
  { id: 'M09', stage: 'group', group: 'E', home_team: 'Alemania', home_code: 'GER', away_team: 'Curazao', away_code: 'CUW', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-06-14T17:00:00Z' },
  { id: 'M10', stage: 'group', group: 'F', home_team: 'Países Bajos', home_code: 'NED', away_team: 'Japón', away_code: 'JPN', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-06-14T20:00:00Z' },
  { id: 'M11', stage: 'group', group: 'E', home_team: 'Costa de Marfil', home_code: 'CIV', away_team: 'Ecuador', away_code: 'ECU', venue: 'Lincoln Financial Field, Philadelphia', kickoff_utc: '2026-06-14T23:00:00Z' },
  { id: 'M12', stage: 'group', group: 'F', home_team: 'Suecia', home_code: 'SWE', away_team: 'Túnez', away_code: 'TUN', venue: 'Estadio BBVA, Monterrey', kickoff_utc: '2026-06-15T02:00:00Z' },
  { id: 'M13', stage: 'group', group: 'H', home_team: 'España', home_code: 'ESP', away_team: 'Cabo Verde', away_code: 'CPV', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-06-15T16:00:00Z' },
  { id: 'M14', stage: 'group', group: 'G', home_team: 'Bélgica', home_code: 'BEL', away_team: 'Egipto', away_code: 'EGY', venue: 'Lumen Field, Seattle', kickoff_utc: '2026-06-15T19:00:00Z' },
  { id: 'M15', stage: 'group', group: 'H', home_team: 'Arabia Saudita', home_code: 'KSA', away_team: 'Uruguay', away_code: 'URU', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-06-15T22:00:00Z' },
  { id: 'M16', stage: 'group', group: 'G', home_team: 'Irán', home_code: 'IRN', away_team: 'Nueva Zelanda', away_code: 'NZL', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-06-16T01:00:00Z' },
  { id: 'M17', stage: 'group', group: 'I', home_team: 'Francia', home_code: 'FRA', away_team: 'Senegal', away_code: 'SEN', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-06-16T19:00:00Z' },
  { id: 'M18', stage: 'group', group: 'I', home_team: 'Irak', home_code: 'IRQ', away_team: 'Noruega', away_code: 'NOR', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-06-16T22:00:00Z' },
  { id: 'M19', stage: 'group', group: 'J', home_team: 'Argentina', home_code: 'ARG', away_team: 'Argelia', away_code: 'ALG', venue: 'Arrowhead Stadium, Kansas City', kickoff_utc: '2026-06-17T01:00:00Z' },
  { id: 'M20', stage: 'group', group: 'J', home_team: 'Austria', home_code: 'AUT', away_team: 'Jordania', away_code: 'JOR', venue: "Levi's Stadium, Santa Clara", kickoff_utc: '2026-06-17T04:00:00Z' },
  { id: 'M21', stage: 'group', group: 'K', home_team: 'Portugal', home_code: 'POR', away_team: 'RD Congo', away_code: 'COD', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-06-17T17:00:00Z' },
  { id: 'M22', stage: 'group', group: 'L', home_team: 'Inglaterra', home_code: 'ENG', away_team: 'Croacia', away_code: 'CRO', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-06-17T20:00:00Z' },
  { id: 'M23', stage: 'group', group: 'L', home_team: 'Ghana', home_code: 'GHA', away_team: 'Panamá', away_code: 'PAN', venue: 'BMO Field, Toronto', kickoff_utc: '2026-06-17T23:00:00Z' },
  { id: 'M24', stage: 'group', group: 'K', home_team: 'Uzbekistán', home_code: 'UZB', away_team: 'Colombia', away_code: 'COL', venue: 'Estadio Azteca, CDMX', kickoff_utc: '2026-06-18T02:00:00Z' },
  { id: 'M25', stage: 'group', group: 'A', home_team: 'Chequia', home_code: 'CZE', away_team: 'Sudáfrica', away_code: 'RSA', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-06-18T16:00:00Z' },
  { id: 'M26', stage: 'group', group: 'B', home_team: 'Suiza', home_code: 'SUI', away_team: 'Bosnia y Herzegovina', away_code: 'BIH', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-06-18T19:00:00Z' },
  { id: 'M27', stage: 'group', group: 'B', home_team: 'Canadá', home_code: 'CAN', away_team: 'Qatar', away_code: 'QAT', venue: 'BC Place, Vancouver', kickoff_utc: '2026-06-18T22:00:00Z' },
  { id: 'M28', stage: 'group', group: 'A', home_team: 'México', home_code: 'MEX', away_team: 'Corea del Sur', away_code: 'KOR', venue: 'Estadio Akron, Zapopan', kickoff_utc: '2026-06-19T01:00:00Z' },
  { id: 'M29', stage: 'group', group: 'D', home_team: 'Estados Unidos', home_code: 'USA', away_team: 'Australia', away_code: 'AUS', venue: 'Lumen Field, Seattle', kickoff_utc: '2026-06-19T19:00:00Z' },
  { id: 'M30', stage: 'group', group: 'C', home_team: 'Escocia', home_code: 'SCO', away_team: 'Marruecos', away_code: 'MAR', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-06-19T22:00:00Z' },
  { id: 'M31', stage: 'group', group: 'C', home_team: 'Brasil', home_code: 'BRA', away_team: 'Haití', away_code: 'HAI', venue: 'Lincoln Financial Field, Philadelphia', kickoff_utc: '2026-06-20T00:30:00Z' },
  { id: 'M32', stage: 'group', group: 'D', home_team: 'Turquía', home_code: 'TUR', away_team: 'Paraguay', away_code: 'PAR', venue: "Levi's Stadium, Santa Clara", kickoff_utc: '2026-06-20T04:00:00Z' },
  { id: 'M33', stage: 'group', group: 'F', home_team: 'Países Bajos', home_code: 'NED', away_team: 'Suecia', away_code: 'SWE', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-06-20T17:00:00Z' },
  { id: 'M34', stage: 'group', group: 'E', home_team: 'Alemania', home_code: 'GER', away_team: 'Costa de Marfil', away_code: 'CIV', venue: 'BMO Field, Toronto', kickoff_utc: '2026-06-20T20:00:00Z' },
  { id: 'M35', stage: 'group', group: 'E', home_team: 'Ecuador', home_code: 'ECU', away_team: 'Curazao', away_code: 'CUW', venue: 'Arrowhead Stadium, Kansas City', kickoff_utc: '2026-06-21T00:00:00Z' },
  { id: 'M36', stage: 'group', group: 'F', home_team: 'Túnez', home_code: 'TUN', away_team: 'Japón', away_code: 'JPN', venue: 'Estadio BBVA, Monterrey', kickoff_utc: '2026-06-21T04:00:00Z' },
  { id: 'M37', stage: 'group', group: 'H', home_team: 'España', home_code: 'ESP', away_team: 'Arabia Saudita', away_code: 'KSA', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-06-21T16:00:00Z' },
  { id: 'M38', stage: 'group', group: 'G', home_team: 'Bélgica', home_code: 'BEL', away_team: 'Irán', away_code: 'IRN', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-06-21T19:00:00Z' },
  { id: 'M39', stage: 'group', group: 'H', home_team: 'Uruguay', home_code: 'URU', away_team: 'Cabo Verde', away_code: 'CPV', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-06-21T22:00:00Z' },
  { id: 'M40', stage: 'group', group: 'G', home_team: 'Nueva Zelanda', home_code: 'NZL', away_team: 'Egipto', away_code: 'EGY', venue: 'BC Place, Vancouver', kickoff_utc: '2026-06-22T01:00:00Z' },
  { id: 'M41', stage: 'group', group: 'J', home_team: 'Argentina', home_code: 'ARG', away_team: 'Austria', away_code: 'AUT', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-06-22T17:00:00Z' },
  { id: 'M42', stage: 'group', group: 'I', home_team: 'Francia', home_code: 'FRA', away_team: 'Irak', away_code: 'IRQ', venue: 'Lincoln Financial Field, Philadelphia', kickoff_utc: '2026-06-22T21:00:00Z' },
  { id: 'M43', stage: 'group', group: 'I', home_team: 'Noruega', home_code: 'NOR', away_team: 'Senegal', away_code: 'SEN', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-06-23T00:00:00Z' },
  { id: 'M44', stage: 'group', group: 'J', home_team: 'Jordania', home_code: 'JOR', away_team: 'Argelia', away_code: 'ALG', venue: "Levi's Stadium, Santa Clara", kickoff_utc: '2026-06-23T03:00:00Z' },
  { id: 'M45', stage: 'group', group: 'K', home_team: 'Portugal', home_code: 'POR', away_team: 'Uzbekistán', away_code: 'UZB', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-06-23T17:00:00Z' },
  { id: 'M46', stage: 'group', group: 'L', home_team: 'Inglaterra', home_code: 'ENG', away_team: 'Ghana', away_code: 'GHA', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-06-23T20:00:00Z' },
  { id: 'M47', stage: 'group', group: 'L', home_team: 'Panamá', home_code: 'PAN', away_team: 'Croacia', away_code: 'CRO', venue: 'BMO Field, Toronto', kickoff_utc: '2026-06-23T23:00:00Z' },
  { id: 'M48', stage: 'group', group: 'K', home_team: 'Colombia', home_code: 'COL', away_team: 'RD Congo', away_code: 'COD', venue: 'Estadio Akron, Zapopan', kickoff_utc: '2026-06-24T02:00:00Z' },
  { id: 'M49', stage: 'group', group: 'B', home_team: 'Suiza', home_code: 'SUI', away_team: 'Canadá', away_code: 'CAN', venue: 'BC Place, Vancouver', kickoff_utc: '2026-06-24T19:00:00Z' },
  { id: 'M50', stage: 'group', group: 'B', home_team: 'Bosnia y Herzegovina', home_code: 'BIH', away_team: 'Qatar', away_code: 'QAT', venue: 'Lumen Field, Seattle', kickoff_utc: '2026-06-24T19:00:00Z' },
  { id: 'M51', stage: 'group', group: 'C', home_team: 'Escocia', home_code: 'SCO', away_team: 'Brasil', away_code: 'BRA', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-06-24T22:00:00Z' },
  { id: 'M52', stage: 'group', group: 'C', home_team: 'Marruecos', home_code: 'MAR', away_team: 'Haití', away_code: 'HAI', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-06-24T22:00:00Z' },
  { id: 'M53', stage: 'group', group: 'A', home_team: 'Chequia', home_code: 'CZE', away_team: 'México', away_code: 'MEX', venue: 'Estadio Azteca, CDMX', kickoff_utc: '2026-06-25T01:00:00Z' },
  { id: 'M54', stage: 'group', group: 'A', home_team: 'Sudáfrica', home_code: 'RSA', away_team: 'Corea del Sur', away_code: 'KOR', venue: 'Estadio BBVA, Monterrey', kickoff_utc: '2026-06-25T01:00:00Z' },
  { id: 'M55', stage: 'group', group: 'E', home_team: 'Curazao', home_code: 'CUW', away_team: 'Costa de Marfil', away_code: 'CIV', venue: 'Lincoln Financial Field, Philadelphia', kickoff_utc: '2026-06-25T20:00:00Z' },
  { id: 'M56', stage: 'group', group: 'E', home_team: 'Ecuador', home_code: 'ECU', away_team: 'Alemania', away_code: 'GER', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-06-25T20:00:00Z' },
  { id: 'M57', stage: 'group', group: 'F', home_team: 'Japón', home_code: 'JPN', away_team: 'Suecia', away_code: 'SWE', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-06-25T23:00:00Z' },
  { id: 'M58', stage: 'group', group: 'F', home_team: 'Túnez', home_code: 'TUN', away_team: 'Países Bajos', away_code: 'NED', venue: 'Arrowhead Stadium, Kansas City', kickoff_utc: '2026-06-25T23:00:00Z' },
  { id: 'M59', stage: 'group', group: 'D', home_team: 'Turquía', home_code: 'TUR', away_team: 'Estados Unidos', away_code: 'USA', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-06-26T02:00:00Z' },
  { id: 'M60', stage: 'group', group: 'D', home_team: 'Paraguay', home_code: 'PAR', away_team: 'Australia', away_code: 'AUS', venue: "Levi's Stadium, Santa Clara", kickoff_utc: '2026-06-26T02:00:00Z' },
  { id: 'M61', stage: 'group', group: 'I', home_team: 'Noruega', home_code: 'NOR', away_team: 'Francia', away_code: 'FRA', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-06-26T19:00:00Z' },
  { id: 'M62', stage: 'group', group: 'I', home_team: 'Senegal', home_code: 'SEN', away_team: 'Irak', away_code: 'IRQ', venue: 'BMO Field, Toronto', kickoff_utc: '2026-06-26T19:00:00Z' },
  { id: 'M63', stage: 'group', group: 'H', home_team: 'Cabo Verde', home_code: 'CPV', away_team: 'Arabia Saudita', away_code: 'KSA', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-06-27T00:00:00Z' },
  { id: 'M64', stage: 'group', group: 'H', home_team: 'Uruguay', home_code: 'URU', away_team: 'España', away_code: 'ESP', venue: 'Estadio Akron, Zapopan', kickoff_utc: '2026-06-27T00:00:00Z' },
  { id: 'M65', stage: 'group', group: 'G', home_team: 'Egipto', home_code: 'EGY', away_team: 'Irán', away_code: 'IRN', venue: 'Lumen Field, Seattle', kickoff_utc: '2026-06-27T03:00:00Z' },
  { id: 'M66', stage: 'group', group: 'G', home_team: 'Nueva Zelanda', home_code: 'NZL', away_team: 'Bélgica', away_code: 'BEL', venue: 'BC Place, Vancouver', kickoff_utc: '2026-06-27T03:00:00Z' },
  { id: 'M67', stage: 'group', group: 'L', home_team: 'Panamá', home_code: 'PAN', away_team: 'Inglaterra', away_code: 'ENG', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-06-27T21:00:00Z' },
  { id: 'M68', stage: 'group', group: 'L', home_team: 'Croacia', home_code: 'CRO', away_team: 'Ghana', away_code: 'GHA', venue: 'Lincoln Financial Field, Philadelphia', kickoff_utc: '2026-06-27T21:00:00Z' },
  { id: 'M69', stage: 'group', group: 'K', home_team: 'Colombia', home_code: 'COL', away_team: 'Portugal', away_code: 'POR', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-06-27T23:30:00Z' },
  { id: 'M70', stage: 'group', group: 'K', home_team: 'RD Congo', home_code: 'COD', away_team: 'Uzbekistán', away_code: 'UZB', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-06-27T23:30:00Z' },
  { id: 'M71', stage: 'group', group: 'J', home_team: 'Argelia', home_code: 'ALG', away_team: 'Austria', away_code: 'AUT', venue: 'Arrowhead Stadium, Kansas City', kickoff_utc: '2026-06-28T02:00:00Z' },
  { id: 'M72', stage: 'group', group: 'J', home_team: 'Jordania', home_code: 'JOR', away_team: 'Argentina', away_code: 'ARG', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-06-28T02:00:00Z' },
  // Round of 32
  { id: 'M73', stage: 'round_of_32', group: null, home_team: '2º A', home_code: 'TBD', away_team: '2º B', away_code: 'TBD', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-06-28T19:00:00Z' },
  { id: 'M74', stage: 'round_of_32', group: null, home_team: '1º C', home_code: 'TBD', away_team: '2º F', away_code: 'TBD', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-06-29T17:00:00Z' },
  { id: 'M75', stage: 'round_of_32', group: null, home_team: '1º E', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-06-29T20:30:00Z' },
  { id: 'M76', stage: 'round_of_32', group: null, home_team: '1º F', home_code: 'TBD', away_team: '2º C', away_code: 'TBD', venue: 'Estadio BBVA, Monterrey', kickoff_utc: '2026-06-30T01:00:00Z' },
  { id: 'M77', stage: 'round_of_32', group: null, home_team: '2º E', home_code: 'TBD', away_team: '2º I', away_code: 'TBD', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-06-30T17:00:00Z' },
  { id: 'M78', stage: 'round_of_32', group: null, home_team: '1º I', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-06-30T21:00:00Z' },
  { id: 'M79', stage: 'round_of_32', group: null, home_team: '1º A', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'Estadio Azteca, CDMX', kickoff_utc: '2026-07-01T01:00:00Z' },
  { id: 'M80', stage: 'round_of_32', group: null, home_team: '1º L', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-07-01T16:00:00Z' },
  { id: 'M81', stage: 'round_of_32', group: null, home_team: '1º G', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'Lumen Field, Seattle', kickoff_utc: '2026-07-01T20:00:00Z' },
  { id: 'M82', stage: 'round_of_32', group: null, home_team: '1º D', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: "Levi's Stadium, Santa Clara", kickoff_utc: '2026-07-02T00:00:00Z' },
  { id: 'M83', stage: 'round_of_32', group: null, home_team: '1º H', home_code: 'TBD', away_team: '2º J', away_code: 'TBD', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-07-02T19:00:00Z' },
  { id: 'M84', stage: 'round_of_32', group: null, home_team: '2º K', home_code: 'TBD', away_team: '2º L', away_code: 'TBD', venue: 'BMO Field, Toronto', kickoff_utc: '2026-07-02T23:00:00Z' },
  { id: 'M85', stage: 'round_of_32', group: null, home_team: '1º B', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'BC Place, Vancouver', kickoff_utc: '2026-07-03T03:00:00Z' },
  { id: 'M86', stage: 'round_of_32', group: null, home_team: '2º D', home_code: 'TBD', away_team: '2º G', away_code: 'TBD', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-07-03T18:00:00Z' },
  { id: 'M87', stage: 'round_of_32', group: null, home_team: '1º J', home_code: 'TBD', away_team: '2º H', away_code: 'TBD', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-07-03T22:00:00Z' },
  { id: 'M88', stage: 'round_of_32', group: null, home_team: '1º K', home_code: 'TBD', away_team: 'Mejor 3º', away_code: 'TBD', venue: 'Arrowhead Stadium, Kansas City', kickoff_utc: '2026-07-04T01:30:00Z' },
  // Round of 16
  { id: 'M89', stage: 'round_of_16', group: null, home_team: 'Ganador M74', home_code: 'TBD', away_team: 'Ganador M77', away_code: 'TBD', venue: 'NRG Stadium, Houston', kickoff_utc: '2026-07-04T17:00:00Z' },
  { id: 'M90', stage: 'round_of_16', group: null, home_team: 'Ganador M73', home_code: 'TBD', away_team: 'Ganador M75', away_code: 'TBD', venue: 'Lincoln Financial Field, Philadelphia', kickoff_utc: '2026-07-04T21:00:00Z' },
  { id: 'M91', stage: 'round_of_16', group: null, home_team: 'Ganador M76', home_code: 'TBD', away_team: 'Ganador M78', away_code: 'TBD', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-07-05T20:00:00Z' },
  { id: 'M92', stage: 'round_of_16', group: null, home_team: 'Ganador M79', home_code: 'TBD', away_team: 'Ganador M80', away_code: 'TBD', venue: 'Estadio Azteca, CDMX', kickoff_utc: '2026-07-06T00:00:00Z' },
  { id: 'M93', stage: 'round_of_16', group: null, home_team: 'Ganador M83', home_code: 'TBD', away_team: 'Ganador M84', away_code: 'TBD', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-07-06T19:00:00Z' },
  { id: 'M94', stage: 'round_of_16', group: null, home_team: 'Ganador M81', home_code: 'TBD', away_team: 'Ganador M82', away_code: 'TBD', venue: 'Lumen Field, Seattle', kickoff_utc: '2026-07-07T00:00:00Z' },
  { id: 'M95', stage: 'round_of_16', group: null, home_team: 'Ganador M86', home_code: 'TBD', away_team: 'Ganador M88', away_code: 'TBD', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-07-07T16:00:00Z' },
  { id: 'M96', stage: 'round_of_16', group: null, home_team: 'Ganador M85', home_code: 'TBD', away_team: 'Ganador M87', away_code: 'TBD', venue: 'BC Place, Vancouver', kickoff_utc: '2026-07-07T20:00:00Z' },
  // Quarterfinals
  { id: 'M97', stage: 'quarter', group: null, home_team: 'Ganador M89', home_code: 'TBD', away_team: 'Ganador M90', away_code: 'TBD', venue: 'Gillette Stadium, Foxborough', kickoff_utc: '2026-07-09T20:00:00Z' },
  { id: 'M98', stage: 'quarter', group: null, home_team: 'Ganador M93', home_code: 'TBD', away_team: 'Ganador M94', away_code: 'TBD', venue: 'SoFi Stadium, Inglewood', kickoff_utc: '2026-07-10T19:00:00Z' },
  { id: 'M99', stage: 'quarter', group: null, home_team: 'Ganador M91', home_code: 'TBD', away_team: 'Ganador M92', away_code: 'TBD', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-07-11T21:00:00Z' },
  { id: 'M100', stage: 'quarter', group: null, home_team: 'Ganador M95', home_code: 'TBD', away_team: 'Ganador M96', away_code: 'TBD', venue: 'Arrowhead Stadium, Kansas City', kickoff_utc: '2026-07-12T01:00:00Z' },
  // Semis
  { id: 'M101', stage: 'semi', group: null, home_team: 'Ganador M97', home_code: 'TBD', away_team: 'Ganador M98', away_code: 'TBD', venue: 'AT&T Stadium, Arlington', kickoff_utc: '2026-07-14T19:00:00Z' },
  { id: 'M102', stage: 'semi', group: null, home_team: 'Ganador M99', home_code: 'TBD', away_team: 'Ganador M100', away_code: 'TBD', venue: 'Mercedes-Benz Stadium, Atlanta', kickoff_utc: '2026-07-15T19:00:00Z' },
  // Third place
  { id: 'M103', stage: 'third_place', group: null, home_team: 'Perdedor M101', home_code: 'TBD', away_team: 'Perdedor M102', away_code: 'TBD', venue: 'Hard Rock Stadium, Miami Gardens', kickoff_utc: '2026-07-18T21:00:00Z' },
  // Final
  { id: 'M104', stage: 'final', group: null, home_team: 'Ganador M101', home_code: 'TBD', away_team: 'Ganador M102', away_code: 'TBD', venue: 'MetLife Stadium, East Rutherford', kickoff_utc: '2026-07-19T19:00:00Z' },
];

export const PLAYERS = ['Wunshi', 'La Ciruela', 'La Tlayuda', 'El Fugas', 'El Cuadrado'];

export const STAGE_LABELS: Record<Stage, string> = {
  group: 'Fase de grupos',
  round_of_32: 'Dieciseisavos',
  round_of_16: 'Octavos',
  quarter: 'Cuartos',
  semi: 'Semifinal',
  third_place: 'Tercer lugar',
  final: 'Final',
};
