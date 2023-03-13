import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsArray, IsString, IsUrl, ValidateNested } from "class-validator";
import { IsBigNumber } from "@gemunion/nest-js-validators";
import { Type } from "class-transformer";
import { ClaimItemCreateDto } from "../../../claim/dto";

export class CollectionUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimItemCreateDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => Array<TokenUploadDto>)
  public files: Array<TokenUploadDto>;
}

export class TokenUploadDto {
  // @ApiProperty({
  //   minimum: 1,
  // })
  // @IsString({ message: "typeMismatch" })
  // public contract: string;

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

  @ApiPropertyOptional()
  // @ValidateNested()
  @Allow()
  public attributes: any;
}
