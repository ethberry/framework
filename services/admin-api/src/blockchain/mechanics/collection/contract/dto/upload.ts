import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsArray, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigInt } from "@gemunion/nest-js-validators";

import { ClaimCreateDto } from "../../../claim/dto";
import { ICollectionUploadDto, ITokenUploadDto } from "../interfaces";

export class TokenUploadDto implements ITokenUploadDto {
  @ApiProperty({
    type: Number,
    minimum: 0,
  })
  @IsBigInt({ allowEmptyString: true }, { message: "typeMismatch" })
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
    type: ClaimCreateDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => TokenUploadDto)
  public tokens: Array<TokenUploadDto>;
}
