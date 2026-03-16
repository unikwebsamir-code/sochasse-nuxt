<template>
  <div class="category-page">
    <div class="container">
      <div class="page-header">
        <h1>{{ categoryName }}</h1>
        <p>{{ posts.length }} articles</p>
      </div>
      
      <div class="articles-grid">
        <div v-for="article in posts" :key="article.id" class="article-card">
          <NuxtLink :to="`/posts/${article.slug}`">
            <img :src="article.image" :alt="article.title" />
            <div class="article-card-content">
              <div class="article-category">{{ article.categories?.[0] || '' }}</div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
              <span v-if="article.readTime" class="read-time">{{ article.readTime }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div v-if="posts.length === 0" class="no-posts">
        Aucun article dans cette catégorie
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const { data: categoriesData } = await useFetch('/api/categories')

const categoryName = computed(() => {
  if (!categoriesData.value) return slug
  const cat = categoriesData.value.find(c => c.slug === slug)
  return cat ? cat.name : slug
})

const categoryId = computed(() => {
  if (!categoriesData.value) return null
  const cat = categoriesData.value.find(c => c.slug === slug)
  return cat ? cat.id : null
})

const { data: wpData } = await useFetch(() => {
  if (!categoryId.value) return '/api/posts?per_page=20'
  return `/api/posts?per_page=100`
})

const getReadTime = (content) => {
  if (!content) return '3 mins de lecture'
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} mins de lecture`
}

const posts = computed(() => {
  if (!wpData.value?.posts) return []
  let filteredPosts = wpData.value.posts
  
  if (categoryId.value) {
    filteredPosts = filteredPosts.filter(p => 
      p.category_ids && p.category_ids.includes(categoryId.value)
    )
  }
  
  return filteredPosts.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categories: p.categories,
    excerpt: p.excerpt,
    image: p.featured_image || 'https://images.unsplash.com/photo-1508049673083-5b6d5d6f8d2e?w=400&h=300&fit=crop',
    readTime: getReadTime(p.content)
  }))
})
</script>

<style scoped>
.category-page {
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

.no-posts {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
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
</style>
