<template>
  <div class="sync-page">
    <div class="sync-header">
      <h2>Sync with WordPress</h2>
      <button @click="syncAll" class="sync-btn" :disabled="syncing">
        {{ syncing ? 'Syncing...' : '🔄 Sync Now' }}
      </button>
    </div>
    
    <div class="sync-status" v-if="lastSync">
      <h3>Last Sync Information</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="label">Status:</span>
          <span :class="['value', lastSync.status]">{{ lastSync.status }}</span>
        </div>
        <div class="status-item">
          <span class="label">Items Synced:</span>
          <span class="value">{{ lastSync.items_synced }}</span>
        </div>
        <div class="status-item">
          <span class="label">Date:</span>
          <span class="value">{{ formatDate(lastSync.created_at) }}</span>
        </div>
        <div class="status-item full">
          <span class="label">Message:</span>
          <span class="value">{{ lastSync.message }}</span>
        </div>
      </div>
    </div>
    
    <div class="sync-actions">
      <div class="action-card" @click="syncCategories">
        <div class="action-icon">📁</div>
        <h3>Categories</h3>
        <p>Sync categories from WordPress</p>
      </div>
      
      <div class="action-card" @click="syncPosts">
        <div class="action-icon">📝</div>
        <h3>Posts</h3>
        <p>Sync posts from WordPress</p>
      </div>
      
      <div class="action-card" @click="syncMedia">
        <div class="action-icon">🖼️</div>
        <h3>Media</h3>
        <p>Sync media from WordPress</p>
      </div>
    </div>
    
    <div class="sync-result" v-if="syncResult">
      <h3>Sync Result</h3>
      <pre>{{ syncResult }}</pre>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { data: statsData, refresh } = await useFetch('/api/admin/stats')

const syncing = ref(false)
const syncResult = ref(null)

const lastSync = computed(() => statsData.value?.lastSync)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const syncAll = async () => {
  syncing.value = true
  syncResult.value = null
  
  try {
    const { data } = await useFetch('/api/sync', { method: 'POST' })
    syncResult.value = data.value
    refresh()
  } catch (e) {
    syncResult.value = { error: 'Sync failed' }
  } finally {
    syncing.value = false
  }
}

const syncCategories = async () => {
  syncing.value = true
  try {
    await $fetch('/api/sync', { method: 'POST' })
    refresh()
    alert('Categories synced successfully!')
  } catch (e) {
    alert('Sync failed')
  } finally {
    syncing.value = false
  }
}

const syncPosts = async () => {
  syncing.value = true
  try {
    await $fetch('/api/sync', { method: 'POST' })
    refresh()
    alert('Posts synced successfully!')
  } catch (e) {
    alert('Sync failed')
  } finally {
    syncing.value = false
  }
}

const syncMedia = async () => {
  syncing.value = true
  try {
    await $fetch('/api/sync', { method: 'POST' })
    refresh()
    alert('Media synced successfully!')
  } catch (e) {
    alert('Sync failed')
  } finally {
    syncing.value = false
  }
}
</script>

<style scoped>
.sync-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.sync-header h2 {
  font-size: 20px;
  color: #333;
}

.sync-btn {
  padding: 12px 24px;
  background: #1a5f2a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.sync-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sync-status {
  background: white;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.sync-status h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-item.full {
  grid-column: 1 / -1;
}

.label {
  font-size: 12px;
  color: #666;
}

.value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.value.success {
  color: #2e7d32;
}

.value.error {
  color: #c62828;
}

.sync-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.action-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.action-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.action-card p {
  font-size: 14px;
  color: #666;
}

.sync-result {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.sync-result h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.sync-result pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  font-size: 14px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .status-grid,
  .sync-actions {
    grid-template-columns: 1fr;
  }
}
</style>
