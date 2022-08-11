import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IReferralLeaderboardSearchDto } from "@framework/types";

export class ReferralLeaderboardSearchDto extends PaginationDto implements IReferralLeaderboardSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }) => (value === "" ? null : (value as string)))
  public account: string;
}
