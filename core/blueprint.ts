import http, { RequestListener, ServerResponse } from "http"

class BluePrintConfig {
    prefix?: string // path路径
    template?: string // template地址
    name?: string // blueprint名称
    staticFolder?: string // 静态文件位置
}


interface Methods {

    /**
     * 添加子路由
     * @param path 当前路径
     * @param listener 监听返回
     * @returns 无
     */
    addRoute:(path:RegExp | string, listener?:RequestListener) => void
    /**
     * 访问路径匹配后调用
     * @param req 
     * @param res 
     * @returns 
     */
    onReceive:RequestListener
}



class BluePrint extends BluePrintConfig implements Methods{

    constructor(name:string, prefix?:string ){
        super()
        this.name = name
        this.prefix = prefix
    }

    
    onReceive<
    Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse,
> (req: InstanceType<Request>, res: InstanceType<Response> & { req: InstanceType<Request> }){}

    /**
     * 添加路由
     * @param path 
     * @param listener 
     */
    public addRoute(path: RegExp | string, listener?: RequestListener | undefined) {
        // 添加路由

    }


}



export default BluePrint