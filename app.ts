import laynel, { LayNelServerConfig } from "./core/index";
import blueprints from './routes/index'
import LayNel from "./core/laynel";
import BluePrint  from "./core/blueprint";

laynel.addRoute("/", (req, res) => {
    return {
      code:200,
      msg:'访问成功'
  }
});


/**
 * 注册蓝图
 * @param app 
 */
function registerBlueprint(app:LayNel){
    blueprints.forEach((bp: BluePrint) => {
        const listener = bp.onCreate.bind(bp)
        app.registerBlueprint(bp, listener)
    })

}


/**
 * 加载插件
 * @param app 
 */
function loadPlugins(app:LayNel){

}

function createApp() {
  const config: LayNelServerConfig = {
    port: 3001,
    host: "127.0.0.1",
  };

  registerBlueprint(laynel) // 注册蓝图
  loadPlugins(laynel) // 加载插件
  laynel.run(config); // 启动服务
}

// 启动服务
createApp();
