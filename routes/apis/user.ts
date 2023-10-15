import { renderJson } from '@laynel-core/render'
import api from './index'



api.addRoute('/user/login', (req,res) =>{
    // res.end('现在回去登录接口')
    return renderJson({
        msg:'獲取登錄西悉尼'
    })
})



export default api