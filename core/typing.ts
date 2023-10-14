declare module "laynel" {
  global {
    /**
     * 配置
     */
    interface Config {
      port?: number; //访问端口s
      host?: string; // 访问host
      enableHttps?: boolean; // 启动https
      key?: string; // 开启https后必须要配置的，key文件的位置
      cert?: string; // https中必需， 证书中cert文件的位置
    }
    type LayNelRecord = {
      [key: string]: any;
    };

    /**
     * 配置设置路由参数
     */
    interface RouteConfig {
      path: string | RegExp; // 正则匹配
      listener: ((req: any, res: any) => any); // 匹配后的回调监听
      matched?: Array<any>;
    }


    interface LayNelRequest {
      url: string; // 访问url
      headers?: Record<string, any>;
      data: any; // body data
      formData: Record<string, any>; // form-data请求数据
      query: { path: string; params: Record<string, any> };
    }

    interface LayNelResponse {
      url: string; // 请求url
      request: LayNelRequest;   //请求体
      headers?: Record<string, any>; // 响应头
      status?:number // 返回code
      error?:any  // 错误信息
      data?:any // 返回数据
    }
  }
}
