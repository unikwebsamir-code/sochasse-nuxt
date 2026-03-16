import db from './db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const id = query.id as string

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required'
    })
  }

  const post = db.prepare(`
    SELECT p.*, GROUP_CONCAT(c.id) as category_ids
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.id = ?
    GROUP BY p.id
  `).get(id) as any

  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featured_media: post.featured_media,
    status: post.status,
    created_at: post.created_at,
    category_ids: post.category_ids ? post.category_ids.split(',').map(Number) : []
  }
})
