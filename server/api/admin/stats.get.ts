import db from './db'

export default defineEventHandler((event) => {
  const lastSync = db.prepare(`
    SELECT * FROM sync_log ORDER BY created_at DESC LIMIT 1
  `).get()

  const stats = {
    posts: db.prepare('SELECT COUNT(*) as count FROM posts').get() as any,
    categories: db.prepare('SELECT COUNT(*) as count FROM categories').get() as any,
    media: db.prepare('SELECT COUNT(*) as count FROM media').get() as any,
    users: db.prepare('SELECT COUNT(*) as count FROM users').get() as any
  }

  return {
    lastSync,
    stats
  }
})
