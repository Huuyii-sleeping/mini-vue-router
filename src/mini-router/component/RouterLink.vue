<template>
    <a @click="navigate" :href="to">
        <slot />
    </a>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps({
    to: {
        type: String || Object,
        required: true
    }
})

const router = inject('router') as any
const navigate = (e) => {
    e.preventDefault()
    router.push(props.to)
}
</script>

<style scoped lang="scss"></style>