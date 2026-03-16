<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <h1>So Chasse</h1>
        <p>Admin Panel</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="Enter username"
            required
          />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Enter password"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="login-info">
        <p>Default credentials:</p>
        <code>Username: admin</code>
        <code>Password: admin123</code>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const { data, error: fetchError } = await useFetch('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    
    if (fetchError.value) {
      error.value = fetchError.value.data?.message || 'Login failed'
      return
    }
    
    if (data.value?.token) {
      localStorage.setItem('adminToken', data.value.token)
      localStorage.setItem('adminUser', JSON.stringify(data.value.user))
      navigateTo('/mypanel')
    }
  } catch (e) {
    error.value = 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a5f2a 0%, #2d7a3d 100%);
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 36px;
  color: #1a5f2a;
  margin-bottom: 5px;
}

.login-header p {
  color: #666;
  font-size: 14px;
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

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #1a5f2a;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #1a5f2a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover:not(:disabled) {
  background: #2d7a3d;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.login-info {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.login-info p {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.login-info code {
  display: block;
  font-size: 12px;
  color: #1a5f2a;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 4px 0;
}
</style>
