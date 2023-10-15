import { RenderTypes } from "../enums/NetWork";
import { RenderBody } from "../laynel";
/**
 * 返回json格式
 * @param obj 传入返回的数据
 * @returns
 */
export function renderJson(obj: any): RenderBody{
    let result = obj;
    if (typeof obj === "object") {
      result = JSON.stringify(obj);
    }
    return {
      type: RenderTypes.JSON,
      result,
    };
  }