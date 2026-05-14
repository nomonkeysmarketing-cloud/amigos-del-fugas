# La Quiniela de los Amigos del Fugas · Quiniela del Mundial

Pool de predicciones del Mundial FIFA 2026 para amigos. Predice marcadores, gana 3 pts por exacto / 1 pt por solo el resultado. Tablero en vivo.

## Cómo arrancar

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

La primera vez que corre crea automáticamente `data/quiniela.db` con:
- Los **104 partidos** del Mundial 2026
- Los **7 jugadores** (Wunshi, La Ciruela, La Tlayuda, El Fugas, El Cuadrado, El Patrón, El Micas)
- Un **PIN aleatorio de 4 dígitos** por jugador

## Compartir los PINs

Entra a <http://localhost:3000/admin> — ahí ves los PINs de cada jugador. Pásaselos por DM.

## Meter resultados

Cuando termina un partido, ve a `/admin`, busca el partido, mete el marcador y marca como **Final**. El tablero se actualiza solo cada 5 segundos.

PIN admin por defecto: `2026` (cámbialo con `ADMIN_PIN=xxxx` en `.env.local`).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- SQLite vía `better-sqlite3`
- Server Actions + polling para "real-time"

## Deploy a Vercel

SQLite no funciona en serverless. Para deployar:
1. Cambia `lib/db.ts` por un cliente Postgres (Neon / Supabase / Vercel Postgres)
2. Conserva el mismo schema (ya está definido en SQL)
3. `vercel deploy`
