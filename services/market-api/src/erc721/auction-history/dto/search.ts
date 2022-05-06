import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsString, Min, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IErc721AuctionHistorySearchDto } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class Erc721AuctionHistorySearchDto extends PaginationDto implements IErc721AuctionHistorySearchDto {
  @ApiPropertyOptional()
  @ValidateIf(o => !(o.collection && o.tokenId))
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public erc721AuctionId: number;

  @ApiPropertyOptional()
  @ValidateIf(o => !o.erc721AuctionId)
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public collection: string;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @ValidateIf(o => !o.erc721AuctionId)
  @IsBigNumber({}, { message: "typeMismatch" })
  public tokenId: string;
}
