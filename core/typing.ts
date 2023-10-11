declare module "laynel" {
  global {
    /**
     * 配置
     */
    interface Config {
      port?: number; //访问端口s
      host?: string; // 访问host
      enableHttps?: boolean; // 启动https
      key?: string // 开启https后必须要配置的，key文件的位置
      cert?: string // https中必需， 证书中cert文件的位置
    }
    type LayNelRecord = {
      [key: string]: any;
    };
  }
}
