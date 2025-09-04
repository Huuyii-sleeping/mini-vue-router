import { inject } from 'vue'

export function useRouter(){
    const router = inject('router')
    if(!router) throw new Error('useRouter must be used within a router provider')
    return router
}
