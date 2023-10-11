import http, { RequestListener } from "http";
import { pathToRegexp } from "path-to-regexp";

class BluePrintConfig {
  prefix?: string; // path路径
  template?: string; // template地址
  name?: string; // blueprint名称
  staticFolder?: string; // 静态文件位置
  routes: Array<RouteConfig> | undefined;
}

interface Methods {
  /**
   * 添加子路由
   * @param path 当前路径
   * @param listener 监听返回
   * @returns 无
   */
  addRoute: (path: RegExp | string, listener?: RequestListener) => void;
  /**
   * 访问路径匹配后调用
   * @param req
   * @param res
   * @returns
   */
  onReceive: RequestListener;
}

class BluePrint extends BluePrintConfig implements Methods {
  matchRoute: RouteConfig | undefined;

  constructor(name: string, prefix?: string) {
    super();
    this.name = name;
    this.prefix = prefix;
    this.routes = [];
    this.matchRoute = undefined;
  }

  onReceive<
    Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
    Response extends typeof http.ServerResponse = typeof http.ServerResponse
  >(
    req: InstanceType<Request>,
    res: InstanceType<Response> & { req: InstanceType<Request> }
  ) {
    const { url, method } = req;

    // 匹配路由
    this.matchRoute = this.routes?.find((route) => {
      const { path, listener } = route;
      const reg = pathToRegexp(path);
      const result = reg.exec(url!);
      if (result) {
        // url 匹配成功
        route.match = result;
        route.listener(req,res)
        return true;
      }
    });
  }

  /**
   * 添加路由
   * @param path
   * @param listener
   */
  public addRoute(
    path: RegExp | string,
    listener?: RequestListener | undefined
  ) {
    // 添加路由
  }
}

export default BluePrint;
