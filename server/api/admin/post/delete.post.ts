import db from './db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required'
    })
  }

  db.prepare('DELETE FROM post_categories WHERE post_id = ?').run(id)
  db.prepare('DELETE FROM posts WHERE id = ?').run(id)

  return { success: true, message: 'Post deleted successfully' }
})
