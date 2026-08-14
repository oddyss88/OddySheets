import { ImageResponse } from 'next/og'

export const alt = 'OddySheets — Premium fashion finds curated by Oddy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, color: 'white' }}>
          Oddy<span style={{ color: '#3b82f6' }}>Sheets</span>
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#9ca3af', marginTop: 20 }}>
          Premium fashion finds, curated by Oddy
        </div>
      </div>
    ),
    { ...size }
  )
}
