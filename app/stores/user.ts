interface user {
  username: string
  isAuthenticated: boolean
  authCookie: string
}


export const useUserStore = defineStore('user', {


  state: () => {
    return {
      // for ini
    username: '',
    isAuthenticated: false,
    authCookie: '',
    }
  },
  actions: {
    setUser(username: string) {
      this.username = username
      this.isAuthenticated = true
    },
    clearUser() {
      this.username = ''
      this.isAuthenticated = false
      this.authCookie = ''
    },
    setAuthCookie(cookie: string) {
      this.authCookie = cookie
    },
  },
    persist: [
    {
      storage: piniaPluginPersistedstate.localStorage(),
    },
    {
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
        {
      storage: piniaPluginPersistedstate.cookies(),
    },
  ]
})
