<template>
  <div class="videos-page">
    <div class="container">
      <div class="page-header">
        <h1>Vidéos</h1>
        <p>Découvrez nos dernières vidéos</p>
      </div>
      
      <div class="videos-grid">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" />
      </div>
    </div>
  </div>
</template>

<script setup>
const videos = ref([
  {
    id: 1,
    title: 'Une rencontre intime entre un chasseur et un brocard en images',
    category: 'Expliquer la Chasse',
    image: 'https://images.unsplash.com/photo-1504006833117-8886a36e6bf1?w=400&h=300&fit=crop',
    link: '/'
  },
  {
    id: 2,
    title: 'Turquie: Un chasseur « fou » manque de tuer un des collègues !',
    category: 'Sécurité & Responsabilité',
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=300&fit=crop',
    link: '/'
  },
  {
    id: 3,
    title: 'Var : des sangliers détruisent des ruches et dévorent le miel',
    category: 'Sanglier',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=300&fit=crop',
    link: '/'
  }
])
</script>

<style scoped>
.videos-page {
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

.videos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

@media (max-width: 768px) {
  .videos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
