import http from 'http'
import { Request,Response } from './server'
/**
 * 设置标志返回
 */
export const INTERNAL_RES_HEADERS:{[key:string]: string} = {
    "x-customer": "LAYNEL", // 内部标志
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Token, X-Custom-Header,Authorization",
    "Access-Control-Allow-Methods": "*",
  };


export const STATIC_FOLDER = 'static' // 静态文件存放目录




// response 类型
export type ResponseType<T extends typeof http.IncomingMessage = typeof http.IncomingMessage,
E extends typeof http.ServerResponse = typeof http.ServerResponse> = InstanceType<E> & { req: InstanceType<T> }


// resquest 类型
export type RequestType<T extends typeof http.IncomingMessage = typeof http.IncomingMessage> = InstanceType<T>




export  type  RequestListener = (req: Request, res: Response) => any 