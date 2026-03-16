<template>
  <div class="post-page">
    <div class="container">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <article class="post-content">
          <header class="post-header">
            <div class="post-meta">
              <span class="post-category">{{ post.categories?.[0] }}</span>
              <span class="post-date">{{ post.date }}</span>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
          </header>
          
          <div class="post-image">
            <img :src="post.image" :alt="post.title" />
          </div>
          
          <div class="post-body" v-html="post.content"></div>
          
          <footer class="post-footer">
            <NuxtLink to="/articles" class="back-btn">← Retour aux articles</NuxtLink>
          </footer>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const loading = ref(true)
const error = ref(null)
const post = ref({})

const { data: postData } = await useFetch(`/api/post/${route.params.slug}`)

onMounted(() => {
  try {
    if (postData.value) {
      post.value = {
        id: postData.value.id,
        title: postData.value.title,
        content: postData.value.content,
        categories: postData.value.categories,
        date: formatDate(postData.value.created_at),
        image: postData.value.featured_image || 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=1200&h=600&fit=crop'
      }
    } else {
      error.value = 'Article non trouvé'
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'article'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.post-page {
  padding: 40px 0;
}

.post-content {
  max-width: 900px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 30px;
}

.post-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.post-category {
  display: inline-block;
  padding: 4px 12px;
  background: var(--accent-color);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 3px;
}

.post-date {
  color: #666;
  font-size: 14px;
}

.post-title {
  font-size: 42px;
  color: var(--text-dark);
  line-height: 1.2;
}

.post-image {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
}

.post-body {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.post-body :deep(h2) {
  font-size: 28px;
  margin: 30px 0 15px;
  color: var(--primary-color);
}

.post-body :deep(h3) {
  font-size: 22px;
  margin: 25px 0 12px;
}

.post-body :deep(p) {
  margin-bottom: 20px;
}

.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
}

.post-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.back-btn {
  display: inline-block;
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  transition: background 0.3s;
}

.back-btn:hover {
  background: var(--secondary-color);
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #d32f2f;
}

@media (max-width: 768px) {
  .post-title {
    font-size: 28px;
  }
  
  .post-body {
    font-size: 16px;
  }
}
</style>
