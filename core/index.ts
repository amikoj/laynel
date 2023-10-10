import LayNelServer,{Config} from "./typing";

/**
 * 导出types
 */
export type LayNelServerConfig = Config

/**
 * 启动服务器
 * @param config 
 */
export function startServer(config: Config) {

}


const LayNelCore = typeof LayNelServer

export const DefalutConfig:Config = {
    port:3000,
    host:'localhost',
    enableHttps:false
}

const LayNel: LayNelServer = {
    config: DefalutConfig,
    run: startServer
}

export default LayNel

export * from './decorator/index'