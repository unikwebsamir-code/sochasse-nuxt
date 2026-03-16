<template>
  <div class="video-card">
    <NuxtLink :to="video.link">
      <div class="video-thumbnail">
        <img v-if="video.image" :src="video.image" :alt="video.title" />
        <div v-else class="video-placeholder">
          <span>So Chasse</span>
        </div>
        <div class="play-icon"></div>
      </div>
      <div class="video-info">
        <div class="video-category">{{ video.category }}</div>
        <h3 class="video-title">{{ video.title }}</h3>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.video-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c9a959 0%, #8b7355 100%);
}

.video-placeholder span {
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}
</style>
