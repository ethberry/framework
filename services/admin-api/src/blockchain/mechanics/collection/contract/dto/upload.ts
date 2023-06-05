import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsArray, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";

import { ClaimItemCreateDto } from "../../../claim/dto";
import { ICollectionUploadDto, ITokenUploadDto } from "../interfaces";

export class TokenUploadDto implements ITokenUploadDto {
  @ApiProperty({
    type: Number,
    minimum: 0,
  })
  @IsBigNumber({ allowEmptyString: true }, { message: "typeMismatch" })
  public tokenId: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  // TODO fix, this is actually uint256
  @ApiPropertyOptional()
  @Allow()
  public metadata: string;
}

export class CollectionUploadDto implements ICollectionUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimItemCreateDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => TokenUploadDto)
  public tokens: Array<TokenUploadDto>;
}
