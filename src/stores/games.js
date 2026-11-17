import { defineStore } from "pinia"

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: [],
  }),
  getters: {
    allGames: (state) => state.games
  },
  actions: {
    async fetchGames() {
      const url = `${import.meta.env.VITE_API_BASE}/games?key=${import.meta.env.VITE_API_KEY}&page_size=12`
      try {
        const response = await fetch(url)            
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        } else {
          const data = await response.json()
          this.games = data.results
          console.log(this.games)
        }
      } catch(err) {
        console.log('err fetching games', err)
      }
    }
  }
})
