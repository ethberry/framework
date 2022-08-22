import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { IClaimItemCreateDto } from "../interfaces";
import { ItemDto } from "../../asset/dto";

export class ClaimItemCreateDto implements IClaimItemCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public endTimestamp: string;
}
