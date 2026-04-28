import { type GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getCurated, type CuratedItem } from '@/lib/get-curated'

export const getServerSideProps: GetServerSideProps = async () => {
  const items = await getCurated()
  return { props: { items } }
}

export default function Curated({ items }: { items: CuratedItem[] }) {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const topics = [...new Set(items.map((i) => i.topic).filter(Boolean))]
  const filtered = selectedTopic ? items.filter((i) => i.topic === selectedTopic) : []

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#f0f0f0', fontFamily: 'sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 54 }}>
          <span onClick={() => router.push('/')} style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.02em', cursor: 'pointer' }}>edited.</span>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {!selectedTopic ? (
          <>
            <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>curated.</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: 48, fontSize: '0.9em' }}>주제별 패션 아이템 큐레이션</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {topics.map((topic) => {
                const topicItems = items.filter((i) => i.topic === topic)
                const cover = topicItems.find((i) => i.imageUrl)?.imageUrl
                return (
                  <div key={topic} onClick={() => setSelectedTopic(topic)} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 200ms ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
                  >
                    {cover && <img src={cover} alt={topic} style={{ width: '100%', aspectRatio: '1.5', objectFit: 'cover' }} />}
                    {!cover && <div style={{ width: '100%', aspectRatio: '1.5', background: 'rgba(255,255,255,0.03)' }} />}
                    <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: 4 }}>{topic}</div>
                      <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.4)' }}>{topicItems.length}개 아이템</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <button onClick={() => setSelectedTopic(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4em' }}>←</button>
              <h2 style={{ fontSize: '1.6em', fontWeight: 700, letterSpacing: '-0.02em' }}>{selectedTopic}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {filtered.map((item) => (
                <div key={item.id} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.querySelector('.overlay') as HTMLElement).style.opacity = '1'}
                  onMouseLeave={e => (e.currentTarget.querySelector('.overlay') as HTMLElement).style.opacity = '0'}
                >
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 200ms ease', padding: 12 }}>
                    <div style={{ fontSize: '0.9em', fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{item.brand}</div>
                    <div style={{ fontSize: '0.85em', fontWeight: 600 }}>{Number(item.price).toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}