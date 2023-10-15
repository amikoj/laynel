import { renderStatic } from "../core/render";
import BluePrint from "../core/blueprint";
import { Request, Response } from "../core/server";

const instance = new BluePrint('static','/static')

instance.addRoute('/', function(req:Request, res:Response) {
    const url = req.url
    console.log('获取请求的url:',url)
    return renderStatic(url!)
})

export default instance