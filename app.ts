import LayNel,{LayNelServerConfig} from './core';


function createApp(){
    const config: LayNelServerConfig = {
        port: 3001,
        host:'127.0.0.1'
    }
   LayNel.run(config) // 启动服务
}

// 启动服务
createApp()