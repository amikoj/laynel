import { NetErrorCode, NetRenderContent, RenderTypes } from "../enums/NetWork";
import { RenderBody } from "../laynel";
import { readFileSync } from "fs";
import path from "path";

/**
 * 通过文件地址返回文件数据
 * @param filepath
 */
export function renderStatic(filepath: string):RenderBody {
//    const realPath =   path.resolve('static', filepath)
  const realPath = path.resolve(filepath)
   console.log('get real path:', realPath)
   const buffer =   readFileSync(realPath)
   if(buffer) {
    return {
        type:RenderTypes.STATIC,
        result:buffer
    }
   }else {
    return {
        type: RenderTypes.STATIC,
        result:null,
        error:{
            code:NetErrorCode.NOT_FOND,
            msg: NetRenderContent.NOT_FOND
        }
    }
   }

}