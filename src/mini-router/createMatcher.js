// 实现路由匹配逻辑
/**
 *  将一条单独的路由配置 转换成 一个结构化，可匹配的对象
 *  record: 一个包含路由的配置对象
 *  path: 路由（处理过的）
 * 
 *  {
 *      path: 原始字符串
 *      component: 要进行渲染的组件
 *      regex: 生成的正则表达式，用来匹配路由
 *  }
 */

// 实现命名式路由的写法

function createRouteRecord(record, path, dep) {
    return {
        path,
        component: record.component,
        regex: pathToRegex(path),
        dep
    }
}

// 进行路由的转换
function pathToRegex(path) {
    const names = []
    // 实现正则的匹配
    const regex = path.replace(/:([^\/]+)/g, (_, p1) => {
        names.push(p1)
        return '([^\/]+)'
    }).replace(/\//g, '\\/')

    return {
        pattern: new RegExp('^' + regex + '$'),
        keys: names
    }
}

export function createMatcher(routes) {
    const matchers = []

    // 支持子路由的操作
    function registerRoute(route, parentPath = '', dep) { 
        // 多个斜杠的替换
        const fullPath = parentPath ? (parentPath + '/' + route.path).replace(/\/+/g, '/') : route.path
        // 创建记录加入到record当中
        const record = createRouteRecord(route, fullPath, dep)

        matchers.push(record)

        if(route.children && Array.isArray(route.children)){
            route.children.forEach(child => {
                // 递归的调用 实现matcher的完善
                registerRoute(child, fullPath, dep + 1)
            })
        }
    }

    routes.forEach((route) => {
        registerRoute(route, '', 0)
    })

    // 路由匹配函数，用来提取路由当中的动态参数。 eg： /user/123 => 123
    function match(path) {
        console.log('matchers:',matchers)
        for (const record of matchers) {
            const result = record.regex.pattern.exec(path)
            if (result) { // 能够进行匹配
                const params = {}
                record.regex.keys.forEach((key, i) => {
                    params[key] = result[i + 1]
                })
                return {
                    matched: record, // 获取对应的路由记录实现数据的传递
                    params,
                }
            }
        }

        return {
            matched: null,
            params: {},
        }
    }

    return {
        match,
        addRoute(route) {
            matchers.push(createRouteRecord(route, route.path))
        }
    }
}