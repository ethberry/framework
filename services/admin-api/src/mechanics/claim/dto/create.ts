import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IClaimItemCreateDto } from "../interfaces";
import { AssetDto } from "../../asset/dto";

export class ClaimItemCreateDto implements IClaimItemCreateDto {
  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public item: AssetDto;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public account: string;
}
