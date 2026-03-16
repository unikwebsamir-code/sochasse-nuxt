import db from './db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, title, content, excerpt, status, category_ids } = body

  if (!id || !title) {
    throw createError({
      statusCode: 400,
      message: 'ID and title are required'
    })
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now()

  db.prepare(`
    UPDATE posts 
    SET title = ?, content = ?, excerpt = ?, status = ?, slug = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, content, excerpt, status || 'publish', slug, id)

  db.prepare('DELETE FROM post_categories WHERE post_id = ?').run(id)

  if (category_ids && category_ids.length > 0) {
    const insertCategory = db.prepare('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)')
    for (const catId of category_ids) {
      insertCategory.run(id, catId)
    }
  }

  return { success: true, message: 'Post updated successfully' }
})
