import db from './db'

export default defineEventHandler((event) => {
  const categories = db.prepare(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM post_categories pc WHERE pc.category_id = c.id) as post_count
    FROM categories c
    ORDER BY c.name
  `).all()

  return categories
})
