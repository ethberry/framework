import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IEventHistorySearchDto } from "@framework/types";
import { IsBigInt } from "@gemunion/nest-js-validators";

export class EventHistorySearchDto extends PaginationDto implements IEventHistorySearchDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public address: string;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public tokenId: string;
}
