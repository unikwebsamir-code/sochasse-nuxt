<template>
  <div class="events-page">
    <div class="container">
      <div class="page-header">
        <h1>Événements</h1>
        <p>Participez à des événements conçus pour rapprochement les passionnés</p>
      </div>
      
      <div class="events-grid">
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div>
    </div>
  </div>
</template>

<script setup>
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
    link: '#'
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
    link: '#'
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
    link: '#'
  }
])
</script>

<style scoped>
.events-page {
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

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
