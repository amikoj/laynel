import api from './apis'
import admin from './admin'
import web from './web'
import BluePrint from '../core/blueprint'
import staticFiles from './staticFiles'


const instance: Array<BluePrint> = [api, admin, web,staticFiles]

export default instance