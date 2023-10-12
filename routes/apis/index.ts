import BluePrint from "../../core/blueprint";


const api = new BluePrint('api','/api')


api.addRoute('/user/login',(req,res)=>{
    res.end('login success !')
})

export default api