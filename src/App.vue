<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGamesStore } from './stores/games';
import Heading from './components/Heading.vue'
import Search from './components/Search.vue';
import Filters from './components/Filters.vue';
import CardsContainer from './components/CardsContainer.vue';
import NoResults from './components/NoResults.vue';

const gamesStore = useGamesStore()
const { games } = storeToRefs(gamesStore)

const searchTerm = ref('')
const searchIsActive = ref(false)

const buttons = ref([
  {
    id: 0,
    text: 'All Games',
    isActive: true
  },
  {
    id: 1,
    text: 'Action',
    isActive: false
  },
  {
    id: 2,
    text: 'RPG',
    isActive: false
  },
  {
    id: 3,
    text: 'Shooter',
    isActive: false
  },
  {
    id: 4,
    text: 'Puzzle',
    isActive: false
  },
  {
    id: 5,
    text: 'Indie',
    isActive: false
  }
])


const filterIsActive = ref(false)
const activeFilter = ref('')

// const games = ref(gamesStore.fetchGames())
const filteredGames = ref([])
const searchedGames = ref([])

// const fetchGames = async () => {
//     const url = `${import.meta.env.VITE_API_BASE}/games?key=${import.meta.env.VITE_API_KEY}&page_size=12`;
//     const response = await fetch(url);            
//     if (!response.ok) {
//       throw new Error('Failed to fetch games');
//     }
//     const data = await response.json()
//     games.value = data.results
//     console.log(games.value)
// }

const filterBasedOnSearch = (term) => {
  if (term !== '') {
    searchIsActive.value = true
    searchedGames.value = games.value.filter(game => 
  game.name.toLowerCase().includes(term.toLowerCase()))
  } else {
    searchIsActive.value = false
  }
}

const toggleActiveAndFilter = (id, text) => {
  // set isActive to false for any item that has it as true
  buttons.value.map(button => {
    if (button.isActive) button.isActive = false
    if (button.id === id) button.isActive = true
  })

  if (text === 'All Games') {
    filterIsActive.value = false
    activeFilter.value = ''
  } else {
    filterIsActive.value = true
    activeFilter.value = text
    filteredGames.value = games.value.filter(game => 
  game.genres.some(genre => genre.name === text))
  }

}

const gamesToDisplay = computed(() => {
  if (searchIsActive.value && filterIsActive.value) {
      return searchedGames.value.filter(searchedGame => searchedGame.genres.some(genre => genre.name === activeFilter.value))
  } else if (searchIsActive.value && !filterIsActive.value) {
      return searchedGames.value
  } else if (!searchIsActive.value && filterIsActive.value) {
      return filteredGames.value
  } else {
      return games.value
  }
})

onBeforeMount(async () => {
  await gamesStore.fetchGames()
})
</script>

<template>
  <main class="container">
    <Heading />
    <div class="search-container">
      <Search @emitSearch="filterBasedOnSearch(searchTerm)" v-model="searchTerm"/>
      <Filters @toggleActiveAndFilter="toggleActiveAndFilter" :buttons="buttons" />
    </div>
    <CardsContainer v-if="gamesToDisplay.length" :games="gamesToDisplay" />
    <NoResults v-else />
  </main>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.search-container {
  max-width: 800px;
  margin: 0 auto 3rem;
  position: relative;
}
</style>
