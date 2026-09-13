'use client';

/**
 * Kök düzen çöktüğünde devreye giren hata ekranı.
 *
 * Kendi <html> ve <body> etiketlerini tanımlamak zorunda; kök düzenin yerine
 * geçiyor. Next'in ürettiği varsayılan sayfa, kök düzendeki istemci
 * sağlayıcısı yüzünden derleme sırasında ön-render edilemiyordu.
 */

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          background: '#fbf9f4',
          color: '#173d2b',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: '1.5rem',
        }}
      >
        <main style={{ maxWidth: '30rem', textAlign: 'center' }}>
          <p style={{ fontSize: '2.5rem', margin: 0 }} aria-hidden>
            🍲
          </p>
          <h1 style={{ fontSize: '1.5rem', margin: '1rem 0 0' }}>Bir sorun oluştu</h1>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6, color: '#3d7052' }}>
            Beklenmeyen bir hata nedeniyle sayfa görüntülenemedi. Tekrar deneyebilir veya ana
            sayfaya dönebilirsin.
          </p>
          {error.digest ? (
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#5f8e73' }}>
              Hata kodu: {error.digest}
            </p>
          ) : null}

          <div
            style={{
              marginTop: '1.75rem',
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => retry()}
              style={{
                border: 'none',
                borderRadius: '9999px',
                background: '#173d2b',
                color: '#fbf9f4',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Tekrar dene
            </button>
            <a
              href="/"
              style={{
                borderRadius: '9999px',
                border: '1px solid #ddd2bc',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1f4a34',
                textDecoration: 'none',
              }}
            >
              Ana sayfa
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
