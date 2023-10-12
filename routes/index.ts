import api from './apis'
import admin from './admin'
import web from './web'
import BluePrint from '../core/blueprint'


const instance: Array<BluePrint> = [api, admin, web]

export default instance