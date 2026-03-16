import db from './db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const slug = query.slug as string

  if (!slug) {
    return db.prepare('SELECT * FROM categories ORDER BY name').all()
  }

  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug)

  return category || null
})
