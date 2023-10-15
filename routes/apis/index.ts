import { renderJson } from "../../core/render";
import BluePrint from "../../core/blueprint";


const api = new BluePrint('api','/api')


api.addRoute('/user/login',(req,res)=>{
    // res.end('login success !')
    return renderJson({
        result:'success  access!'
    })
})

export default api