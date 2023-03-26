import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

import { IAddressAutocompleteDto } from "../interfaces";

export class AddressAutocompleteDto implements IAddressAutocompleteDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public userId: number;
}
