import { ApiParam } from "@nestjs/swagger";

export const ApiChainId =
  (name: string): MethodDecorator =>
  (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void => {
    ApiParam({ name, type: "number" })(target, propertyKey, descriptor);
  };
