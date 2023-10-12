import https from "https";
import http, { RequestListener, Server } from "http";
import { LayNelServerConfig } from "./index";
import { readFileSync } from "fs";
import path from "path";



export class LayNelServer {
  verson: string = "0.0.1";
  server?: Server;
  constructor() {
    this.verson = "0.0.1";
  }

  /**
   * 构建一个服务器
   * @param config 服务器配置
   * @param listener 进入服务器的回调
   * @returns
   */
  createServer<
    Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
    Response extends typeof http.ServerResponse = typeof http.ServerResponse
  >(
    config?: LayNelServerConfig,
    listener?: RequestListener<Request, Response>
  ): Server<Request, Response> {
    if (!config) throw Error("获取配置信息异常");
    const enableHttps = config.enableHttps || false;

    if (enableHttps) {
      //支持https
      if (!config.key || !config.cert)
        throw Error(
          "请先配置证书的key文件和cert文件的地址，https开启时必需要有证书文件的配置"
        );

      const options = {
        key: readFileSync(path.join(__dirname, config.key)),
        cert: readFileSync(path.join(__dirname, config.cert)),
      };
      this.server = https.createServer(options, listener);
    } else {
      //未启动https
      this.server = http.createServer(listener);
    }
    return this.server;
  }
}

export const instance = new LayNelServer();

export default instance;
