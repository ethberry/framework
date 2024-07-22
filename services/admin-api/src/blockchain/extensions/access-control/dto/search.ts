import { Mixin } from "ts-mixer";

import { AccountDto, AddressDto } from "@gemunion/nest-js-validators";
import { IAccessControlSearchDto } from "../interfaces";

export class AccessControlSearchDto extends Mixin(AccountDto, AddressDto) implements IAccessControlSearchDto {}
