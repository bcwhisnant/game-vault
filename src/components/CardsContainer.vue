<script setup>
import GameCard from './GameCard.vue'

defineProps({
  games: {
    type: Array,
    required: true
  }
})

</script>

<template>
   <div class="results-grid">
    <GameCard 
      v-for="(game, index) in games" 
      :key="index" 
      :imageUrl="game.background_image" 
      :name="game.name"
      :genres="game.genres" 
      :description="game.description" 
      :rating="game.rating" 
      :year="game.released" 
    />
  </div>
</template>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}
</style>
