import {SetMetadata} from "@nestjs/common";
import {UserRole} from "@gemunionstudio/framework-types";

export const Roles = (...roles: Array<UserRole>): ((target: any, key?: any, descriptor?: any) => any) =>
  SetMetadata("roles", [...roles]);
