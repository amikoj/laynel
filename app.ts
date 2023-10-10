import { LayNelServerConfig, startServer } from 'core';




function createApp(){
    const config: LayNelServerConfig = {
        port:3030,
        host:'127.0.0.1'
    }
    startServer(config)
}

// 启动服务
createApp()