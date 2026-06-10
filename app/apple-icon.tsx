import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
            width: 122,
            height: 122,
            borderRadius: '50%',
            background: '#00d86b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 70,
            color: '#0a1f14',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.18)',
          }}
        >
          F
        </div>
      </div>
    ),
    { ...size },
  );
}
