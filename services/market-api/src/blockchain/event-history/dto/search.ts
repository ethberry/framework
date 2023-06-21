import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { ContractEventType, IEventHistorySearchDto } from "@framework/types";
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

export class EventHistorySearchDto2 extends PaginationDto {
  @ApiPropertyOptional({
    enum: ContractEventType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractEventType>)
  @IsEnum(ContractEventType, { each: true, message: "badInput" })
  public eventTypes: Array<ContractEventType>;
}
