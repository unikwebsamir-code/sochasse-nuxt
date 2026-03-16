export const useWordPress = () => {
  const API_BASE = 'https://sochasseux.unikweb.fr/wp-json/wp/v2'

  const fetchPosts = async (params = {}) => {
    const queryString = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      _fields: 'id,title,slug,link,excerpt,featured_media,categories,date',
      ...params
    }).toString()

    const response = await fetch(`${API_BASE}/posts?${queryString}`)
    const data = await response.json()
    return data
  }

  const fetchPost = async (idOrSlug) => {
    const response = await fetch(`${API_BASE}/posts/${idOrSlug}?_embed`)
    const data = await response.json()
    return data
  }

  const fetchCategories = async () => {
    const response = await fetch(`${API_BASE}/categories?per_page=50`)
    const data = await response.json()
    return data
  }

  const fetchCategory = async (idOrSlug) => {
    const response = await fetch(`${API_BASE}/categories/${idOrSlug}`)
    const data = await response.json()
    return data
  }

  const fetchPostsByCategory = async (categoryId, params = {}) => {
    const queryString = new URLSearchParams({
      categories: categoryId,
      per_page: params.per_page || 10,
      page: params.page || 1,
      _fields: 'id,title,slug,link,excerpt,featured_media,categories,date'
    }).toString()

    const response = await fetch(`${API_BASE}/posts?${queryString}`)
    const data = await response.json()
    return data
  }

  const fetchMedia = async (id) => {
    const response = await fetch(`${API_BASE}/media/${id}`)
    const data = await response.json()
    return data
  }

  const fetchFeaturedMedia = async (post) => {
    if (!post.featured_media) return null
    try {
      const media = await fetchMedia(post.featured_media)
      return media.source_url
    } catch {
      return null
    }
  }

  const getCategoryName = (categoryId, categories) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : ''
  }

  const getCategorySlug = (categoryId, categories) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.slug : ''
  }

  return {
    fetchPosts,
    fetchPost,
    fetchCategories,
    fetchCategory,
    fetchPostsByCategory,
    fetchMedia,
    fetchFeaturedMedia,
    getCategoryName,
    getCategorySlug
  }
}
