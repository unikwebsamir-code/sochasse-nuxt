<template>
  <div class="categories-page">
    <div class="page-header">
      <h2>Categories ({{ categories.length }})</h2>
    </div>
    
    <div class="categories-grid">
      <div v-for="cat in categories" :key="cat.id" class="category-card">
        <div class="category-info">
          <h3>{{ cat.name }}</h3>
          <p class="slug">{{ cat.slug }}</p>
          <p class="description" v-if="cat.description">{{ cat.description }}</p>
          <span class="post-count">{{ cat.post_count }} posts</span>
        </div>
        <div class="category-actions">
          <NuxtLink :to="`/category/${cat.slug}`" class="view-btn">View</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { data: categoriesData } = await useFetch('/api/admin/categories')

const categories = computed(() => categoriesData.value || [])
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  color: #333;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.category-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.category-info h3 {
  font-size: 18px;
  color: #1a5f2a;
  margin-bottom: 5px;
}

.slug {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.description {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.post-count {
  display: inline-block;
  padding: 4px 10px;
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  border-radius: 4px;
}

.category-actions {
  margin-top: auto;
  padding-top: 15px;
}

.view-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #1a5f2a;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
