import { notion } from './notion-api'
import { rootNotionPageId } from './config'

export interface NaverMapLink {
  name: string
  url: string
}

export interface Brand {
  id: string
  name: string
  url: string
  category: string
  region: string
  naverMaps: NaverMapLink[]
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const recordMap = await notion.getPage(rootNotionPageId)
    const brands: Brand[] = []

    for (const [blockId, blockData] of Object.entries(recordMap.block)) {
      const block = (blockData as any)?.value?.value
      if (!block) continue
      if (block.type !== 'page') continue
      if (block.id === rootNotionPageId.replace(/-/g, '')) continue

      const properties = block.properties || {}
      const name = properties.title?.[0]?.[0] || ''
      if (!name) continue

      const url = properties['p0_a']?.[0]?.[0] || ''
      const category = properties['Tt_p']?.[0]?.[0] || ''
      const region = properties['YhPk']?.[0]?.[0] || ''

      const naverMaps: NaverMapLink[] = []
      const rawNaverMap = properties['~hG['] || []
      for (const item of rawNaverMap) {
        const text = item[0] || ''
        const links = item[1] || []
        for (const link of links) {
          if (link[0] === 'a' && link[1]) {
            naverMaps.push({ name: text, url: link[1] })
          }
        }
      }

      if (category) console.log('category:', JSON.stringify(category))
      brands.push({ id: blockId, name, url, category, region, naverMaps })
    }

    return brands
  } catch (err) {
    console.error('getBrands error', err)
    return []
  }
}