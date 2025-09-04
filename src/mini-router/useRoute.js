import { inject } from 'vue'

export function useRoute(){
    const route = inject('currentRoute')
    if(!route) throw new Error('useRoute must be used within a router provider')
    return route
}