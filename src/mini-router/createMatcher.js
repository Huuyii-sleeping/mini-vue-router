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

function createRouteRecord(record, path){
    return {
        path,
        component: record.component,
        regex: pathToRegex(path),
    }
}

// 进行路由的转换
function pathToRegex(path){
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

export function createMatcher(routes){
    const matchers = []
    
    routes.forEach(route => {
        const record = createRouteRecord(route, route.path)
        matchers.push(record)
    })

    // 路由匹配函数，用来提取路由当中的动态参数。 eg： /user/123 => 123
    function match(path){
        for (const record of matchers) {
            const result = record.regex.pattern.exec(path)
            if(result){ // 能够进行匹配
                const params = {}
                record.regex.keys.forEach((key, i) => {
                    params[key] = result[i + 1]
                })
                return {
                    matched: record,
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
        addRoute(route){
            matchers.push(createRouteRecord(route, route.path))
        }
    }
}