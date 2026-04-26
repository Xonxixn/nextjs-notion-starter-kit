import type { PageProps } from '@/lib/types'
import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)
    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)
    // 429 에러면 빌드 실패 대신 fallback 반환
    return {
      props: {} as PageProps,
      revalidate: 5
    }
  }
}

export default function NotionDomainPage(props: PageProps) {
  return <NotionPage {...props} />
}
