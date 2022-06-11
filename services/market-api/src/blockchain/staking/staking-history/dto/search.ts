import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import { ILeaderboardSearchDto } from "../interfaces/search";

export class LeaderboardSearchDto extends SearchDto implements ILeaderboardSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }) => (value === "" ? null : (value as string)))
  public owner: string;
}
