<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <h3>{{ stats.posts?.count || 0 }}</h3>
          <p>Posts</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📁</div>
        <div class="stat-info">
          <h3>{{ stats.categories?.count || 0 }}</h3>
          <p>Categories</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🖼️</div>
        <div class="stat-info">
          <h3>{{ stats.media?.count || 0 }}</h3>
          <p>Media</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div class="stat-info">
          <h3>{{ stats.users?.count || 0 }}</h3>
          <p>Users</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h2>Last Sync</h2>
        <div v-if="lastSync" class="sync-info">
          <p><strong>Status:</strong> {{ lastSync.status }}</p>
          <p><strong>Items Synced:</strong> {{ lastSync.items_synced }}</p>
          <p><strong>Message:</strong> {{ lastSync.message }}</p>
          <p><strong>Date:</strong> {{ formatDate(lastSync.created_at) }}</p>
        </div>
        <div v-else>
          <p>No sync has been performed yet.</p>
        </div>
      </div>
      
      <div class="dashboard-card">
        <h2>Quick Actions</h2>
        <div class="quick-actions">
          <NuxtLink to="/mypanel/posts" class="action-btn">Manage Posts</NuxtLink>
          <NuxtLink to="/mypanel/categories" class="action-btn">Manage Categories</NuxtLink>
          <NuxtLink to="/mypanel/sync" class="action-btn">Sync Now</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { data: statsData } = await useFetch('/api/admin/stats')

const stats = computed(() => statsData.value?.stats || {})
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
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-icon {
  font-size: 40px;
}

.stat-info h3 {
  font-size: 32px;
  color: #1a5f2a;
  margin-bottom: 5px;
}

.stat-info p {
  color: #666;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.dashboard-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.dashboard-card h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a5f2a;
}

.sync-info p {
  margin-bottom: 10px;
  color: #555;
  font-size: 14px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 12px 20px;
  background: #1a5f2a;
  color: white;
  text-align: center;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #2d7a3d;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
