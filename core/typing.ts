export type LayNelRecord = {
  [key:string]:any
}


/**
 * 配置
 */
export interface Config {
  port?: number; //访问端口s
  host?: string; // 访问host
  enableHttps?: boolean; // 启动https
}

/**
 * 路由
 */
export interface Router {}

/**
 * 
 */
class LayNelServer {
  config?: Config;
  router?: Router;
  run?: (config: Config) => any
}

export default LayNelServer;
