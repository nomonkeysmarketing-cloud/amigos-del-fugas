import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

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
          background: '#08110d',
        }}
      >
        <div
          style={{
            width: 348,
            height: 348,
            borderRadius: '50%',
            background: '#00d86b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 208,
            color: '#0a1f14',
            boxShadow: 'inset 0 10px 0 rgba(255,255,255,0.18)',
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
