import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";
import { SearchDto } from "@gemunion/collection";
import { IMerchantSearchDto, MerchantStatus } from "@gemunion/framework-types";

export class MerchantSearchDto extends SearchDto implements IMerchantSearchDto {
  @ApiPropertyOptional({
    enum: MerchantStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsString({
    required: false,
    enum: MerchantStatus,
    isArray: true,
  })
  public merchantStatus: Array<MerchantStatus>;
}
