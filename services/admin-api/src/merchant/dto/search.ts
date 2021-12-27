import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IMerchantSearchDto, MerchantStatus } from "@gemunion/framework-types";

export class MerchantSearchDto extends SearchDto implements IMerchantSearchDto {
  @ApiPropertyOptional({
    enum: MerchantStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(lang => MerchantStatus[lang as unknown as keyof typeof MerchantStatus])
  @IsEnum({ enum: MerchantStatus }, { each: true, message: "badInput" })
  public merchantStatus: Array<MerchantStatus>;
}
