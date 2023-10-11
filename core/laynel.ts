import { DefalutConfig, LayNelServerConfig } from "./index";
import server, { LayNelServer } from "./server";
import http, { Server, ServerResponse } from "http";
import Color from "colors";
import Logger from "log4js";

/**
 * LayNel操作类
 */
export default class LayNel {
  config?: LayNelServerConfig; // 配置
  server?: Server; // 服务
  log = console;

  constructor(config?: LayNelServerConfig) {
    this.config = config || DefalutConfig;
  }

  public addHeader(key: string, v: string) {}

  private onCreate<
    Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  >(req: InstanceType<Request>, res: InstanceType<Response> & { req: InstanceType<Request> }) {
    console.log('欢迎使用LayNel 系统服务')
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' });
    // res.writeProcessing()
    res.end('欢迎使用LayNel 系统服务')
  }

  /**
   * 启动服务器
   */
  public run(config?: LayNelServerConfig) {
    if (config) this.config = config;
    this.log.info("准备启动服务器");
    if (!this.config) {
      console.log("请先配置监听端口和主机".red);
      return;
    }
    const { port, host } = this.config;

    this.server = server.createServer(config, this.onCreate); // 创建服务器
    this.server?.listen(port, host, () => {
      this.log.info("服务启动成功！");
      console.log(`服务器访问地址：http://${host}:${port}`);
    });
  }
}
