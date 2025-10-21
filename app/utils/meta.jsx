export const extractMeta = (server_url, article) => [
  { property: 'og:url', content: server_url },
  { property: 'og:type', content: 'article' },
  { property: 'og:title', content: article.title },
  {
    property: 'og:description',
    content: article.meta?.search_description || 'GBH Open Vault Exhibit',
  },
  { property: 'og:image', content: article.cover_image?.url },
  { name: 'twitter:card', content: 'summary_large_image' },
  { property: 'twitter:domain', content: 'openvault.wgbh.org' },
  { property: 'twitter:url', content: server_url },
  { name: 'twitter:title', content: article.title },
  {
    name: 'twitter:description',
    content: article.meta?.search_description || 'GBH Open Vault Exhibit',
  },
  { name: 'twitter:image', content: article.cover_image?.url },
]

export const Meta = [
  { property: 'og:type', content: 'website' },
  { property: 'og:image', content: 'https://ov.wgbh-mla.org/gbh-mural.jpg' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { property: 'twitter:domain', content: 'openvault.wgbh.org' },
  { name: 'twitter:title', content: 'GBH Open Vault Exhibit' },
  {
    name: 'twitter:description',
    content: 'Explore Scholar Exhibits and Collections from GBH Open Vault',
  },
  { name: 'twitter:image', content: 'https://ov.wgbh-mla.org/gbh-mural.jpg' },
]

export const HomeMeta = [
  ...Meta,
  { property: 'og:title', content: 'GBH Open Vault' },
  { property: 'og:url', content: 'https://openvault.wgbh.org' },
  { property: 'twitter:url', content: 'https://openvault.wgbh.org' },
  {
    property: 'og:description',
    content: 'Explore Scholar Exhibits and Collections from GBH Open Vault',
  },
]
