import BluePrint from "~/core/blueprint";

class AdminBluePrint extends BluePrint {

    constructor(name:string,prefix:string){
        super(name,prefix)
    }



}

const instance = new AdminBluePrint('admin','/admin')



export default instance