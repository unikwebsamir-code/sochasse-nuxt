<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-main">
            <div class="image-wrapper">
              <img v-if="featuredPost.image" :src="featuredPost.image" :alt="featuredPost.title" />
              <div v-else class="image-placeholder"><span>So Chasse</span></div>
            </div>
            <div class="hero-main-content">
              <span class="category-tag">{{ featuredPost.category }}</span>
              <h2>{{ featuredPost.title }}</h2>
              <NuxtLink :to="`/posts/${featuredPost.slug}`" class="read-more">Lire la suite →</NuxtLink>
            </div>
          </div>
          
          <div class="hero-side">
            <div v-for="article in heroArticles" :key="article.id" class="hero-side-item">
              <div class="image-wrapper">
                <img v-if="article.image" :src="article.image" :alt="article.title" />
                <div v-else class="image-placeholder"><span>So Chasse</span></div>
              </div>
              <div class="hero-side-content">
                <span class="category-tag">{{ article.category }}</span>
                <h3>{{ article.title }}</h3>
                <NuxtLink :to="`/posts/${article.slug}`" class="read-more">Lire la suite →</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Most Read Articles -->
    <section class="articles-section">
      <div class="container">
        <h2 class="section-title">Articles les plus consultés</h2>
        <div class="articles-grid">
          <div v-for="article in mostReadArticles" :key="article.id" class="article-card">
            <NuxtLink :to="`/posts/${article.slug}`">
              <div class="image-wrapper">
                <img v-if="article.image" :src="article.image" :alt="article.title" />
                <div v-else class="image-placeholder"><span>So Chasse</span></div>
              </div>
              <div class="article-card-content">
                <div class="article-category">{{ article.category }}</div>
                <h3 class="article-title">{{ article.title }}</h3>
                <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
                <span v-if="article.readTime" class="read-time">{{ article.readTime }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="articles-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Derniers articles</h2>
          <NuxtLink to="/articles" class="view-all-btn">Tout voir</NuxtLink>
        </div>
        <div class="articles-grid">
          <div v-for="article in latestArticles" :key="article.id" class="article-card">
            <NuxtLink :to="`/posts/${article.slug}`">
              <div class="image-wrapper">
                <img v-if="article.image" :src="article.image" :alt="article.title" />
                <div v-else class="image-placeholder"><span>So Chasse</span></div>
              </div>
              <div class="article-card-content">
                <div class="article-category">{{ article.category }}</div>
                <h3 class="article-title">{{ article.title }}</h3>
                <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
                <span v-if="article.readTime" class="read-time">{{ article.readTime }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
      <div class="container">
        <h2 class="section-title">Rencontres entre passionnés</h2>
        <p style="margin-bottom: 20px; color: #666;">Participez à des événements conçus pour rapprochement les passionnés, favoriser les échanges et faire progresser ensemble la vision de la chasse</p>
        <div class="events-grid">
          <EventCard v-for="event in events" :key="event.id" :event="event" />
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <NuxtLink to="/evenements" class="view-all-btn">Tous les événements</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Contest Section -->
    <section class="contest-section">
      <div class="container">
        <div class="contest-content">
          <div class="contest-text">
            <h2>{{ contest.title }}</h2>
            <p>{{ contest.description }}</p>
            <NuxtLink to="/jeux-concours" class="view-all-btn">Participer</NuxtLink>
          </div>
          <div class="contest-image">
            <img :src="contest.image" :alt="contest.title" />
          </div>
        </div>
      </div>
    </section>

    <!-- Videos Section -->
    <section class="videos-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Vidéos</h2>
          <NuxtLink to="/videos" class="view-all-btn">Tout voir</NuxtLink>
        </div>
        <div class="videos-grid">
          <VideoCard v-for="video in videos" :key="video.id" :video="video" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: wpData } = await useFetch('/api/posts?per_page=20')
const { data: categories } = await useFetch('/api/categories')

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

const getReadTime = (content) => {
  if (!content) return '3 mins de lecture'
  const words = stripHtml(content).split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} mins de lecture`
}

const getCategoryName = (categoryIds) => {
  if (!categoryIds || categoryIds.length === 0 || !categories.value) return ''
  return categoryIds[0]?.name || ''
}

const posts = wpData.value?.posts || []

const featuredPost = computed(() => {
  if (posts.length === 0) return {
    title: 'Aucun article',
    category: '',
    slug: '',
    image: null
  }
  
  const p = posts[0]
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categories?.[0] || '',
    image: p.featured_image || null
  }
})

const heroArticles = computed(() => {
  return posts.slice(1, 3).map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categories?.[0] || '',
    image: p.featured_image || null
  }))
})

const mostReadArticles = computed(() => {
  return posts.slice(3, 7).map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categories?.[0] || '',
    excerpt: p.excerpt,
    image: p.featured_image || null,
    readTime: getReadTime(p.content)
  }))
})

const latestArticles = computed(() => {
  return posts.slice(7, 11).map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categories?.[0] || '',
    excerpt: p.excerpt,
    image: p.featured_image || null,
    readTime: getReadTime(p.content)
  }))
})

const events = ref([
  {
    id: 1,
    title: 'Dîner du printemps chez Bombance',
    day: '26',
    month: 'Mar',
    year: '2026',
    location: '40 rue des Blancs Manteaux, 75004 Paris',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    badge: 'member',
    link: '/evenements'
  },
  {
    id: 2,
    title: 'Dîner des chasseurs de Côte d\'Or à l\'Alambic',
    day: '30',
    month: 'Avr',
    year: '2026',
    location: '10 avenue Albert Bichot 21200 Beaune',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    badge: 'public',
    link: '/evenements'
  },
  {
    id: 3,
    title: 'Dîner chevreuil d\'été à la Régalade',
    day: '25',
    month: 'Juin',
    year: '2026',
    location: '106 Rue Saint-Honoré, 75001 Paris',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    badge: 'member',
    link: '/evenements'
  }
])

const contest = ref({
  title: 'Gagnez votre assurance chasse et celle de votre chien',
  description: 'Sans nos chiens, combien d\'entre nous auraient déjà rangé le fusil pour de bon ?...',
  image: null
})

const videos = ref([
  {
    id: 1,
    title: 'Une rencontre intime entre un chasseur et un brocard en images',
    category: 'Expliquer la Chasse',
    image: null,
    link: '/'
  },
  {
    id: 2,
    title: 'Turquie: Un chasseur « fou » manque de tuer un des collègues !',
    category: 'Sécurité & Responsabilité',
    image: null,
    link: '/'
  },
  {
    id: 3,
    title: 'Var : des sangliers détruisent des ruches et dévorent le miel',
    category: 'Sanglier',
    image: null,
    link: '/'
  }
])
</script>
