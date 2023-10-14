import { DefalutConfig, LayNelServerConfig } from "./index";
import server, {  Request,Response,type RequestType,type ResponseType } from "./server";
import http, { IncomingMessage, RequestListener, Server, ServerResponse } from "http";
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
export default class LayNel<
  T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
  E extends typeof http.ServerResponse = typeof http.ServerResponse
> extends Config {
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

  private onMessage(self: LayNel,req: RequestType<T>, res: ResponseType<T,E>) {
    const request: Request = new Request(req); // 构建Request和Response
    const respose: Response = new Response(res)
    // 错误处理
    req.on("error", (err) => {self
      console.error(err);
      self.errorListeners?.forEach((errLi) => {
        errLi(err, req, res);
      });
      res.statusCode = 400;
    });
    /**
     * 结束回调
     */
    res.on("end", () => {
      self.onCompleteListeners?.forEach((li) => li());
    });

    const { url } = req;

    /**
     * 匹配处理路由
     */
    const currentBlueprint = self.blueprints?.find((item) => {
      const isMatch = url?.startsWith(item.blueprint.prefix!);
      if (isMatch) {
        if (item.listener) item.listener(req, res);

        item.blueprint.onReceive.bind(item.blueprint, req, res)();
        // item.blueprint.onReceive(req, res);
      }
      return isMatch; // 匹配后结束
    });
    // console.log('get currentBlueprint:',currentBlueprint,this.routes)
    let matchRoute;

    if (!currentBlueprint) {
      self.matchBlueprint = undefined;
      // 蓝图不匹配，查找配置路由
      matchRoute = self.routes?.find((route) => {
        const { path, listener } = route;
        const reg = pathToRegexp(path);
        const result = reg.exec(url!);
        // console.log("get result:", result);
        try {
          if (result) {
            // url 匹配成功
            route.matched = result;
            // listener(req, res);
            return true;
          }
        } catch (e) {
          console.error("get exception:", e);
        }
      });
    } else {
      self.matchBlueprint = currentBlueprint.blueprint;
      matchRoute = currentBlueprint.blueprint.matchRoute;
    }

    if (!matchRoute) {
      res.statusCode = 404;
      const result = {
        code: 404,
        msg: "未找到匹配的访问路径",
        data: null,
      };
      res.end(JSON.stringify(result));
    } else {
      const result =  matchRoute.listener(request,respose)
     res.end(result)
    }
  }

  /**
   * 启动服务器
   */
  public run(config?: LayNelServerConfig) {
    if (config) this.config = config;
    this.log.info("准备启动服务器");
    if (!this.config) {
      console.log("请先配置监听端口和主机");
      return;
    }
    const { port, host } = this.config;
    let self = this;

    this.server = server.createServer(config,(req: any, res: any) =>
      this.onMessage(self, req, res)
    ); // 创建服务器
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
    console.log("addRoute:", this.routes);
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
