import { useRouter } from 'next/router'

const SECTIONS = [
  {
    id: 'brands',
    title: '브랜드 & 편집샵',
    description: '국내 편집샵과 브랜드 사이트 모음',
    href: '/brands',
    available: true,
  },
  {
    id: 'regions',
    title: '지역별 분류',
    description: '지역별로 찾아보는 편집샵',
    href: '/regions',
    available: false,
  },
  {
    id: 'section3',
    title: '준비중',
    description: '곧 오픈예정',
    href: '#',
    available: false,
  },
  {
    id: 'section4',
    title: '준비중',
    description: '곧 오픈예정',
    href: '#',
    available: false,
  },
]

export default function Home() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#f0f0f0', fontFamily: 'sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
          <span style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.02em', cursor: 'pointer' }} onClick={() => router.push('/')}>
            edited.
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5em', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16 }}>
          edited.
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: 64, fontSize: '1em' }}>
          국내 패션 브랜드와 편집샵을 한곳에서
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              onClick={() => section.available && router.push(section.href)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                padding: '40px 32px',
                cursor: section.available ? 'pointer' : 'default',
                opacity: section.available ? 1 : 0.4,
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => {
                if (section.available) {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.2)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '1.2em', fontWeight: 600, marginBottom: 8 }}>{section.title}</div>
              <div style={{ fontSize: '0.85em', color: 'rgba(255,255,255,0.4)' }}>{section.description}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}