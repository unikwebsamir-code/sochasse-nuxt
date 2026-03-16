<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>So Chasse</h2>
        <p>Admin Panel</p>
      </div>
      
      <nav class="sidebar-nav">
        <NuxtLink to="/mypanel" class="nav-item" exact>
          <span>📊</span> Dashboard
        </NuxtLink>
        <NuxtLink to="/mypanel/posts" class="nav-item">
          <span>📝</span> Posts
        </NuxtLink>
        <NuxtLink to="/mypanel/categories" class="nav-item">
          <span>📁</span> Categories
        </NuxtLink>
        <NuxtLink to="/mypanel/sync" class="nav-item">
          <span>🔄</span> Sync
        </NuxtLink>
        <NuxtLink to="/mypanel/settings" class="nav-item">
          <span>⚙️</span> Settings
        </NuxtLink>
      </nav>
      
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
    
    <main class="admin-main">
      <header class="admin-header">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
          <span>{{ user?.username }}</span>
        </div>
      </header>
      
      <div class="admin-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const user = ref(null)

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/mypanel') return 'Dashboard'
  if (path.includes('/posts')) return 'Posts'
  if (path.includes('/categories')) return 'Categories'
  if (path.includes('/sync')) return 'Sync'
  if (path.includes('/settings')) return 'Settings'
  return 'Admin'
})

onMounted(() => {
  const token = localStorage.getItem('adminToken')
  const userData = localStorage.getItem('adminUser')
  
  if (!token || !userData) {
    navigateTo('/mypanel/login')
    return
  }
  
  user.value = JSON.parse(userData)
})

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  navigateTo('/mypanel/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 260px;
  background: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 25px 20px;
  background: #1a5f2a;
}

.sidebar-header h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.sidebar-header p {
  font-size: 12px;
  opacity: 0.8;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: #aaa;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover, .nav-item.router-link-active {
  background: #2a2a2a;
  color: white;
  border-left: 3px solid #1a5f2a;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #333;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #444;
  color: #aaa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #d32f2f;
  border-color: #d32f2f;
  color: white;
}

.admin-main {
  flex: 1;
  background: #f5f5f5;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: white;
  border-bottom: 1px solid #ddd;
}

.admin-header h1 {
  font-size: 24px;
  color: #333;
}

.user-info {
  color: #666;
}

.admin-content {
  padding: 30px;
}
</style>
