<template>
  <div class="club-page">
    <div class="container">
      <div class="page-header">
        <h1>Le Club So Chasse</h1>
        <p>Rejoignez notre communauté de passionnés</p>
      </div>
      
      <div class="club-content">
        <div class="club-intro">
          <h2>Découvrez les avantages du Club</h2>
          <p>Le Club So Chasse est réservé aux abonnés et vous offre de nombreux avantages :</p>
          <ul>
            <li>Accès exclusifs aux événements privés</li>
            <li>Réductions chez nos partenaires</li>
            <li>Contenu premium et exclusivities</li>
            <li>Communauté de passionnés</li>
          </ul>
          <NuxtLink to="/register" class="join-btn">Rejoindre le Club</NuxtLink>
        </div>
        
        <div class="club-image">
          <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop" alt="Le Club So Chasse" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.club-page {
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

.club-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.club-intro h2 {
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.club-intro p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #333;
}

.club-intro ul {
  list-style: none;
  margin-bottom: 30px;
}

.club-intro ul li {
  padding: 10px 0;
  padding-left: 30px;
  position: relative;
}

.club-intro ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.join-btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--primary-color);
  border-radius: 6px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s;
}

.join-btn:hover {
  background: var(--secondary-color);
}

.club-image img {
  width: 100%;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .club-content {
    grid-template-columns: 1fr;
  }
}
</style>
