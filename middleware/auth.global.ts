export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for these routes
  const publicRoutes = ['/', '/login', '/auth']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Check if user is authenticated
  const userStore = useUserStore()
  if (!userStore.isAuthenticated) {
    return navigateTo('/')
  }
})
