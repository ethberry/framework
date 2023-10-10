import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsString, IsEthereumAddress } from "class-validator";
import { IsBigInt } from "@gemunion/nest-js-validators";

import type { IWalletContractDeployDto } from "@framework/types";

export class WaitListContractDeployDto implements IWalletContractDeployDto {
  @ApiPropertyOptional({
    type: String,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @IsString({ each: true, message: "typeMismatch" })
  @IsEthereumAddress({ each: true, message: "patternMismatch" })
  public payees: Array<string>;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @IsBigInt({}, { message: "typeMismatch" })
  shares: Array<string>;
}
