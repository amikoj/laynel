

interface PluginsProps {
    name: string
    desc: string
    icon: string
    author: string
}

/**
 * 插件定义类
 */
export default class Plugins{
    props?: PluginsProps

    constructor(props?: PluginsProps) {
        this.props = props
    }
 
}