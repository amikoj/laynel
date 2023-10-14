import https from "https";
import http, { RequestListener, Server } from "http";
import { LayNelServerConfig } from "./index";
import { readFileSync } from "fs";
import path from "path";
import qs from 'querystring' 
import URL from 'url'

// response 类型
export type ResponseType<T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
E extends typeof http.ServerResponse = typeof http.ServerResponse> = InstanceType<E> & { req: InstanceType<T> }


// resquest 类型
export type RequestType<T extends typeof http.IncomingMessage = typeof http.IncomingMessage> = InstanceType<T>



abstract class Base < T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
E extends typeof http.ServerResponse = typeof http.ServerResponse>{
  url: string | undefined; // 访问url
  method: string | undefined
  headers?: Record<string, any>;
  body: any; // body row data
  data: any; // body data
  formData: Record<string, any> | undefined; // form-data请求数据
  query: { path: any; params: Record<string, any>; } | undefined;
  error?:any  // 错误信息
  request?:RequestType<T>   // 添加了请求的请求引用
  response?:ResponseType<T,E>  // 添加了响应的引用

  constructor(req:RequestType<T>,res?:ResponseType<T,E>){
    // 初始化构造
    this.request = req
    this.response =res
    this.parseData()
   
  }

 abstract parseData():void
}

/**
 * 请求信息封装
 */
export class Request< T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
E extends typeof http.ServerResponse = typeof http.ServerResponse> extends Base{


  constructor(req:RequestType<T>,res?:ResponseType<T,E>) {
    super(req,res)
  }


   parseData(){

    const  { headers, url, method} = this.request!
    this.url = url
    this.headers = headers
    this.method = method
    const { pathname,query } = URL.parse(url!)
    this.query = {
      path:pathname,
      params:qs.parse(query)
    }
    let data = '';
    this.request?.on('data', (chunk) =>{
      data += chunk;
    })

    this.request?.on('end', () => {
      try{
        this.body = data
        this.data = JSON.parse(data);
      }catch(e){
        console.log('设置请求信息')
      }
    });

  }

}


/**
 * 封装返回参数，关闭一些操作口，防止误操作
 */
export class Response < T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
E extends typeof http.ServerResponse = typeof http.ServerResponse> extends Base{
  
  constructor(res: ResponseType<T,E>) {
    super(res!.req,res);

  }


  parseData(): void {
    const  res = this.response!
   // 跨域允许携带凭据（cookie之类）
   res.setHeader('Access-Control-Allow-Credentials', 'true');
   // 要允许跨域携带cookie，必须设置为具体的域，不能是‘*'
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Content-Type', 'application/json;utf-8');
   res.setHeader('Access-Control-Allow-Headers',"Token, X-Custom-Header,Authorization")
   res.setHeader("Access-Control-Allow-Methods", "*");
  }
  /**
   * 添加Header头信息
   * @param name 
   * @param value 
   */
  public appendHeader(name: string, value: string | readonly string[]){
    this.response?.appendHeader(name,value)
    return this
  }

  public setHeader(name: string, value: string | number | readonly string[]) {
    this.response?.setHeader(name,value)
    return this
  }

}

 
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
    T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
    E extends typeof http.ServerResponse = typeof http.ServerResponse
  >(
    config?: LayNelServerConfig,
    listener?: RequestListener<T, E>
  ): Server<T, E> {
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
