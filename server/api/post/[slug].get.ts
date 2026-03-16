import db from './db'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }

  const post = db.prepare(`
    SELECT p.*, GROUP_CONCAT(c.id) as category_ids, GROUP_CONCAT(c.name) as categories
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.slug = ? AND p.status = 'publish'
    GROUP BY p.id
  `).get(slug) as any

  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }

  let featuredImage = null
  if (post.featured_media) {
    const media = db.prepare('SELECT local_path, source_url FROM media WHERE id = ?').get(post.featured_media) as any
    if (media) {
      featuredImage = media.local_path || media.source_url
    }
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featured_media: post.featured_media,
    featured_image: featuredImage,
    created_at: post.created_at,
    categories: post.categories ? post.categories.split(',') : [],
    category_ids: post.category_ids ? post.category_ids.split(',').map(Number) : []
  }
})
