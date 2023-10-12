import api from './index'



api.addRoute('/user/login', (req,res) =>{
    res.end('现在回去登录接口')
})



export default api