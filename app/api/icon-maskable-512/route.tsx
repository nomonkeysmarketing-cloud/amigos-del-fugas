import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

// Maskable icon: keeps content inside the safe zone (80% center).
// Android may crop it to a circle/squircle.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#00d86b',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 240,
            color: '#0a1f14',
            lineHeight: 1,
          }}
        >
          F
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  );
}
