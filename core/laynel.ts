import { DefalutConfig, LayNelServerConfig } from "./index";
import server, { LayNelServer } from "./server";
import http, { RequestListener, Server, ServerResponse } from "http";
import Color from "colors";
import Logger from "log4js";
import BluePrint from "./blueprint";
import { pathToRegexp } from "path-to-regexp";

export type ErrorListener<
  Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse
> = (
  err: Error,
  req: InstanceType<Request>,
  res: InstanceType<Response> & { req: InstanceType<Request> }
) => void; // 错误回调
export type OnCompleteListener = () => void; // 请求结束回到

export type BluePrintOperator = {
  blueprint: BluePrint;
  listener?: RequestListener;
};

class Config {
  config?: LayNelServerConfig; // 配置
  server?: Server; // 服务
  log = console;
  errorListeners: Array<ErrorListener> | undefined; // 错误监听列表
  onCompleteListeners: Array<OnCompleteListener> | undefined; // 请求完成监听
  blueprints: Array<BluePrintOperator> | undefined; // 蓝图列表
  routes: Array<RouteConfig> | undefined; // 路由集合
}

/**
 * LayNel操作类
 */
export default class LayNel extends Config {
  matchRoute: RouteConfig | undefined;
  matchBlueprint: BluePrint | undefined;

  constructor(config?: LayNelServerConfig) {
    super();
    this.config = config || DefalutConfig;
    this.blueprints = [];
    this.errorListeners = [];
    this.onCompleteListeners = [];
    this.routes = [];
    this.matchRoute = undefined;
    this.matchBlueprint = undefined;
  }

  /**
   * 注册结束回调
   * @param listener 结束回调
   */
  public registerCompleteLister(listener: OnCompleteListener) {
    if (!this.onCompleteListeners?.includes(listener)) {
      this.onCompleteListeners?.push(listener);
    }
  }

  /**
   * 添加请求错误回调
   * @param listener 错误回调
   */
  public registerErrorListener(listener: ErrorListener) {
    if (!this.errorListeners?.includes(listener)) {
      this.errorListeners?.push(listener);
    }
  }

  private onCreate<
    Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  >(
    req: InstanceType<Request>,
    res: InstanceType<Response> & { req: InstanceType<Request> }
  ) {
    // 错误处理
    req.on("error", (err) => {
      console.error(err);
      this.errorListeners?.forEach((errLi) => {
        errLi(err, req, res);
      });
      res.statusCode = 400;
      res.end();
    });

    /**
     * 结束回调
     */
    req.on("end", () => {
      this.onCompleteListeners?.forEach((li) => li());
    });

    const { url, method } = req;

    /**
     * 匹配处理路由
     */
    const currentBlueprint = this.blueprints?.find((item) => {
      const isMatch = url?.startsWith(item.blueprint.prefix!);
      if (isMatch) {
        if (item.listener) item.listener(req, res);
        item.blueprint.onReceive(req, res);
      }
      return isMatch; // 匹配后结束
    });

    if (!currentBlueprint) {
      this.matchBlueprint = undefined;
      // 蓝图不匹配，查找配置路由
      this.matchRoute = this.routes?.find((route) => {
        const { path, listener } = route;
        const reg = pathToRegexp(path);
        const result = reg.exec(url!);
        if (result) {
          // url 匹配成功
          route.match = result;
          route.listener(req, res);
          return true;
        }
      });
    } else {
      this.matchBlueprint = currentBlueprint.blueprint;
      this.matchRoute = currentBlueprint.blueprint.matchRoute;
    }

    if (!this.matchRoute) {
      res.appendHeader("Content-Type", "application/json");
      res.statusCode = 404;
      const result = {
        code: 404,
        msg: "未找到匹配的访问路径",
        data: null,
      };
      res.end(JSON.stringify(result));
    }

    console.log("欢迎使用LayNel 系统服务");
    res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    // res.writeProcessing()
    res.end("欢迎使用LayNel 系统服务");
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

  /**
   * 添加路由
   * @param path 监听路由URL
   * @param listener 回调事件处理
   */
  public addRoute(path: string | RegExp, listener: RequestListener) {
    this.routes?.push({ path, listener }); // 添加路由，匹配成功的第一个回调
  }

  /**
   * 添加蓝图【组路由配合】
   * @param blueprint 蓝图配置
   * @param listener 匹配蓝图首先进入回调
   */
  public registerBlueprint(blueprint: BluePrint, listener?: RequestListener) {
    const { prefix, name } = blueprint;
    if (!prefix || !name) throw Error("请先配置蓝图的prefix，name属性");
    this.blueprints?.push({ blueprint, listener });
  }
}
