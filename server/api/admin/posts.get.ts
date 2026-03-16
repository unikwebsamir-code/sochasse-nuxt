import db from './db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const perPage = parseInt(query.per_page as string) || 20
  const page = parseInt(query.page as string) || 1
  const offset = (page - 1) * perPage

  const posts = db.prepare(`
    SELECT p.*, GROUP_CONCAT(c.name) as categories
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(perPage, offset)

  const total = db.prepare('SELECT COUNT(*) as count FROM posts').get() as any

  return {
    posts: posts.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      status: p.status,
      created_at: p.created_at,
      categories: p.categories ? p.categories.split(',') : []
    })),
    total: total.count,
    page,
    perPage
  }
})
