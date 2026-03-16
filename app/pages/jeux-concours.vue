<template>
  <div class="contest-page">
    <div class="container">
      <div class="page-header">
        <h1>Jeux-Concours</h1>
        <p>Gagnez des cadeaux exclusifs</p>
      </div>
      
      <div class="contest-banner">
        <div class="contest-content">
          <h2>{{ contest.title }}</h2>
          <p>{{ contest.description }}</p>
          <button class="participate-btn">Participer</button>
        </div>
        <div class="contest-image">
          <img :src="contest.image" :alt="contest.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const contest = ref({
  title: 'Gagnez votre assurance chasse et celle de votre chien',
  description: 'Sans nos chiens, combien d\'entre nous auraient déjà rangé le fusil pour de bon ? Participez à notre jeu concours et tentez de gagner une assurance complète pour vous et votre chien de chasse.',
  image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop'
})
</script>

<style scoped>
.contest-page {
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

.contest-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 12px;
  overflow: hidden;
}

.contest-content {
  padding: 40px;
  color: white;
}

.contest-content h2 {
  font-size: 28px;
  margin-bottom: 15px;
}

.contest-content p {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.participate-btn {
  padding: 12px 30px;
  background: var(--accent-color);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.participate-btn:hover {
  transform: scale(1.05);
}

.contest-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .contest-banner {
    grid-template-columns: 1fr;
  }
  
  .contest-image {
    height: 250px;
  }
}
</style>
