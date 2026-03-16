<template>
  <header class="header">
    <div class="header-top">
      <div class="container">
        <NuxtLink to="/jeux-concours">Jeux-concours</NuxtLink>
        <NuxtLink to="/evenements">Événements</NuxtLink>
        <NuxtLink to="/le-club">Le Club</NuxtLink>
      </div>
    </div>
    
    <div class="header-main">
      <div class="container">
        <NuxtLink to="/" class="logo">So<span>Chasse</span></NuxtLink>
        
        <div class="header-actions">
          <button class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </button>
          <NuxtLink to="/login" class="login-btn">Se connecter</NuxtLink>
          <NuxtLink to="/register" class="register-btn">S'inscrire</NuxtLink>
        </div>
      </div>
    </div>
    
    <nav class="main-nav">
      <div class="container">
        <ul class="nav-menu">
          <li v-for="cat in mainCategories" :key="cat.id">
            <NuxtLink :to="`/category/${cat.slug}`">{{ cat.name }}</NuxtLink>
          </li>
        </ul>
        <button class="nav-toggle">☰</button>
      </div>
    </nav>
  </header>
</template>

<script setup>
const { data: categoriesData } = await useFetch('/api/categories')

const mainCategorySlugs = ['devenir-chasseur', 'savoir-chasser', 'expliquer-la-chasse', 'defendre-la-chasse', 'sanglier', 'chiens-de-chasse', 'recettes']

const mainCategories = computed(() => {
  if (!categoriesData.value) {
    return [
      { id: 1, name: 'Devenir Chasseur', slug: 'devenir-chasseur' },
      { id: 2, name: 'Savoir Chasser', slug: 'savoir-chasser' },
      { id: 3, name: 'Expliquer la Chasse', slug: 'expliquer-la-chasse' },
      { id: 4, name: 'Défendre la Chasse', slug: 'defendre-la-chasse' },
      { id: 5, name: 'Sanglier', slug: 'sanglier' },
      { id: 6, name: 'Chiens de Chasse', slug: 'chiens-de-chasse' },
      { id: 7, name: 'Recettes', slug: 'recettes' }
    ]
  }
  
  return categoriesData.value
    .filter(c => mainCategorySlugs.includes(c.slug))
    .slice(0, 7)
    .map(c => ({ id: c.id, name: c.name, slug: c.slug }))
})
</script>
