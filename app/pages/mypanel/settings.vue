<template>
  <div class="settings-page">
    <div class="settings-grid">
      <div class="settings-card">
        <h2>Change Password</h2>
        <form @submit.prevent="changePassword" class="settings-form">
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" v-model="passwordForm.current" required />
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" v-model="passwordForm.new" required />
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" v-model="passwordForm.confirm" required />
          </div>
          <button type="submit" class="save-btn">Update Password</button>
        </form>
      </div>
      
      <div class="settings-card">
        <h2>Site Information</h2>
        <div class="info-list">
          <div class="info-item">
            <span class="label">WordPress URL:</span>
            <span class="value">https://sochasseux.unikweb.fr</span>
          </div>
          <div class="info-item">
            <span class="label">Database:</span>
            <span class="value">SQLite (Local)</span>
          </div>
          <div class="info-item">
            <span class="label">Admin Panel:</span>
            <span class="value">/mypanel</span>
          </div>
        </div>
      </div>
      
      <div class="settings-card">
        <h2>Auto Sync Settings</h2>
        <p class="info-text">
          Auto sync can be set up using cron jobs or by calling the sync API endpoint.
        </p>
        <div class="sync-endpoint">
          <code>POST /api/sync</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('New passwords do not match')
    return
  }
  
  alert('Password change functionality would be implemented here')
  passwordForm.value = { current: '', new: '', confirm: '' }
}
</script>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.settings-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.settings-card h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a5f2a;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.save-btn {
  padding: 10px 20px;
  background: #1a5f2a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 10px;
}

.info-item .label {
  font-weight: 500;
  color: #666;
}

.info-item .value {
  color: #333;
}

.info-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.sync-endpoint {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
}

.sync-endpoint code {
  font-size: 14px;
  color: #1a5f2a;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
