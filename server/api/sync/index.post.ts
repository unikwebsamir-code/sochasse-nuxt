import db from './db'

const WP_API = 'https://www.sochasse.fr/wp-json/wp/v2'

const stripHtml = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

export const syncCategories = async () => {
  const response = await fetch(`${WP_API}/categories?per_page=100`)
  const categories = await response.json()

  let synced = 0
  
  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO categories (id, name, slug, description, parent_id, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)

  const transaction = db.transaction((cats: any[]) => {
    for (const cat of cats) {
      insertCategory.run(
        cat.id,
        cat.name,
        cat.slug,
        cat.description || '',
        cat.parent || 0
      )
      synced++
    }
  })

  transaction(categories)
  
  return synced
}

export const syncPosts = async () => {
  const response = await fetch(`${WP_API}/posts?per_page=100`)
  const posts = await response.json()

  let synced = 0

  const insertPost = db.prepare(`
    INSERT OR REPLACE INTO posts (id, title, slug, content, excerpt, featured_media, status, wp_post_id, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)

  const insertPostCategory = db.prepare(`
    INSERT OR REPLACE INTO post_categories (post_id, category_id)
    VALUES (?, ?)
  `)

  const deletePostCategories = db.prepare(`DELETE FROM post_categories WHERE post_id = ?`)

  const transaction = db.transaction((psts: any[]) => {
    for (const post of psts) {
      insertPost.run(
        post.id,
        stripHtml(post.title.rendered),
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
  })

  transaction(posts)

  return synced
}

export const syncMedia = async () => {
  const response = await fetch(`${WP_API}/media?per_page=100`)
  const media = await response.json()

  let synced = 0

  const insertMedia = db.prepare(`
    INSERT OR REPLACE INTO media (id, title, alt_text, caption, mime_type, source_url, wp_media_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const transaction = db.transaction((medias: any[]) => {
    for (const m of medias) {
      insertMedia.run(
        m.id,
        m.title.rendered,
        m.alt_text || '',
        m.caption?.rendered || '',
        m.mime_type,
        m.source_url,
        m.id
      )
      synced++
    }
  })

  transaction(media)

  return synced
}

export const syncAll = async () => {
  const results: any = { categories: 0, posts: 0, media: 0 }

  try {
    results.categories = await syncCategories()
  } catch (e) {
    console.error('Category sync error:', e)
  }

  try {
    results.posts = await syncPosts()
  } catch (e) {
    console.error('Post sync error:', e)
  }

  try {
    results.media = await syncMedia()
  } catch (e) {
    console.error('Media sync error:', e)
  }

  const total = results.categories + results.posts + results.media

  db.prepare(`
    INSERT INTO sync_log (sync_type, items_synced, status, message)
    VALUES (?, ?, ?, ?)
  `).run('full_sync', total, 'success', `Categories: ${results.categories}, Posts: ${results.posts}, Media: ${results.media}`)

  return results
}

export default defineEventHandler(async (event) => {
  const results = await syncAll()

  return {
    success: true,
    message: 'Sync completed',
    ...results
  }
})
