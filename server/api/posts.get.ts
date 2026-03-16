import db from './db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const perPage = parseInt(query.per_page as string) || 20
  const page = parseInt(query.page as string) || 1
  const offset = (page - 1) * perPage

  const posts = db.prepare(`
    SELECT p.*, GROUP_CONCAT(c.id) as category_ids, GROUP_CONCAT(c.name) as categories, GROUP_CONCAT(c.slug) as category_slugs
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.status = 'publish'
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(perPage, offset)

  const total = db.prepare(`SELECT COUNT(*) as count FROM posts WHERE status = 'publish'`).get() as any

  return {
    posts: posts.map((p: any) => {
      let featuredImage = null
      if (p.featured_media) {
        const media = db.prepare('SELECT local_path, source_url FROM media WHERE id = ?').get(p.featured_media) as any
        if (media) {
          featuredImage = media.local_path || media.source_url
        }
      }
      
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        featured_media: p.featured_media,
        featured_image: featuredImage,
        status: p.status,
        created_at: p.created_at,
        categories: p.categories ? p.categories.split(',') : [],
        category_slugs: p.category_slugs ? p.category_slugs.split(',') : [],
        category_ids: p.category_ids ? p.category_ids.split(',').map(Number) : []
      }
    }),
    total: total.count,
    page,
    perPage
  }
})
