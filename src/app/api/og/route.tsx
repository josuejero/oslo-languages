// src/app/api/og/route.tsx

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Oslo Languages';
    const description = searchParams.get('description') || '';
    const siteName = searchParams.get('siteName') || 'Oslo Languages';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1a1a1a',
            padding: '40px 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: '32px',
                  color: '#888888',
                  marginTop: '20px',
                }}
              >
                {description}
              </p>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #333',
              paddingTop: '20px',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                color: '#888888',
              }}
            >
              {siteName}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}