import db from './db'

export default defineEventHandler((event) => {
  const categories = db.prepare(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM post_categories pc JOIN posts p ON pc.post_id = p.id WHERE pc.category_id = c.id AND p.status = 'publish') as post_count
    FROM categories c
    ORDER BY c.name
  `).all()

  return categories
})
