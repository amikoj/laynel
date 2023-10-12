
import Laynel from './laynel'
import './typing'

// 别名
export type LayNelServerConfig = Config



export const DefalutConfig:LayNelServerConfig = {
    port:3000,
    host:'localhost',
    enableHttps:false
}

export * from './decorator/index'

const instance = new Laynel()  // 构建


export * from './blueprint'
export * from './server'
export * from './plugins'
export default instance
