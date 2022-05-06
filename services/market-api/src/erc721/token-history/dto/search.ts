import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsString, Min, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IErc721TokenHistorySearchDto } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class Erc721TokenHistorySearchDto extends PaginationDto implements IErc721TokenHistorySearchDto {
  @ApiPropertyOptional()
  @ValidateIf(o => !(o.collection && o.tokenId))
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public erc721TokenId: number;

  @ApiPropertyOptional()
  @ValidateIf(o => !o.erc721TokenId)
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public collection: string;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @ValidateIf(o => !o.erc721TokenId)
  @IsBigNumber({ allowEmptyString: true }, { message: "typeMismatch" })
  public tokenId: string;
}
