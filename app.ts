import { result } from "lodash";
import laynel, { LayNelServerConfig } from "./core";

laynel.addRoute("/", (req, res) => {

    const a  ={
        code:200,
        msg:'访问成功'
    }
    res.end(a)
});

function createApp() {
  const config: LayNelServerConfig = {
    port: 3001,
    host: "127.0.0.1",
  };
  laynel.run(config); // 启动服务
}

// 启动服务
createApp();
