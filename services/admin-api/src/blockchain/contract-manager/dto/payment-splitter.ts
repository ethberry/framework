import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEthereumAddress, IsString } from "class-validator";
// import { IsBigInt } from "@gemunion/nest-js-validators";

import type { IWalletContractDeployDto } from "@framework/types";

export class PaymentSplitterContractDeployDto implements IWalletContractDeployDto {
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
  // @IsBigInt({}, { message: "typeMismatch" })
  // TODO validate SUM(shares) = 100 %
  shares: Array<string>;
}
