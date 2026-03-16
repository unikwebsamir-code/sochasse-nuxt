<template>
  <div class="articles-page">
    <div class="container">
      <div class="page-header">
        <h1>Tous les articles</h1>
        <p>{{ total }} articles</p>
      </div>
      
      <div class="articles-grid">
        <div v-for="article in allPosts" :key="article.id" class="article-card">
          <NuxtLink :to="`/posts/${article.slug}`">
            <div class="article-image-wrapper">
              <img v-if="article.image" :src="article.image" :alt="article.title" />
              <div v-else class="article-image-placeholder">
                <span>So Chasse</span>
              </div>
            </div>
            <div class="article-card-content">
              <div class="article-category">{{ article.categories?.[0] || '' }}</div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
              <span v-if="article.readTime" class="read-time">{{ article.readTime }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div v-if="hasMore" class="load-more-container">
        <button @click="loadMore" :disabled="loading" class="load-more-btn">
          {{ loading ? 'Chargement...' : 'Voir plus d\'articles' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const getReadTime = (content) => {
  if (!content) return '3 mins de lecture'
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} mins de lecture`
}

const allPosts = ref([])
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const perPage = 20
const hasMore = computed(() => allPosts.value.length < total.value)

const fetchPosts = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await useFetch(`/api/posts?per_page=${perPage}&page=${page}`)
    if (data.value?.posts) {
      const newPosts = data.value.posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        categories: p.categories,
        excerpt: p.excerpt,
        image: p.featured_image || null,
        readTime: getReadTime(p.content)
      }))
      
      if (page === 1) {
        allPosts.value = newPosts
      } else {
        allPosts.value = [...allPosts.value, ...newPosts]
      }
      total.value = data.value.total || 0
    }
  } catch (e) {
    console.error('Error fetching posts:', e)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  fetchPosts(currentPage.value)
}

await fetchPosts(1)
</script>

<style scoped>
.articles-page {
  padding: 40px 0;
}

.page-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--primary-color);
}

.page-header h1 {
  font-size: 36px;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.article-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #e8dfc9;
}

.article-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c9a959 0%, #8b7355 100%);
}

.article-image-placeholder span {
  color: white;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

@media (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #c49a3d;
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
