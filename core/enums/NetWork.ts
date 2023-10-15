export enum NetErrorCode {
    NOT_FOND = 404, // 路由找不到
    INTERNAL_SERVER_ERROR = 500, // 服内部错误
    TOKEN_EXPAIRED = 4001, // token已过期
    REUSLT_OK = 200, // 请求成功
}


export enum RenderTypes {
    JSON = 'json', // json格式
    RAW  = 'raw', // 纯文本格式
    HTML = 'html', // html静态文本格式
    STATIC = 'static', // 返回静态资源

}

export enum NetRenderContent{
    NOT_FOND = '页面不存在'
}