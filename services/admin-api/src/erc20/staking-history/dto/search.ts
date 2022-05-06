import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IErc20LeaderboardSearchDto } from "@framework/types";

export class Erc20LeaderboardSearchDto extends SearchDto implements IErc20LeaderboardSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }) => (value === "" ? null : (value as string)))
  public owner: string;
}
