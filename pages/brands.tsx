import { type GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getBrands, Brand } from '@/lib/get-brands'

const CATEGORIES = ['전체', '편집샵', '브랜드', '온라인몰', '빈티지/세컨핸드', '리셀', 'ETC']

export const getServerSideProps: GetServerSideProps = async () => {
  const brands = await getBrands()
  return { props: { brands } }
}

export default function Brands({ brands }: { brands: Brand[] }) {
  const router = useRouter()
  const [active, setActive] = useState('전체')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Brand | null>(null)

  const filtered = brands
    .filter((b) => active === '전체' || b.category === active)
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.url.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#f0f0f0', fontFamily: 'sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
          <h1 onClick={() => router.push('/')} style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px 0', cursor: 'pointer' }}>edited.</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} style={{ padding: '6px 16px', borderRadius: 20, border: active === cat ? '1px solid #fff' : '1px solid rgba(255,255,255,0.15)', background: active === cat ? '#fff' : 'transparent', color: active === cat ? '#0f0f0f' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85em', fontWeight: active === cat ? 600 : 400, transition: 'all 150ms ease' }}>
                {cat}
              </button>
            ))}
          </div>
          <input type="text" placeholder="브랜드 검색..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', maxWidth: 400, padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#f0f0f0', fontSize: '0.85em', outline: 'none' }} />
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filtered.map((brand) => (
            <div key={brand.id} onClick={() => setSelected(brand)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'all 200ms ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: '1.05em', fontWeight: 600, marginBottom: 8, color: '#f0f0f0' }}>{brand.name}</div>
              <div style={{ fontSize: '0.78em', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>{brand.url}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {brand.category && <span style={{ fontSize: '0.72em', padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{brand.category}</span>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 80 }}>검색 결과가 없어요</div>}
      </main>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px', maxWidth: 480, width: '90%', position: 'relative' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.4em', cursor: 'pointer' }}>×</button>
            <div style={{ fontSize: '1.6em', fontWeight: 700, marginBottom: 6 }}>{selected.name}</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
              {selected.category && <span style={{ fontSize: '0.75em', padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{selected.category}</span>}
              {selected.region && <span style={{ fontSize: '0.75em', padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{selected.region}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selected.url && (
                <a href={selected.url.startsWith('http') ? selected.url : 'https://' + selected.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, textDecoration: 'none', color: '#f0f0f0', fontSize: '0.9em' }}>
                  <span>🔗</span><span>{selected.url}</span>
                </a>
              )}
              {selected.naverMaps && selected.naverMaps.length > 0 ? (
                selected.naverMaps.map((map, i) => (
                  <a key={i} href={map.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, textDecoration: 'none', color: '#f0f0f0', fontSize: '0.9em' }}>
                    <span>📍</span><span>{map.name}</span>
                  </a>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, color: 'rgba(255,255,255,0.25)', fontSize: '0.9em' }}>
                  <span>📍</span><span>위치 정보 없음</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}