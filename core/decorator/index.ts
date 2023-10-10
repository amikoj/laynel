
/**
 * 添加装饰器
 * @param target 目标对象
 * @param prop 属性名称
 * @param desc 属性描述符
 */
export const route: MethodDecorator  = (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    console.log(`@Annotation applied to ${target.constructor.name}.${String(propertyKey)}`)
}

export const MessageDecorator: ClassDecorator = (target: Function) => {
    target.prototype.message = (context:string) => {
      console.log(context);
    }
  }


export  const sleepDecoratorFactory = (waitTime:number) => (target:any,propertyKey:string | symbol,descriptor:PropertyDescriptor) => {
    target.name = 'zs';
    const value = descriptor.value;
    descriptor.value = () => {
      setTimeout(() => {
          value();  
      },waitTime)
    }
}