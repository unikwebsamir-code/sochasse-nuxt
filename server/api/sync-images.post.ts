import db from './db'
import fs from 'fs'
import path from 'path'

const WP_API = 'https://www.sochasse.fr/wp-json/wp/v2'
const MEDIA_DIR = path.join(process.cwd(), 'public', 'images')

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
}

const downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    
    const buffer = await response.arrayBuffer()
    const filepath = path.join(MEDIA_DIR, filename)
    fs.writeFileSync(filepath, Buffer.from(buffer))
    return `/images/${filename}`
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const method = event.method
  
  if (method === 'POST') {
    const body = await readBody(event)
    const { action } = body

    if (action === 'download-images') {
      const media = db.prepare('SELECT * FROM media WHERE source_url IS NOT NULL').all() as any[]
      
      let downloaded = 0
      let failed = 0
      
      for (const m of media) {
        if (!m.source_url) continue
        
        const filename = m.source_url.split('/').pop() || `${m.id}.jpg`
        const localPath = `/images/${filename}`
        const fullPath = path.join(MEDIA_DIR, filename)
        
        if (fs.existsSync(fullPath)) {
          db.prepare('UPDATE media SET local_path = ? WHERE id = ?').run(localPath, m.id)
          continue
        }
        
        const savedPath = await downloadImage(m.source_url, filename)
        if (savedPath) {
          db.prepare('UPDATE media SET local_path = ? WHERE id = ?').run(savedPath, m.id)
          downloaded++
        } else {
          failed++
        }
      }
      
      return {
        success: true,
        message: `Downloaded ${downloaded} images, ${failed} failed`
      }
    }
    
    if (action === 'sync') {
      const response = await fetch(`${WP_API}/categories?per_page=100`)
      const categories = await response.json()
      
      let synced = 0
      const insertCategory = db.prepare(`
        INSERT OR REPLACE INTO categories (id, name, slug, description, parent_id, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)
      
      for (const cat of categories) {
        insertCategory.run(cat.id, cat.name, cat.slug, cat.description || '', cat.parent || 0)
        synced++
      }
      
      const postsResponse = await fetch(`${WP_API}/posts?per_page=100`)
      const posts = await postsResponse.json()
      
      const insertPost = db.prepare(`
        INSERT OR REPLACE INTO posts (id, title, slug, content, excerpt, featured_media, status, wp_post_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)
      
      const insertPostCategory = db.prepare(`
        INSERT OR REPLACE INTO post_categories (post_id, category_id) VALUES (?, ?)
      `)
      
      const deletePostCategories = db.prepare('DELETE FROM post_categories WHERE post_id = ?')
      
      for (const post of posts) {
        insertPost.run(
          post.id,
          post.title.rendered,
          post.slug,
          post.content.rendered,
          post.excerpt.rendered,
          post.featured_media || 0,
          post.status,
          post.id
        )
        
        deletePostCategories.run(post.id)
        
        if (post.categories && post.categories.length > 0) {
          for (const catId of post.categories) {
            insertPostCategory.run(post.id, catId)
          }
        }
        synced++
      }
      
      const mediaResponse = await fetch(`${WP_API}/media?per_page=100`)
      const media = await mediaResponse.json()
      
      const insertMedia = db.prepare(`
        INSERT OR REPLACE INTO media (id, title, alt_text, caption, mime_type, source_url, wp_media_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      for (const m of media) {
        insertMedia.run(
          m.id,
          m.title.rendered,
          m.alt_text || '',
          m.caption?.rendered || '',
          m.mime_type,
          m.source_url,
          m.id
        )
        
        const filename = m.source_url?.split('/').pop() || `${m.id}.jpg`
        const localPath = `/images/${filename}`
        const fullPath = path.join(MEDIA_DIR, filename)
        
        if (!fs.existsSync(fullPath)) {
          await downloadImage(m.source_url, filename)
        }
        
        db.prepare('UPDATE media SET local_path = ? WHERE id = ?').run(localPath, m.id)
        synced++
      }
      
      db.prepare(`
        INSERT INTO sync_log (sync_type, items_synced, status, message)
        VALUES (?, ?, ?, ?)
      `).run('full_sync', synced, 'success', `Synced with image download`)
      
      return {
        success: true,
        message: 'Sync completed with image download',
        synced
      }
    }
  }
  
  return {
    message: 'Use POST with action: sync or download-images'
  }
})
