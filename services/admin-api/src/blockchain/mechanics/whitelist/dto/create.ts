import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { IWhitelistItemCreateDto } from "../interfaces";

export class WhitelistItemCreateDto implements IWhitelistItemCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;
}
