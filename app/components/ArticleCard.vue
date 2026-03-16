<template>
  <article class="article-card">
    <NuxtLink :to="article.link">
      <img :src="article.image" :alt="article.title" />
      <div class="article-card-content">
        <div class="article-category">{{ article.category }}</div>
        <h3 class="article-title">{{ article.title }}</h3>
        <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
        <span v-if="article.readTime" class="read-time">{{ article.readTime }}</span>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>
