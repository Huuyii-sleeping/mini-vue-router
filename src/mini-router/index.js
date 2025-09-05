import { createRouter } from './createRouter.js'
import { useRoute } from './useRoute.js'
import { useRouter } from './useRouter.js'
import { utils } from './utils.js'

// 1. 导出核心 API
export { createRouter }

// 2. 导出组合式 API（Vue 3 风格）
export { useRoute }
export { useRouter }

// 3. 可选：导出工具函数
export { utils }
