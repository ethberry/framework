import { IAddressUpdateDto } from "../interfaces";
import { AddressCreateDto } from "./create";

export class AddressUpdateDto extends AddressCreateDto implements IAddressUpdateDto {}
