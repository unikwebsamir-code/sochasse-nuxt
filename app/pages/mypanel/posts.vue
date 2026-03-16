<template>
  <div class="posts-page">
    <div class="page-header">
      <h2>All Posts ({{ total }})</h2>
      <button @click="refreshPosts" class="refresh-btn">🔄 Refresh</button>
    </div>
    
    <div class="posts-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Categories</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.id }}</td>
            <td class="title-cell">{{ post.title }}</td>
            <td>
              <span v-for="cat in post.categories" :key="cat" class="category-tag">
                {{ cat }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', post.status]">{{ post.status }}</span>
            </td>
            <td>{{ formatDate(post.created_at) }}</td>
            <td>
              <button @click="viewPost(post)" class="action-btn view">View</button>
              <button @click="editPost(post)" class="action-btn edit">Edit</button>
              <button @click="deletePost(post)" class="action-btn delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="total > perPage" class="pagination">
      <button @click="changePage(-1)" :disabled="page === 1">Previous</button>
      <span>Page {{ page }} of {{ Math.ceil(total / perPage) }}</span>
      <button @click="changePage(1)" :disabled="page >= Math.ceil(total / perPage)">Next</button>
    </div>
    
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit Post</h2>
          <button @click="showEditModal = false" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="savePost" class="edit-form">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="editForm.title" required />
          </div>
          
          <div class="form-group">
            <label>Excerpt</label>
            <textarea v-model="editForm.excerpt" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>Content</label>
            <textarea v-model="editForm.content" rows="10"></textarea>
          </div>
          
          <div class="form-group">
            <label>Status</label>
            <select v-model="editForm.status">
              <option value="publish">Publish</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Categories</label>
            <div class="categories-checkboxes">
              <label v-for="cat in allCategories" :key="cat.id">
                <input 
                  type="checkbox" 
                  :value="cat.id" 
                  v-model="editForm.category_ids"
                />
                {{ cat.name }}
              </label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showEditModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { data: postsData, refresh: refreshPosts } = await useFetch('/api/admin/posts?per_page=100')
const { data: categoriesData } = await useFetch('/api/admin/categories')

const posts = computed(() => postsData.value?.posts || [])
const total = computed(() => postsData.value?.total || 0)
const perPage = computed(() => postsData.value?.perPage || 20)
const page = ref(1)
const allCategories = computed(() => categoriesData.value || [])

const showEditModal = ref(false)
const editForm = ref({
  id: null,
  title: '',
  excerpt: '',
  content: '',
  status: 'publish',
  category_ids: []
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  })
}

const editPost = async (post) => {
  const { data } = await useFetch(`/api/admin/post?id=${post.id}`)
  
  if (data.value) {
    editForm.value = {
      id: data.value.id,
      title: data.value.title,
      excerpt: data.value.excerpt || '',
      content: data.value.content || '',
      status: data.value.status,
      category_ids: data.value.category_ids || []
    }
    showEditModal.value = true
  }
}

const savePost = async () => {
  try {
    await useFetch('/api/admin/post/update', {
      method: 'POST',
      body: editForm.value
    })
    showEditModal.value = false
    refreshPosts()
  } catch (e) {
    alert('Error saving post')
  }
}

const deletePost = async (post) => {
  if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
    try {
      await useFetch('/api/admin/post/delete', {
        method: 'POST',
        body: { id: post.id }
      })
      refreshPosts()
    } catch (e) {
      alert('Error deleting post')
    }
  }
}

const viewPost = (post) => {
  window.open(`/posts/${post.slug}`, '_blank')
}

const changePage = (delta) => {
  page.value += delta
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  color: #333;
}

.refresh-btn {
  padding: 10px 20px;
  background: #1a5f2a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.posts-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.title-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #e8f5e9;
  color: #1a5f2a;
  font-size: 12px;
  border-radius: 4px;
  margin: 2px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.publish {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.draft {
  background: #fff3e0;
  color: #f57c00;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
}

.action-btn.view {
  background: #e3f2fd;
  color: #1565c0;
}

.action-btn.edit {
  background: #fff3e0;
  color: #f57c00;
}

.action-btn.delete {
  background: #ffebee;
  color: #c62828;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  background: #1a5f2a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
}

.edit-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.categories-checkboxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.categories-checkboxes label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #999;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  padding: 10px 20px;
  background: #1a5f2a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
