import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsEthereumAddress, Min } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { IsBigInt } from "@gemunion/nest-js-validators";
import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";
import type { ISignDismantleDto } from "@framework/types";

import { ChainIdDto } from "../../../../../common/dto";

export class SignDismantleDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ISignDismantleDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dismantleId: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public tokenId: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public address: string;
}
