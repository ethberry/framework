import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString, ValidateNested, IsISO8601 } from "class-validator";
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

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public endTimestamp: string;
}
