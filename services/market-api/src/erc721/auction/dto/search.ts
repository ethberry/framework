import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { SortDto } from "@gemunion/collection";
import { Erc721AuctionStatus, IErc721Auction, IErc721AuctionSearchDto } from "@framework/types";
import { SortDirection } from "@gemunion/types-collection";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class AuctionSortDto extends SortDto<IErc721Auction> implements IErc721AuctionSearchDto {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public minPrice: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public maxPrice: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @Transform(({ value }: { value: keyof IErc721Auction }) => value)
  public sortBy: keyof IErc721Auction;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @Transform(({ value }: { value: SortDirection }) => value)
  public sort: SortDirection;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public owner: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc721AuctionStatus>)
  @IsEnum(Erc721AuctionStatus, { each: true, message: "badInput" })
  public auctionStatus: Array<Erc721AuctionStatus>;
}
