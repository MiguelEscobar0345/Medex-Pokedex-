import React from 'react'

const LINKS = {
  sitemap: [
    { label: 'Portfolio',  href: 'https://tu-portfolio.com' },
    { label: 'Contact',    href: 'mailto:miguelescobarp03@gmail.com' },
  ],
  socials: [
    { label: 'LinkedIn',   href: 'https://www.linkedin.com/in/miguel-escobar-p?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
    { label: 'GitHub',     href: 'https://github.com/MiguelEscobar0345' },
    { label: 'Instagram',  href: 'https://www.instagram.com/escomiguep?igsh=Njl4bWpnOXB3NTJ1&utm_source=qr' },
    { label: 'Email',      href: 'mailto:miguelescobarp03@gmail.com' },
  ],
}

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          text-decoration: none;
          color: #3a3a3c;
          font-size: 1rem;
          font-weight: 400;
          line-height: 2;
          transition: color 0.15s ease;
          display: block;
        }
        .footer-link:hover { color: #395144; }
        @media (max-width: 640px) {
          .footer-cols { flex-direction: column !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; gap: 20px !important; align-items: flex-start !important; }
          .footer-name { font-size: 2.4rem !important; }
        }
      `}</style>
      <footer style={{
        borderTop: '1px solid rgba(0,0,0,0.08)',
        background: '#f5f5f7',
        padding: '48px 40px 40px',
        marginTop: 0,
        boxSizing: 'border-box',
      }}>
        {/* Columns */}
        <div
          className="footer-cols"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Sitemap */}
          <div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 600, color: '#aeaeb2',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
            }}>
              Sitemap
            </div>
            {LINKS.sitemap.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="footer-link">
                {l.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 600, color: '#aeaeb2',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
            }}>
              Socials
            </div>
            {LINKS.socials.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="footer-link"
                style={{ textAlign: 'right' }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', marginBottom: 36 }} />

        {/* Bottom row: name + version + macaw */}
        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <h2
            className="footer-name"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#1d1d1f',
            }}
          >
            Miguel E.<br />Escobar P.
          </h2>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 600, color: '#aeaeb2',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                Version
              </div>
              <div style={{
                fontSize: '1.4rem', fontWeight: 600, color: '#1d1d1f',
                letterSpacing: '-0.02em',
              }}>
                2026
              </div>
            </div>
            {/* Macaw — pon tu imagen en /public/macaw.png */}
            <img
              src="/public/macaw.png"
              alt="Macaw"
              style={{ width: 48, height: 48, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </div>
      </footer>
    </>
  )
}