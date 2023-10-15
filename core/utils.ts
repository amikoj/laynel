import { RenderTypes } from "./enums/NetWork";

/**
 * 返回json格式
 * @param obj 传入返回的数据
 * @returns
 */
export function renderJson(obj: any) {
  let result = obj;
  if (typeof obj === "object") {
    result = JSON.stringify(obj);
  }
  return {
    type: RenderTypes.JSON,
    result,
  };
}

/**
 * 设置标志返回
 */
export const INTERNAL_RES_HEADERS:{[key:string]: string} = {
  "x-customer": "LAYNEL", // 内部标志
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Token, X-Custom-Header,Authorization",
  "Access-Control-Allow-Methods": "*",
};
