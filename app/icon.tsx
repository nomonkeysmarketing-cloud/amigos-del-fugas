import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#00d86b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 22,
            color: '#0a1f14',
          }}
        >
          F
        </div>
      </div>
    ),
    { ...size },
  );
}
