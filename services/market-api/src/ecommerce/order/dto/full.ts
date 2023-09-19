import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IOrderFullDto } from "../interfaces";
import { IUserImportDto } from "../../../infrastructure/user/interfaces";
import { IAddressCreateDto } from "../../address/interfaces";
import { AddressCreateDto } from "../../address/dto";
import { ProfileUpdateDto } from "../../../infrastructure/profile/dto";

export class OrderFullDto implements IOrderFullDto {
  @ApiProperty({
    type: () => ProfileUpdateDto,
  })
  @ValidateNested()
  @Type(() => ProfileUpdateDto)
  public user: IUserImportDto;

  @ApiProperty({
    type: () => [AddressCreateDto],
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => AddressCreateDto)
  public addresses: Array<IAddressCreateDto>;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public save: boolean;
}
