<template>
  <div class="event-card">
    <NuxtLink :to="event.link">
      <div class="event-image">
        <img v-if="event.image" :src="event.image" :alt="event.title" />
        <div v-else class="event-placeholder">
          <span>So Chasse</span>
        </div>
        <div class="event-date">
          <span class="day">{{ event.day }}</span>
          <span class="month">{{ event.month }}</span>
        </div>
      </div>
      <div class="event-info">
        <span :class="['event-badge', event.badge === 'member' ? 'badge-member' : 'badge-public']">
          {{ event.badge === 'member' ? 'Réservé aux membres du Club SoChasse' : 'Ouvert à tous' }}
        </span>
        <h3 class="event-title">{{ event.title }}</h3>
        <p class="event-location">{{ event.location }}</p>
        <span class="read-more">En savoir plus →</span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.event-image {
  position: relative;
}

.event-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.event-placeholder {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c9a959 0%, #8b7355 100%);
}

.event-placeholder span {
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}

.event-date {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary-color);
  color: white;
  padding: 10px 15px;
  text-align: center;
  border-radius: 4px;
  z-index: 10;
}

.event-date .day {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.event-date .month {
  font-size: 12px;
  text-transform: uppercase;
}
</style>
