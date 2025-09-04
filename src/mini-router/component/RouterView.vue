<template>
    <component :is="matchedComponent" v-if="matchedComponent"></component>
    <div v-else>404 Not Found</div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
const router = inject('router') as any
const currentRoute = inject('currentRoute') as any

const matchedComponent = computed(() => {
    const match = router.match(currentRoute.current)
    return match.matched?.component || null
})
</script>

<style scoped lang="scss">
    
</style>