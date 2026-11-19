import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  const title = 'Game Visioning';
  const subtitle = 'AI, Gaming, and Tech News';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 64,
          background: 'linear-gradient(135deg, #0f172a, #111827)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(60% 80% at 10% 10%, rgba(99,102,241,0.45), transparent 50%), radial-gradient(70% 60% at 90% 30%, rgba(236,72,153,0.32), transparent 55%)',
          }}
        />
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>{title}</div>
        <div style={{ fontSize: 32, opacity: 0.9, marginTop: 8 }}>{subtitle}</div>
        <div style={{ fontSize: 22, opacity: 0.7, marginTop: 16 }}>visionong.dpdns.org</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
