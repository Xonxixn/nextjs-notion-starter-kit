import { notion } from './notion-api'

const curatedPageId = 'de5fe4346aeb4d2195cf18de493cc03a'

export interface CuratedItem {
  id: string
  name: string
  brand: string
  topic: string
  price: string
  imageUrl: string
}

export async function getCurated(): Promise<CuratedItem[]> {
  try {
    const recordMap = await notion.getPage(curatedPageId)
    const items: CuratedItem[] = []

    for (const [blockId, blockData] of Object.entries(recordMap.block)) {
      const block = (blockData as any)?.value?.value
      if (!block) continue
      if (block.type !== 'page') continue
      if (block.id === curatedPageId.replace(/-/g, '')) continue

      const properties = block.properties || {}
      const name = properties.title?.[0]?.[0] || ''
      if (!name) continue

      const topic = properties['dh`P']?.[0]?.[0] || ''
      const brand = properties['nG};']?.[0]?.[0] || ''
      const price = properties['sba?']?.[0]?.[0] || ''
      const rawImage = properties['xHUy']
      const imageUrl = rawImage?.[0]?.[1]?.[0]?.[1] || rawImage?.[0]?.[0] || ''

      items.push({ id: blockId, name, brand, topic, price, imageUrl })
    }

    return items
  } catch (err) {
    console.error('getCurated error', err)
    return []
  }
}